import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CloudBrowserScreen = ({ navigation }) => {
  const [files, setFiles] = useState([]);
  const [currentPath, setCurrentPath] = useState('/');
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [showFileOptionsModal, setShowFileOptionsModal] = useState(false);
  const [sortBy, setSortBy] = useState('name'); // 'name', 'date', 'size'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc', 'desc'
  const [viewMode, setViewMode] = useState('list'); // 'list', 'grid'

  useEffect(() => {
    loadFiles();
  }, [currentPath]);

  const loadFiles = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call to fetch files from the cloud
      // For this demo, we'll use mock data stored in AsyncStorage
      const savedFiles = await AsyncStorage.getItem('cloudFiles');
      let filesData = [];
      
      if (savedFiles) {
        filesData = JSON.parse(savedFiles);
      } else {
        // Create some demo files if none exist
        filesData = createDemoFiles();
        await AsyncStorage.setItem('cloudFiles', JSON.stringify(filesData));
      }
      
      // Filter files by current path
      const filteredFiles = filesData.filter(file => {
        const filePath = file.path.substring(0, file.path.lastIndexOf('/') + 1);
        return filePath === currentPath;
      });
      
      // Sort files
      const sortedFiles = sortFiles(filteredFiles, sortBy, sortOrder);
      
      setFiles(sortedFiles);
    } catch (error) {
      console.error('Error loading files:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء تحميل الملفات');
    } finally {
      setIsLoading(false);
    }
  };

  const createDemoFiles = () => {
    return [
      {
        id: '1',
        name: 'المستندات',
        type: 'folder',
        path: '/المستندات/',
        size: 0,
        lastModified: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'الصور',
        type: 'folder',
        path: '/الصور/',
        size: 0,
        lastModified: new Date().toISOString(),
      },
      {
        id: '3',
        name: 'المشاريع',
        type: 'folder',
        path: '/المشاريع/',
        size: 0,
        lastModified: new Date().toISOString(),
      },
      {
        id: '4',
        name: 'ملاحظات.txt',
        type: 'file',
        path: '/ملاحظات.txt',
        size: 1024,
        lastModified: new Date().toISOString(),
      },
      {
        id: '5',
        name: 'مشروع_تطبيق.zip',
        type: 'file',
        path: '/مشروع_تطبيق.zip',
        size: 1024 * 1024 * 5,
        lastModified: new Date().toISOString(),
      },
      {
        id: '6',
        name: 'صورة.jpg',
        type: 'file',
        path: '/الصور/صورة.jpg',
        size: 1024 * 512,
        lastModified: new Date().toISOString(),
      },
      {
        id: '7',
        name: 'مستند.pdf',
        type: 'file',
        path: '/المستندات/مستند.pdf',
        size: 1024 * 1024,
        lastModified: new Date().toISOString(),
      },
      {
        id: '8',
        name: 'تطبيق_ويب',
        type: 'folder',
        path: '/المشاريع/تطبيق_ويب/',
        size: 0,
        lastModified: new Date().toISOString(),
      },
      {
        id: '9',
        name: 'تطبيق_جوال',
        type: 'folder',
        path: '/المشاريع/تطبيق_جوال/',
        size: 0,
        lastModified: new Date().toISOString(),
      },
      {
        id: '10',
        name: 'index.html',
        type: 'file',
        path: '/المشاريع/تطبيق_ويب/index.html',
        size: 2048,
        lastModified: new Date().toISOString(),
      },
    ];
  };

  const sortFiles = (filesToSort, sortByField, order) => {
    return [...filesToSort].sort((a, b) => {
      // Always put folders first
      if (a.type === 'folder' && b.type !== 'folder') return -1;
      if (a.type !== 'folder' && b.type === 'folder') return 1;
      
      // Then sort by the specified field
      let comparison = 0;
      switch (sortByField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'date':
          comparison = new Date(a.lastModified) - new Date(b.lastModified);
          break;
        case 'size':
          comparison = a.size - b.size;
          break;
        default:
          comparison = a.name.localeCompare(b.name);
      }
      
      return order === 'asc' ? comparison : -comparison;
    });
  };

  const navigateToFolder = (folder) => {
    setCurrentPath(folder.path);
  };

  const navigateUp = () => {
    if (currentPath === '/') return;
    
    const pathParts = currentPath.split('/').filter(part => part !== '');
    pathParts.pop();
    const newPath = pathParts.length === 0 ? '/' : `/${pathParts.join('/')}/`;
    
    setCurrentPath(newPath);
  };

  const createNewFolder = async () => {
    if (!newFolderName.trim()) {
      Alert.alert('تنبيه', 'يرجى إدخال اسم للمجلد');
      return;
    }
    
    try {
      const savedFiles = await AsyncStorage.getItem('cloudFiles');
      let filesData = savedFiles ? JSON.parse(savedFiles) : [];
      
      const newFolderId = Date.now().toString();
      const newFolderPath = `${currentPath}${newFolderName}/`;
      
      // Check if folder already exists
      const folderExists = filesData.some(file => 
        file.path === newFolderPath && file.type === 'folder'
      );
      
      if (folderExists) {
        Alert.alert('تنبيه', 'يوجد مجلد بهذا الاسم بالفعل');
        return;
      }
      
      const newFolder = {
        id: newFolderId,
        name: newFolderName,
        type: 'folder',
        path: newFolderPath,
        size: 0,
        lastModified: new Date().toISOString(),
      };
      
      filesData.push(newFolder);
      await AsyncStorage.setItem('cloudFiles', JSON.stringify(filesData));
      
      setNewFolderName('');
      setShowCreateModal(false);
      loadFiles();
    } catch (error) {
      console.error('Error creating folder:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء إنشاء المجلد');
    }
  };

  const handleFilePress = (file) => {
    if (file.type === 'folder') {
      navigateToFolder(file);
    } else {
      setSelectedFile(file);
      setShowFileOptionsModal(true);
    }
  };

  const handleFileLongPress = (file) => {
    setSelectedFile(file);
    setShowFileOptionsModal(true);
  };

  const deleteFile = async () => {
    if (!selectedFile) return;
    
    Alert.alert(
      'تأكيد الحذف',
      `هل أنت متأكد من رغبتك في حذف "${selectedFile.name}"؟`,
      [
        { text: 'إلغاء', style: 'cancel' },
        { 
          text: 'حذف', 
          style: 'destructive',
          onPress: async () => {
            try {
              const savedFiles = await AsyncStorage.getItem('cloudFiles');
              let filesData = savedFiles ? JSON.parse(savedFiles) : [];
              
              // If it's a folder, delete all files inside it as well
              if (selectedFile.type === 'folder') {
                filesData = filesData.filter(file => !file.path.startsWith(selectedFile.path));
              }
              
              // Delete the file/folder itself
              filesData = filesData.filter(file => file.id !== selectedFile.id);
              
              await AsyncStorage.setItem('cloudFiles', JSON.stringify(filesData));
              
              setShowFileOptionsModal(false);
              setSelectedFile(null);
              loadFiles();
            } catch (error) {
              console.error('Error deleting file:', error);
              Alert.alert('خطأ', 'حدث خطأ أثناء حذف الملف');
            }
          }
        }
      ]
    );
  };

  const shareFile = () => {
    if (!selectedFile) return;
    
    Alert.alert(
      'مشاركة',
      `تمت مشاركة "${selectedFile.name}" بنجاح`,
      [{ text: 'حسناً', style: 'default' }]
    );
    
    setShowFileOptionsModal(false);
    setSelectedFile(null);
  };

  const downloadFile = () => {
    if (!selectedFile || selectedFile.type === 'folder') return;
    
    Alert.alert(
      'تحميل',
      `جاري تحميل "${selectedFile.name}"...`,
      [{ text: 'حسناً', style: 'default' }]
    );
    
    setShowFileOptionsModal(false);
    setSelectedFile(null);
  };

  const openFile = () => {
    if (!selectedFile || selectedFile.type === 'folder') return;
    
    Alert.alert(
      'فتح الملف',
      `جاري فتح "${selectedFile.name}"...`,
      [{ text: 'حسناً', style: 'default' }]
    );
    
    setShowFileOptionsModal(false);
    setSelectedFile(null);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderFileItem = ({ item }) => (
    <TouchableOpacity
      style={styles.fileItem}
      onPress={() => handleFilePress(item)}
      onLongPress={() => handleFileLongPress(item)}
    >
      <View style={styles.fileIconContainer}>
        <Ionicons
          name={item.type === 'folder' ? 'folder' : getFileIcon(item.name)}
          size={24}
          color={item.type === 'folder' ? '#FFC107' : '#2196F3'}
        />
      </View>
      
      <View style={styles.fileDetails}>
        <Text style={styles.fileName}>{item.name}</Text>
        <Text style={styles.fileInfo}>
          {item.type === 'folder' ? 'مجلد' : formatFileSize(item.size)} • {formatDate(item.lastModified)}
        </Text>
      </View>
      
      <TouchableOpacity
        style={styles.fileAction}
        onPress={() => handleFileLongPress(item)}
      >
        <Ionicons name="ellipsis-vertical" size={20} color="#666" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return 'document-text';
      case 'doc':
      case 'docx':
        return 'document';
      case 'xls':
      case 'xlsx':
        return 'grid';
      case 'ppt':
      case 'pptx':
        return 'albums';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return 'image';
      case 'mp3':
      case 'wav':
      case 'ogg':
        return 'musical-notes';
      case 'mp4':
      case 'mov':
      case 'avi':
        return 'videocam';
      case 'zip':
      case 'rar':
        return 'archive';
      case 'html':
      case 'css':
      case 'js':
        return 'code-slash';
      default:
        return 'document-outline';
    }
  };

  const filteredFiles = searchQuery
    ? files.filter(file => file.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : files;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#f5f5f5" barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-forward" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>متصفح السحابة</Text>
        <View style={styles.headerRight} />
      </View>
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="بحث في الملفات..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
      
      {/* Path Navigation */}
      <View style={styles.pathContainer}>
        <TouchableOpacity
          style={styles.pathButton}
          onPress={() => setCurrentPath('/')}
        >
          <Ionicons name="home" size={18} color="#2196F3" />
        </TouchableOpacity>
        
        <Text style={styles.pathSeparator}>/</Text>
        
        {currentPath !== '/' && (
          <>
            {currentPath.split('/').filter(part => part !== '').map((part, index, array) => (
              <React.Fragment key={index}>
                <TouchableOpacity
                  style={styles.pathButton}
                  onPress={() => {
                    const newPath = '/' + array.slice(0, index + 1).join('/') + '/';
                    setCurrentPath(newPath);
                  }}
                >
                  <Text style={styles.pathText}>{part}</Text>
                </TouchableOpacity>
                
                {index < array.length - 1 && (
                  <Text style={styles.pathSeparator}>/</Text>
                )}
              </React.Fragment>
            ))}
          </>
        )}
      </View>
      
      {/* Sort and View Controls */}
      <View style={styles.controlsContainer}>
        <View style={styles.sortControls}>
          <Text style={styles.controlLabel}>ترتيب حسب:</Text>
          <TouchableOpacity
            style={[styles.sortButton, sortBy === 'name' && styles.activeSortButton]}
            onPress={() => {
              if (sortBy === 'name') {
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              } else {
                setSortBy('name');
                setSortOrder('asc');
              }
              setFiles(sortFiles(files, sortBy === 'name' ? 'name' : 'name', sortBy === 'name' && sortOrder === 'asc' ? 'desc' : 'asc'));
            }}
          >
            <Text style={[styles.sortButtonText, sortBy === 'name' && styles.activeSortButtonText]}>
              الاسم {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.sortButton, sortBy === 'date' && styles.activeSortButton]}
            onPress={() => {
              if (sortBy === 'date') {
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              } else {
                setSortBy('date');
                setSortOrder('desc');
              }
              setFiles(sortFiles(files, sortBy === 'date' ? 'date' : 'date', sortBy === 'date' && sortOrder === 'asc' ? 'desc' : 'asc'));
            }}
          >
            <Text style={[styles.sortButtonText, sortBy === 'date' && styles.activeSortButtonText]}>
              التاريخ {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.sortButton, sortBy === 'size' && styles.activeSortButton]}
            onPress={() => {
              if (sortBy === 'size') {
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              } else {
                setSortBy('size');
                setSortOrder('desc');
              }
              setFiles(sortFiles(files, sortBy === 'size' ? 'size' : 'size', sortBy === 'size' && sortOrder === 'asc' ? 'desc' : 'asc'));
            }}
          >
            <Text style={[styles.sortButtonText, sortBy === 'size' && styles.activeSortButtonText]}>
              الحجم {sortBy === 'size' && (sortOrder === 'asc' ? '↑' : '↓')}
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.viewControls}>
          <TouchableOpacity
            style={[styles.viewButton, viewMode === 'list' && styles.activeViewButton]}
            onPress={() => setViewMode('list')}
          >
            <Ionicons
              name="list"
              size={20}
              color={viewMode === 'list' ? '#2196F3' : '#666'}
            />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.viewButton, viewMode === 'grid' && styles.activeViewButton]}
            onPress={() => setViewMode('grid')}
          >
            <Ionicons
              name="grid"
              size={20}
              color={viewMode === 'grid' ? '#2196F3' : '#666'}
            />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* File List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={styles.loadingText}>جاري تحميل الملفات...</Text>
        </View>
      ) : filteredFiles.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="folder-open" size={64} color="#ccc" />
          <Text style={styles.emptyText}>
            {searchQuery ? 'لا توجد نتائج للبحث' : 'هذا المجلد فارغ'}
          </Text>
          <Text style={styles.emptySubtext}>
            {searchQuery
              ? 'جرب استخدام كلمات بحث مختلفة'
              : 'اضغط على زر "+" لإنشاء مجلد جديد أو رفع ملف'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredFiles}
          renderItem={renderFileItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.fileList}
        />
      )}
      
      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        {currentPath !== '/' && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={navigateUp}
          >
            <Ionicons name="arrow-up" size={24} color="#fff" />
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={[styles.actionButton, styles.primaryActionButton]}
          onPress={() => setShowCreateModal(true)}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      
      {/* Create Folder Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showCreateModal}
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>إنشاء مجلد جديد</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  setShowCreateModal(false);
                  setNewFolderName('');
                }}
              >
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={styles.modalInput}
              placeholder="اسم المجلد"
              placeholderTextColor="#999"
              value={newFolderName}
              onChangeText={setNewFolderName}
              autoFocus
            />
            
            <TouchableOpacity
              style={styles.modalButton}
              onPress={createNewFolder}
            >
              <Text style={styles.modalButtonText}>إنشاء</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      {/* File Options Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showFileOptionsModal}
        onRequestClose={() => {
          setShowFileOptionsModal(false);
          setSelectedFile(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.fileOptionsContent}>
            {selectedFile && (
              <>
                <View style={styles.fileOptionsHeader}>
                  <View style={styles.selectedFileInfo}>
                    <Ionicons
                      name={selectedFile.type === 'folder' ? 'folder' : getFileIcon(selectedFile.name)}
                      size={32}
                      color={selectedFile.type === 'folder' ? '#FFC107' : '#2196F3'}
                    />
                    <View style={styles.selectedFileDetails}>
                      <Text style={styles.selectedFileName}>{selectedFile.name}</Text>
                      <Text style={styles.selectedFileSubinfo}>
                        {selectedFile.type === 'folder' ? 'مجلد' : formatFileSize(selectedFile.size)} • {formatDate(selectedFile.lastModified)}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => {
                      setShowFileOptionsModal(false);
                      setSelectedFile(null);
                    }}
                  >
                    <Ionicons name="close" size={24} color="#333" />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.fileOptionsButtons}>
                  {selectedFile.type !== 'folder' && (
                    <TouchableOpacity
                      style={styles.fileOptionButton}
                      onPress={openFile}
                    >
                      <Ionicons name="open-outline" size={24} color="#2196F3" />
                      <Text style={styles.fileOptionText}>فتح</Text>
                    </TouchableOpacity>
                  )}
                  
                  {selectedFile.type !== 'folder' && (
                    <TouchableOpacity
                      style={styles.fileOptionButton}
                      onPress={downloadFile}
                    >
                      <Ionicons name="download-outline" size={24} color="#4CAF50" />
                      <Text style={styles.fileOptionText}>تحميل</Text>
                    </TouchableOpacity>
                  )}
                  
                  <TouchableOpacity
                    style={styles.fileOptionButton}
                    onPress={shareFile}
                  >
                    <Ionicons name="share-social-outline" size={24} color="#FF9800" />
                    <Text style={styles.fileOptionText}>مشاركة</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.fileOptionButton}
                    onPress={deleteFile}
                  >
                    <Ionicons name="trash-outline" size={24} color="#F44336" />
                    <Text style={styles.fileOptionText}>حذف</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  headerRight: {
    width: 40,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f5f5f5',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
    textAlign: 'right',
  },
  pathContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexWrap: 'wrap',
  },
  pathButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  pathText: {
    fontSize: 14,
    color: '#2196F3',
  },
  pathSeparator: {
    fontSize: 14,
    color: '#666',
    marginHorizontal: 4,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sortControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  sortButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginHorizontal: 4,
    borderRadius: 4,
    backgroundColor: '#f0f0f0',
  },
  activeSortButton: {
    backgroundColor: '#e3f2fd',
  },
  sortButtonText: {
    fontSize: 12,
    color: '#666',
  },
  activeSortButtonText: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
  viewControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewButton: {
    padding: 6,
    marginLeft: 8,
    borderRadius: 4,
  },
  activeViewButton: {
    backgroundColor: '#e3f2fd',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  fileList: {
    padding: 16,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  fileIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  fileDetails: {
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  fileInfo: {
    fontSize: 12,
    color: '#666',
  },
  fileAction: {
    padding: 8,
  },
  actionButtons: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    flexDirection: 'row',
  },
  actionButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#757575',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  primaryActionButton: {
    backgroundColor: '#2196F3',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  modalInput: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'right',
  },
  modalButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  fileOptionsContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  fileOptionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  selectedFileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  selectedFileDetails: {
    marginLeft: 12,
    flex: 1,
  },
  selectedFileName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  selectedFileSubinfo: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  fileOptionsButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  fileOptionButton: {
    alignItems: 'center',
    padding: 12,
    width: '25%',
  },
  fileOptionText: {
    fontSize: 12,
    color: '#333',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default CloudBrowserScreen;