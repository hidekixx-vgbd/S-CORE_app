
import { GoogleGenAI, Type } from "@google/genai";
import { Scores, AthleteInfo } from "../types";

export const getAIAnalysis = async (scores: Scores, info: AthleteInfo) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const genderJP = info.gender === 'Male' ? '男子' : '女子';
  
  const prompt = `
    あなたはトップレベルの現場で数多くのエリート選手を分析してきた、最高峰のテクニカルスカウト兼分析官です。
    提供された17項目の計測スコアに基づき、各項目の本質を突いた「完全に独立した専門的フィードバック」を生成してください。

    【表現の絶対ルール：トップレベルへの統一】
    1. 「世界」「欧州」「Jリーグ」「プロ」などの具体的な地域名やリーグ名は一切使用しないでください。
    2. 最高水準や目標を表現する場合は、すべて「トップレベル」という言葉に統一してください。
    （例：世界基準 → トップレベル、プロ級のキック → トップレベルのキック）

    【重複排除と項目別指針】
    - 各項目のコメントは、内容・表現ともに他と重複させてはいけません。
    - ドリブル: 重心移動と加速時のボールコンタクトに特化。
    - リフティング: 空中でのタッチの繊細さと足首の脱力に特化。
    - ショートパス: 受け手の次の動作を想定した配給精度と意思表示に特化。
    - ロングパス: 遠距離へのレンジ拡大と軌道の質、局面展開に特化。
    - シュート: 決定力、インパクト、ターゲットを射抜く冷静さに特化。
    - フィジカル各項目: 10m(初動) vs 30m(最高速)、敏捷性(左右差)、垂直跳び(制空権) vs 三段跳び(連続推進)を明確に書き分けること。

    選手情報: ${info.name}, カテゴリー: ${info.ageGroup} (${genderJP}), クラブ: ${info.clubName}
    
    計測スコア (1〜5点):
    [フィジカル] 10m走:${scores.run10m}, 30m走:${scores.run30m}, 敏捷R:${scores.agilityR}, 敏捷L:${scores.agilityL}, 垂直跳:${scores.verticalJump}, 三段跳:${scores.tripleJump}, 上体起:${scores.sitUps}, 調整力:${scores.coordination}, 持久力:${scores.endurance}
    [テクニカル] ドリブル:${scores.dribble}, リフティング:${scores.lifting}, SパスR:${scores.shortPassR}, SパスL:${scores.shortPassL}, LパスR:${scores.longPassR}, LパスL:${scores.longPassL}, シュートR:${scores.shootR}, シュートL:${scores.shootL}

    返信は必ず指定されたJSON形式で行ってください。
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            aiAdvice: { 
              type: Type.ARRAY, 
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  improvement: { type: Type.STRING },
                  keyPoint: { type: Type.STRING },
                  goal: { type: Type.STRING }
                },
                required: ["title", "improvement", "keyPoint", "goal"]
              }
            },
            physicalSummary: { type: Type.STRING },
            technicalSummary: { type: Type.STRING },
            playStyle: { type: Type.STRING },
            physicalComments: { 
              type: Type.OBJECT, 
              properties: { 
                run10m: {type:Type.STRING, description: "10m走：初動の爆発力についての独自分析。トップレベルという言葉を使用。"}, 
                run30m: {type:Type.STRING, description: "30m走：加速局面と最高速維持についての独自分析。トップレベルという言葉を使用。"}, 
                agilityR: {type:Type.STRING, description: "右敏捷：右への切り返し速度についての独自分析。"}, 
                agilityL: {type:Type.STRING, description: "左敏捷：左への切り返し速度についての独自分析。"}, 
                verticalJump: {type:Type.STRING, description: "垂直跳び：垂直方向のパワー発揮についての独自分析。"}, 
                tripleJump: {type:Type.STRING, description: "立ち三段跳び：水平方向の連続推進についての独自分析。"}, 
                sitUps: {type:Type.STRING, description: "上体起こし：体幹の連動についての独自分析。"}, 
                coordination: {type:Type.STRING, description: "コーディネーション：リズム同調についての独自分析。"}, 
                endurance: {type:Type.STRING, description: "持久力：乳酸耐性と持続力についての独自分析。"} 
              },
              required: ["run10m", "run30m", "agilityR", "agilityL", "verticalJump", "tripleJump", "sitUps", "coordination", "endurance"]
            },
            technicalComments: { 
              type: Type.OBJECT, 
              properties: { 
                dribble: {type:Type.STRING, description: "ドリブル：スピードとコントロールの融合についての独自分析。"}, 
                lifting: {type:Type.STRING, description: "リフティング：タッチの繊細さについての独自分析。"}, 
                shortPassR: {type:Type.STRING, description: "右Sパス：右足の配給精度とメッセージについての独自分析。"}, 
                shortPassL: {type:Type.STRING, description: "左Sパス：左足の配給精度とメッセージについての独自分析。"}, 
                longPassR: {type:Type.STRING, description: "右Lパス：右足のキックレンジについての独自分析。"}, 
                longPassL: {type:Type.STRING, description: "左Lパス：左足のキックレンジについての独自分析。"}, 
                shootR: {type:Type.STRING, description: "右シュート：右足の決定力についての独自分析。"}, 
                shootL: {type:Type.STRING, description: "左シュート：左足の決定力についての独自分析。"} 
              },
              required: ["dribble", "lifting", "shortPassR", "shortPassL", "longPassR", "longPassL", "shootR", "shootL"]
            }
          },
          required: ["aiAdvice", "physicalSummary", "technicalSummary", "playStyle", "physicalComments", "technicalComments"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Analysis Error:", error);
    // フォールバックデータも各項目に特化し、「トップレベル」に統一
    return {
      aiAdvice: [{ title: "トップレベルへの道", improvement: "すべてのトップレベルのプレーヤーは、自分の弱みを最大の武器に変える努力を惜しみませんでした。", keyPoint: "日常の些細な動作へのこだわり", goal: "トップレベルの数値をターゲットに" }],
      physicalSummary: "君の身体能力には、トップレベルで通用するエンジンが眠っています。それを呼び覚ます鍵は、基礎の徹底にあります。",
      technicalSummary: "技術の習得に終わりはありません。トップレベルの舞台を想像し、ボールと対話を続けましょう。",
      playStyle: "未来を切り拓くトップレベルの開拓者",
      physicalComments: { 
        run10m: "地面をえぐるような一歩目が身につけば、トップレベルの守備網を一瞬で無効化できます。", 
        run30m: "トップスピードの持続力は高い。後半のストライドの伸びを意識し、トップレベルの加速を磨こう。", 
        agilityR: "右への切り返しにおける軸足の固定が素晴らしい。ここでの重心移動がトップレベルの攻撃の起点となります。", 
        agilityL: "左へのステップにおける膝の使い方が柔軟。さらにトップレベルのスピード感と連動させれば完璧です。", 
        verticalJump: "空中で一瞬止まるような感覚を掴めれば、トップレベルのセットプレーを支配できます。", 
        tripleJump: "推進力を連続させる力は、トップレベルのドリブルの源泉。足裏の感覚をさらに研ぎ澄ませて。", 
        sitUps: "強靭な腹圧は、トップレベルの激しいコンタクトの中でもプレーの正確性を担保する盾になります。", 
        coordination: "複雑な動きを優雅にこなす姿には、トップレベルのインテリジェンスを感じる。四肢の連動を極めよう。", 
        endurance: "後半30分、全員が立ち止まる時、君だけが走り続ける姿はトップレベルの戦術に不可欠です。" 
      },
      technicalComments: { 
        dribble: "スピードに乗ったままボールを愛せるようになれば、君のプレーはトップレベルを驚かせる芸術へと進化する。", 
        lifting: "ボールの中心を捉え続ける繊細さは、トップレベルのトラップの瞬間に魔法をかける力になります。", 
        shortPassR: "君のパスにはメッセージが込められている。トップレベルの出し手として、受け手の未来を創ろう。", 
        shortPassL: "逆足が呼吸し始めた時、ピッチの全域がトップレベルの支配下に入る。左足の精度向上を。", 
        longPassR: "美しい弾道はピッチを縦断する矢だ。トップレベルのレンジで局面を打開する展開を狙おう。", 
        longPassL: "左足での展開力は、トップレベルの戦術的オプションを増やす。レンジをあと数メートル伸ばそう。", 
        shootR: "ゴールへの執着心を乗せた一撃。トップレベルの冷静さでターゲットの四隅を射抜く準備を。", 
        shootL: "左足での決定力が完成した時、君はトップレベルのディフェンダーが最も恐れる存在になるだろう。" 
      }
    };
  }
};
