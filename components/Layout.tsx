
import React from 'react';
import { AppView } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeView: AppView;
  onNavigate: (view: AppView) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, onNavigate, isLoggedIn, onLogout }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 px-4 py-3 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('chat')}>
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-xl shadow-lg shadow-indigo-200">
              <i className="fas fa-robot"></i>
            </div>
            <div className="max-w-[150px] sm:max-w-none">
              <h1 className="text-sm sm:text-lg font-bold text-slate-800 leading-tight">الدعم الفني لنظام التعليم الإلكتروني</h1>
              <span className="text-[10px] sm:text-xs text-slate-500 font-medium block leading-tight mt-0.5">
                قسم المحتوى الإلكتروني بالمعهد التخصصي للتدريب المهني للمعلمين
              </span>
            </div>
          </div>

          <nav className="flex items-center gap-2">
            <button 
              onClick={() => onNavigate('chat')}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${activeView === 'chat' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              الدردشة
            </button>
            {isLoggedIn ? (
              <>
                <button 
                  onClick={() => onNavigate('admin')}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${activeView === 'admin' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  لوحة التحكم
                </button>
                <button 
                  onClick={onLogout}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
                >
                  خروج
                </button>
              </>
            ) : (
              <button 
                onClick={() => onNavigate('login')}
                className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium text-indigo-600 hover:bg-indigo-50 transition-all border border-indigo-200"
              >
                دخول المسؤول
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto flex flex-col">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-4 px-4 text-center text-slate-400 text-[10px] sm:text-xs">
        <p>&copy; 2024 نظام التدريب الإلكتروني - قسم المحتوى الإلكتروني بالمعهد التخصصي للتدريب المهني للمعلمين</p>
      </footer>
    </div>
  );
};

export default Layout;
