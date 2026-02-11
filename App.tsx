
import React, { useState, useEffect } from 'react';
import { AppView, KnowledgeFile, BotSettings } from './types';
import Layout from './components/Layout';
import ChatInterface from './components/ChatInterface';
import AdminPanel from './components/AdminPanel';
import Login from './components/Login';
import { DEFAULT_KNOWLEDGE_BASE } from './constants';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('chat');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [knowledgeFiles, setKnowledgeFiles] = useState<KnowledgeFile[]>([]);
  const [botSettings, setBotSettings] = useState<BotSettings>({
    bubbleColor: '#ffffff',
    icon: 'fa-robot'
  });

  // تحميل البيانات من التخزين المحلي عند بدء التطبيق
  useEffect(() => {
    const savedFiles = localStorage.getItem('oman_support_files');
    if (savedFiles && JSON.parse(savedFiles).length > 0) {
      try {
        setKnowledgeFiles(JSON.parse(savedFiles));
      } catch (e) {
        console.error("Error loading files", e);
      }
    } else {
      // إذا لم توجد ملفات، قم بتحميل الملف الافتراضي (الأسئلة الشائعة)
      const defaultFile: KnowledgeFile = {
        id: 'default-faq',
        name: 'الأسئلة_الشائعة.csv',
        type: 'csv',
        content: DEFAULT_KNOWLEDGE_BASE,
        uploadDate: Date.now()
      };
      setKnowledgeFiles([defaultFile]);
    }

    const savedSettings = localStorage.getItem('oman_bot_settings');
    if (savedSettings) {
      try {
        setBotSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error("Error loading settings", e);
      }
    }
  }, []);

  const saveFiles = (files: KnowledgeFile[]) => {
    setKnowledgeFiles(files);
    localStorage.setItem('oman_support_files', JSON.stringify(files));
  };

  const updateBotSettings = (newSettings: BotSettings) => {
    setBotSettings(newSettings);
    localStorage.setItem('oman_bot_settings', JSON.stringify(newSettings));
  };

  const handleFileUpload = (newFile: KnowledgeFile) => {
    saveFiles([...knowledgeFiles, newFile]);
  };

  const handleFileDelete = (id: string) => {
    saveFiles(knowledgeFiles.filter(f => f.id !== id));
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setView('admin');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setView('chat');
  };

  const renderContent = () => {
    if (view === 'admin' && !isLoggedIn) {
      return <Login onLogin={handleLogin} />;
    }
    
    if (view === 'login') {
      return isLoggedIn ? setView('admin') : <Login onLogin={handleLogin} />;
    }

    switch (view) {
      case 'chat':
        return <ChatInterface 
          knowledgeFiles={knowledgeFiles} 
          botSettings={botSettings}
          isLoggedIn={isLoggedIn}
          onUpdateSettings={updateBotSettings}
        />;
      case 'admin':
        return <AdminPanel 
            files={knowledgeFiles} 
            onUpload={handleFileUpload} 
            onDelete={handleFileDelete}
            botSettings={botSettings}
            onUpdateSettings={updateBotSettings}
          />;
      default:
        return <ChatInterface 
          knowledgeFiles={knowledgeFiles} 
          botSettings={botSettings}
          isLoggedIn={isLoggedIn}
          onUpdateSettings={updateBotSettings}
        />;
    }
  };

  return (
    <Layout 
      activeView={view} 
      onNavigate={setView} 
      isLoggedIn={isLoggedIn} 
      onLogout={handleLogout}
    >
      <div className="flex-1 flex flex-col">
        {renderContent()}
      </div>
    </Layout>
  );
};

export default App;
