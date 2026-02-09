
import React, { useState } from 'react';
import { AthleteInfo, AgeGroup, Gender } from '../types';
import { generateId } from '../utils';

interface InputForm1Props {
  onSubmit: (info: AthleteInfo) => void;
  onBack: () => void;
  onSkip?: () => void;
}

const InputForm1: React.FC<InputForm1Props> = ({ onSubmit, onBack, onSkip }) => {
  const [formData, setFormData] = useState({
    id: generateId(10),
    name: '',
    clubName: '',
    clubId: 'C' + Math.floor(Math.random() * 90000 + 10000),
    ageGroup: 'U18' as AgeGroup,
    gender: 'Male' as Gender,
    email: '',
    date: new Date().toISOString().split('T')[0]
  });

  const fillTestData = () => {
    const names = ['田中 健太', '佐藤 美咲', '鈴木 翼', '伊藤 結衣', '渡辺 翔太'];
    const clubs = ['S-CORE Youth Academy', 'Tokyo Liberty FC', 'Rise Sports Club'];
    const ageGroups: AgeGroup[] = ['U10', 'U12', 'U15', 'U18'];
    const genders: Gender[] = ['Male', 'Female'];
    
    setFormData({
      ...formData,
      name: names[Math.floor(Math.random() * names.length)],
      clubName: clubs[Math.floor(Math.random() * clubs.length)],
      ageGroup: ageGroups[Math.floor(Math.random() * ageGroups.length)],
      gender: genders[Math.floor(Math.random() * genders.length)],
      email: `player_${Math.floor(Math.random() * 1000)}@s-core.ai`
    });
  };

  const LabelWithBar = ({ labelJp, cyan = true }: { labelJp: string, cyan?: boolean }) => (
    <div className="flex flex-col mb-3 md:mb-4">
      <div className={`text-[14px] md:text-[15px] font-black uppercase tracking-tight mb-1 md:mb-1.5 leading-tight ${cyan ? 'text-cyan-400' : 'text-slate-600'}`}>
        <span className="block text-[15px] md:text-[16px] font-noto">{labelJp}</span>
      </div>
      <div className={`h-0.5 w-4 rounded-full ${cyan ? 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]' : 'bg-slate-800'}`}></div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
      {/* Progress & Navigation */}
      <div className="mb-8 md:mb-12 flex items-center justify-between font-noto">
        <button onClick={onBack} className="flex items-center gap-2 md:gap-3 text-slate-600 hover:text-white font-black text-[9px] md:text-[10px] uppercase tracking-widest transition-all">
          <i className="fas fa-arrow-left text-[10px] md:text-xs"></i> 戻る
        </button>
        <div className="flex gap-2 md:gap-3">
          <div className="h-1 md:h-1.5 w-8 md:w-12 rounded-full bg-cyan-400"></div>
          <div className="h-1 md:h-1.5 w-8 md:w-12 rounded-full bg-slate-900"></div>
        </div>
      </div>

      <div className="glass-card rounded-2xl md:rounded-[2.5rem] p-6 md:p-14 relative overflow-hidden border border-white/5 font-noto">
        {/* Title Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start mb-10 md:mb-14 gap-6">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-noto font-black mb-2 md:mb-3 tracking-tighter text-white">選手プロフィール</h2>
            <p className="text-slate-500 font-bold text-[10px] md:text-[11px] uppercase tracking-[0.4em]">基本情報入力</p>
          </div>
          <button 
            type="button"
            onClick={fillTestData}
            className="w-full sm:w-auto group flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-cyan-400 px-5 py-3 rounded-xl border border-cyan-400/20 transition-all text-[10px] font-black tracking-widest uppercase"
          >
            <i className="fas fa-wand-magic-sparkles"></i> AI 自動入力
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-8 md:space-y-12">
          
          {/* Row 1: 実施日 & クラブ名 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 md:gap-y-10">
            <div>
              <label className="flex flex-col">
                <LabelWithBar labelJp="実施日" />
                <input
                  required
                  type="date"
                  className="form-input rounded-xl md:rounded-2xl px-5 md:px-6 py-3 md:py-4 w-full outline-none text-lg md:text-xl font-medium"
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                />
              </label>
            </div>
            <div>
              <label className="flex flex-col">
                <LabelWithBar labelJp="クラブ名" />
                <input
                  required
                  placeholder="Rise Sports Club"
                  className="form-input rounded-xl md:rounded-2xl px-5 md:px-6 py-3 md:py-4 w-full outline-none text-lg md:text-xl font-bold"
                  value={formData.clubName}
                  onChange={e => setFormData({ ...formData, clubName: e.target.value })}
                />
              </label>
            </div>
          </div>

          {/* Row 2: クラブID & 氏名 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 md:gap-y-10">
            <div>
              <label className="flex flex-col">
                <LabelWithBar labelJp="クラブID" cyan={false} />
                <input
                  readOnly
                  className="form-input bg-slate-900/50 border-dashed border-white/5 text-slate-600 rounded-xl md:rounded-2xl px-5 md:px-6 py-3 md:py-4 w-full cursor-not-allowed text-lg md:text-xl"
                  value={formData.clubId}
                />
              </label>
            </div>
            <div>
              <label className="flex flex-col">
                <LabelWithBar labelJp="氏名" />
                <input
                  required
                  placeholder="例：渡辺 翔太"
                  className="form-input rounded-xl md:rounded-2xl px-5 md:px-6 py-3 md:py-4 w-full outline-none text-lg md:text-xl font-bold"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </label>
            </div>
          </div>

          {/* Row 3: 選手ID & カテゴリー */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 md:gap-y-10">
            <div>
              <label className="flex flex-col">
                <LabelWithBar labelJp="選手ID" cyan={false} />
                <input
                  readOnly
                  className="form-input bg-slate-900/50 border-dashed border-white/5 text-cyan-400 font-mono rounded-xl md:rounded-2xl px-5 md:px-6 py-3 md:py-4 w-full cursor-not-allowed text-lg md:text-xl"
                  value={formData.id}
                />
              </label>
            </div>
            <div>
              <label className="flex flex-col">
                <LabelWithBar labelJp="カテゴリー" />
                <select
                  className="form-input rounded-xl md:rounded-2xl px-4 md:px-4 py-3 md:py-4 w-full outline-none appearance-none cursor-pointer text-lg md:text-xl font-bold"
                  value={formData.ageGroup}
                  onChange={e => setFormData({ ...formData, ageGroup: e.target.value as AgeGroup })}
                >
                  <option value="U10">U10</option>
                  <option value="U12">U12</option>
                  <option value="U15">U15</option>
                  <option value="U18">U18</option>
                </select>
              </label>
            </div>
          </div>

          {/* Row 4: 性別 & メールアドレス */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 md:gap-y-10">
            <div>
              <label className="flex flex-col">
                <LabelWithBar labelJp="性別" />
                <select
                  className="form-input rounded-xl md:rounded-2xl px-4 md:px-4 py-3 md:py-4 w-full outline-none appearance-none cursor-pointer text-lg md:text-xl font-bold"
                  value={formData.gender}
                  onChange={e => setFormData({ ...formData, gender: e.target.value as Gender })}
                >
                  <option value="Male">男子</option>
                  <option value="Female">女子</option>
                </select>
              </label>
            </div>
            <div>
              <label className="flex flex-col">
                <LabelWithBar labelJp="メールアドレス (任意)" />
                <input
                  type="email"
                  placeholder="player_268@s-core.ai"
                  className="form-input rounded-xl md:rounded-2xl px-5 md:px-6 py-3 md:py-4 w-full outline-none text-lg md:text-xl"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              className="btn-primary flex-1 py-4 md:py-6 text-white font-black text-lg md:text-xl rounded-xl md:rounded-2xl transition-all tracking-widest uppercase flex items-center justify-center gap-4 group font-noto"
            >
              次へ：計測データ入力
              <i className="fas fa-arrow-right text-xs md:text-sm transition-transform group-hover:translate-x-1"></i>
            </button>
            
            {onSkip && (
              <button
                type="button"
                onClick={onSkip}
                className="bg-slate-800 hover:bg-slate-700 text-slate-400 font-bold py-4 md:py-6 px-8 md:px-10 rounded-xl md:rounded-2xl text-base md:text-lg transition-all tracking-tight flex items-center justify-center gap-3"
              >
                スキップして計測へ
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default InputForm1;
