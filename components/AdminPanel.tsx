
import React, { useState } from 'react';
import { KnowledgeFile, BotSettings } from '../types';
import { parseFile } from '../utils/fileParser';

interface AdminPanelProps {
  files: KnowledgeFile[];
  onUpload: (file: KnowledgeFile) => void;
  onDelete: (id: string) => void;
  botSettings: BotSettings;
  onUpdateSettings: (settings: BotSettings) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  files, 
  onUpload, 
  onDelete, 
  botSettings, 
  onUpdateSettings 
}) => {
  const [isParsing, setIsParsing] = useState(false);
  const [pendingFile, setPendingFile] = useState<KnowledgeFile | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsing(true);
    try {
      const content = await parseFile(file);
      const newFile: KnowledgeFile = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.name.split('.').pop() || 'unknown',
        content,
        uploadDate: Date.now()
      };
      setPendingFile(newFile);
    } catch (error) {
      alert("فشل في معالجة الملف. يرجى التأكد من نوع الملف.");
    } finally {
      setIsParsing(false);
      e.target.value = '';
    }
  };

  const confirmSave = () => {
    if (pendingFile) {
      onUpload(pendingFile);
      setPendingFile(null);
      const toast = document.createElement('div');
      toast.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg z-[100] animate-fadeIn';
      toast.innerHTML = '<i class="fas fa-check-circle ml-2"></i> تم حفظ الملف في قاعدة البيانات بنجاح';
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
    }
  };

  const cancelPending = () => {
    setPendingFile(null);
  };

  const botIcons = [
    { id: 'fa-robot', label: 'روبوت' },
    { id: 'fa-headset', label: 'دعم فني' },
    { id: 'fa-user-tie', label: 'مسؤول' },
    { id: 'fa-shield-halved', label: 'أمان' },
    { id: 'fa-graduation-cap', label: 'تعليم' }
  ];

  return (
    <div className="flex-1 p-4 sm:p-8 animate-fadeIn">
      <div className="max-w-5xl mx-auto space-y-8 pb-20">
        
        {/* Appearance Customization Section */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <i className="fas fa-magic text-indigo-500"></i>
              تخصيص هوية المساعد الذكي
            </h2>
            <p className="text-slate-500 text-sm">تحكم في ألوان وأيقونات البوت ليتناسب مع هوية المؤسسة</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-sm font-bold text-slate-700 block">لون خلفية فقاعة الدردشة (للبوت)</label>
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <input 
                  type="color" 
                  value={botSettings.bubbleColor}
                  onChange={(e) => onUpdateSettings({...botSettings, bubbleColor: e.target.value})}
                  className="w-12 h-12 rounded-xl cursor-pointer border-0 bg-transparent ring-2 ring-white shadow-sm"
                />
                <div>
                  <span className="text-sm font-mono font-bold text-slate-800 uppercase">{botSettings.bubbleColor}</span>
                  <p className="text-[10px] text-slate-400">هذا اللون سيظهر كخلفية لردود البوت</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-bold text-slate-700 block">اختيار أيقونة البوت</label>
              <div className="grid grid-cols-5 gap-3">
                {botIcons.map(icon => (
                  <button
                    key={icon.id}
                    onClick={() => onUpdateSettings({...botSettings, icon: icon.id})}
                    className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${
                      botSettings.icon === icon.id 
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100 scale-105' 
                      : 'bg-white border-slate-200 text-slate-400 hover:border-indigo-300'
                    }`}
                  >
                    <i className={`fas ${icon.id} text-xl`}></i>
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
            <h4 className="text-xs font-bold text-indigo-600 mb-2">معاينة مباشرة:</h4>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-white text-indigo-600 border border-slate-200 flex items-center justify-center">
                <i className={`fas ${botSettings.icon} text-xs`}></i>
              </div>
              <div 
                className="p-3 rounded-2xl rounded-tl-none shadow-sm text-xs"
                style={{ backgroundColor: botSettings.bubbleColor, color: '#1e293b' }}
              >
                هكذا سيبدو مظهر ردي في نافذة الدردشة...
              </div>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-slate-800">إدارة قاعدة المعرفة</h2>
            <p className="text-slate-500">قم بتغذية البوت بملفات التعليمات والدعم الفني</p>
          </div>
          
          <label className="relative flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-2xl cursor-pointer transition-all shadow-lg shadow-indigo-100 shrink-0">
            {isParsing ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-cloud-upload-alt"></i>}
            <span>{isParsing ? 'جاري التحليل...' : 'إضافة ملف جديد'}</span>
            <input 
              type="file" 
              className="hidden" 
              onChange={handleFileChange} 
              accept=".csv, .txt, .docx, .xlsx, .xls"
              disabled={isParsing || !!pendingFile}
            />
          </label>
        </div>

        {/* Pending File Area */}
        {pendingFile && (
          <div className="bg-indigo-50 border-2 border-dashed border-indigo-200 p-6 rounded-3xl animate-fadeIn flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100 text-xl">
                <i className="fas fa-file-alt"></i>
              </div>
              <div>
                <h3 className="font-bold text-indigo-900">ملف جاهز: {pendingFile.name}</h3>
                <p className="text-sm text-indigo-700 opacity-75">تم تحليل المحتوى. اضغط حفظ للتخزين في قاعدة البيانات.</p>
              </div>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <button onClick={confirmSave} className="flex-1 md:flex-none bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-100">
                <i className="fas fa-save"></i> حفظ الملف
              </button>
              <button onClick={cancelPending} className="flex-1 md:flex-none bg-white hover:bg-red-50 text-red-600 border border-red-100 px-6 py-3 rounded-xl font-medium transition-all">
                إلغاء
              </button>
            </div>
          </div>
        )}

        {/* Files Grid */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-700 flex items-center gap-2">
            <i className="fas fa-database text-indigo-500"></i>
            الملفات المخزنة ({files.length})
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.length === 0 ? (
              <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-400 gap-4 bg-white rounded-3xl border border-slate-100 border-dashed">
                <i className="fas fa-folder-open text-6xl opacity-20"></i>
                <p>لا توجد ملفات حالياً</p>
              </div>
            ) : (
              files.map(file => (
                <div key={file.id} className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center justify-between group hover:border-indigo-300 transition-all shadow-sm">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                      file.type === 'csv' ? 'bg-green-50 text-green-600' :
                      file.type.includes('xl') ? 'bg-emerald-50 text-emerald-600' :
                      file.type.includes('doc') ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-600'
                    }`}>
                      <i className={`fas ${
                        file.type === 'csv' ? 'fa-file-csv' :
                        file.type.includes('xl') ? 'fa-file-excel' :
                        file.type.includes('doc') ? 'fa-file-word' : 'fa-file-alt'
                      }`}></i>
                    </div>
                    <div className="overflow-hidden">
                      <h3 className="font-bold text-slate-700 truncate text-sm">{file.name}</h3>
                      <p className="text-[10px] text-slate-400">
                        {new Date(file.uploadDate).toLocaleDateString('ar-OM')}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => onDelete(file.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
