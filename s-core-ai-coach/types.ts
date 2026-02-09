
export type AgeGroup = 'U10' | 'U12' | 'U15' | 'U18';
export type Gender = 'Male' | 'Female';

export type CategoryKey = 'U10_M' | 'U10_F' | 'U12_M' | 'U12_F' | 'U15_M' | 'U15_F' | 'U18_M' | 'U18_F';

export type AthleteType = 'SUPER_ACE' | 'PHYSICAL_MONSTER' | 'TECHNICIAN' | 'POTENTIAL' | 'BOTTLENECK';

export interface AthleteInfo {
  id: string;
  name: string;
  clubName: string;
  clubId: string;
  ageGroup: AgeGroup;
  gender: Gender;
  date: string;
  email: string;
}

export interface PhysicalMeasurements {
  run10m: number;
  run30m_1: number;
  run30m_2: number;
  agilityL: number;
  agilityR: number;
  verticalJump_1: number;
  verticalJump_2: number;
  verticalJump_3: number;
  tripleJump: number;
  sitUps: number;
  coordination: number;
  yoYoDistance: number;
}

export interface TechnicalMeasurements {
  dribble: number;
  lifting: number;
  shortPassR: number;
  shortPassL: number;
  longPassR: number;
  longPassL: number;
  shootL: number;
  shootR: number;
}

export interface Scores {
  run10m: number;
  run30m: number;
  agility: number;
  agilityL: number;
  agilityR: number;
  verticalJump: number;
  tripleJump: number;
  sitUps: number;
  coordination: number;
  endurance: number;
  dribble: number;
  lifting: number;
  shortPass: number;
  longPass: number;
  shoot: number;
  shortPassR: number;
  shortPassL: number;
  longPassR: number;
  longPassL: number;
  shootR: number;
  shootL: number;
}

export interface AdviceItem {
  title: string;
  improvement: string;
  keyPoint: string;
  goal: string;
}

export interface MetricFeedback {
  intelligence: string;
  advice: string;
}

export interface AnalysisResult {
  scores: Scores;
  measurements?: {
    physical: PhysicalMeasurements;
    technical: TechnicalMeasurements;
  };
  physicalFeedbacks: Record<string, MetricFeedback>;
  technicalFeedbacks: Record<string, MetricFeedback>;
  physicalSummary: string;
  technicalSummary: string;
  aiAdvice: AdviceItem[];
  playStyle: string;
  inspirationalQuote: string;
  athleteType: AthleteType;
}

export interface MasterStandard {
  metric: string;
  type: 'time' | 'distance' | 'reps' | 'points';
  thresholds: [number, number, number, number, number];
}
