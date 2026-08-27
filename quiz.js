// =====================================================
// JURASSIC WORLD - ISLA NUBLAR RESEARCH LAB
// 文化祭用 周遊謎解きタブレットシステム
// quiz.js - ゲームロジック & データ & セキュリティ
// =====================================================

// ==================== 問題データプール ====================
const SECTOR_POOLS = [
    // ========== 一区画：JUNGLE ==========
    {
        id: 0,
        name: "一区画",
        shortName: "一区画",
        areaName: "JUNGLE AREA",
        icon: "🦖",
        instructions: "【一区画 調査指示書】\n\n1階 101教室前のジャングルパドックへ向かえ。\n\n現地の展示パネルを調査し、隠されたセキュリティコードを解読せよ。\n\nヒント：パネルに描かれた恐竜の名前が鍵となる。",
        patterns: [
            {
                patternName: "A",
                title: "一区画：ジャングルエリア (Pattern A)",
                question: "【問題】\nジャングルパドックの展示パネルには、長い首を持つ草食恐竜が描かれている。\n\nこの恐竜の名前は何か？\n\n※カタカナで入力せよ（例：ティラノサウルス）",
                answers: ["ブラキオサウルス", "ブラキオ"],
                hint: "ヒント：首がとても長く、高い木の葉を食べる恐竜だ。名前は「ブラ」で始まる。",
                explanation: "正解は「ブラキオサウルス」。ジュラ紀を代表する大型草食恐竜で、全長は約25メートルにも達する。"
            },
            {
                patternName: "B",
                title: "一区画：ジャングルエリア (Pattern B)",
                question: "【問題】\nジャングルパドックの近くに設置された標識には、3本の角を持つ恐竜のシルエットが描かれている。\n\nこの恐竜の名前は何か？\n\n※カタカナで入力せよ",
                answers: ["トリケラトプス", "トリケラ"],
                hint: "ヒント：顔に3本の角を持ち、フリル（えり飾り）が特徴的な恐竜だ。",
                explanation: "正解は「トリケラトプス」。白亜紀後期に生息した角竜で、その名前は「3本の角を持つ顔」を意味する。"
            },
            {
                patternName: "C",
                title: "一区画：ジャングルエリア (Pattern C)",
                question: "【問題】\nジャングルパドックの壁に貼られた警告プレートには、背中に大きな板状の突起を持つ恐竜が描かれている。\n\nこの恐竜の名前は何か？\n\n※カタカナで入力せよ",
                answers: ["ステゴサウルス", "ステゴ"],
                hint: "ヒント：背中の骨板が特徴的。名前は「屋根トカゲ」を意味する。",
                explanation: "正解は「ステゴサウルス」。ジュラ紀後期の剣竜で、背中の骨板は体温調節に使われたと考えられている。"
            }
        ]
    },
    // ========== 二区画：RIVER ==========
    {
        id: 1,
        name: "二区画",
        shortName: "二区画",
        areaName: "RIVER AREA",
        icon: "🐊",
        instructions: "【二区画 調査指示書】\n\n2階 201教室前のリバーエリアへ向かえ。\n\n川辺の調査ポイントに隠された古代生物の痕跡を探し出せ。\n\nヒント：水辺に生息する爬虫類に注目。",
        patterns: [
            {
                patternName: "A",
                title: "二区画：リバーエリア (Pattern A)",
                question: "【問題】\nリバーエリアの展示には、ジュラ紀の海を支配した巨大な海生爬虫類の化石が展示されている。\n\n長い首と大きなヒレを持つこの生物の名前は？\n\n※カタカナで入力せよ",
                answers: ["プレシオサウルス", "プレシオ"],
                hint: "ヒント：「首長竜」とも呼ばれる。ネッシーの正体だと言われることもある。",
                explanation: "正解は「プレシオサウルス」。ジュラ紀の海に生息した海生爬虫類で、4つのヒレを使って泳いでいた。"
            },
            {
                patternName: "B",
                title: "二区画：リバーエリア (Pattern B)",
                question: "【問題】\nリバーエリアのパネルには、現代のワニに似た姿を持つ古代爬虫類が描かれている。\n\nジュラ紀に水辺で獲物を待ち伏せていたこの生物は？\n\n※カタカナで入力せよ",
                answers: ["サルコスクス", "サルコ"],
                hint: "ヒント：「肉ワニ」という意味の名前を持つ。全長は10メートルを超える。",
                explanation: "正解は「サルコスクス」。白亜紀前期に生息した巨大なワニの仲間で、恐竜さえも捕食したと考えられている。"
            },
            {
                patternName: "C",
                title: "二区画：リバーエリア (Pattern C)",
                question: "【問題】\nリバーエリアの展示で、小さな貝の化石が多数見つかっている。\n\nジュラ紀の浅い海に生息していた、螺旋状の殻を持つこの生物の総称は？\n\n※カタカナで入力せよ",
                answers: ["アンモナイト", "アンモ"],
                hint: "ヒント：巻き貝のような形をした化石。名前は古代エジプトの神にちなむ。",
                explanation: "正解は「アンモナイト」。ジュラ紀から白亜紀にかけて繁栄した頭足類で、示準化石として地質学で重要。"
            }
        ]
    },
    // ========== 三区画：AVIARY ==========
    {
        id: 2,
        name: "三区画",
        shortName: "三区画",
        areaName: "AVIARY AREA",
        icon: "🦅",
        instructions: "【三区画 調査指示書】\n\n3階 301教室前のアビアリー（鳥小屋）エリアへ向かえ。\n\n空を飛ぶ古代生物の展示を調査し、飛行コードを解読せよ。\n\nヒント：恐竜から進化した生物に注目。",
        patterns: [
            {
                patternName: "A",
                title: "三区画：アビアリーエリア (Pattern A)",
                question: "【問題】\nアビアリーの展示には、翼を広げると10メートルを超える巨大な飛行爬虫類が展示されている。\n\nこの空の支配者の名前は？\n\n※カタカナで入力せよ",
                answers: ["ケツァルコアトルス", "ケツァル"],
                hint: "ヒント：アステカ神話の羽毛の蛇の神にちなんで名付けられた。",
                explanation: "正解は「ケツァルコアトルス」。白亜紀後期に生息した史上最大級の飛行生物で、翼開長は10〜12メートル。"
            },
            {
                patternName: "B",
                title: "三区画：アビアリーエリア (Pattern B)",
                question: "【問題】\nアビアリーの展示パネルで、鳥類の祖先と考えられている小型の肉食恐竜が紹介されている。\n\n羽毛を持ち、木の枝で生活していたとされるこの恐竜は？\n\n※カタカナで入力せよ",
                answers: ["ミクロラプトル", "ミクロ"],
                hint: "ヒント：名前は「小さな泥棒」を意味する。4枚の翼を持っていた。",
                explanation: "正解は「ミクロラプトル」。白亜紀前期の小型獣脚類で、前肢と後肢の両方に翼があった。"
            },
            {
                patternName: "C",
                title: "三区画：アビアリーエリア (Pattern C)",
                question: "【問題】\nアビアリーの展示で、白亜紀の空を飛んでいた爬虫類のグループ名が問われている。\n\n恐竜とは異なる系統の飛行爬虫類の総称は？\n\n※カタカナで入力せよ",
                answers: ["プテラノドン", "プテラ"],
                hint: "ヒント：翼指竜（よくしりゅう）とも呼ばれる。「翼のある指」という意味。",
                explanation: "正解は「プテラノドン」。白亜紀後期の翼竜で、頭の後ろに長いトサカを持つのが特徴。"
            }
        ]
    },
    // ========== 四区画：LAB ==========
    {
        id: 3,
        name: "四区画",
        shortName: "四区画",
        areaName: "LAB AREA",
        icon: "🧬",
        instructions: "【四区画 調査指示書】\n\n4階 401教室前のラボエリアへ向かえ。\n\n研究施設のデータベースにアクセスし、遺伝子コードを解読せよ。\n\nヒント：DNAと恐竜の関係について考えよ。",
        patterns: [
            {
                patternName: "A",
                title: "四区画：ラボエリア (Pattern A)",
                question: "【問題】\nラボの展示パネルには、恐竜のDNAを復元する研究について説明されている。\n\nジュラシック・ワールドの物語で、DNAの欠損を補うために使われた現代の生物は？\n\n※カタカナで入力せよ",
                answers: ["カエル", "アフリカツメガエル"],
                hint: "ヒント：両生類の一種。水辺に生息し、卵を産む。",
                explanation: "正解は「カエル」。映画では恐竜のDNAの欠損部分を補うためにカエルのDNAが使用された。"
            },
            {
                patternName: "B",
                title: "四区画：ラボエリア (Pattern B)",
                question: "【問題】\nラボの展示で、遺伝子情報を保存する生体分子の名前が問われている。\n\n二重らせん構造を持つこの分子は？\n\n※アルファベット3文字で入力せよ",
                answers: ["DNA", "ＤＮＡ", "dna"],
                hint: "ヒント：デオキシリボ核酸の略称。",
                explanation: "正解は「DNA」。すべての生物の設計図となる分子で、アデニン・チミン・グアニン・シトシンの4つの塩基で構成される。"
            },
            {
                patternName: "C",
                title: "四区画：ラボエリア (Pattern C)",
                question: "【問題】\nラボの研究資料に、恐竜が絶滅した原因についての記述がある。\n\n約6600万年前に起こったとされる、恐竜絶滅の主な原因は？\n\n※カタカナで入力せよ",
                answers: ["隕石衝突", "いんせきしょうとつ", "小惑星衝突"],
                hint: "ヒント：巨大な天体が地球に落下した。メキシコのユカタン半島に痕跡がある。",
                explanation: "正解は「隕石衝突」。チクシュルーブ・クレーターを形成した小惑星の衝突が、恐竜を含む多くの生物の大量絶滅を引き起こした。"
            }
        ]
    },
    // ========== FINAL ==========
    {
        id: 4,
        name: "FINAL",
        shortName: "FINAL",
        areaName: "FINAL MISSION",
        icon: "🏆",
        instructions: "【FINAL MISSION 最終指令】\n\nすべての区画調査が完了した。\n\n1階ホールの本部に戻り、最終問題に挑戦せよ。\n\n集めたすべての手がかりを組み合わせ、ISLA NUBLARの謎を解き明かせ！",
        patterns: [
            {
                patternName: "A",
                title: "FINAL MISSION (Pattern A)",
                question: "【最終問題】\n\nこれまでの調査で、あなたはジュラシック・ワールドの様々な恐竜について学んできた。\n\n映画『ジュラシック・パーク』で、最も象徴的な肉食恐竜として描かれた恐竜の名前は？\n\n※カタカナで入力せよ",
                answers: ["ティラノサウルス", "ティラノ", "Tレックス", "T-REX"],
                hint: "ヒント：名前は「暴君トカゲ」を意味する。白亜紀最強の捕食者。",
                explanation: "正解は「ティラノサウルス」。全長約12メートル、体重約8トンの史上最大級の肉食恐竜。その名前は「暴君トカゲ」を意味する。"
            },
            {
                patternName: "B",
                title: "FINAL MISSION (Pattern B)",
                question: "【最終問題】\n\nすべての調査区画を踏破したあなたに、最後の謎が提示される。\n\nジュラシック・ワールドのテーマである「生命は道を見つける」という言葉。\n\nこの言葉を最初に語った映画のキャラクターは誰か？\n\n※カタカナで入力せよ",
                answers: ["マルコム", "イアンマルコム", "イアン・マルコム"],
                hint: "ヒント：カオス理論の数学者。演じたのはジェフ・ゴールドブラム。",
                explanation: "正解は「イアン・マルコム」。カオス理論の専門家として、恐竜テーマパークの危険性を最初から警告していた。"
            },
            {
                patternName: "C",
                title: "FINAL MISSION (Pattern C)",
                question: "【最終問題】\n\n探検の集大成として、ISLA NUBLAR（ヌブラル島）の名前の意味が問われる。\n\n「Nublar」はスペイン語で何を意味するか？\n\n※カタカナで入力せよ",
                answers: ["雲", "くも", "クラウド"],
                hint: "ヒント：空に浮かぶ白いもの。スペイン語の「nube」に由来する。",
                explanation: "正解は「雲」。ISLA NUBLARは「雲の島」という意味で、霧に覆われた島の様子から名付けられた。"
            }
        ]
    }
];

// ==================== 定数 ====================
const ADMIN_PASSWORD = "admin";
const STORAGE_KEY = "jw_expedition_data";
const LOCK_CODE = "JW-SEC-001";
const TOTAL_SECTORS = 4; // FINALを含まない通常区画数

// ==================== 状態管理 ====================
let gameState = {
    teamName: "",
    currentSector: 0, // 現在の区画インデックス
    clearedSectors: [], // クリア済み区画のインデックス配列
    selectedPatterns: {}, // { sectorIndex: patternIndex }
    isLocked: false,
    gamePhase: "registration", // "registration" | "playing" | "completed"
    completedAt: null,
    quizInProgress: false,
    currentQuizPattern: null,
    hintShown: false,
    violationCount: 0,
    lastVisibilityChange: 0,
    isFullscreen: false,
    adminAuthenticated: false,
};

// ==================== DOM要素の参照 ====================
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// ==================== 初期化 ====================
document.addEventListener("DOMContentLoaded", () => {
    loadGameState();
    setupEventListeners();
    setupSecurity();
    renderAll();
    checkScreenSize();
});

// ==================== ローカルストレージ ====================
function saveGameState() {
    try {
        const data = JSON.stringify(gameState);
        localStorage.setItem(STORAGE_KEY, data);
    } catch (e) {
        console.warn("localStorage save failed:", e);
    }
}

function loadGameState() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed && typeof parsed === "object") {
                gameState = { ...gameState, ...parsed };
            }
        }
    } catch (e) {
        console.warn("localStorage load failed:", e);
    }
}

function clearGameState() {
    gameState = {
        teamName: "",
        currentSector: 0,
        clearedSectors: [],
        selectedPatterns: {},
        isLocked: false,
        gamePhase: "registration",
        completedAt: null,
        quizInProgress: false,
        currentQuizPattern: null,
        hintShown: false,
        violationCount: 0,
        lastVisibilityChange: 0,
        isFullscreen: false,
        adminAuthenticated: false,
    };
    saveGameState();
}

// ==================== セキュリティ機能 ====================
function setupSecurity() {
    // 右クリック禁止
    document.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        return false;
    });

    // テキスト選択・コピー禁止
    document.addEventListener("copy", (e) => {
        e.preventDefault();
        return false;
    });

    document.addEventListener("cut", (e) => {
        e.preventDefault();
        return false;
    });

    document.addEventListener("selectstart", (e) => {
        if (!e.target.classList.contains("quiz-answer-input") &&
            !e.target.classList.contains("team-name-input") &&
            !e.target.classList.contains("admin-password-input")) {
            e.preventDefault();
        }
    });

    // キーボードショートカット禁止（F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U など）
    document.addEventListener("keydown", (e) => {
        // F12
        if (e.key === "F12") {
            e.preventDefault();
            triggerSecurityViolation("F12キーが押されました");
            return false;
        }
        // Ctrl+Shift+I / Cmd+Option+I
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "I" || e.key === "i")) {
            e.preventDefault();
            triggerSecurityViolation("開発者ツールが開かれました");
            return false;
        }
        // Ctrl+Shift+J / Cmd+Option+J
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "J" || e.key === "j")) {
            e.preventDefault();
            triggerSecurityViolation("開発者コンソールが開かれました");
            return false;
        }
        // Ctrl+U / Cmd+U
        if ((e.ctrlKey || e.metaKey) && (e.key === "U" || e.key === "u")) {
            e.preventDefault();
            triggerSecurityViolation("ソースコード表示が試行されました");
            return false;
        }
        // Ctrl+S / Cmd+S
        if ((e.ctrlKey || e.metaKey) && (e.key === "S" || e.key === "s")) {
            e.preventDefault();
            return false;
        }
        // Ctrl+P / Cmd+P
        if ((e.ctrlKey || e.metaKey) && (e.key === "P" || e.key === "p")) {
            e.preventDefault();
            return false;
        }
    });

    // Page Visibility API - タブ切り替え検知
    document.addEventListener("visibilitychange", () => {
        const now = Date.now();
        // 誤爆防止: 500ms以内の連続イベントは無視
        if (now - gameState.lastVisibilityChange < 500) {
            return;
        }
        gameState.lastVisibilityChange = now;

        if (document.hidden) {
            // フルスクリーン遷移中の一時的なhiddenを許容
            // iOS Safariのフルスクリーンや、ソフトウェアキーボード起因のイベントを除外
            if (!isTransitioningFullscreen()) {
                triggerSecurityViolation("画面が離脱しました");
            }
        }
    });

    // ウィンドウのフォーカス喪失
    window.addEventListener("blur", () => {
        const now = Date.now();
        if (now - gameState.lastVisibilityChange < 500) return;
        gameState.lastVisibilityChange = now;
        // フルスクリーン遷移中や、入力フィールドのフォーカス移動は許容
        if (!isTransitioningFullscreen() && gameState.gamePhase === "playing" && !gameState.isLocked) {
            triggerSecurityViolation("ウィンドウのフォーカスが外れました");
        }
    });

    // タッチデバイスのスワイプによる戻る操作防止
    window.addEventListener("popstate", (e) => {
        e.preventDefault();
        triggerSecurityViolation("ブラウザの戻る操作が検出されました");
    });

    // iOSのジェスチャーによるズーム防止
    document.addEventListener("gesturestart", (e) => {
        e.preventDefault();
    });

    document.addEventListener("gesturechange", (e) => {
        e.preventDefault();
    });

    document.addEventListener("gestureend", (e) => {
        e.preventDefault();
    });
}

function isTransitioningFullscreen() {
    // フルスクリーンAPIの遷移中かどうかを判定
    const doc = document;
    return !!(doc.fullscreenElement !== null && doc.fullscreenElement === undefined) ||
        document.webkitFullscreenElement !== undefined ||
        document.fullscreenElement !== undefined;
}

function triggerSecurityViolation(reason) {
    if (gameState.isLocked) return;
    if (gameState.gamePhase !== "playing") return;

    gameState.violationCount++;
    gameState.isLocked = true;
    saveGameState();
    showLockScreen();
    console.warn("SECURITY VIOLATION:", reason);
}

function showLockScreen() {
    const lockScreen = $("#lockScreen");
    const dashboard = $("#dashboard");
    const registrationModal = $("#registrationModal");
    const quizModal = $("#quizModal");
    const resultModal = $("#resultModal");
    const howToModal = $("#howToModal");
    const warningModal = $("#warningModal");
    const completionModal = $("#completionModal");

    // すべてのモーダルを閉じる
    [quizModal, resultModal, howToModal, warningModal, completionModal].forEach(m => {
        if (m) m.classList.add("hidden");
    });

    if (registrationModal) registrationModal.classList.add("hidden");
    if (dashboard) dashboard.classList.add("hidden");
    if (lockScreen) lockScreen.classList.remove("hidden");

    // ロックコードを表示
    const lockCodeDisplay = $("#lockCodeDisplay");
    if (lockCodeDisplay) {
        lockCodeDisplay.textContent = `CODE: ${LOCK_CODE} (違反回数: ${gameState.violationCount})`;
    }
}

function hideLockScreen() {
    const lockScreen = $("#lockScreen");
    if (lockScreen) lockScreen.classList.add("hidden");
    gameState.isLocked = false;
    gameState.lastVisibilityChange = Date.now();
    saveGameState();
    renderAll();
}

// ==================== フルスクリーン制御 ====================
function requestFullscreen() {
    const el = document.documentElement;
    if (el.requestFullscreen) {
        el.requestFullscreen().catch(() => {
            gameState.isFullscreen = false;
        });
    } else if (el.webkitRequestFullscreen) {
        el.webkitRequestFullscreen();
    } else if (el.msRequestFullscreen) {
        el.msRequestFullscreen();
    } else {
        // フルスクリーン非対応（iOS Safariなど）
        gameState.isFullscreen = false;
        console.log("Fullscreen API not supported - continuing without fullscreen");
    }
}

function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}

// ==================== イベントリスナー設定 ====================
function setupEventListeners() {
    // チーム登録
    $("#btnRegister")?.addEventListener("click", handleRegistration);
    $("#teamNameInput")?.addEventListener("keydown", (e) => {
        if (e.key === "Enter") handleRegistration();
    });

    // 遊び方・注意事項
    $("#btnHowTo")?.addEventListener("click", () => {
        $("#howToModal").classList.remove("hidden");
    });
    $("#btnCloseHowTo")?.addEventListener("click", () => {
        $("#howToModal").classList.add("hidden");
    });
    $("#btnWarning")?.addEventListener("click", () => {
        $("#warningModal").classList.remove("hidden");
    });
    $("#btnCloseWarning")?.addEventListener("click", () => {
        $("#warningModal").classList.add("hidden");
    });

    // アクションバー
    $("#btnPrevSector")?.addEventListener("click", handlePrevSector);
    $("#btnNextSector")?.addEventListener("click", handleNextSector);
    $("#btnQuiz")?.addEventListener("click", handleQuizButton);

    // クイズモーダル
    $("#btnCloseResult")?.addEventListener("click", () => {
        $("#resultModal").classList.add("hidden");
        if (gameState.gamePhase === "completed") {
            showCompletionModal();
        }
    });

    $("#btnCloseCompletion")?.addEventListener("click", () => {
        $("#completionModal").classList.add("hidden");
    });

    // 管理者
    $("#btnAdmin")?.addEventListener("click", openAdminModal);
    $("#btnCloseAdmin")?.addEventListener("click", closeAdminModal);
    $("#btnAdminLogin")?.addEventListener("click", handleAdminLogin);
    $("#adminPassword")?.addEventListener("keydown", (e) => {
        if (e.key === "Enter") handleAdminLogin();
    });
    $("#btnAdminUnlock")?.addEventListener("click", handleAdminUnlock);
    $("#btnAdminReset")?.addEventListener("click", handleAdminReset);

    // 確認ダイアログ
    $("#btnConfirmCancel")?.addEventListener("click", () => {
        $("#confirmModal").classList.add("hidden");
    });
    $("#btnConfirmOK")?.addEventListener("click", handleConfirmOK);
}

// ==================== チーム登録処理 ====================
function handleRegistration() {
    const input = $("#teamNameInput");
    const errorEl = $("#registrationError");
    const name = input.value.trim();

    if (!name) {
        errorEl.classList.remove("hidden");
        return;
    }

    errorEl.classList.add("hidden");
    gameState.teamName = name;
    gameState.currentSector = 0;
    gameState.clearedSectors = [];
    gameState.selectedPatterns = {};
    gameState.isLocked = false;
    gameState.gamePhase = "playing";
    gameState.completedAt = null;
    gameState.violationCount = 0;
    gameState.quizInProgress = false;
    gameState.currentQuizPattern = null;
    gameState.hintShown = false;

    // 各区画からランダムに1問ずつ抽選
    for (let i = 0; i < SECTOR_POOLS.length; i++) {
        const pool = SECTOR_POOLS[i];
        const patternCount = pool.patterns.length;
        const selectedIndex = Math.floor(Math.random() * patternCount);
        gameState.selectedPatterns[i] = selectedIndex;
    }

    saveGameState();

    // 登録モーダルを閉じる
    $("#registrationModal").classList.add("hidden");

    // フルスクリーン化
    requestFullscreen();

    renderAll();
}

// ==================== ナビゲーション処理 ====================
function handlePrevSector() {
    if (gameState.currentSector > 0) {
        gameState.currentSector--;
        gameState.quizInProgress = false;
        gameState.hintShown = false;
        saveGameState();
        renderAll();
    }
}

function handleNextSector() {
    const maxSector = SECTOR_POOLS.length - 1; // FINALを含む
    if (gameState.currentSector < maxSector) {
        // 次の区画が解放されているか確認
        if (gameState.currentSector < TOTAL_SECTORS) {
            // 通常区画（0-3）の場合は、現在の区画がクリア済みである必要がある
            if (!gameState.clearedSectors.includes(gameState.currentSector)) {
                return;
            }
        }
        gameState.currentSector++;
        gameState.quizInProgress = false;
        gameState.hintShown = false;
        saveGameState();
        renderAll();
    }
}

function handleQuizButton() {
    if (gameState.isLocked) return;
    if (gameState.gamePhase !== "playing") return;

    const sector = SECTOR_POOLS[gameState.currentSector];
    if (!sector) return;

    // 通常区画（FINALではない）の場合、すでにクリア済みか確認
    if (gameState.currentSector < TOTAL_SECTORS && gameState.clearedSectors.includes(gameState.currentSector)) {
        // すでにクリア済み
        openQuizModal(sector, true);
        return;
    }

    // FINAL区画の場合、すべての通常区画がクリアされているか確認
    if (gameState.currentSector === TOTAL_SECTORS) {
        if (gameState.clearedSectors.length < TOTAL_SECTORS) {
            alert("⚠️ すべての区画をクリアしてからFINALに挑戦してください。");
            return;
        }
    }

    openQuizModal(sector, false);
}

// ==================== クイズモーダル処理 ====================
function openQuizModal(sector, alreadyCleared = false) {
    const modal = $("#quizModal");
    const content = $("#quizContent");
    const footer = $("#quizModalFooter");
    const titleEl = $("#quizModalTitle");
    const subtitleEl = $("#quizModalSubtitle");
    const iconEl = $("#quizModalIcon");

    const patternIndex = gameState.selectedPatterns[gameState.currentSector];
    const pattern = sector.patterns[patternIndex];

    if (!pattern) {
        console.error("Pattern not found for sector", gameState.currentSector);
        return;
    }

    gameState.currentQuizPattern = pattern;
    gameState.quizInProgress = true;
    gameState.hintShown = false;

    titleEl.textContent = sector.name + " クイズ";
    subtitleEl.textContent = `${sector.areaName} - PATTERN ${pattern.patternName}`;
    iconEl.textContent = sector.icon;

    const isCleared = alreadyCleared || gameState.clearedSectors.includes(gameState.currentSector);

    let html = `
        <div class="quiz-pattern-badge">PATTERN ${pattern.patternName} / ${sector.areaName}</div>
        <div class="quiz-question">${escapeHtml(pattern.question)}</div>
        <div class="quiz-hint-section hidden" id="quizHintSection">
            <div class="quiz-hint-label">💡 ヒント</div>
            <div class="quiz-hint-text">${escapeHtml(pattern.hint)}</div>
        </div>
    `;

    if (isCleared) {
        html += `
            <div class="quiz-answer-section">
                <p style="text-align:center;color:var(--green-glow);font-weight:700;">✅ この区画はクリア済みです</p>
            </div>
        `;
        content.innerHTML = html;
        footer.innerHTML = `
            <button id="btnQuizClose" class="btn-modal btn-secondary">閉じる</button>
        `;
    } else {
        html += `
            <div class="quiz-answer-section">
                <input type="text" id="quizAnswerInput" class="quiz-answer-input" placeholder="答えを入力..." autocomplete="off" autocorrect="off" autocapitalize="characters" spellcheck="false">
                <div class="quiz-btn-group">
                    <button id="btnShowHint" class="btn-modal btn-hint">💡 ヒントを見る</button>
                    <button id="btnSubmitAnswer" class="btn-modal btn-primary btn-submit">回答する</button>
                </div>
            </div>
        `;
        content.innerHTML = html;
        footer.innerHTML = `
            <button id="btnQuizCancel" class="btn-modal btn-secondary">キャンセル</button>
        `;

        // イベントリスナー
        $("#btnShowHint")?.addEventListener("click", () => {
            gameState.hintShown = true;
            $("#quizHintSection").classList.remove("hidden");
        });

        $("#btnSubmitAnswer")?.addEventListener("click", handleAnswerSubmission);
        $("#quizAnswerInput")?.addEventListener("keydown", (e) => {
            if (e.key === "Enter") handleAnswerSubmission();
        });

        // フォーカス
        setTimeout(() => {
            $("#quizAnswerInput")?.focus();
        }, 300);
    }

    $("#btnQuizClose")?.addEventListener("click", () => {
        modal.classList.add("hidden");
        gameState.quizInProgress = false;
    });

    $("#btnQuizCancel")?.addEventListener("click", () => {
        modal.classList.add("hidden");
        gameState.quizInProgress = false;
    });

    modal.classList.remove("hidden");
}

function handleAnswerSubmission() {
    const input = $("#quizAnswerInput");
    if (!input) return;

    const userAnswer = input.value.trim();
    if (!userAnswer) {
        input.classList.add("incorrect");
        setTimeout(() => input.classList.remove("incorrect"), 500);
        return;
    }

    const pattern = gameState.currentQuizPattern;
    if (!pattern) return;

    const normalizedUser = normalizeAnswer(userAnswer);
    const isCorrect = pattern.answers.some(ans => normalizeAnswer(ans) === normalizedUser);

    if (isCorrect) {
        input.classList.add("correct");
        // 正解処理
        handleCorrectAnswer(pattern);
    } else {
        input.classList.add("incorrect");
        setTimeout(() => {
            input.classList.remove("incorrect");
            input.value = "";
            input.focus();
        }, 800);
        // 不正解のフィードバック
        showResultModal(false, pattern);
    }
}

function handleCorrectAnswer(pattern) {
    const sectorIndex = gameState.currentSector;
    if (sectorIndex < TOTAL_SECTORS) {
        // 通常区画のクリア
        if (!gameState.clearedSectors.includes(sectorIndex)) {
            gameState.clearedSectors.push(sectorIndex);
            gameState.clearedSectors.sort((a, b) => a - b);
        }
    } else {
        // FINALクリア
        gameState.gamePhase = "completed";
        gameState.completedAt = new Date().toISOString();
    }

    gameState.quizInProgress = false;
    gameState.hintShown = false;
    saveGameState();

    // クイズモーダルを閉じる
    $("#quizModal").classList.add("hidden");

    // 結果を表示
    showResultModal(true, pattern);

    // 完了の場合は完了モーダルを後で表示
    if (gameState.gamePhase === "completed") {
        // showResultModalのcloseで完了モーダルを表示する
    }

    renderAll();
}

function showResultModal(isCorrect, pattern) {
    const modal = $("#resultModal");
    const iconEl = $("#resultModalIcon");
    const titleEl = $("#resultModalTitle");
    const subtitleEl = $("#resultModalSubtitle");
    const content = $("#resultContent");

    if (isCorrect) {
        iconEl.textContent = "✅";
        titleEl.textContent = "正解！";
        titleEl.className = "correct-title";
        subtitleEl.textContent = "ACCESS GRANTED";
        content.innerHTML = `
            <div class="result-emoji">🎉</div>
            <div class="result-title correct-title">正解！</div>
            <div class="result-explanation">
                <div class="result-explanation-label">💡 解説</div>
                ${escapeHtml(pattern.explanation)}
            </div>
        `;
    } else {
        iconEl.textContent = "❌";
        titleEl.textContent = "不正解";
        titleEl.className = "incorrect-title";
        subtitleEl.textContent = "ACCESS DENIED";
        content.innerHTML = `
            <div class="result-emoji">😤</div>
            <div class="result-title incorrect-title">不正解</div>
            <div class="result-explanation">
                <div class="result-explanation-label">💡 ヒント</div>
                ${escapeHtml(pattern.hint)}
            </div>
            <p style="text-align:center;margin-top:8px;color:var(--text-muted);font-size:0.75rem;">
                もう一度挑戦してみよう！
            </p>
        `;
    }

    modal.classList.remove("hidden");
}

function showCompletionModal() {
    const modal = $("#completionModal");
    const codeEl = $("#completionCode");

    // クリアコードを生成（チーム名に基づく）
    const code = generateCompletionCode();
    codeEl.textContent = code;

    modal.classList.remove("hidden");
}

function generateCompletionCode() {
    const base = gameState.teamName.replace(/[^\w]/g, "").toUpperCase();
    const hash = simpleHash(base + gameState.completedAt);
    return `JW-${hash.slice(0, 6)}`;
}

function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash).toString(36).toUpperCase().padStart(6, "0");
}

// ==================== 入力正規化関数 ====================
function normalizeAnswer(input) {
    if (!input) return "";
    let normalized = input.trim();

    // 全角英数字→半角
    normalized = normalized.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (char) => {
        return String.fromCharCode(char.charCodeAt(0) - 0xFEE0);
    });

    // 全角カタカナ→半角カタカナ（解答はカタカナで扱うため、全角カタカナはそのまま保持）
    // 小文字→大文字（アルファベットの場合）
    normalized = normalized.toUpperCase();

    // 全角スペース→半角スペース
    normalized = normalized.replace(/\u3000/g, " ");

    // 連続スペースを1つに
    normalized = normalized.replace(/\s+/g, " ");

    // 前後のハイフン・ダッシュ正規化
    normalized = normalized.replace(/[－—–]/g, "-");

    // 長音記号の正規化（ーと−を統一）
    normalized = normalized.replace(/[−ー]/g, "ー");

    return normalized;
}

// ==================== HTMLエスケープ ====================
function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

// ==================== レンダリング ====================
function renderAll() {
    renderDashboard();
    renderSectorCards();
    renderStatusPanel();
    renderBriefing();
    updateActionButtons();
    updateAdminStatus();
}

function renderDashboard() {
    const dashboard = $("#dashboard");
    const registrationModal = $("#registrationModal");
    const lockScreen = $("#lockScreen");

    if (gameState.isLocked) {
        dashboard.classList.add("hidden");
        registrationModal.classList.add("hidden");
        lockScreen.classList.remove("hidden");
        return;
    }

    lockScreen.classList.add("hidden");

    if (gameState.gamePhase === "registration") {
        dashboard.classList.add("hidden");
        registrationModal.classList.remove("hidden");
    } else {
        registrationModal.classList.add("hidden");
        dashboard.classList.remove("hidden");

        // チーム名表示
        const teamNameDisplay = $("#teamNameDisplay");
        if (teamNameDisplay) {
            teamNameDisplay.textContent = gameState.teamName || "---";
        }
    }
}

function renderSectorCards() {
    const container = $("#sectorCards");
    if (!container) return;

    let html = "";

    SECTOR_POOLS.forEach((sector, index) => {
        const isCleared = gameState.clearedSectors.includes(index);
        const isCurrent = gameState.currentSector === index && gameState.gamePhase === "playing";
        const isUnlocked = isSectorUnlocked(index);
        const isFinal = index === TOTAL_SECTORS;

        let statusClass = "locked-status";
        let statusText = "🔒 未解放";
        let cardClass = "locked";

        if (isCleared) {
            statusClass = "cleared-status";
            statusText = "✓ クリア";
            cardClass = "cleared";
        } else if (isCurrent && isUnlocked) {
            statusClass = "active-status";
            statusText = "● 調査中";
            cardClass = "active";
        } else if (isUnlocked) {
            statusClass = "active-status";
            statusText = "○ 挑戦可能";
            cardClass = "";
        }

        if (isFinal && gameState.clearedSectors.length < TOTAL_SECTORS) {
            cardClass = "locked";
            statusClass = "locked-status";
            statusText = "🔒 未解放";
        }

        html += `
            <div class="sector-card ${cardClass}" data-sector-index="${index}">
                <span class="sector-card-icon">${sector.icon}</span>
                <span class="sector-card-name">${sector.shortName}</span>
                <span class="sector-card-area">${sector.areaName}</span>
                <span class="sector-card-status ${statusClass}">${statusText}</span>
            </div>
        `;
    });

    container.innerHTML = html;

    // カードクリックイベント
    container.querySelectorAll(".sector-card").forEach(card => {
        card.addEventListener("click", () => {
            const index = parseInt(card.dataset.sectorIndex);
            if (isSectorUnlocked(index) && gameState.gamePhase === "playing" && !gameState.isLocked) {
                gameState.currentSector = index;
                gameState.quizInProgress = false;
                gameState.hintShown = false;
                saveGameState();
                renderAll();
            }
        });
    });
}

function isSectorUnlocked(index) {
    if (index === 0) return true;
    if (index < TOTAL_SECTORS) {
        // 通常区画は前の区画がクリア済みである必要がある
        return gameState.clearedSectors.includes(index - 1);
    }
    if (index === TOTAL_SECTORS) {
        // FINALは全通常区画クリアが必要
        return gameState.clearedSectors.length >= TOTAL_SECTORS;
    }
    return false;
}

function renderStatusPanel() {
    const clearedCount = $("#clearedCount");
    const clueCount = $("#clueCount");

    if (clearedCount) {
        const count = gameState.clearedSectors.filter(i => i < TOTAL_SECTORS).length;
        clearedCount.textContent = `${count} / ${TOTAL_SECTORS}`;
    }
    if (clueCount) {
        clueCount.textContent = gameState.clearedSectors.length;
    }
}

function renderBriefing() {
    const content = $("#briefingContent");
    if (!content) return;

    if (gameState.gamePhase === "playing" && gameState.currentSector !== undefined) {
        const sector = SECTOR_POOLS[gameState.currentSector];
        if (sector) {
            content.textContent = sector.instructions;
            return;
        }
    }

    content.textContent = "システム準備完了。\nチーム登録を行ってください。";
}

function updateActionButtons() {
    const btnPrev = $("#btnPrevSector");
    const btnNext = $("#btnNextSector");
    const btnQuiz = $("#btnQuiz");

    if (!btnPrev || !btnNext || !btnQuiz) return;

    const canPrev = gameState.currentSector > 0 && gameState.gamePhase === "playing";
    const canNext = gameState.currentSector < SECTOR_POOLS.length - 1 &&
        gameState.gamePhase === "playing" &&
        (gameState.currentSector < TOTAL_SECTORS ?
            gameState.clearedSectors.includes(gameState.currentSector) :
            true);

    btnPrev.disabled = !canPrev;
    btnNext.disabled = !canNext;

    const sector = SECTOR_POOLS[gameState.currentSector];
    if (sector && gameState.currentSector < TOTAL_SECTORS && gameState.clearedSectors.includes(gameState.currentSector)) {
        btnQuiz.textContent = "✅ クリア済み - 確認する";
        btnQuiz.disabled = false;
    } else if (sector && gameState.currentSector === TOTAL_SECTORS && gameState.gamePhase === "completed") {
        btnQuiz.textContent = "🏆 完了！";
        btnQuiz.disabled = true;
    } else {
        btnQuiz.textContent = "クイズに挑戦する ➔";
        btnQuiz.disabled = gameState.gamePhase !== "playing";
    }
}

function updateAdminStatus() {
    const statusText = $("#adminStatusText");
    if (!statusText) return;

    if (gameState.isLocked) {
        statusText.textContent = "🔒 ロック中";
    } else if (gameState.gamePhase === "registration") {
        statusText.textContent = "📝 登録待ち";
    } else if (gameState.gamePhase === "playing") {
        statusText.textContent = `🎮 プレイ中 (${gameState.teamName})`;
    } else if (gameState.gamePhase === "completed") {
        statusText.textContent = "🏆 完了";
    } else {
        statusText.textContent = "---";
    }
}

// ==================== 管理者機能 ====================
function openAdminModal() {
    const modal = $("#adminModal");
    const actions = $("#adminActions");
    const passwordSection = $(".admin-password-section");
    const errorEl = $("#adminError");

    errorEl.classList.add("hidden");
    $("#adminPassword").value = "";

    if (gameState.adminAuthenticated) {
        actions.classList.remove("hidden");
        passwordSection.classList.add("hidden");
    } else {
        actions.classList.add("hidden");
        passwordSection.classList.remove("hidden");
    }

    updateAdminStatus();
    modal.classList.remove("hidden");
}

function closeAdminModal() {
    $("#adminModal").classList.add("hidden");
    gameState.adminAuthenticated = false;
    $("#adminActions").classList.add("hidden");
    $(".admin-password-section").classList.remove("hidden");
    $("#adminError").classList.add("hidden");
}

function handleAdminLogin() {
    const input = $("#adminPassword");
    const errorEl = $("#adminError");
    const password = input.value.trim();

    if (password === ADMIN_PASSWORD) {
        gameState.adminAuthenticated = true;
        errorEl.classList.add("hidden");
        $(".admin-password-section").classList.add("hidden");
        $("#adminActions").classList.remove("hidden");
        updateAdminStatus();
    } else {
        errorEl.classList.remove("hidden");
        input.value = "";
        input.focus();
    }
}

function handleAdminUnlock() {
    if (!gameState.adminAuthenticated) return;

    if (gameState.isLocked) {
        hideLockScreen();
        closeAdminModal();
    } else {
        alert("現在ロックされていません。");
    }
}

function handleAdminReset() {
    if (!gameState.adminAuthenticated) return;

    // 確認ダイアログを表示
    const confirmModal = $("#confirmModal");
    const confirmMessage = $("#confirmMessage");
    confirmMessage.textContent = "端末を初期化します。\nすべてのデータが消去され、次のチームが登録できる状態になります。\n\n本当に実行しますか？";
    confirmModal.classList.remove("hidden");

    // 確認ダイアログのOKボタンに処理を設定
    window._pendingConfirmAction = "reset";
}

function handleConfirmOK() {
    const action = window._pendingConfirmAction;
    if (action === "reset") {
        clearGameState();
        exitFullscreen();
        closeAdminModal();
        $("#confirmModal").classList.add("hidden");
        // すべてのモーダルを閉じる
        $$(".modal-overlay").forEach(m => m.classList.add("hidden"));
        $("#lockScreen").classList.add("hidden");
        renderAll();
    }
    window._pendingConfirmAction = null;
}

// ==================== 画面サイズチェック ====================
function checkScreenSize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    if (width < 300 || height < 400) {
        console.warn("Screen size too small for optimal experience");
    }
}

window.addEventListener("resize", checkScreenSize);

// ==================== 初期レンダリング ====================
renderAll();

// ==================== エクスポート（デバッグ用） ====================
if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        SECTOR_POOLS,
        normalizeAnswer,
        ADMIN_PASSWORD,
        TOTAL_SECTORS,
    };
}
