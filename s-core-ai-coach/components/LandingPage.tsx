
import React, { useState } from 'react';

interface LandingPageProps {
  onStart: () => void;
  onSkipProfile?: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart, onSkipProfile }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleSearch = () => {
    const db = JSON.parse(localStorage.getItem('score_db') || '[]');
    const results = db.filter((item: any) => 
        item.name.includes(searchQuery) || item.id === searchQuery
    );
    setSearchResults(results);
  };

  return (
    <div className="relative min-h-screen">
      {/* Header */}
      <nav className="p-4 md:p-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
            <i className="fas fa-bolt text-white text-sm md:text-base"></i>
          </div>
          <span className="font-montserrat font-black text-xl md:text-2xl tracking-tighter text-white">S-CORE</span>
        </div>
        <div className="hidden md:flex gap-8 text-[11px] font-black uppercase tracking-widest text-slate-500 font-noto">
          <span className="text-cyan-400">ダッシュボード</span>
          <span className="hover:text-white cursor-pointer transition-colors">メソッド</span>
          <span className="hover:text-white cursor-pointer transition-colors">サポート</span>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-10 pb-10 md:pt-24 md:pb-20 text-center px-4 max-w-5xl mx-auto">
        <div className="inline-block px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] mb-6 md:mb-8 animate-pulse font-noto">
          次世代AIコーチングエンジン
        </div>
        
        <h1 className="text-4xl sm:text-6xl md:text-8xl font-montserrat font-black mb-6 md:mb-8 tracking-tighter leading-tight text-white">
          ELEVATE YOUR<br />
          <span className="neo-gradient-text">PERFORMANCE</span>
        </h1>
        
        <p className="text-slate-400 text-base md:text-xl max-w-2xl mx-auto mb-8 md:mb-12 leading-relaxed font-light font-noto">
          スポーツ科学とAIの融合。<br className="hidden sm:block" />
          選手の身体能力と技術を多角的に分析し、<br className="hidden sm:block" />
          <span className="text-white font-semibold"> 科学的根拠に基づいた最適解 </span>を提示します。
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mx-auto max-w-lg font-noto px-4 sm:px-0">
          <button
            onClick={onStart}
            className="btn-primary w-full text-white font-black py-4 md:py-5 px-6 md:px-10 rounded-xl md:rounded-2xl text-base md:text-lg transition-all transform hover:scale-105 tracking-tight flex items-center justify-center gap-3"
          >
            <span>計測を開始する</span>
            <i className="fas fa-chevron-right text-sm ml-2"></i>
          </button>
          
          <button
            onClick={onSkipProfile}
            className="w-full bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 font-bold py-4 md:py-5 px-6 md:px-10 rounded-xl md:rounded-2xl text-base md:text-lg transition-all tracking-tight flex items-center justify-center gap-3"
          >
            <span>プロフィールなしで入力</span>
            <i className="fas fa-fast-forward text-sm opacity-50"></i>
          </button>
        </div>
      </div>

      {/* Search Section */}
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <div className="glass-card rounded-2xl md:rounded-[2.5rem] p-6 md:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-cyan-500/5 rounded-full translate-x-12 -translate-y-12 md:translate-x-16 md:-translate-y-16"></div>
          
          <div className="flex flex-col lg:flex-row justify-between lg:items-end mb-8 md:mb-10 gap-6">
            <div>
              <h2 className="text-xl md:text-2xl font-black mb-1 flex items-center font-noto text-white">
                <i className="fas fa-database mr-3 text-cyan-400"></i>
                データエクスプローラー
              </h2>
              <p className="text-slate-500 text-[10px] md:text-xs font-bold uppercase tracking-widest font-noto">選手データベース検索</p>
            </div>
            <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-2">
              <input
                type="text"
                placeholder="氏名 または 選手IDを入力..."
                className="flex-1 sm:w-64 bg-slate-900 border border-slate-800 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 text-white placeholder:text-slate-600 font-medium font-noto"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                onClick={handleSearch}
                className="bg-white hover:bg-slate-200 text-black font-black px-8 py-3 rounded-xl transition-all active:scale-95 font-noto"
              >
                検索
              </button>
            </div>
          </div>
          
          {searchResults.length > 0 ? (
            <div className="overflow-x-auto -mx-6 px-6 font-noto scrollbar-hide">
              <table className="w-full text-left min-w-[500px]">
                <thead>
                  <tr className="text-slate-600 text-[10px] font-black uppercase tracking-[0.2em] border-b border-white/5">
                    <th className="pb-5 px-4">選手ID</th>
                    <th className="pb-5 px-4">選手氏名</th>
                    <th className="pb-5 px-4">実施日</th>
                    <th className="pb-5 px-4 text-center">平均スコア</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {searchResults.map((item, idx) => {
                      const avg = Object.values(item.scores as Record<string, number>).reduce((a,b) => a+b, 0) / 15;
                      return (
                        <tr key={idx} className="group hover:bg-white/5 transition-colors">
                          <td className="py-5 px-4 font-mono text-cyan-400 text-xs">{item.id}</td>
                          <td className="py-5 px-4 font-bold text-slate-200">{item.name}</td>
                          <td className="py-5 px-4 text-slate-500 text-sm">{item.date}</td>
                          <td className="py-5 px-4 text-center">
                            <span className="bg-cyan-400/10 text-cyan-400 px-4 py-1.5 rounded-lg text-xs font-black">
                              {avg.toFixed(1)}
                            </span>
                          </td>
                        </tr>
                      );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-16 md:py-20 text-center border-2 border-dashed border-white/5 rounded-xl md:rounded-[2rem] font-noto">
              <i className="fas fa-folder-open text-slate-800 text-3xl md:text-4xl mb-4"></i>
              <p className="text-slate-600 font-bold uppercase text-[9px] md:text-[10px] tracking-widest">該当するデータが見つかりません</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
