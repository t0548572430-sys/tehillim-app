

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Trophy, 
  Shuffle, 
  CheckCircle, 
  Sparkles, 
  Eye, 
  ChevronDown,
  AlertCircle,
  List
} from 'lucide-react';

import appData from './appData.json';

// ============================================================================
// GEMATRIA HELPER - Convert numbers to Hebrew numerals
// ============================================================================
const toHebrewNumeral = (num) => {
  const ones = ['', 'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט'];
  const tens = ['', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ'];
  const hundreds = ['', 'ק', 'ר', 'ש', 'ת'];
  
  if (num === 15) return 'ט״ו';
  if (num === 16) return 'ט״ז';
  
  const h = Math.floor(num / 100);
  const t = Math.floor((num % 100) / 10);
  const o = num % 10;
  
  let result = hundreds[h] + tens[t] + ones[o];
  
  if (result.length > 1) {
    return result.slice(0, -1) + '״' + result.slice(-1);
  }
  return result + '׳';
};

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================
function App() {
  // State Management
  const [chapters, setChapters] = useState(() => {
    const saved = localStorage.getItem('tehillim_chapters');
    if (saved) return JSON.parse(saved);
    return Array.from({ length: 150 }, (_, i) => ({
      id: i + 1,
      status: 'available', 
    }));
  });

  const [previewChapter, setPreviewChapter] = useState(null); 
  const [viewingChapterId, setViewingChapterId] = useState(null); 
  const [showSelectInput, setShowSelectInput] = useState(false); 

  useEffect(() => {
    localStorage.setItem('tehillim_chapters', JSON.stringify(chapters));
  }, [chapters]);

  const stats = {
    completed: chapters.filter(ch => ch.status === 'completed').length,
    available: chapters.filter(ch => ch.status === 'available').length,
    reading: chapters.filter(ch => ch.status === 'reading').length
  };

  const getChapterContent = () => {
    if (!viewingChapterId) return null;
    const key = String(viewingChapterId);
    if (appData && appData[key]) {
      const content = appData[key];
      if (Array.isArray(content)) return content;
      if (typeof content === 'string') return [content];
    }
    return null;
  };

  const currentText = getChapterContent();
  
  // ============================================================================
  // USER ACTIONS
  // ============================================================================
  const handleRaffle = () => {
    const available = chapters.filter(ch => ch.status === 'available');
    if (available.length === 0) return alert('כל הפרקים כבר נקראו!');
    const randomChapter = available[Math.floor(Math.random() * available.length)];
    setPreviewChapter(randomChapter);
    setShowSelectInput(false);
  };

  const handleAcceptRaffle = () => {
    if (!previewChapter) return;
    setChapters(prev => prev.map(ch => ch.id === previewChapter.id ? { ...ch, status: 'reading' } : ch));
    setViewingChapterId(previewChapter.id);
    setPreviewChapter(null);
  };

  const handleManualSelect = (event) => {
    const id = Number(event.target.value);
    if (!id) return;
    setChapters(prev => prev.map(ch => ch.id === id ? { ...ch, status: 'reading' } : ch));
    setViewingChapterId(id);
    setShowSelectInput(false);
  };

  const handleFinish = (id) => {
    triggerConfetti();
    setChapters(prev => prev.map(ch => ch.id === id ? { ...ch, status: 'completed' } : ch));
    if (viewingChapterId === id) setViewingChapterId(null);
  };

  const triggerConfetti = () => {
    const el = document.createElement('div');
    el.className = 'fixed inset-0 pointer-events-none z-50 flex items-center justify-center';
    el.innerHTML = '<div class="text-6xl animate-bounce">🎉</div>';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] pb-12 font-sans text-gray-800" dir="rtl">
      
      {/* HEADER - Icon on RIGHT */}
      <header className="py-8 text-center border-b border-gray-100">
        <div className="inline-flex items-center justify-center gap-3 mb-1">
          <div className="bg-[#FF9800] p-3 rounded-2xl text-white shadow-md">
            <BookOpen size={28} strokeWidth={2.5} />
          </div>
          <h1 className="text-5xl font-black text-[#FF9800]">תהילים ביחד</h1>
        </div>
        <p className="text-gray-500 text-sm font-medium">הגרלת פרקי תהילים ✨</p>
      </header>

      <main className="max-w-6xl mx-auto px-6 space-y-8">
        
        {/* STATS CARDS - Colored backgrounds, RIGHT to LEFT order */}
        <div className="grid grid-cols-4 gap-4">
          <StatsCard 
            label="פרקים בקריאה" 
            value={stats.reading} 
            icon={BookOpen} 
            color="text-blue-500" 
            bg="bg-blue-50/30"
          />
          <StatsCard 
            label="פרקים שנקראו" 
            value={`${stats.completed} מתוך 150`}
            icon={CheckCircle} 
            color="text-green-500" 
            bg="bg-green-50/30"
          />
          <StatsCard 
            label="נשארו להגרלה" 
            value={stats.available} 
            icon={Sparkles} 
            color="text-orange-500" 
            bg="bg-orange-50/30"
          />
          <StatsCard 
            label="ספרים שהושלמו" 
            value={Math.floor(stats.completed / 150)} 
            icon={Trophy} 
            color="text-purple-500" 
            bg="bg-purple-50/30"
          />
        </div>

        {/* ACTION ISLAND - EXACT MATCH TO IMAGE 2 */}
        <div className="bg-[#FFFBEB] border border-amber-100 rounded-[2rem] p-10 text-center relative shadow-sm">
          
          {previewChapter ? (
            // RAFFLE RESULT
            <div className="animate-in fade-in zoom-in duration-300">
              <span className="inline-block px-4 py-1.5 bg-[#FFF5E6] border border-orange-200 rounded-full text-orange-600 text-sm font-bold mb-6 shadow-sm">
                ✨ הגרלת פרקים
              </span>
              
              <p className="text-gray-600 mb-6 font-medium">:הפרק שהוגרל</p>
              
              <div className="mb-8 flex justify-center">
                <div className="bg-white border-4 border-orange-300 rounded-3xl py-6 px-14 shadow-lg">
                  <h2 className="text-6xl font-black text-[#F97316]">
                    פרק {toHebrewNumeral(previewChapter.id)}
                  </h2>
                </div>
              </div>

              <div className="flex justify-center gap-4">
                <button onClick={handleAcceptRaffle} className="bg-[#10B981] hover:bg-[#059669] text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-green-200 flex items-center gap-2 transition-transform hover:scale-105">
                  <span>אני לוקח את הפרק</span> <CheckCircle size={20} /> 
                </button>
                 <button onClick={handleRaffle} className="bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors">
                   <Shuffle size={18} /> הגרל פרק אחר
                </button>
                
              </div>
            </div>
          ) : (
            // DEFAULT ACTIONS - EXACT MATCH TO IMAGE 2
            <div className="flex flex-col items-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-white px-4 py-1.5 rounded-full mb-4 shadow-sm border border-amber-100">
                 <Sparkles size={16} className="text-amber-500" />
                 <span className="text-amber-600 font-bold text-sm">הגרלת פרקים</span>
              </div>
              
              <p className="text-gray-600 mb-8 font-medium">לחצו להגרלת פרק תהילים אקראי או בחרו פרק מסוים</p>
              
              {/* BUTTONS ROW - Icons on RIGHT */}
              <div className="flex flex-row gap-4 w-full justify-center max-w-lg mb-6">
                
                {/* 1. Raffle Button (Orange) - RIGHT SIDE */}
                <button 
                  onClick={handleRaffle} 
                  disabled={stats.available === 0} 
                  className="flex-1 bg-[#F59E0B] hover:bg-[#D97706] text-white py-3.5 px-6 rounded-2xl font-bold shadow-md shadow-orange-100 flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  <span>הגרילו פרק</span> <Shuffle size={20} />
                </button>

                {/* 2. Select Button (White with Blue Text) - LEFT SIDE */}
                <button 
                  onClick={() => setShowSelectInput(!showSelectInput)} 
                  className={`flex-1 bg-white border-2 text-[#3B82F6] py-3.5 px-6 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-sm
                    ${showSelectInput ? 'border-blue-400 ring-2 ring-blue-50' : 'border-blue-100 hover:border-blue-300'}
                  `}
                >
                  <span>בחרו פרק מסוים</span> 
                  <List size={20} />
                </button>
              </div>

              {/* DROPDOWN INPUT */}
              {showSelectInput && (
                <div className="w-full max-w-lg animate-in slide-in-from-top-2 fade-in duration-200">
                  <div className="relative group">
                    <select 
                      onChange={handleManualSelect}
                      className="w-full appearance-none bg-white border border-gray-200 text-gray-700 font-medium py-3.5 px-4 pr-10 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 text-right cursor-pointer text-base"
                      defaultValue=""
                    >
                      <option value="" disabled>...בחרו פרק מהרשימה</option>
                      {chapters.filter(ch => ch.status === 'available').map(ch => (
                        <option key={ch.id} value={ch.id}>פרק {toHebrewNumeral(ch.id)}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-blue-500 transition-colors" size={18} />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* SPLIT LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* RIGHT COLUMN: READING LIST - EXACT MATCH TO IMAGE 3 */}
          <div className="col-span-12 lg:col-span-4 order-1">
             <div className="flex items-center justify-between text-gray-800 font-bold px-1 mb-4">
                <div className="flex items-center gap-2">
                    <BookOpen size={18} className="text-[#3B82F6]"/>
                    <h3>פרקים בקריאה</h3>
                </div>
                <span className="bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full text-xs font-extrabold">{stats.reading}</span>
             </div>

             {stats.reading === 0 ? (
                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center bg-white/60">
                   <p className="text-gray-400 font-medium text-sm">עדיין לא נבחרו פרקים</p>
                </div>
             ) : (
                <div className="space-y-3">
                   {chapters.filter(ch => ch.status === 'reading').map(ch => (
                     <div 
                       key={ch.id} 
                       className={`bg-white border-2 rounded-2xl p-3 flex items-center justify-between shadow-sm transition-all
                         ${viewingChapterId === ch.id ? 'border-blue-400 bg-[#F0F9FF]' : 'border-gray-100 hover:border-blue-200'}
                       `}
                     ><div className="flex items-center gap-3">
                           <span className="font-bold text-gray-800 text-base">פרק {toHebrewNumeral(ch.id)}</span>
                           {/* Badge on RIGHT */}
                           <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base
                              ${viewingChapterId === ch.id ? 'bg-blue-500 text-white shadow-sm' : 'bg-blue-50 text-blue-600'}
                           `}>
                              {toHebrewNumeral(ch.id)}
                           </div>
                        </div>
                        <div className="flex items-center gap-2">
                           {/* Buttons - Icons on LEFT of text */}
                           <button 
                              onClick={() => setViewingChapterId(ch.id)} 
                              className="flex items-center gap-1.5 px-3 py-1.5 text-blue-600 hover:bg-blue-100 rounded-lg font-bold text-xs transition-colors"
                           >
                              <Eye size={16} /> צפייה
                           </button>
                           <button 
                              onClick={() => handleFinish(ch.id)}
                              className="flex items-center gap-1.5 px-3 py-1.5 text-[#10B981] hover:bg-green-50 rounded-lg font-bold text-xs transition-colors"
                           >
                              <CheckCircle size={16} /> סיימתי
                           </button>

                           
                        </div>
                        
                        
                     </div>
                   ))}
                </div>
             )}
          </div>

          {/* LEFT COLUMN: READING AREA */}
          <div className="col-span-12 lg:col-span-8 order-2 min-h-[500px]">
             {!viewingChapterId ? (
                // EMPTY STATE
                <div className="bg-white border-2 border-gray-100 rounded-[2rem] p-12 text-center shadow-sm h-full flex flex-col items-center justify-center text-gray-400">
                   <BookOpen size={64} className="mb-6 text-gray-200 stroke-1" />
                   <h3 className="text-xl font-bold text-gray-300 mb-2">אזור קריאה</h3>
                   <p className="text-gray-400 font-medium">לחצו על "צפייה" בפרק מהרשימה כדי לקרוא אותו כאן</p>
                </div>
             ) : (
                currentText ? (
                   // SUCCESS: SHOW TEXT
                   <div className="bg-white border-2 border-gray-100 rounded-[2rem] p-10 shadow-sm h-full animate-in fade-in slide-in-from-bottom-2 flex flex-col">
                      <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-6">
                         <div className="flex items-center gap-4">
                            <span className="bg-blue-100 text-blue-700 font-bold px-4 py-2 rounded-xl text-xl">
                               {toHebrewNumeral(viewingChapterId)}
                            </span>
                            <h2 className="text-3xl font-extrabold text-gray-800">פרק {toHebrewNumeral(viewingChapterId)}</h2>
                         </div>
                         <button onClick={() => setViewingChapterId(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                            <Eye size={20}/>
                         </button>
                      </div>
                      
                      {/* TEXT CONTENT */}
                      <div className="text-2xl leading-relaxed font-serif text-gray-800 text-center flex-grow overflow-y-auto px-4 py-4">
                         {currentText.map((verse, i) => (
                            <p key={i} className="mb-4">{verse}</p>
                         ))}
                      </div>
                      
                      {/* FINISH BUTTON */}
                      <div className="mt-8 pt-6 border-t border-gray-100 flex justify-center">
                         <button onClick={() => handleFinish(viewingChapterId)} className="bg-[#10B981] hover:bg-[#059669] text-white px-12 py-3.5 rounded-2xl font-bold shadow-lg shadow-green-100 flex items-center gap-3 transition-transform hover:scale-105">
                            <CheckCircle size={22} /> <span className="text-lg">סיימתי לקרוא</span>
                         </button>
                      </div>
                   </div>
                ) : (
                   // ERROR: PINK BOX - EXACT MATCH TO IMAGE 3
                   <div className="bg-[#FEF2F2] border-2 border-[#FECACA] rounded-[2rem] p-12 text-center h-full flex flex-col items-center justify-center">
                      <h3 className="text-[#B91C1C] font-extrabold text-xl mb-2">שגיאה בטעינת הפרק</h3>
                   </div>
                )
             )}
          </div>
        </div>
      </main>
    </div>
  );
}

// ============================================================================
// STATS CARD COMPONENT - Icon on LEFT, Text on RIGHT
// ============================================================================
const StatsCard = ({ label, value, sub, icon: Icon, color, bg }) => (
  <div className={`${bg} p-5 rounded-2xl border border-gray-200 shadow-sm`}>
    <div className="flex items-start justify-between">
      {/* Icon */}
      <div className={`${color} mr-3`}>
        <Icon size={24} strokeWidth={2} />
      </div>
      
      {/* Text Container - CHANGED items-end to items-start for RTL alignment */}
      <div className="flex flex-col items-start text-right flex-1">
        <p className="text-gray-600 text-sm font-medium mb-3">{label}</p>
        <p className="text-4xl font-black text-gray-900 leading-none">{value}</p>
        {sub && <span className="text-sm text-gray-500 font-medium mt-0.5">{sub}</span>}
      </div>
    </div>
  </div>
);


export default App;

