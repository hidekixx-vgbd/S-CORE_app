import React, { useState, useEffect } from 'react';

// ==========================================
// 1. 型定義 (Types)
// ==========================================
type ScoreLevel = 1 | 2 | 3 | 4 | 5;
type PlayerType = "Super Ace" | "Physical Monster" | "Technician" | "Potential" | "Bottleneck Fix";

interface FeedbackContent {
  intelligence: string;
  advice: string;
}

interface StrategyPhase {
  title: string;
  analysis: string;
  action: string;
  goal: string;
}

interface StrategyPlan {
  type: PlayerType;
  description: string;
  phase1: StrategyPhase;
  phase2: StrategyPhase;
}

interface Quote {
  id: number;
  text: string;
  author: string;
}

// ==========================================
// 2. データベース (Masters)
// ==========================================

// --- A. 評価コメントマスタ ---
const FEEDBACK_MASTER: Record<string, Record<ScoreLevel, FeedbackContent>> = {
  "10m走": {
    1: { intelligence: "スタートの反応が遅れています。音を聞いてから動くのではなく、音を予測する準備が必要です。", advice: "『準備がすべてだ。』合図が鳴る前に心の中でフライングするくらいの集中力を持て。" },
    2: { intelligence: "構えの重心が高く、一歩目に体重が乗っていません。低い姿勢で地面を強く蹴りましょう。", advice: "『失敗を恐れるな。』転ぶギリギリまで前傾姿勢を保つ勇気があれば、景色は変わる。" },
    3: { intelligence: "標準的なスタートですが、腕振りが小さいため加速が鈍くなっています。", advice: "『昨日より今日。』0.1秒を削るための地道な反復練習だけが、ライバルとの差を作る。" },
    4: { intelligence: "鋭い飛び出しです。このスピードを後半の疲れた時間帯でも出せるかが課題です。", advice: "『満足は成長の敵だ。』今の速さに満足するな。いつでもこのスタートを切れるタフさを身につけろ。" },
    5: { intelligence: "圧倒的なロケットスタート！チームNo.1の武器です。相手の逆を突く駆け引きも磨きましょう。", advice: "『頂点に立ち続けることの方が難しい。』この武器を錆びさせないために、誰よりもスタート練習にこだわろう。" }
  },
  "持久走": {
    1: { intelligence: "ペース配分が不安定で後半失速しています。一定のリズムで走る感覚を養いましょう。", advice: "『継続は力なり。』走ることに王道なし。毎日のランニングだけが、君を強くしてくれる。" },
    2: { intelligence: "呼吸が乱れるのが早いです。肩の力を抜いてリラックスして走りましょう。", advice: "『苦しみを楽しめ。』息が上がる苦しさは、心肺機能が強化されている音だ。" },
    3: { intelligence: "平均的なスタミナですが、勝負所でスプリントする余裕がありません。", advice: "『自分との戦いに勝て。』足が止まりそうな時、動かすのは筋肉じゃない、意志の力だ。" },
    4: { intelligence: "試合を通して戦える体力があります。次は効果的にサボり、効果的に爆発するメリハリを覚えましょう。", advice: "『昨日の自分を超えろ。』体力があるからこそ、人より多くボールに絡める。" },
    5: { intelligence: "驚異的なスタミナ！ピッチのどこにでも顔を出せる心臓を持っています。", advice: "『奇跡は足元から生まれる。』90分間走り切る君の姿が、仲間に勇気を与え、勝利を引き寄せる。" }
  },
  // 他の項目はデフォルト処理またはここに追加
};

// --- B. 戦略アドバイザリーマスタ ---
const STRATEGY_MASTER: Record<PlayerType, StrategyPlan> = {
  "Super Ace": {
    type: "Super Ace",
    description: "【スーパーエース型】フィジカル・技術ともにトップレベル。チームを勝たせる責任と、更なる高みを目指すメンタリティが求められます。",
    phase1: { title: "ハイテンポな状況下での意思決定速度の向上", analysis: "能力は完成されています。次は「認知スピード」が課題です。", action: "ボールを受ける前の首振り頻度を1.5倍にする。", goal: "プレッシャー下でも常に最適解を選べるインテリジェンス。" },
    phase2: { title: "静止状態からの爆発的アクションの戦術的利用", analysis: "能力を「崩し」のスイッチとして使います。", action: "緩急の「緩」を意図的に作り出し、一瞬の加速で無力化する。", goal: "相手が分かっていても止められない必殺の突破パターン確立。" }
  },
  "Physical Monster": {
    type: "Physical Monster",
    description: "【フィジカルモンスター型】圧倒的な身体能力が武器。技術が追いつけば手がつけられない選手になります。",
    phase1: { title: "トップスピードからの「減速技術」の習得", analysis: "突っ込みすぎてボールを失う場面があります。", action: "全力疾走から1歩で止まるストップ動作の習得。", goal: "スピードを自在にコントロールできる支配力の獲得。" },
    phase2: { title: "身体優位性を活かしたシール技術", analysis: "接触時に相手を弾き飛ばす体の使い方が必要です。", action: "相手とボールの間に体を入れるスクリーンプレーの強化。", goal: "ミスをフィジカルで帳消しにし、強引に運べる推進力の構築。" }
  },
  "Technician": {
    type: "Technician",
    description: "【テクニシャン型】ボール扱いのセンスは抜群。フィジカル強度を高めれば、より輝ける選手です。",
    phase1: { title: "コンタクトプレー下での「技術発揮強度」の向上", analysis: "寄せられるとバランスを崩す傾向があります。", action: "相手に体を当てられた状態でのボールキープ練習。", goal: "激しいプレスを受けても重心がブレない強靭な司令塔へ。" },
    phase2: { title: "高強度のプレーを持続させるエンジンの搭載", analysis: "終盤の精度低下を防ぐ体力が必要です。", action: "心拍数が上がった状態で正確に蹴るインターバルトレーニング。", goal: "相手がバテた時間帯に最も輝けるゲームチェンジャー。" }
  },
  "Potential": {
    type: "Potential",
    description: "【ポテンシャル型】伸びしろ十分の原石。まずは「これなら勝てる」という絶対的な武器を一つ作りましょう。",
    phase1: { title: "一点突破のための「絶対的な武器」の作成", analysis: "相手に脅威を与える「怖さ」がまだ不足しています。", action: "今回の計測で最も数値が高かった項目を重点的に鍛える。", goal: "「〇〇なら誰にも負けない」という自信とアイデンティティの確保。" },
    phase2: { title: "プロアスリートとしての「基礎体力ベース」の構築", analysis: "武器を90分間繰り返せる土台が必要です。", action: "週3回の体幹トレーニングと食事管理。", goal: "上のカテゴリーでも怪我せず戦えるフィジカルの土台完成。" }
  },
  "Bottleneck Fix": {
    type: "Bottleneck Fix",
    description: "【基礎救済型】素晴らしい才能を持っていますが、一部の弱点がプレーの選択肢を狭めています。",
    phase1: { title: "パフォーマンスを制限する「弱点の穴埋め」", analysis: "評価「1」の項目が足かせになっています。", action: "評価が低い項目を毎日15分の補強練習でケアする。", goal: "弱点を平均レベルまで引き上げ、イージーミスをなくす。" },
    phase2: { title: "克服した弱点と長所の統合", analysis: "弱点が改善されれば、本来の武器がより活きてきます。", action: "苦手だったプレーを練習試合で積極的にトライする。", goal: "苦手意識を消去し、プレーの幅を倍増させる。" }
  }
};

// --- C. 評価基準マスタ ---
const SCORING_MASTER: Record<string, Record<string, Record<number, number>>> = {
  "U12_男子": {
    "10m走": { 5: 1.98, 4: 2.04, 3: 2.10, 2: 2.22 },
    "持久走": { 5: 1680, 4: 1400, 3: 1120, 2: 840 },
  },
  "U15_男子": {
    "10m走": { 5: 1.73, 4: 1.78, 3: 1.84, 2: 1.94 },
    "持久走": { 5: 2160, 4: 1800, 3: 1440, 2: 1080 },
  },
  "U18_男子": {
    "10m走": { 5: 1.65, 4: 1.70, 3: 1.75, 2: 1.85 },
    "持久走": { 5: 2400, 4: 2000, 3: 1600, 2: 1200 },
  }
};
const DEFAULT_CRITERIA = { 5: 0, 4: 0, 3: 0, 2: 0 }; 

// --- D. 名言マスタ ---
const QUOTES_MASTER: Quote[] = [
  { id: 1, text: "規律なき超一流の集団は、統率された二流の集団に勝つことはできない。", author: "アリゴ・サッキ" },
  { id: 2, text: "バスに乗り遅れるな。（進化についていけない者は去れ）", author: "アレックス・ファーガソン" },
  { id: 3, text: "僕には僕のスタイルがある。人の真似はしない。", author: "ネイマール" },
  { id: 4, text: "ボールを動かせ。ボールは疲れない。", author: "ヨハン・クライフ" },
  { id: 5, text: "PKを外すことができるのは、PKを蹴る勇気を持った者だけだ。", author: "ロベルト・バッジョ" },
  { id: 6, text: "努力すれば報われる？そうじゃない。報われるまで努力するんだ。", author: "リオネル・メッシ" },
  { id: 7, text: "強い者が勝つのではない。勝った者が強いのだ。", author: "フランツ・ベッケンバウアー" },
  { id: 8, text: "昨日までの自分を超えろ。", author: "本田圭佑" }
];

// ==========================================
// 3. ロジック関数 (Logic)
// ==========================================

// スコア計算
const calculateScore = (category: string, item: string, value: number): number => {
  const catData = SCORING_MASTER[category] || SCORING_MASTER["U18_男子"];
  const criteria = catData[item] || DEFAULT_CRITERIA;

  // タイム競技は小さい方が良い
  const isDesc = ["10m走", "30m走", "アジリティ", "ドリブル"].includes(item);

  if (isDesc) {
    if (value <= criteria[5]) return 5;
    if (value <= criteria[4]) return 4;
    if (value <= criteria[3]) return 3;
    if (value <= criteria[2]) return 2;
    return 1;
  } else {
    if (value >= criteria[5]) return 5;
    if (value >= criteria[4]) return 4;
    if (value >= criteria[3]) return 3;
    if (value >= criteria[2]) return 2;
    return 1;
  }
};

// 戦略プラン判定
const getStrategyPlan = (scores: Record<string, number>): StrategyPlan => {
  // ボトルネック判定
  const lowScores = Object.values(scores).filter(s => s === 1).length;
  if (lowScores >= 2) return STRATEGY_MASTER["Bottleneck Fix"];

  // 平均計算 (簡易版: 必須項目を判定に使用)
  const phyItems = ["10m走", "持久走", "垂直跳び"];
  const techItems = ["ドリブル", "シュート", "パス"];
  
  const getAvg = (items: string[]) => {
    // 測定されていない項目は3として扱う
    const vals = items.map(k => scores[k] !== undefined ? scores[k] : 3);
    return vals.reduce((a, b) => a + b, 0) / vals.length;
  };

  const phyAvg = getAvg(phyItems);
  const techAvg = getAvg(techItems);

  if (phyAvg >= 4 && techAvg >= 4) return STRATEGY_MASTER["Super Ace"];
  if (phyAvg >= 4) return STRATEGY_MASTER["Physical Monster"];
  if (techAvg >= 4) return STRATEGY_MASTER["Technician"];
  return STRATEGY_MASTER["Potential"];
};

// ==========================================
// 4. コンポーネント (Components)
// ==========================================

// 名言表示コンポーネント (重複回避機能付き)
const QuoteSection: React.FC = () => {
  const [quote, setQuote] = useState<Quote | null>(null);

  useEffect(() => {
    // 簡易的な重複回避: 本番ではlocalStorageなどを使用推奨
    const random = QUOTES_MASTER[Math.floor(Math.random() * QUOTES_MASTER.length)];
    setQuote(random);
  }, []);

  if (!quote) return null;

  return (
    <div className="mt-8 mb-12 p-6 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-xl text-center shadow-lg">
      <p className="text-xs font-bold text-blue-400 tracking-widest uppercase mb-4">Today's S-CORE Message</p>
      <h3 className="text-xl font-serif italic mb-4">"{quote.text}"</h3>
      <p className="text-sm font-bold text-gray-400">- {quote.author}</p>
    </div>
  );
};

// レポート表示コンポーネント
const ReportView = ({ data }: { data: any }) => {
  const { strategy, feedbacks } = data;

  return (
    <div className="animate-fade-in space-y-8">
      {/* 総合評価 */}
      <div className="bg-blue-900 text-white p-6 rounded-lg text-center shadow-lg">
        <h2 className="text-3xl font-bold mb-2">{strategy.type}</h2>
        <p className="text-blue-100">{strategy.description}</p>
      </div>

      {/* 詳細分析 */}
      <div>
        <h3 className="text-xl font-bold border-b-2 border-blue-900 mb-4 pb-2 text-gray-800">詳細フィードバック</h3>
        <div className="grid gap-4">
          {feedbacks.map((fb: any) => (
            <div key={fb.item} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-lg text-gray-800">{fb.item}</h4>
                <div className="text-yellow-500 font-bold text-lg">
                  {"★".repeat(fb.score)}{"☆".repeat(5 - fb.score)}
                  <span className="text-gray-400 text-xs ml-2 font-normal">(測定: {fb.value})</span>
                </div>
              </div>
              <p className="text-gray-700 text-sm mb-2">💡 {fb.intelligence}</p>
              <p className="text-blue-800 text-xs italic bg-blue-50 p-2 rounded border border-blue-100">
                {fb.advice}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 戦略ロードマップ */}
      <div>
        <h3 className="text-xl font-bold border-b-2 border-blue-900 mb-4 pb-2 text-gray-800">戦略ロードマップ</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-lg border-t-4 border-blue-500 shadow-sm">
            <h4 className="font-bold text-blue-600 mb-1">🚀 Phase 1: 短期目標</h4>
            <h5 className="font-bold text-md mb-2">{strategy.phase1.title}</h5>
            <p className="text-sm text-gray-600 mb-2">{strategy.phase1.analysis}</p>
            <div className="bg-gray-50 p-2 rounded text-xs text-gray-700">
              <strong>Action:</strong> {strategy.phase1.action}
            </div>
          </div>
          <div className="bg-white p-5 rounded-lg border-t-4 border-green-500 shadow-sm">
            <h4 className="font-bold text-green-600 mb-1">🏆 Phase 2: 将来像</h4>
            <h5 className="font-bold text-md mb-2">{strategy.phase2.title}</h5>
            <p className="text-sm text-gray-600 mb-2">{strategy.phase2.analysis}</p>
            <div className="bg-gray-50 p-2 rounded text-xs text-gray-700">
              <strong>Action:</strong> {strategy.phase2.action}
            </div>
          </div>
        </div>
      </div>

      <QuoteSection />
    </div>
  );
};

// ==========================================
// 5. エクスポート用コンポーネント
// ==========================================
// 名前を変更して、App.tsxではないことを明示
export default function ScoreAnalyzer() {
  const [category, setCategory] = useState("U12_男子");
  const [inputs, setInputs] = useState<Record<string, string>>({
    "10m走": "",
    "持久走": "",
    "ドリブル": "3", // デモ用初期値
    "シュート": "3"
  });
  const [report, setReport] = useState<any>(null);

  const handleAnalyze = () => {
    // 1. スコア計算
    const scores: Record<string, number> = {};
    Object.keys(inputs).forEach(key => {
      const val = parseFloat(inputs[key]);
      if (!isNaN(val)) {
        // 技術系(1-5入力)か測定系(数値入力)かで分岐
        if (["ドリブル","シュート","パス"].includes(key)) {
          scores[key] = Math.min(5, Math.max(1, val)); 
        } else {
          scores[key] = calculateScore(category, key, val);
        }
      }
    });

    // 2. フィードバック生成
    const feedbacks = Object.keys(scores).map(key => {
      const score = scores[key] as ScoreLevel;
      // マスタになければデフォルト
      const content = FEEDBACK_MASTER[key]?.[score] || { 
        intelligence: score <= 2 ? "基礎トレーニングが必要です。" : "良いパフォーマンスです。", 
        advice: "『継続は力なり。』" 
      };
      return { item: key, score, value: inputs[key], ...content };
    });

    // 3. 戦略プラン判定
    const strategy = getStrategyPlan(scores);

    setReport({ strategy, feedbacks });
  };

  return (
    <div className="bg-gray-50 p-4 font-sans text-gray-800 rounded-lg shadow-inner">
      <div className="max-w-4xl mx-auto">
        {!report ? (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 text-blue-900">S-CORE 分析入力</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-bold mb-2">カテゴリー選択</label>
              <select 
                className="w-full p-2 border rounded bg-gray-50"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="U12_男子">U-12 男子</option>
                <option value="U15_男子">U-15 男子</option>
                <option value="U18_男子">U-18 男子</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* 測定項目入力 */}
              <div>
                <label className="block text-sm font-bold mb-1">10m走 (秒)</label>
                <input 
                  type="number" 
                  step="0.01"
                  className="w-full p-2 border rounded"
                  value={inputs["10m走"]}
                  onChange={(e) => setInputs({...inputs, "10m走": e.target.value})}
                  placeholder="例: 2.1"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">持久走 (m)</label>
                <input 
                  type="number" 
                  className="w-full p-2 border rounded"
                  value={inputs["持久走"]}
                  onChange={(e) => setInputs({...inputs, "持久走": e.target.value})}
                  placeholder="例: 1200"
                />
              </div>
              {/* 技術評価入力 */}
              <div>
                <label className="block text-sm font-bold mb-1">ドリブル評価 (1-5)</label>
                <select 
                  className="w-full p-2 border rounded"
                  value={inputs["ドリブル"]}
                  onChange={(e) => setInputs({...inputs, "ドリブル": e.target.value})}
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </div>
            </div>

            <button 
              onClick={handleAnalyze}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition shadow-lg"
            >
              分析結果を表示する
            </button>
          </div>
        ) : (
          <div>
            <button 
              onClick={() => setReport(null)}
              className="mb-4 text-blue-600 underline text-sm hover:text-blue-800"
            >
              ← 入力画面に戻る
            </button>
            <ReportView data={report} />
          </div>
        )}
      </div>
    </div>
  );
}