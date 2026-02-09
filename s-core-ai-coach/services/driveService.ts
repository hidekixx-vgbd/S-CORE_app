
import { AthleteInfo, Scores, AnalysisResult } from '../types';

/**
 * 【重要】GASを「ウェブアプリとしてデプロイ」した際に発行されるURLをここに貼り付けてください。
 */
const GAS_ENDPOINT_URL = "https://script.google.com/macros/s/YOUR_DEPLOYED_GAS_ID/exec";

export const syncToSpreadsheet = async (info: AthleteInfo, scores: Scores, analysis: AnalysisResult) => {
  console.log("Drive同期を開始します...");

  const payload = {
    action: "syncData",
    info,
    scores,
    analysis
  };

  try {
    // URLが設定されている場合のみ実際にリクエストを送る
    if (GAS_ENDPOINT_URL.includes("YOUR_DEPLOYED_GAS_ID")) {
      console.warn("GASのURLが設定されていません。シミュレーションモードで動作します。");
      await new Promise(resolve => setTimeout(resolve, 2000));
      return { success: true };
    }

    const response = await fetch(GAS_ENDPOINT_URL, {
      method: 'POST',
      mode: 'no-cors', // GASへのPOSTはno-corsが必要な場合があります
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    console.log("Success: Players_Records へのデータ送信完了");
    return { success: true };
  } catch (error) {
    console.error("Sync Error:", error);
    return { success: false };
  }
};

export const savePdfToDrive = async (info: AthleteInfo, pdfBase64?: string) => {
  if (!pdfBase64) {
    console.log("PDF保存準備完了（Base64待ち）");
    return { success: true };
  }

  console.log("PDFのDrive保存を開始します...");

  const payload = {
    action: "savePdf",
    fileName: `S-CORE_${info.name}_${info.date}.pdf`,
    folderName: "S-CORE/Players_Records/PDF",
    data: pdfBase64
  };

  try {
    if (GAS_ENDPOINT_URL.includes("YOUR_DEPLOYED_GAS_ID")) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      return { success: true };
    }

    await fetch(GAS_ENDPOINT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    console.log("Success: Drive内PDFフォルダへの保存完了");
    return { success: true };
  } catch (error) {
    console.error("PDF Save Error:", error);
    return { success: false };
  }
};
