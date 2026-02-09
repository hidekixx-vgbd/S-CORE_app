
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { AthleteInfo, AnalysisResult, MetricFeedback, AthleteType } from '../types';
import { ADVISORY_MASTER } from '../data/advisoryMaster';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import React, { useState, useRef, useEffect } from 'react';

interface AnalysisResultViewProps {
  info: AthleteInfo;
  analysis: AnalysisResult;
  onReset: () => void;
}

// --- UI Components ---

const SoccerSilhouette = ({ url, className }: { url: string, className?: string }) => (
  <div className={`absolute pointer-events-none opacity-[0.04] grayscale invert mix-blend-screen overflow-hidden ${className}`}>
    <img src={url} className="w-full h-full object-contain" alt="soccer silhouette" />
  </div>
);

const ProgressBar = ({ score, color }: { score: number, color: string }) => {
  const percentage = (score / 5) * 100;
  return (
    <div className="w-full h-1.5 bg-slate-900/10 rounded-full mt-1.5 overflow-hidden border border-slate-900/5">
      <div 
        className={`h-full rounded-full transition-all duration-1000 ${color}`} 
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

const MetricBox = ({ icon, label, en, value, score, feedback, colorClass, textColorClass }: any) => (
  <div className="bg-white border border-slate-300 p-4 rounded-xl shadow-sm flex flex-col h-full hover:border-slate-500 transition-colors box-border relative overflow-hidden group">
    <div className={`absolute -right-3 -top-3 text-slate-100 opacity-20 text-6xl group-hover:opacity-30 transition-opacity`}>
      <i className={`fas ${icon}`}></i>
    </div>
    <div className="flex justify-between items-start mb-2 relative z-10">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-white shadow-md ${colorClass}`}>
        <i className={`fas ${icon} text-base`}></i>
      </div>
      <div className="text-right">
        <span className="text-[28px] font-montserrat font-black text-slate-900 leading-none">{score.toFixed(1)}</span>
        <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest block font-montserrat">点</span>
      </div>
    </div>
    
    <div className="flex-1 mb-2 relative z-10">
      <h4 className="text-[16px] font-black text-slate-900 leading-tight font-noto">{label}</h4>
      
      {value && (
        <div className="mt-1.5 inline-block px-2 py-0.5 bg-slate-100 border border-slate-300 rounded text-[10px] font-mono font-bold text-slate-600 leading-none">
          記録: {value}
        </div>
      )}

      <ProgressBar score={score} color={colorClass} />
    </div>

    <div className="mt-auto pt-3 border-t border-slate-100 relative z-10 min-h-[95px] flex flex-col justify-start">
      <div className="flex flex-col">
        <span className={`text-[9.5px] font-black ${textColorClass} uppercase leading-none mb-1.5 tracking-wider font-noto`}>AIフィードバック</span>
        <p className="text-[12px] text-slate-700 font-bold leading-[1.4] font-noto">
          {feedback?.intelligence || "データ解析中..."}
        </p>
      </div>
    </div>
  </div>
);

const SummaryBox = ({ title, content, color, icon, accentColor, silhouetteUrl }: { title: string, content: string, color: string, icon: string, accentColor: string, silhouetteUrl?: string }) => {
  const getFontSize = (text: string) => {
    const len = text.length;
    if (len > 240) return 'text-[11px]';
    if (len > 180) return 'text-[13px]';
    if (len > 130) return 'text-[15px]';
    if (len > 80) return 'text-[18px]';
    return 'text-[22px]';
  };

  return (
    <div className="mt-1 relative overflow-hidden rounded-2xl group shadow-xl">
      <div className={`bg-slate-900/95 border-l-[6px] ${color.replace('bg-', 'border-')} px-6 py-5 relative z-10 flex flex-col justify-center min-h-[110px]`}>
        <h5 className="text-[18px] font-black text-white uppercase tracking-[0.1em] mb-1.5 flex items-center gap-3 font-noto">
          <i className={`fas ${icon} ${accentColor} animate-pulse text-xl`}></i> {title}
        </h5>
        <p className={`${getFontSize(content)} text-slate-100 leading-relaxed font-black italic drop-shadow-lg font-noto`}>
          {content || "AI解析エンジンがパフォーマンスデータを処理しています..."}
        </p>
      </div>
      {silhouetteUrl && (
        <div className="absolute inset-0 z-0">
          <img src={silhouetteUrl} className="w-full h-full object-cover opacity-15 grayscale group-hover:scale-105 transition-transform duration-[10s]" alt="decoration" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-transparent to-transparent"></div>
        </div>
      )}
    </div>
  );
};

const CustomSectionHeader = ({ icon, title, subtitle, color }: any) => (
  <div className="flex items-center gap-3 mb-3 pb-2 border-b-2 border-slate-400">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-xl ${color}`}>
      <i className={`fas ${icon} text-xl`}></i>
    </div>
    <div>
      <h3 className="text-[22px] font-black text-slate-900 tracking-tighter leading-none mb-0.5 font-noto">{title}</h3>
      <p className="text-[12px] text-slate-600 font-black uppercase tracking-[0.2em] font-noto">{subtitle}</p>
    </div>
  </div>
);

// --- Main Component ---

const AnalysisResultView: React.FC<AnalysisResultViewProps> = ({ info, analysis, onReset }) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const page1Ref = useRef<HTMLDivElement>(null);
  const page2Ref = useRef<HTMLDivElement>(null);
  const page3Ref = useRef<HTMLDivElement>(null);
  const page4Ref = useRef<HTMLDivElement>(null);
  const page5Ref = useRef<HTMLDivElement>(null);
  const page6Ref = useRef<HTMLDivElement>(null);

  // Resize scaling logic for viewing A4 pages on mobile/tablet
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const viewportWidth = window.innerWidth - 32; // padding
        const targetWidth = 794; // approx 210mm in pixels at standard DPI
        if (viewportWidth < targetWidth) {
          setScale(viewportWidth / targetWidth);
        } else {
          setScale(1);
        }
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMale = info.gender === 'Male';
  const type = analysis.athleteType || 'POTENTIAL';
  const pattern = ADVISORY_MASTER[type];

  const getPatternTheme = (t: AthleteType) => {
    switch(t) {
      case 'SUPER_ACE': 
        return { name: 'スーパーエース', cardBorder: 'border-blue-500', accent: 'text-yellow-400', bg: 'bg-blue-600', tag: '🟦 エリート・ストラテジー', tagText: 'text-yellow-400', desc: 'エリート・ストラテジー (青/ゴールド)' };
      case 'PHYSICAL_MONSTER': 
        return { name: 'フィジカルモンスター', cardBorder: 'border-red-600', accent: 'text-slate-950', bg: 'bg-red-700', tag: '🟥 パワー・ストラテジー', tagText: 'text-slate-950', desc: 'パワー・ストラテジー (赤/黒)' };
      case 'TECHNICIAN': 
        return { name: 'テクニシャン', cardBorder: 'border-emerald-500', accent: 'text-white', bg: 'bg-emerald-600', tag: '🟩 スキル・ストラテジー', tagText: 'text-white', desc: 'スキル・ストラテジー (緑/白)' };
      case 'POTENTIAL': 
        return { name: 'ポテンシャル', cardBorder: 'border-yellow-400', accent: 'text-slate-950', bg: 'bg-yellow-500', tag: '🟨 グロース・ストラテジー', tagText: 'text-slate-950', desc: 'グロース・ストラテジー (黄/黒)' };
      case 'BOTTLENECK': 
        return { name: 'ボトルネック', cardBorder: 'border-orange-500', accent: 'text-white', bg: 'bg-orange-600', tag: '🟧 フォーカス・ストラテジー', tagText: 'text-white', desc: 'フォーカス・ストラテジー (オレンジ/白)' };
      default: return { name: '分析中', cardBorder: 'border-slate-400', accent: 'text-slate-600', bg: 'bg-slate-600', tag: 'Unknown', tagText: 'text-white', desc: '' };
    }
  };

  const patternStyles = getPatternTheme(type);

  const theme = {
    topBar: isMale ? 'bg-cyan-400' : 'bg-orange-500',
    primary: isMale ? 'bg-cyan-400' : 'bg-orange-500', 
    primaryText: isMale ? 'text-cyan-600' : 'text-orange-600',
    primaryBorder: isMale ? 'border-cyan-400' : 'border-orange-500',
    secondary: isMale ? 'bg-cyan-400' : 'bg-orange-500',
    secondaryText: isMale ? 'text-cyan-400' : 'text-orange-500', 
    secondaryBorder: isMale ? 'border-cyan-400' : 'border-orange-500',
    accentText: isMale ? 'text-cyan-400' : 'text-orange-400',
    radarPhys: isMale ? '#22d3ee' : '#f97316', 
    radarTech: isMale ? '#22d3ee' : '#f97316', 
    glow: isMale ? 'bg-cyan-400/5' : 'bg-orange-500/5',
    pageBg: 'bg-[#f5f5f5]',
  };

  const handleDownloadPdf = async () => {
    const refs = [page1Ref, page2Ref, page3Ref, page4Ref, page5Ref, page6Ref];
    if (refs.some(r => !r.current)) return;
    setIsGeneratingPdf(true);
    try {
      const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
      const pageWidth = pdf.internal.pageSize.getWidth(); 
      const captureOptions = { scale: 2.2, useCORS: true, logging: false, windowWidth: 1000 };
      
      for (let i = 0; i < refs.length; i++) {
        if (i > 0) pdf.addPage();
        const canvas = await html2canvas(refs[i].current!, { ...captureOptions, backgroundColor: '#f5f5f5' });
        const imgData = canvas.toDataURL('image/jpeg', 0.85);
        pdf.addImage(imgData, 'JPEG', 0, 0, pageWidth, (canvas.height * pageWidth) / canvas.width, undefined, 'FAST');
      }
      pdf.save(`S-CORE_REPORT_${info.name}.pdf`);
      setIsGeneratingPdf(false);
    } catch (e) {
      console.error(e);
      alert("PDF作成に失敗しました。");
      setIsGeneratingPdf(false);
    }
  };

  const physicalData = [
    { subject: '瞬発', A: analysis.scores.run10m },
    { subject: '加速', A: analysis.scores.run30m },
    { subject: '敏捷', A: analysis.scores.agility },
    { subject: '跳躍', A: analysis.scores.verticalJump },
    { subject: '推進', A: analysis.scores.tripleJump },
    { subject: '体幹', A: analysis.scores.sitUps },
    { subject: 'リズム', A: analysis.scores.coordination },
    { subject: '持久', A: analysis.scores.endurance },
  ];

  const technicalData = [
    { subject: 'ドリブル', A: analysis.scores.dribble },
    { subject: 'リフティング', A: analysis.scores.lifting },
    { subject: 'Sパス', A: analysis.scores.shortPass },
    { subject: 'Lパス', A: analysis.scores.longPass },
    { subject: 'シュート', A: analysis.scores.shoot },
  ];

  const avgPhys = ((Object.values(analysis.scores) as number[]).slice(0, 8).reduce((a, b) => a + b, 0) / 8).toFixed(1);
  const avgTech = ((analysis.scores.dribble + analysis.scores.lifting + analysis.scores.shortPass + analysis.scores.longPass + analysis.scores.shoot) / 5).toFixed(1);

  const getQuoteParts = (fullQuote: string) => {
    const parts = fullQuote.split(' - ');
    const text = parts[0]?.replace(/^『|』$/g, '') || "努力は嘘をつかない。";
    const author = parts[1] || "Legend Player";
    return { text, author };
  };

  const { text: legendText, author: legendAuthor } = getQuoteParts(analysis.inspirationalQuote || "");

  const physicalDetailList = [
    { icon: 'fa-stopwatch', label: '10m走', val: `${analysis.measurements?.physical.run10m.toFixed(2)}秒`, score: analysis.scores.run10m, feedback: analysis.physicalFeedbacks.run10m, color: theme.primary },
    { icon: 'fa-bolt', label: '30m走', val: `${Math.min(analysis.measurements?.physical.run30m_1 || 0, analysis.measurements?.physical.run30m_2 || 0).toFixed(2)}秒`, score: analysis.scores.run30m, feedback: analysis.physicalFeedbacks.run30m, color: theme.primary },
    { icon: 'fa-arrows-left-right', label: '敏捷性(右)', val: `${analysis.measurements?.physical.agilityR.toFixed(2)}秒`, score: analysis.scores.agilityR, feedback: analysis.physicalFeedbacks.agilityR, color: theme.primary },
    { icon: 'fa-arrows-left-right', label: '敏捷性(左)', val: `${analysis.measurements?.physical.agilityL.toFixed(2)}秒`, score: analysis.scores.agilityL, feedback: analysis.physicalFeedbacks.agilityL, color: theme.primary },
    { icon: 'fa-arrow-up-long', label: '垂直跳び', val: `${Math.max(analysis.measurements?.physical.verticalJump_1 || 0, analysis.measurements?.physical.verticalJump_2 || 0, analysis.measurements?.physical.verticalJump_3 || 0).toFixed(1)}cm`, score: analysis.scores.verticalJump, feedback: analysis.physicalFeedbacks.verticalJump, color: theme.primary },
    { icon: 'fa-ruler-horizontal', label: '立ち三段跳び', val: `${analysis.measurements?.physical.tripleJump.toFixed(2)}m`, score: analysis.scores.tripleJump, feedback: analysis.physicalFeedbacks.tripleJump, color: theme.primary },
    { icon: 'fa-child-reaching', label: '上体起こし', val: `${analysis.measurements?.physical.sitUps}回`, score: analysis.scores.sitUps, feedback: analysis.physicalFeedbacks.sitUps, color: theme.primary },
    { icon: 'fa-brain', label: '調整能力', val: `${analysis.measurements?.physical.coordination.toFixed(2)}秒`, score: analysis.scores.coordination, feedback: analysis.physicalFeedbacks.coordination, color: theme.primary },
    { icon: 'fa-heart-pulse', label: 'Yo-Yo持久力', val: `${analysis.measurements?.physical.yoYoDistance}m`, score: analysis.scores.endurance, feedback: analysis.physicalFeedbacks.endurance, color: theme.primary },
  ];

  const technicalDetailList = [
    { icon: 'fa-gauge-high', label: 'ドリブル', val: `${analysis.measurements?.technical.dribble.toFixed(2)}秒`, score: analysis.scores.dribble, feedback: analysis.technicalFeedbacks.dribble, color: theme.secondary },
    { icon: 'fa-repeat', label: 'リフティング', val: `${analysis.measurements?.technical.lifting}回`, score: analysis.scores.lifting, feedback: analysis.technicalFeedbacks.lifting, color: theme.secondary },
    { icon: 'fa-crosshairs', label: 'ショートパス(右)', val: `${analysis.measurements?.technical.shortPassR}点`, score: analysis.scores.shortPassR, feedback: analysis.technicalFeedbacks.shortPassR, color: theme.secondary },
    { icon: 'fa-crosshairs', label: 'ショートパス(左)', val: `${analysis.measurements?.technical.shortPassL}点`, score: analysis.scores.shortPassL, feedback: analysis.technicalFeedbacks.shortPassL, color: theme.secondary },
    { icon: 'fa-compass', label: 'ロングパス(右)', val: `${analysis.measurements?.technical.longPassR}点`, score: analysis.scores.longPassR, feedback: analysis.technicalFeedbacks.longPassR, color: theme.secondary },
    { icon: 'fa-compass', label: 'ロングパス(左)', val: `${analysis.measurements?.technical.longPassL}点`, score: analysis.scores.longPassL, feedback: analysis.technicalFeedbacks.longPassL, color: theme.secondary },
    { icon: 'fa-bullseye', label: 'シュート(右)', val: `${analysis.measurements?.technical.shootR}点`, score: analysis.scores.shootR, feedback: analysis.technicalFeedbacks.shootR, color: theme.secondary },
    { icon: 'fa-bullseye', label: 'シュート(左)', val: `${analysis.measurements?.technical.shootL}点`, score: analysis.scores.shootL, feedback: analysis.technicalFeedbacks.shootL, color: theme.secondary },
  ];

  const LegendItem = ({ label, color, strategy, desc, isActive }: any) => (
    <div className={`flex flex-col p-2 rounded-xl transition-all border ${isActive ? 'bg-white border-slate-300 shadow-md scale-105 z-10' : 'bg-transparent border-transparent opacity-60'}`}>
       <div className="flex items-center gap-2 mb-1">
         <div className={`w-3 h-3 rounded-full ${color}`}></div>
         <span className="text-[10px] font-black font-noto">{label}</span>
       </div>
       <div className="text-[9px] font-black text-slate-500 uppercase tracking-tighter leading-none">{strategy}</div>
       {isActive && <div className="text-[8px] mt-1 font-bold text-slate-400 font-noto leading-tight">{desc}</div>}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 md:py-6 font-noto text-slate-900" ref={containerRef}>
      {/* Control Bar */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 md:p-6 mb-8 no-print flex flex-col lg:flex-row justify-between items-center shadow-xl border border-slate-400/30 gap-6 font-noto">
        <div className="flex items-center gap-4 w-full lg:w-auto">
          <div className={`w-10 h-10 ${theme.secondary} rounded-lg flex items-center justify-center text-white text-xl shadow-lg shrink-0`}>
            <i className="fas fa-crown"></i>
          </div>
          <div>
            <h2 className="font-noto font-black text-lg md:text-xl text-slate-900 leading-none tracking-tighter uppercase">エリートパフォーマンスレポート</h2>
            <p className="text-[9px] md:text-[10px] text-slate-500 font-bold tracking-[0.4em] mt-1.5 uppercase font-noto">S-CORE インテリジェンスネットワーク</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <button disabled={isGeneratingPdf} onClick={handleDownloadPdf} className={`${theme.secondary} hover:opacity-80 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-black text-[13px] md:text-[14px] tracking-widest uppercase transition-all flex items-center justify-center gap-3 shadow-sm active:scale-95 font-noto w-full sm:w-auto`}>
            {isGeneratingPdf ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-file-pdf"></i>}
            {isGeneratingPdf ? "保存中..." : "PDFレポートを書き出す"}
          </button>
          <button onClick={onReset} className="bg-slate-800 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-black text-[13px] md:text-[14px] tracking-widest uppercase hover:bg-slate-700 transition-all font-noto w-full sm:w-auto">終了する</button>
        </div>
      </div>

      {/* Pages Container with Scaling for Mobile */}
      <div className="flex flex-col items-center gap-6 md:gap-10 overflow-x-hidden">
        <div style={{ transform: `scale(${scale})`, transformOrigin: 'top center', width: 'fit-content', height: 'fit-content' }}>
          <div className="flex flex-col gap-10">
            {/* PAGE 1: RADAR SUMMARY */}
            <div ref={page1Ref} className={`pdf-page ${theme.pageBg} text-slate-900 w-[210mm] h-[297mm] shadow-2xl flex flex-col relative overflow-hidden box-border font-noto border border-slate-400/50`}>
              <SoccerSilhouette url="https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=1200&auto=format&fit=crop" className="top-10 right-5 w-[450px] h-[450px]" />
              <div className={`h-2 ${theme.topBar} w-full shrink-0`}></div>
              <div className="px-12 py-10 flex-1 relative z-10 flex flex-col box-border">
                <header className="relative mb-6 border-b-4 border-slate-900/10 pb-4 flex flex-col gap-4">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h1 className="text-[44px] font-montserrat font-black tracking-tighter uppercase leading-[1.0] mb-2 text-slate-900">S-CORE<br /><span className={theme.secondaryText}>ANALYTICS</span></h1>
                      <p className="text-[10px] font-black tracking-[0.4em] text-slate-500 uppercase font-montserrat">ELITE LEVEL DOSSIER / 2024 EDITION</p>
                    </div>
                    <div className="text-right flex-1 min-w-0 flex flex-col items-end">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 font-montserrat whitespace-nowrap">Player Name / 氏名</p>
                      <div className="flex items-center justify-end gap-3 w-full">
                        <div className={`px-4 py-2 rounded-xl border-2 ${theme.primaryBorder} ${theme.primaryText} font-black text-lg tracking-tighter leading-none font-montserrat shrink-0 shadow-sm`}>
                          {info.ageGroup}
                        </div>
                        <div className="text-right">
                           <h2 className="text-[36px] font-black text-slate-900 tracking-tighter leading-tight font-noto break-words overflow-hidden" style={{maxWidth: '350px'}}>
                            {info.name}
                           </h2>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-end pb-2 border-t border-slate-900/5 pt-2">
                    <div className="flex items-center gap-4 text-[13px] font-black text-slate-500 uppercase tracking-widest font-montserrat">
                      <span>{info.clubName}</span><span className="text-slate-400 text-2xl">|</span>
                      <span>ID: <span className="text-slate-900 font-bold">{info.id}</span></span>
                    </div>
                    <div className="bg-slate-100 rounded-xl px-4 py-2 text-[13px] font-black text-slate-500 tracking-[0.2em] uppercase font-montserrat whitespace-nowrap">DATE: <span className="text-slate-900 font-bold">{info.date}</span></div>
                  </div>
                </header>
                
                <div className="flex flex-col gap-4 flex-1 min-h-0">
                  <div className="bg-slate-900 p-4 rounded-[2rem] text-white relative overflow-hidden flex items-center shrink-0 shadow-lg">
                    <div className={`absolute right-0 top-0 w-32 h-32 ${theme.glow} rounded-full blur-[40px]`}></div>
                    <div className={`w-2 h-12 ${theme.secondary} rounded-full mr-6 shrink-0`}></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h5 className={`text-[9.5px] font-black ${theme.secondaryText} uppercase tracking-[0.4em] font-noto`}>AI プレースタイル定義</h5>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${patternStyles.tagText} ${patternStyles.bg} shadow-sm border border-black/10`}>
                          {patternStyles.tag}
                        </span>
                      </div>
                      <p className="text-[26px] font-black italic tracking-tight leading-tight font-noto">"{analysis.playStyle}"</p>
                    </div>
                  </div>

                  {/* Legend Grid */}
                  <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-4 border border-slate-200 grid grid-cols-5 gap-2 mb-2 relative overflow-hidden">
                    <LegendItem label="スーパーエース" strategy="エリート・ストラテジー" color="bg-blue-600" desc="🟦 エリート・ストラテジー (青/ゴールド)" isActive={type === 'SUPER_ACE'} />
                    <LegendItem label="フィジカルモンスター" strategy="パワー・ストラテジー" color="bg-red-700" desc="🟥 パワー・ストラテジー (赤/黒)" isActive={type === 'PHYSICAL_MONSTER'} />
                    <LegendItem label="テクニシャン" strategy="スキル・ストラテジー" color="bg-emerald-600" desc="🟩 スキル・ストラテジー (緑/白)" isActive={type === 'TECHNICIAN'} />
                    <LegendItem label="ポテンシャル" strategy="グロース・ストラテジー" color="bg-yellow-500" desc="🟨 グロース・ストラテジー (黄/黒)" isActive={type === 'POTENTIAL'} />
                    <LegendItem label="ボトルネック" strategy="フォーカス・ストラテジー" color="bg-orange-600" desc="🟧 フォーカス・ストラテジー (オレンジ/白)" isActive={type === 'BOTTLENECK'} />
                  </div>
                  
                  <div className="flex flex-col gap-4 flex-1 min-h-0">
                    <div className="bg-white/80 rounded-[2.5rem] p-5 flex flex-col items-center border border-slate-300 flex-1 min-h-0 relative box-border overflow-hidden shadow-lg">
                      <h4 className="text-[15px] font-black text-slate-900 uppercase tracking-[0.3em] leading-none mb-2 z-10 font-noto">フィジカル特性分析</h4>
                      <div className="w-full flex-1 relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={physicalData} margin={{ top: 10, right: 35, bottom: 10, left: 35 }}>
                            <PolarGrid stroke="rgba(0,0,0,0.1)" />
                            <PolarAngleAxis dataKey="subject" tick={{fontSize: 13, fontWeight: 900, fill: '#334155'}} />
                            <Radar dataKey="A" stroke={theme.radarPhys} strokeWidth={3} fill={theme.radarPhys} fillOpacity={0.15} />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="mt-1.5 pt-1.5 border-t border-slate-200 w-full text-center shrink-0 z-10">
                        <span className={`text-[13px] font-black ${theme.primaryText} uppercase tracking-[0.2em] font-noto`}>平均スコア: {avgPhys}</span>
                      </div>
                    </div>
                    
                    <div className="bg-white/80 rounded-[2.5rem] p-5 flex flex-col items-center border border-slate-300 flex-1 min-h-0 relative box-border overflow-hidden shadow-lg">
                      <h4 className="text-[15px] font-black text-slate-900 uppercase tracking-[0.3em] leading-none mb-2 z-10 font-noto">テクニカル特性分析</h4>
                      <div className="w-full flex-1 relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={technicalData} margin={{ top: 10, right: 35, bottom: 10, left: 35 }}>
                            <PolarGrid stroke="rgba(0,0,0,0.1)" />
                            <PolarAngleAxis dataKey="subject" tick={{fontSize: 13, fontWeight: 900, fill: '#334155'}} />
                            <Radar dataKey="A" stroke={theme.radarTech} strokeWidth={3} fill={theme.radarTech} fillOpacity={0.15} />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="mt-1.5 pt-1.5 border-t border-slate-200 w-full text-center shrink-0 z-10">
                        <span className={`text-[13px] font-black ${theme.secondaryText} uppercase tracking-[0.2em] font-noto`}>平均スコア: {avgTech}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <footer className="mt-auto h-8 flex items-center px-6 justify-between border-t border-slate-900/10 text-[8.5px] font-black text-slate-600 uppercase tracking-[0.5em] font-noto">
                  S-CORE パフォーマンス分析 / ページ 01
                </footer>
              </div>
            </div>

            {/* PAGE 2: PHYSICAL REPOSITORY */}
            <div ref={page2Ref} className={`pdf-page ${theme.pageBg} text-slate-900 w-[210mm] h-[297mm] shadow-2xl flex flex-col relative overflow-hidden box-border font-noto border border-slate-400/50`}>
              <SoccerSilhouette url="https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=1200&auto=format&fit=crop" className="bottom-20 right-0 w-[85%] h-[35%]" />
              <div className={`h-2 ${theme.topBar} w-full shrink-0`}></div>
              <div className="px-10 py-6 flex-1 relative z-10 flex flex-col box-border">
                <div className="flex-1">
                  <CustomSectionHeader icon="fa-stopwatch" title="フィジカル詳細計測データ" subtitle="身体能力データリポジトリ" color={theme.primary} />
                  <div className="grid grid-cols-3 gap-3 relative z-10">
                    {physicalDetailList.map((item, idx) => (
                      <MetricBox key={idx} {...item} colorClass={item.color} textColorClass={theme.primaryText} />
                    ))}
                  </div>
                </div>
                <SummaryBox title="フィジカルAI総合考察" content={analysis.physicalSummary} color={theme.primary} icon="fa-bolt" accentColor={theme.accentText} silhouetteUrl="https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=800&auto=format&fit=crop" />
                <footer className="mt-4 h-8 flex items-center px-6 justify-between border-t border-slate-900/10 text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] font-noto">
                  S-CORE バイオメトリックデータ / ページ 02
                </footer>
              </div>
            </div>

            {/* PAGE 3: TECHNICAL REPOSITORY */}
            <div ref={page3Ref} className={`pdf-page ${theme.pageBg} text-slate-900 w-[210mm] h-[297mm] shadow-2xl flex flex-col relative overflow-hidden box-border font-noto border border-slate-400/50`}>
              <SoccerSilhouette url="https://images.unsplash.com/photo-1511886929837-354d827aae26?q=80&w=800&auto=format&fit=crop" className="top-1/3 left-0 w-full h-[45%]" />
              <div className={`h-2 ${theme.topBar} w-full shrink-0`}></div>
              <div className="px-10 py-6 flex-1 relative z-10 flex flex-col box-border">
                <div className="flex-1">
                  <CustomSectionHeader icon="fa-futbol" title="テクニカル詳細計測データ" subtitle="スキル習熟度データリポジトリ" color={theme.secondary} />
                  <div className="grid grid-cols-3 gap-3 relative z-10">
                    {technicalDetailList.map((item, idx) => (
                      <MetricBox key={idx} {...item} colorClass={item.color} textColorClass={theme.secondaryText} />
                    ))}
                    <div className="flex items-center justify-center opacity-10 grayscale text-slate-900 text-[60px]">
                       <i className="fas fa-futbol animate-spin-slow"></i>
                    </div>
                  </div>
                </div>
                <SummaryBox title="テクニカルAI総合考察" content={analysis.technicalSummary} color={theme.secondary} icon="fa-brain" accentColor={theme.accentText} silhouetteUrl="https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop" />
                <footer className="mt-4 h-8 flex items-center px-6 justify-between border-t border-slate-900/10 text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] font-noto">
                  S-CORE テクニカルデータ / ページ 03
                </footer>
              </div>
            </div>

            {/* PAGE 4: ADVISORY I */}
            <div ref={page4Ref} className={`pdf-page ${theme.pageBg} text-slate-900 w-[210mm] h-[297mm] shadow-2xl flex flex-col relative overflow-hidden box-border font-noto border border-slate-400/50`}>
              <div className={`h-2 ${theme.topBar} w-full shrink-0`}></div>
              <div className="px-14 py-8 flex-1 relative z-10 flex flex-col box-border">
                <header className="mb-6 border-l-[12px] border-slate-900 pl-8 py-2 shrink-0 flex justify-between items-end">
                  <div>
                    <h2 className="text-[38px] font-noto font-black tracking-tighter uppercase leading-none mb-1 text-slate-900">戦略アドバイザリー I</h2>
                    <p className="text-[12px] font-black text-slate-500 uppercase tracking-[0.3em]">Phase 01: 短期集中強化プラン</p>
                  </div>
                  <div className={`px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest ${patternStyles.tagText} ${patternStyles.bg} shadow-lg mb-1 border border-black/10`}>
                    {patternStyles.tag}
                  </div>
                </header>
                <div className="flex-1 flex flex-col gap-6">
                  <div className="flex items-center gap-4 border-b-2 border-slate-300 pb-2 text-slate-600"><i className={`fas fa-compass text-xl ${theme.accentText}`}></i><h3 className="text-[18px] font-black tracking-tight uppercase font-noto">強化ポイントと目標設定 <span className="text-[11px] opacity-60 ml-2">フェーズ 01</span></h3></div>
                  <div className="grid grid-cols-1 gap-6">{analysis.aiAdvice.slice(0, 2).map((item, idx) => (
                    <div key={idx} className={`bg-white/90 border-2 ${patternStyles.cardBorder} rounded-[2rem] p-6 shadow-xl relative overflow-hidden`}>
                       <div className="flex items-center gap-5 mb-3 border-b border-slate-100 pb-2 relative z-10">
                         <span className={`w-9 h-9 ${patternStyles.bg} ${patternStyles.tagText} rounded-xl flex items-center justify-center font-black text-lg font-noto`}>{idx+1}</span>
                         <h4 className={`text-[24px] font-black text-slate-900 font-noto`}>{item.title}</h4>
                       </div>
                       <div className="space-y-3 relative z-10">
                         <div><p className={`text-[10px] font-black ${theme.primaryText} uppercase tracking-widest mb-0.5 font-noto`}>現状分析</p><p className="text-[15px] text-slate-700 font-bold leading-relaxed font-noto">{item.improvement}</p></div>
                         <div><p className={`text-[10px] font-black ${theme.primaryText} uppercase tracking-widest mb-0.5 font-noto`}>アクションプラン</p><p className="text-[15px] text-slate-900 font-black leading-relaxed font-noto">{item.keyPoint}</p></div>
                         <div className={`bg-slate-900 text-white p-4 rounded-2xl flex justify-between items-center mt-3 border-l-[8px] ${patternStyles.cardBorder.replace('border-', 'border-')} shadow-xl`}>
                           <span className="text-[10px] font-black opacity-50 uppercase tracking-widest font-noto">目標数値</span>
                           <p className={`text-[24px] font-black tracking-tighter font-montserrat ${patternStyles.accent}`}>{item.goal}</p>
                         </div>
                       </div>
                    </div>
                  ))}</div>
                </div>
                <footer className="mt-6 h-10 flex items-center px-8 justify-between border-t border-slate-900/10 text-[10px] font-black text-slate-600 uppercase tracking-[0.5em] font-noto">
                  S-CORE 戦略ドキュメント / ページ 04
                </footer>
              </div>
            </div>

            {/* PAGE 5: ADVISORY II */}
            <div ref={page5Ref} className={`pdf-page ${theme.pageBg} text-slate-900 w-[210mm] h-[297mm] shadow-2xl flex flex-col relative overflow-hidden box-border font-noto border border-slate-400/50`}>
              <div className={`h-2 ${theme.topBar} w-full shrink-0`}></div>
              <div className="px-14 py-8 flex-1 relative z-10 flex flex-col box-border">
                <header className="mb-6 border-l-[12px] border-slate-900 pl-8 py-2 shrink-0 flex justify-between items-end">
                  <div>
                    <h2 className="text-[38px] font-noto font-black tracking-tighter uppercase leading-none mb-1 text-slate-900">戦略アドバイザリー II</h2>
                    <p className="text-[12px] font-black text-slate-500 uppercase tracking-[0.3em]">Phase 02: 中長期的な理想像</p>
                  </div>
                  <div className={`px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest ${patternStyles.tagText} ${patternStyles.bg} shadow-lg mb-1 border border-black/10`}>
                    {patternStyles.tag}
                  </div>
                </header>
                <div className="flex-1 flex flex-col gap-6">
                  <div className="flex items-center gap-4 border-b-2 border-slate-300 pb-2 text-slate-600"><i className={`fas fa-compass text-xl ${theme.accentText}`}></i><h3 className="text-[18px] font-black tracking-tight uppercase font-noto">強化ポイントと目標設定 <span className="text-[11px] opacity-60 ml-2">フェーズ 02</span></h3></div>
                  <div className="grid grid-cols-1 gap-6">{analysis.aiAdvice.slice(2, 4).map((item, idx) => (
                    <div key={idx} className={`bg-white/90 border-2 ${patternStyles.cardBorder} rounded-[2rem] p-6 shadow-xl relative overflow-hidden`}>
                       <div className="flex items-center gap-5 mb-3 border-b border-slate-100 pb-2 relative z-10">
                         <span className={`w-9 h-9 ${patternStyles.bg} ${patternStyles.tagText} rounded-xl flex items-center justify-center font-black text-lg font-noto`}>{idx+3}</span>
                         <h4 className={`text-[24px] font-black text-slate-900 font-noto`}>{item.title}</h4>
                       </div>
                       <div className="space-y-3 relative z-10">
                         <div><p className={`text-[10px] font-black ${theme.primaryText} uppercase tracking-widest mb-0.5 font-noto`}>現状分析</p><p className="text-[15px] text-slate-700 font-bold leading-relaxed font-noto">{item.improvement}</p></div>
                         <div><p className={`text-[10px] font-black ${theme.primaryText} uppercase tracking-widest mb-0.5 font-noto`}>アクションプラン</p><p className="text-[15px] text-slate-900 font-black leading-relaxed font-noto">{item.keyPoint}</p></div>
                         <div className={`bg-slate-900 text-white p-4 rounded-2xl flex justify-between items-center mt-3 border-l-[8px] ${patternStyles.cardBorder.replace('border-', 'border-')} shadow-xl`}>
                           <span className="text-[10px] font-black opacity-50 uppercase tracking-widest font-noto">目標数値</span>
                           <p className={`text-[24px] font-black tracking-tighter font-montserrat ${patternStyles.accent}`}>{item.goal}</p>
                         </div>
                       </div>
                    </div>
                  ))}</div>
                </div>
                <footer className="mt-6 h-10 flex items-center px-8 justify-between border-t border-slate-900/10 text-[10px] font-black text-slate-600 uppercase tracking-[0.5em] font-noto">
                  S-CORE 戦略ドキュメント / ページ 05
                </footer>
              </div>
            </div>

            {/* PAGE 6: LEGEND MESSAGE */}
            <div ref={page6Ref} className={`pdf-page ${theme.pageBg} text-slate-900 w-[210mm] h-[297mm] shadow-2xl flex flex-col relative overflow-hidden box-border font-noto border border-slate-400/50`}>
              <div className="absolute inset-0 opacity-15 grayscale pointer-events-none">
                <img src="https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=1200&auto=format&fit=crop" className="w-full h-full object-cover" alt="" />
              </div>
              <div className={`h-2 ${theme.topBar} w-full shrink-0`}></div>
              <div className="px-16 py-12 flex-1 flex flex-col items-center justify-center relative z-10">
                <div className={`w-28 h-28 ${theme.secondary} rounded-[2rem] flex items-center justify-center text-white text-5xl mb-8 shadow-2xl rotate-2`}>
                  <i className="fas fa-crown"></i>
                </div>
                <div className="text-center max-w-2xl px-10 flex flex-col items-center">
                  <h2 className="text-[14px] font-black text-slate-600 uppercase tracking-[0.8em] mb-10 font-noto">レジェンドからのメッセージ</h2>
                  <div className="relative mb-8 text-slate-900">
                     <div className="text-slate-900/10 absolute -top-10 -left-10 text-[120px] font-serif">“</div>
                     <p className="text-[32px] font-black italic leading-[1.2] tracking-tighter text-balance drop-shadow-sm font-noto">『{legendText}』</p>
                     <div className="text-slate-900/10 absolute -bottom-10 -right-10 text-[120px] font-serif">”</div>
                  </div>
                  <div className="mb-8">
                    <p className={`text-[26px] font-black ${theme.primaryText} uppercase tracking-[0.1em] flex items-center gap-4 font-noto`}>
                      <span className="w-10 h-[3px] bg-slate-900/10 rounded-full"></span>{legendAuthor.toUpperCase()}
                    </p>
                  </div>
                  <div className={`h-2 w-28 mx-auto ${theme.secondary} rounded-full mb-10 shadow-sm`}></div>
                  <div className="bg-white/60 backdrop-blur-sm border border-slate-300 rounded-[3rem] p-8 shadow-xl w-full text-slate-800">
                    <p className="text-[17px] font-bold leading-relaxed italic text-center font-noto">
                      この数値は単なる記録ではない。君の現在地だ。<br />
                      頂点へ続く階段の、次の一歩を今日踏み出せ。
                    </p>
                  </div>
                </div>
              </div>
              <footer className="mt-auto h-16 flex items-center px-12 justify-between bg-white/20 border-t border-slate-300 text-slate-600 shrink-0">
                 <div className="flex flex-col"><p className="text-[10px] font-black tracking-[0.5em] uppercase font-noto">S-CORE インテリジェンスネットワーク</p></div>
                 <span className="text-[12px] font-black tracking-[0.2em] uppercase font-noto">最終分析レポート / ページ 06</span>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResultView;
