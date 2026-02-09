
import { FEEDBACK_MASTER, FeedbackLevel } from '../data/feedbackMaster';
import { ADVISORY_MASTER, AdvisoryPattern } from '../data/advisoryMaster';
import { AthleteType, Scores } from '../types';

/**
 * 個別項目のメッセージ取得
 */
export const getFeedback = (itemKey: string, score: number) => {
  const safeScore = Math.max(1, Math.min(5, Math.round(score))) as FeedbackLevel;
  const masterItem = FEEDBACK_MASTER[itemKey] || FEEDBACK_MASTER["default"];
  return masterItem[safeScore];
};

/**
 * 弱点克服アドバイス生成（スコア2以下を抽出）
 */
export const generateWeaknessAdvice = (scores: Record<string, number>): string[] => {
  const weaknesses: string[] = [];
  
  Object.entries(scores).forEach(([key, score]) => {
    if (score <= 2) {
      const feedback = getFeedback(key, score);
      weaknesses.push(`【${key}】${feedback.intelligence} ${feedback.advice}`);
    }
  });

  if (weaknesses.length === 0) {
    weaknesses.push("現在のパフォーマンスは非常にバランスが取れています。長所をさらに磨き、チームの核を目指しましょう。");
  }

  return weaknesses;
};

/**
 * 選手タイプ（パターン）の判定
 */
export const categorizeAthlete = (scores: Scores): AthleteType => {
  const scoreValues = Object.values(scores);
  const onesCount = scoreValues.filter(s => s <= 1.5).length;

  // 1. 致命的な弱点が複数ある場合 (1.5以下が2つ以上)
  if (onesCount >= 2) return 'BOTTLENECK';

  const physAvg = (scores.run10m + scores.run30m + scores.agility + scores.verticalJump + scores.tripleJump) / 5;
  const techAvg = (scores.dribble + scores.lifting + scores.shortPass + scores.longPass + scores.shoot) / 5;

  // 2. 両方高い
  if (physAvg >= 4.0 && techAvg >= 4.0) return 'SUPER_ACE';
  
  // 3. フィジカル優位
  if (physAvg >= 4.0) return 'PHYSICAL_MONSTER';
  
  // 4. テクニック優位
  if (techAvg >= 4.0) return 'TECHNICIAN';

  // 5. 発展途上
  return 'POTENTIAL';
};

/**
 * プレースタイル分析（強み）生成
 */
export const analyzePlayStyle = (type: AthleteType): string => {
  return ADVISORY_MASTER[type].playStyle;
};

/**
 * 戦略アドバイザリーの取得
 */
export const getAdvisoryPattern = (type: AthleteType): AdvisoryPattern => {
  return ADVISORY_MASTER[type];
};
