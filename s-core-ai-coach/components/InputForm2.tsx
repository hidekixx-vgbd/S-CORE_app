
import React, { useState } from 'react';
import { PhysicalMeasurements, TechnicalMeasurements } from '../types';

interface InputForm2Props {
  onSubmit: (p: PhysicalMeasurements, t: TechnicalMeasurements) => void;
  onBack: () => void;
  isLoading: boolean;
}

const InputForm2: React.FC<InputForm2Props> = ({ onSubmit, onBack, isLoading }) => {
  const [phys, setPhys] = useState<PhysicalMeasurements>({
    run10m: 0, run30m_1: 0, run30m_2: 0, agilityL: 0, agilityR: 0,
    verticalJump_1: 0, verticalJump_2: 0, verticalJump_3: 0,
    tripleJump: 0, sitUps: 0, coordination: 0, yoYoDistance: 0,
  });

  const [tech, setTech] = useState<TechnicalMeasurements>({
    dribble: 0, lifting: 0, shortPassR: 0, shortPassL: 0,
    longPassR: 0, longPassL: 0, shootL: 0, shootR: 0,
  });

  const fillTestData = () => {
    const rand = (min: number, max: number, d = 2) => parseFloat((Math.random() * (max - min) + min).toFixed(d));
    setPhys({
      run10m: rand(1.7, 2.3), run30m_1: rand(4.3, 5.2), run30m_2: rand(4.2, 5.3),
      agilityL: rand(4.8, 6.2), agilityR: rand(4.8, 6.2),
      verticalJump_1: rand(40, 60, 1), verticalJump_2: rand(40, 60, 1), verticalJump_3: rand(40, 60, 1),
      tripleJump: rand(5, 7), sitUps: Math.floor(rand(25, 45, 0)), coordination: rand(7, 10), yoYoDistance: Math.floor(rand(800, 2000, 0)),
    });
    setTech({
      dribble: rand(9, 12), lifting: Math.floor(rand(50, 300, 0)),
      shortPassR: Math.floor(rand(3, 5, 0)), shortPassL: Math.floor(rand(3, 5, 0)),
      longPassR: Math.floor(rand(3, 5, 0)), longPassL: Math.floor(rand(3, 5, 0)),
      shootL: Math.floor(rand(3, 6, 0)), shootR: Math.floor(rand(3, 6, 0)),
    });
  };

  const InputField = ({ label, value, onChange, step = "0.01", icon = "fa-hashtag" }: any) => (
    <div className="relative group">
      <div className="flex justify-between mb-2 items-end">
        <span className="text-[14px] md:text-[16px] font-black text-cyan-400 uppercase tracking-widest font-noto whitespace-nowrap">{label}</span>
      </div>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-cyan-400 transition-colors">
          <i className={`fas ${icon} text-sm`}></i>
        </div>
        <input
          required
          type="number"
          step={step}
          className="w-full bg-slate-900/40 border border-white/5 rounded-xl py-3 md:py-3.5 pl-11 pr-4 text-white font-mono text-lg md:text-xl focus:ring-2 focus:ring-cyan-400/20 focus:border-cyan-400 outline-none transition-all shadow-sm"
          value={value}
          onChange={e => onChange(parseFloat(e.target.value) || 0)}
        />
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 font-noto">
      <div className="mb-8 md:mb-12 flex items-center justify-between">
        <button onClick={onBack} className="text-slate-600 hover:text-white font-black text-[9px] md:text-[10px] uppercase tracking-widest flex items-center gap-2 md:gap-3 group">
          <i className="fas fa-arrow-left text-[10px] md:text-xs transition-transform group-hover:-translate-x-1"></i> 戻る
        </button>
        <div className="flex gap-2 md:gap-3">
          <div className="h-1 md:h-1.5 w-8 md:w-12 rounded-full bg-cyan-400"></div>
          <div className="h-1 md:h-1.5 w-8 md:w-12 rounded-full bg-cyan-400"></div>
        </div>
      </div>

      <div className="mb-8 flex flex-col sm:flex-row justify-between sm:items-end gap-6">
        <div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-noto font-black tracking-tighter uppercase text-white">計測データ入力</h2>
          <p className="text-slate-600 font-bold text-[10px] md:text-[11px] uppercase tracking-[0.4em]">測定値の登録</p>
        </div>
        <button 
          type="button"
          onClick={fillTestData}
          className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-cyan-400 px-6 py-3 rounded-xl border border-cyan-400/20 transition-all text-[10px] font-black tracking-widest uppercase flex items-center justify-center gap-2 shadow-sm"
        >
          <i className="fas fa-magic-sparkles"></i> テスト入力
        </button>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); onSubmit(phys, tech); }} className="space-y-8 md:space-y-10">
        <div className="flex flex-col gap-8 md:gap-10">
          
          {/* Physical Section */}
          <div className="glass-card rounded-2xl md:rounded-[3rem] p-6 md:p-10 shadow-sm border-t-4 border-t-emerald-500">
            <h3 className="text-2xl md:text-3xl font-black mb-8 md:mb-10 flex items-center gap-4">
              <span className="w-10 h-10 md:w-14 md:h-14 bg-emerald-500/10 rounded-xl md:rounded-2xl flex items-center justify-center text-emerald-400 shadow-sm">
                <i className="fas fa-running text-xl md:text-2xl"></i>
              </span>
              <div>
                <span className="block text-white tracking-tighter">フィジカル計測</span>
                <span className="text-[10px] md:text-[11px] text-slate-600 font-bold tracking-[0.3em] uppercase">/ 身体能力の測定</span>
              </div>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-x-6 md:gap-x-10 gap-y-6 md:gap-y-8">
              <InputField label="10m走 (秒)" icon="fa-stopwatch" value={phys.run10m} onChange={(v:any) => setPhys({...phys, run10m:v})} />
              <InputField label="30m 1本目 (秒)" icon="fa-bolt" value={phys.run30m_1} onChange={(v:any) => setPhys({...phys, run30m_1:v})} />
              <InputField label="30m 2本目 (秒)" icon="fa-bolt" value={phys.run30m_2} onChange={(v:any) => setPhys({...phys, run30m_2:v})} />
              <InputField label="敏捷性 左 (秒)" icon="fa-arrows-left-right" value={phys.agilityL} onChange={(v:any) => setPhys({...phys, agilityL:v})} />
              <InputField label="敏捷性 右 (秒)" icon="fa-arrows-left-right" value={phys.agilityR} onChange={(v:any) => setPhys({...phys, agilityR:v})} />
              <InputField label="立ち三段跳び (m)" icon="fa-ruler-horizontal" value={phys.tripleJump} onChange={(v:any) => setPhys({...phys, tripleJump:v})} />
              
              <div className="col-span-1 sm:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4 border-y border-white/5 py-6 md:py-8 my-4">
                <InputField label="垂直跳び 1 (cm)" icon="fa-arrow-up" step="0.1" value={phys.verticalJump_1} onChange={(v:any) => setPhys({...phys, verticalJump_1:v})} />
                <InputField label="垂直跳び 2 (cm)" icon="fa-arrow-up" step="0.1" value={phys.verticalJump_2} onChange={(v:any) => setPhys({...phys, verticalJump_2:v})} />
                <InputField label="垂直跳び 3 (cm)" icon="fa-arrow-up" step="0.1" value={phys.verticalJump_3} onChange={(v:any) => setPhys({...phys, verticalJump_3:v})} />
              </div>

              <InputField label="上体起こし (回)" icon="fa-child-reaching" step="1" value={phys.sitUps} onChange={(v:any) => setPhys({...phys, sitUps:v})} />
              <InputField label="コーディネーション (秒)" icon="fa-brain" value={phys.coordination} onChange={(v:any) => setPhys({...phys, coordination:v})} />
              <InputField label="Yo-Yo 距離 (m)" icon="fa-heart-pulse" step="1" value={phys.yoYoDistance} onChange={(v:any) => setPhys({...phys, yoYoDistance:v})} />
            </div>
          </div>

          {/* Technical Section */}
          <div className="glass-card rounded-2xl md:rounded-[3rem] p-6 md:p-10 shadow-sm border-t-4 border-t-blue-500">
            <h3 className="text-2xl md:text-3xl font-black mb-8 md:mb-10 flex items-center gap-4">
              <span className="w-10 h-10 md:w-14 md:h-14 bg-blue-500/10 rounded-xl md:rounded-2xl flex items-center justify-center text-blue-400 shadow-sm">
                <i className="fas fa-futbol text-xl md:text-2xl"></i>
              </span>
              <div>
                <span className="block text-white tracking-tighter">テクニカルスキル</span>
                <span className="text-[10px] md:text-[11px] text-slate-600 font-bold tracking-[0.3em] uppercase">/ 技術項目の測定</span>
              </div>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 md:gap-x-10 gap-y-6 md:gap-y-8">
              <InputField label="ドリブル (秒)" icon="fa-gauge-high" value={tech.dribble} onChange={(v:any) => setTech({...tech, dribble:v})} />
              <InputField label="リフティング (回)" icon="fa-repeat" step="1" value={tech.lifting} onChange={(v:any) => setTech({...tech, lifting:v})} />
              
              <div className="col-span-1 sm:col-span-2 mt-4 md:mt-6">
                <div className="flex items-center gap-4 md:gap-6 mb-6 md:mb-8">
                  <div className="h-[1px] flex-1 bg-white/5"></div>
                  <span className="text-[9px] md:text-[11px] font-black text-slate-600 uppercase tracking-[0.3em]">技術評価 (1-5点)</span>
                  <div className="h-[1px] flex-1 bg-white/5"></div>
                </div>
              </div>
              
              <InputField label="ショートパス 右" icon="fa-crosshairs" step="1" value={tech.shortPassR} onChange={(v:any) => setTech({...tech, shortPassR:v})} />
              <InputField label="ショートパス 左" icon="fa-crosshairs" step="1" value={tech.shortPassL} onChange={(v:any) => setTech({...tech, shortPassL:v})} />
              <InputField label="ロングパス 右" icon="fa-compass" step="1" value={tech.longPassR} onChange={(v:any) => setTech({...tech, longPassR:v})} />
              <InputField label="ロングパス 左" icon="fa-compass" step="1" value={tech.longPassL} onChange={(v:any) => setTech({...tech, longPassL:v})} />
              <InputField label="シュート 右" icon="fa-bullseye" step="1" value={tech.shootR} onChange={(v:any) => setTech({...tech, shootR:v})} />
              <InputField label="シュート 左" icon="fa-bullseye" step="1" value={tech.shootL} onChange={(v:any) => setTech({...tech, shootL:v})} />
            </div>
          </div>

        </div>

        <button
          disabled={isLoading}
          type="submit"
          className="btn-primary w-full py-5 md:py-7 text-white font-black text-xl md:text-2xl rounded-2xl md:rounded-[2.5rem] transition-all tracking-widest uppercase flex items-center justify-center gap-3 md:gap-5 mt-8 md:mt-12 group"
        >
          {isLoading ? (
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-6 h-6 md:w-8 md:h-8 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
              <span className="text-lg md:text-xl">同期中...</span>
            </div>
          ) : (
            <>
              <i className="fas fa-brain-circuit text-2xl md:text-3xl group-hover:scale-110 transition-transform"></i>
              <span>AI分析を開始する</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default InputForm2;
