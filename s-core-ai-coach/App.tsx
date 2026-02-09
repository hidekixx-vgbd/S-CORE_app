
import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import InputForm1 from './components/InputForm1';
import InputForm2 from './components/InputForm2';
import AnalysisResultView from './components/AnalysisResultView';
import { AthleteInfo, PhysicalMeasurements, TechnicalMeasurements, Scores, AnalysisResult, MetricFeedback, AthleteType } from './types';
import { processScores, generateId } from './utils';
import { getAIAnalysis } from './services/geminiService';
import { syncToSpreadsheet } from './services/driveService';
import { getFeedback, categorizeAthlete, getAdvisoryPattern } from './utils/analysisUtils';
import { LEGEND_QUOTES } from './data/quotes';

enum Step {
  Landing,
  Input1,
  Input2,
  Analysis
}

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>(Step.Landing);
  const [athleteInfo, setAthleteInfo] = useState<AthleteInfo | null>(null);
  const [scores, setScores] = useState<Scores | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleStart = () => setCurrentStep(Step.Input1);
  
  const handleSkipProfile = () => {
    const guestInfo: AthleteInfo = {
      id: "GUEST-" + generateId(5),
      name: 'ゲストプレイヤー',
      clubName: '未設定',
      clubId: 'GUEST-001',
      ageGroup: 'U18',
      gender: 'Male',
      date: new Date().toISOString().split('T')[0],
      email: ''
    };
    setAthleteInfo(guestInfo);
    setCurrentStep(Step.Input2);
  };

  const handleInput1Submit = (info: AthleteInfo) => {
    setAthleteInfo(info);
    setCurrentStep(Step.Input2);
  };

  const handleInput2Submit = async (phys: PhysicalMeasurements, tech: TechnicalMeasurements) => {
    if (!athleteInfo) return;
    
    setIsLoading(true);
    
    // 1. 数値計算
    const calculatedScores = processScores(phys, tech, athleteInfo.ageGroup, athleteInfo.gender);
    setScores(calculatedScores);
    
    // 2. 選手タイプの判定
    const athleteType = categorizeAthlete(calculatedScores);
    const pattern = getAdvisoryPattern(athleteType);
    
    // 3. マスタデータからのフィードバック取得
    const physFeedbacks: Record<string, MetricFeedback> = {
      run10m: getFeedback("10m走", calculatedScores.run10m),
      run30m: getFeedback("30m走", calculatedScores.run30m),
      agilityR: getFeedback("敏捷性", calculatedScores.agilityR),
      agilityL: getFeedback("敏捷性", calculatedScores.agilityL),
      agility: getFeedback("敏捷性", calculatedScores.agility),
      verticalJump: getFeedback("垂直跳び", calculatedScores.verticalJump),
      tripleJump: getFeedback("立ち三段跳び", calculatedScores.tripleJump),
      sitUps: getFeedback("上体起こし", calculatedScores.sitUps),
      coordination: getFeedback("コーディネーション", calculatedScores.coordination),
      endurance: getFeedback("持久力", calculatedScores.endurance),
    };

    const techFeedbacks: Record<string, MetricFeedback> = {
      dribble: getFeedback("ドリブル", calculatedScores.dribble),
      lifting: getFeedback("リフティング", calculatedScores.lifting),
      shortPassR: getFeedback("ショートパス", calculatedScores.shortPassR),
      shortPassL: getFeedback("ショートパス", calculatedScores.shortPassL),
      shortPass: getFeedback("ショートパス", calculatedScores.shortPass),
      longPassR: getFeedback("ロングパス", calculatedScores.longPassR),
      longPassL: getFeedback("ロングパス", calculatedScores.longPassL),
      longPass: getFeedback("ロングパス", calculatedScores.longPass),
      shootR: getFeedback("シュート", calculatedScores.shootR),
      shootL: getFeedback("シュート", calculatedScores.shootL),
      shoot: getFeedback("シュート", calculatedScores.shoot),
    };

    // 4. AI分析
    const aiResponse = await getAIAnalysis(calculatedScores, athleteInfo);
    
    // AIフィードバックをマージ
    Object.keys(physFeedbacks).forEach(key => {
      if (aiResponse.physicalComments[key]) {
        physFeedbacks[key].intelligence = aiResponse.physicalComments[key];
      }
    });
    Object.keys(techFeedbacks).forEach(key => {
      if (aiResponse.technicalComments[key]) {
        techFeedbacks[key].intelligence = aiResponse.technicalComments[key];
      }
    });

    // 名言リストからランダムに1つ選択
    const randomQuote = LEGEND_QUOTES[Math.floor(Math.random() * LEGEND_QUOTES.length)];

    const result: AnalysisResult = {
      scores: calculatedScores,
      measurements: {
        physical: phys,
        technical: tech
      },
      physicalFeedbacks: physFeedbacks,
      technicalFeedbacks: techFeedbacks,
      physicalSummary: aiResponse.physicalSummary,
      technicalSummary: aiResponse.technicalSummary,
      aiAdvice: pattern.advice, // マスタデータのアドバイスを使用
      playStyle: pattern.playStyle,
      inspirationalQuote: randomQuote,
      athleteType: athleteType
    };
    
    setAnalysisResult(result);
    // Spreadsheet sync (optional error handling)
    try {
      await syncToSpreadsheet(athleteInfo, calculatedScores, result);
    } catch (e) {
      console.error("Spreadsheet sync failed", e);
    }
    
    setIsLoading(false);
    setCurrentStep(Step.Analysis);
  };

  const handleReset = () => {
    setAthleteInfo(null);
    setScores(null);
    setAnalysisResult(null);
    setCurrentStep(Step.Landing);
  };

  const wrapperBg = currentStep === Step.Analysis ? 'bg-[#f5f5f5]' : 'bg-[#000000]';

  return (
    <div className={`min-h-screen pb-12 transition-colors duration-700 ${wrapperBg}`}>
      {currentStep === Step.Landing && (
        <LandingPage onStart={handleStart} onSkipProfile={handleSkipProfile} />
      )}
      {currentStep === Step.Input1 && <InputForm1 onSubmit={handleInput1Submit} onBack={() => setCurrentStep(Step.Landing)} onSkip={handleSkipProfile} />}
      {currentStep === Step.Input2 && <InputForm2 onSubmit={handleInput2Submit} onBack={() => setCurrentStep(Step.Input1)} isLoading={isLoading} />}
      {currentStep === Step.Analysis && analysisResult && athleteInfo && <AnalysisResultView info={athleteInfo} analysis={analysisResult} onReset={handleReset} />}
      {isLoading && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl flex items-center justify-center z-[100]">
          <div className="text-center">
            <div className="w-24 h-24 border-4 border-slate-900 border-t-cyan-400 rounded-full animate-spin mx-auto mb-8 shadow-[0_0_20px_rgba(34,211,238,0.3)]"></div>
            <h2 className="text-4xl font-noto font-black text-white mb-2 tracking-tighter uppercase">AI分析中...</h2>
            <p className="text-cyan-400 font-bold text-sm tracking-widest uppercase animate-pulse">パフォーマンスを多角的に分析中</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
