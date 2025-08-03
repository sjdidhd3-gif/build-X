import AsyncStorage from '@react-native-async-storage/async-storage';
// استيراد المكتبات الإضافية
import { Platform } from 'react-native';

class AIService {
  constructor() {
    this.apiKey = null;
    this.provider = 'openai'; // 'openai' or 'google'
    this.baseURL = {
      openai: 'https://api.openai.com/v1',
      google: 'https://generativelanguage.googleapis.com/v1beta'
    };
  }

  // تعيين مفتاح API
  async setAPIKey(key, provider = 'openai') {
    try {
      this.apiKey = key;
      this.provider = provider;
      await AsyncStorage.setItem('ai_api_key', key);
      await AsyncStorage.setItem('ai_provider', provider);
      return true;
    } catch (error) {
      console.error('خطأ في حفظ مفتاح API:', error);
      return false;
    }
  }

  // جلب مفتاح API المحفوظ
  async loadAPIKey() {
    try {
      const key = await AsyncStorage.getItem('ai_api_key');
      const provider = await AsyncStorage.getItem('ai_provider') || 'openai';
      if (key) {
        this.apiKey = key;
        this.provider = provider;
        return true;
      }
      return false;
    } catch (error) {
      console.error('خطأ في جلب مفتاح API:', error);
      return false;
    }
  }

  // التحقق من صحة مفتاح API
  async validateAPIKey() {
    if (!this.apiKey) {
      throw new Error('مفتاح API غير موجود');
    }

    try {
      if (this.provider === 'openai') {
        const response = await fetch(`${this.baseURL.openai}/models`, {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        });
        return response.ok;
      } else if (this.provider === 'google') {
        const response = await fetch(`${this.baseURL.google}/models?key=${this.apiKey}`);
        return response.ok;
      }
    } catch (error) {
      console.error('خطأ في التحقق من مفتاح API:', error);
      return false;
    }
  }

  // إرسال رسالة للذكاء الاصطناعي
  async sendMessage(message, conversationHistory = []) {
    if (!this.apiKey) {
      throw new Error('يرجى إعداد مفتاح API أولاً');
    }

    try {
      if (this.provider === 'openai') {
        return await this.sendToOpenAI(message, conversationHistory);
      } else if (this.provider === 'google') {
        return await this.sendToGoogle(message, conversationHistory);
      }
    } catch (error) {
      console.error('خطأ في إرسال الرسالة:', error);
      throw error;
    }
  }

  // إرسال إلى OpenAI
  async sendToOpenAI(message, conversationHistory) {
    // تحميل النموذج المحفوظ أو استخدام النموذج الافتراضي
    let model = 'gpt-3.5-turbo';
    try {
      const savedModel = await AsyncStorage.getItem('ai_model');
      if (savedModel) {
        model = savedModel;
      }
    } catch (error) {
      console.error('خطأ في تحميل النموذج:', error);
    }
    
    const messages = [
      {
        role: 'system',
        content: 'أنت مساعد ذكي يتحدث العربية ويساعد المستخدمين في مختلف المهام. كن مفيداً ومهذباً.'
      },
      ...conversationHistory.map(msg => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.text
      })),
      {
        role: 'user',
        content: message
      }
    ];

    const response = await fetch(`${this.baseURL.openai}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'خطأ في الاتصال بـ OpenAI');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  // إرسال إلى Google AI
  async sendToGoogle(message, conversationHistory) {
    const contents = [
      ...conversationHistory.map(msg => ({
        role: msg.isUser ? 'user' : 'model',
        parts: [{ text: msg.text }]
      })),
      {
        role: 'user',
        parts: [{ text: message }]
      }
    ];

    const response = await fetch(
      `${this.baseURL.google}/models/gemini-pro:generateContent?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000
          }
        })
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'خطأ في الاتصال بـ Google AI');
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  }

  // تحليل الصور (OpenAI Vision)
  async analyzeImage(imageBase64, prompt = 'صف هذه الصورة') {
    if (!this.apiKey || this.provider !== 'openai') {
      throw new Error('تحليل الصور متاح فقط مع OpenAI');
    }

    const response = await fetch(`${this.baseURL.openai}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`
                }
              }
            ]
          }
        ],
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'خطأ في تحليل الصورة');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  // حذف مفتاح API
  async clearAPIKey() {
    try {
      await AsyncStorage.removeItem('ai_api_key');
      await AsyncStorage.removeItem('ai_provider');
      this.apiKey = null;
      this.provider = 'openai';
      return true;
    } catch (error) {
      console.error('خطأ في حذف مفتاح API:', error);
      return false;
    }
  }
}

export default new AIService();