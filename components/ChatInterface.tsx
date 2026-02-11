
import React, { useState, useRef, useEffect } from 'react';
import { Message, KnowledgeFile, BotSettings } from '../types';
import { getChatResponse } from '../services/geminiService';

interface ChatInterfaceProps {
  knowledgeFiles: KnowledgeFile[];
  botSettings: BotSettings;
  isLoggedIn: boolean;
  onUpdateSettings: (settings: BotSettings) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  knowledgeFiles, 
  botSettings, 
  isLoggedIn, 
  onUpdateSettings 
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      text: 'مرحباً بك في نظام الدعم الفني للتعليم الإلكتروني! أنا هنا لمساعدتك في التحديات التقنية. كيف يمكنني مساعدتك اليوم؟',
      timestamp: Date.now()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const renderTextWithLinks = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);

    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-800 underline font-bold hover:text-blue-600 transition-colors break-all block my-2 p-2 bg-blue-50/50 rounded-lg border border-blue-100/50"
          >
            <i className="fas fa-link ml-2 text-xs"></i>
            {part}
          </a>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    const context = knowledgeFiles.map(f => `محتوى من ملف ${f.name}:\n${f.content}`).join('\n\n');
    
    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const responseText = await getChatResponse(userMsg.text, history, context);

    const botMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, botMsg]);
    setIsLoading(false);
  };

  const botIcons = [
    { id: 'fa-robot', label: 'روبوت' },
    { id: 'fa-headset', label: 'دعم فني' },
    { id: 'fa-user-tie', label: 'مسؤول' },
    { id: 'fa-shield-halved', label: 'أمان' },
    { id: 'fa-graduation-cap', label: 'تعليم' }
  ];

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-140px)] overflow-hidden relative">
      {/* Floating Settings Button for Admin */}
      {isLoggedIn && (
        <button 
          onClick={() => setShowSettings(!showSettings)}
          className="absolute top-4 left-4 z-20 bg-white/80 backdrop-blur-sm border border-slate-200 p-3 rounded-full shadow-lg text-slate-600 hover:text-indigo-600 transition-all hover:scale-110"
          title="تخصيص مظهر البوت"
        >
          <i className={`fas ${showSettings ? 'fa-times' : 'fa-magic'}`}></i>
        </button>
      )}

      {/* Admin Quick Settings Panel */}
      {isLoggedIn && showSettings && (
        <div className="absolute top-16 left-4 z-20 w-72 bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 animate-fadeIn space-y-6">
          <div className="space-y-4">
            <h4 className="font-bold text-slate-800 flex items-center gap-2">
              <i className="fas fa-palette text-indigo-500"></i>
              تخصيص مظهر البوت
            </h4>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 block">لون فقاعة الرد</label>
              <div className="flex gap-2 items-center">
                <input 
                  type="color" 
                  value={botSettings.bubbleColor}
                  onChange={(e) => onUpdateSettings({...botSettings, bubbleColor: e.target.value})}
                  className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent"
                />
                <span className="text-sm font-mono text-slate-600 uppercase">{botSettings.bubbleColor}</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 block">أيقونة البوت</label>
              <div className="grid grid-cols-5 gap-2">
                {botIcons.map(icon => (
                  <button
                    key={icon.id}
                    onClick={() => onUpdateSettings({...botSettings, icon: icon.id})}
                    className={`p-2 rounded-lg border transition-all ${
                      botSettings.icon === icon.id 
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-600 scale-110' 
                      : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    <i className={`fas ${icon.id}`}></i>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <button 
            onClick={() => setShowSettings(false)}
            className="w-full bg-slate-800 text-white py-2 rounded-xl text-sm font-bold hover:bg-slate-900 transition-all"
          >
            إغلاق الإعدادات
          </button>
        </div>
      )}

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 scroll-smooth"
      >
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[85%] sm:max-w-[70%] gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600 border border-slate-200'
              }`}>
                <i className={`fas ${msg.role === 'user' ? 'fa-user' : botSettings.icon} text-xs transition-all`}></i>
              </div>
              <div 
                className={`p-4 rounded-2xl shadow-sm text-sm sm:text-base leading-relaxed whitespace-pre-wrap transition-all ${
                  msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'border border-slate-100 rounded-tl-none'
                }`}
                style={msg.role === 'model' ? { backgroundColor: botSettings.bubbleColor, color: '#1e293b' } : {}}
              >
                {msg.role === 'model' ? renderTextWithLinks(msg.text) : msg.text}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex flex-row gap-3 items-center">
              <div className="w-8 h-8 rounded-full bg-white text-indigo-600 border border-slate-200 flex items-center justify-center">
                <i className={`fas ${botSettings.icon} text-xs animate-pulse`}></i>
              </div>
              <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none flex gap-1 items-center">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 sm:p-6 bg-white border-t border-slate-100">
        <div className="max-w-3xl mx-auto flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="اكتب سؤالك هنا عن نظام التعليم..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !inputText.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white w-12 h-12 flex items-center justify-center rounded-xl shadow-lg shadow-indigo-100 transition-all shrink-0"
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
        <p className="text-center text-[10px] text-slate-400 mt-2">
          قد يخطئ الذكاء الاصطناعي أحياناً، يرجى مراجعة التعليمات الرسمية.
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;
