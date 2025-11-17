document.addEventListener('DOMContentLoaded', () => {
    // --- DOM要素の取得 ---
    const foldCountDisplay = document.getElementById('fold-count');
    const addButton = document.getElementById('add-fold-button');
    const subtractButton = document.getElementById('subtract-fold-button'); 
    const baseThicknessInput = document.getElementById('base-thickness-input');
    const sideLengthInput = document.getElementById('side-length-input'); 

    // 厚さの結果表示
    const thicknessMetersDisplay = document.getElementById('thickness-meters');
    const thicknessKmDisplay = document.getElementById('thickness-km');
    const comparisonResult = document.getElementById('comparison-result');
    
    // 辺の長さの結果表示
    const currentWidthLengthDisplay = document.getElementById('current-width-length');
    const thicknessCmDisplay = document.getElementById('thickness-cm'); 
    const foldCountSideDisplay = document.getElementById('fold-count-side');

    // --- 定数と初期値 ---
    let foldCount = 0;
    const MM_TO_M = 0.001;  // 1mm = 0.001m
    const M_TO_KM = 0.001;  // 1m = 0.001km
    const MM_TO_CM = 0.1;   // 1mm = 0.1cm

    // --- (A) 計算ロジック ---
    const calculateThickness = () => {
        const baseThicknessMM = parseFloat(baseThicknessInput.value);
        const initialSideLengthCM = parseFloat(sideLengthInput.value);

        if (isNaN(baseThicknessMM) || baseThicknessMM <= 0 || isNaN(initialSideLengthCM) || initialSideLengthCM <= 0) {
            // 初期値が不正な場合はエラー表示
            comparisonResult.innerHTML = "初期厚さおよび辺の長さを正の値で入力してください。";
            thicknessMetersDisplay.textContent = "0.00 メートル";
            thicknessKmDisplay.textContent = "0.00 キロメートル";
            currentWidthLengthDisplay.textContent = "計算不能";
            thicknessCmDisplay.textContent = "計算不能";
            return;
        }

        // 1. 【厚さ計算】指数関数的な厚さ (mm)
        const finalThicknessMM = baseThicknessMM * Math.pow(2, foldCount);
        
        // メートルとキロメートルに変換
        const finalThicknessM = finalThicknessMM * MM_TO_M;
        const finalThicknessKM = finalThicknessM * M_TO_KM;
        const finalThicknessCM = finalThicknessMM * MM_TO_CM; // cm単位

        // 2. 【辺の長さ計算】半分折りを繰り返すシミュレーション
        let currentWidth = initialSideLengthCM;
        let currentLength = initialSideLengthCM;
        
        for (let i = 0; i < foldCount; i++) {
            // 長い方の辺を半分にする
            if (currentWidth >= currentLength) {
                currentWidth /= 2;
            } else {
                currentLength /= 2;
            }
        }

        // 3. 【結果の表示更新】
        foldCountDisplay.textContent = foldCount;
        foldCountSideDisplay.textContent = foldCount;

        // 厚さ表示 (メートルとキロメートルは固定小数点、cmは指数表記)
        thicknessMetersDisplay.textContent = `${finalThicknessM.toFixed(2)} メートル`;
        // 10km以上の場合はkm単位で表示
        if (finalThicknessKM >= 10) {
            thicknessKmDisplay.textContent = `${finalThicknessKM.toLocaleString()} キロメートル`; 
        } else {
            thicknessKmDisplay.textContent = `${finalThicknessKM.toFixed(4)} キロメートル`; 
        }

        thicknessCmDisplay.textContent = `${finalThicknessCM.toExponential(2)} cm`;
        
        // 辺の長さ表示
        currentWidthLengthDisplay.textContent = 
            `${currentWidth.toFixed(2)} cm × ${currentLength.toFixed(2)} cm`;

        // 4. 【比較結果の更新】
        updateComparison(finalThicknessM);
    };

    // --- (B) 比較結果更新ロジック ---
    const updateComparison = (thicknessM) => {
        let resultText = "ボタンを押してシミュレーションを開始してください。";
        const fold = foldCount; // 短縮表記

        if (thicknessM >= 300000000) { 
            resultText = `🪐 ${fold}回で到達！ 地球から月までの距離 384,400km を超え、火星へGo!!(平均約2億2500万km)`;
        } else if (thicknessM >= 384400000) { // 384,400km = 384,400,000 m
            resultText = `🌕 ${fold}回で月へ到達！ 約384,400km先に到達しました！`;
        } else if (thicknessM >= 100000) { // 100,000 m = 100km
            resultText = `🌌 ${fold}回で宇宙の境界！ 宇宙の始まりとされるカーマン・ライン（100km）を突破しました！`;
        } else if (thicknessM >= 8848) { 
            resultText = `🏔️ ${fold}回でエベレスト！ 地球上の最高峰、エベレスト（約8,848m）を超えました！`;
        } else if (thicknessM >= 634) { 
            resultText = `🗼 ${fold}回でスカイツリー！ 東京スカイツリー（634m）の高さを超えました！`;
        } else if (thicknessM >= 50) { 
            resultText = `🏢 ${fold}回でビル！ 15階建て程度の高層ビル（約50m）に匹敵します。`;
        } else if (fold > 0) {
            resultText = `🤏 最初の紙の厚さ ${baseThicknessInput.value}mm から ${fold}回折って、${thicknessM.toFixed(2)}m になりました。`;
        } else if (fold === 0) {
            resultText = "ボタンを押してシミュレーションを開始してください。";
        }

        comparisonResult.innerHTML = resultText;
    };

    // --- (C) イベントリスナーの設定 ---
    addButton.addEventListener('click', () => {
        foldCount++;
        calculateThickness();
    });
    
    subtractButton.addEventListener('click', () => {
        // 折り回数が0未満にならないように制御
        if (foldCount > 0) {
            foldCount--;
            calculateThickness();
        }
    });

    // 初期設定変更時にも計算を更新
    baseThicknessInput.addEventListener('change', calculateThickness);
    baseThicknessInput.addEventListener('keyup', calculateThickness);
    sideLengthInput.addEventListener('change', calculateThickness);
    sideLengthInput.addEventListener('keyup', calculateThickness);

    // ページロード時の初期計算
    calculateThickness();
});