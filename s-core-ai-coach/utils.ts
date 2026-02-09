
import { CATEGORY_COEFFICIENTS, MASTER_STANDARDS } from './constants';
import { AgeGroup, Gender, CategoryKey, Scores, PhysicalMeasurements, TechnicalMeasurements } from './types';

export const calculateScore = (value: number, ageGroup: AgeGroup, gender: Gender, metricKey: string): number => {
  const genderCode = gender === 'Male' ? 'M' : 'F';
  const lookupKey = `${ageGroup}_${genderCode}` as CategoryKey;
  const coefficient = CATEGORY_COEFFICIENTS[lookupKey];
  const standard = MASTER_STANDARDS[metricKey];
  
  if (!standard) return 3;

  let normalizedValue = value;
  if (standard.type === 'time') {
    normalizedValue = value / coefficient;
  } else if (standard.type === 'distance' || standard.type === 'reps') {
    normalizedValue = value * coefficient;
  } else {
    normalizedValue = value;
  }

  const { thresholds, type } = standard;
  
  if (type === 'time' || metricKey === 'dribble') {
    if (normalizedValue <= thresholds[4]) return 5;
    if (normalizedValue <= thresholds[3]) return 4;
    if (normalizedValue <= thresholds[2]) return 3;
    if (normalizedValue <= thresholds[1]) return 2;
    return 1;
  } else {
    if (normalizedValue >= thresholds[4]) return 5;
    if (normalizedValue >= thresholds[3]) return 4;
    if (normalizedValue >= thresholds[2]) return 3;
    if (normalizedValue >= thresholds[1]) return 2;
    return 1;
  }
};

export const processScores = (
  physical: PhysicalMeasurements,
  technical: TechnicalMeasurements,
  ageGroup: AgeGroup,
  gender: Gender
): Scores => {
  const best30m = Math.min(physical.run30m_1, physical.run30m_2);
  const bestVertical = Math.max(physical.verticalJump_1, physical.verticalJump_2, physical.verticalJump_3);
  
  // 敏捷性の左右別スコア
  const agiR = calculateScore(physical.agilityR, ageGroup, gender, 'agility');
  const agiL = calculateScore(physical.agilityL, ageGroup, gender, 'agility');

  // テクニカル左右別のスコア計算
  const spR = calculateScore(technical.shortPassR, ageGroup, gender, 'shortPass');
  const spL = calculateScore(technical.shortPassL, ageGroup, gender, 'shortPass');
  const lpR = calculateScore(technical.longPassR, ageGroup, gender, 'longPass');
  const lpL = calculateScore(technical.longPassL, ageGroup, gender, 'longPass');
  const sR = calculateScore(technical.shootR, ageGroup, gender, 'shoot');
  const sL = calculateScore(technical.shootL, ageGroup, gender, 'shoot');

  return {
    run10m: calculateScore(physical.run10m, ageGroup, gender, 'run10m'),
    run30m: calculateScore(best30m, ageGroup, gender, 'run30m'),
    agility: (agiR + agiL) / 2,
    agilityR: agiR,
    agilityL: agiL,
    verticalJump: calculateScore(bestVertical, ageGroup, gender, 'verticalJump'),
    tripleJump: calculateScore(physical.tripleJump, ageGroup, gender, 'tripleJump'),
    sitUps: calculateScore(physical.sitUps, ageGroup, gender, 'sitUps'),
    coordination: calculateScore(physical.coordination, ageGroup, gender, 'coordination'),
    endurance: calculateScore(physical.yoYoDistance, ageGroup, gender, 'endurance'),
    dribble: calculateScore(technical.dribble, ageGroup, gender, 'dribble'),
    lifting: calculateScore(technical.lifting, ageGroup, gender, 'lifting'),
    shortPass: (spR + spL) / 2,
    longPass: (lpR + lpL) / 2,
    shoot: (sR + sL) / 2,
    shortPassR: spR,
    shortPassL: spL,
    longPassR: lpR,
    longPassL: lpL,
    shootR: sR,
    shootL: sL,
  };
};

export const generateId = (length: number = 10) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};
