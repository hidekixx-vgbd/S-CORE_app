
import { CategoryKey, MasterStandard } from './types';

export const CATEGORY_COEFFICIENTS: Record<CategoryKey, number> = {
  'U18_M': 1.0,
  'U18_F': 1.15,
  'U15_M': 1.2,
  'U15_F': 1.35,
  'U12_M': 1.45,
  'U12_F': 1.6,
  'U10_M': 1.75,
  'U10_F': 1.9,
};

export const MASTER_STANDARDS: Record<string, MasterStandard> = {
  run10m: {
    metric: '10m走',
    type: 'time',
    thresholds: [2.5, 2.2, 1.9, 1.7, 1.5]
  },
  run30m: {
    metric: '30m走',
    type: 'time',
    thresholds: [5.5, 5.0, 4.6, 4.3, 4.0]
  },
  agility: {
    metric: '敏捷性',
    type: 'time',
    thresholds: [6.5, 6.0, 5.5, 5.0, 4.5]
  },
  verticalJump: {
    metric: '垂直跳び',
    type: 'distance',
    thresholds: [30, 40, 50, 60, 70]
  },
  tripleJump: {
    metric: '立ち三段跳び',
    type: 'distance',
    thresholds: [4.0, 5.0, 6.0, 7.0, 8.0]
  },
  sitUps: {
    metric: '上体起こし',
    type: 'reps',
    thresholds: [15, 20, 25, 30, 35]
  },
  coordination: {
    metric: 'コーディネーション',
    type: 'time',
    thresholds: [10.0, 9.0, 8.0, 7.0, 6.0]
  },
  endurance: {
    metric: '持久力',
    type: 'distance',
    thresholds: [400, 800, 1200, 1600, 2000]
  },
  dribble: {
    metric: 'ドリブル',
    type: 'time',
    thresholds: [12.0, 11.0, 10.0, 9.0, 8.0]
  },
  lifting: {
    metric: 'リフティング',
    type: 'reps',
    thresholds: [10, 30, 50, 100, 200]
  },
  shortPass: {
    metric: 'ショートパス',
    type: 'points',
    thresholds: [1, 2, 3, 4, 5]
  },
  longPass: {
    metric: 'ロングパス',
    type: 'points',
    thresholds: [1, 2, 3, 4, 5]
  },
  shoot: {
    metric: 'シュート',
    type: 'points',
    thresholds: [1, 2, 3, 4, 5]
  }
};
