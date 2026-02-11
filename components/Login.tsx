
import React, { useState } from 'react';
import { ADMIN_CREDENTIALS } from '../constants';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // محاكاة تأخير بسيط لتجربة مستخدم أفضل
    setTimeout(() => {
      if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        onLogin();
      } else {
        setError('اسم المستخدم أو كلمة المرور غير صحيحة. يرجى المحاولة مرة أخرى.');
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6 animate-fadeIn">
      <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-[2rem] border border-slate-200 shadow-2xl shadow-indigo-100/50 space-y-8">
        <div className="text-center space-y-3">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl flex items-center justify-center text-white text-4xl mx-auto shadow-xl shadow-indigo-200 ring-8 ring-indigo-50">
            <i className="fas fa-lock-open"></i>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">بوابة الإدارة</h2>
            <p className="text-slate-500 text-sm mt-1">يرجى إدخال بيانات الوصول لإدارة البوت</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-2xl text-sm flex items-center gap-3 border border-red-100 animate-pulse">
              <i className="fas fa-exclamation-triangle shrink-0"></i>
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 mr-1 block">اسم المستخدم</label>
            <div className="relative group">
              <i className="fas fa-user absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors"></i>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pr-12 pl-4 py-4 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-800"
                placeholder="أدخل اسم المستخدم"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 mr-1 block">كلمة المرور</label>
            <div className="relative group">
              <i className="fas fa-key absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors"></i>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pr-12 pl-4 py-4 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-800"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 group disabled:opacity-70"
          >
            {loading ? (
              <i className="fas fa-circle-notch fa-spin"></i>
            ) : (
              <>
                <span>تسجيل الدخول</span>
                <i className="fas fa-arrow-left group-hover:-translate-x-1 transition-transform"></i>
              </>
            )}
          </button>
        </form>

        <div className="pt-4 text-center">
          <p className="text-xs text-slate-400">نظام آمن ومشفر لإدارة المحتوى التعليمي</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
