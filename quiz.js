/* ==========================================================
   🔑 セキュリティ設定
========================================================== */
const ADMIN_PASSWORD = "admin"; // 管理者解除パスコード

/* ==========================================================
   🟩 問題データ設定エリア 🟩
========================================================== */
const SECTORS = [
    {
        id: 0,
        name: "第1区画",
        shortName: "第1区画",
        title: "第1区画：草食恐竜エリア (HERBIVORE)",
        location: "【移動先】1階 101教室前へ向かってください",
        question: "【調査ミッション 01】\n現地の展示パネルに隠された暗号を解読せよ。\n\n『巨大な首の影が指す方角にある4文字の英単語を入力せよ』",
        answers: ["BRAK", "ブラキオ"], // 半角・全角・大文字小文字は自動判定
        hint: "展示パネル右下の矢印の先にあるアルファベットを順に読んでみよう。",
        explanation: "正解は「BRAK」でした！草食恐竜のDNAサンプル回収に成功しました。"
    },
    {
        id: 1,
        name: "第2区画",
        shortName: "第2区画",
        title: "第2区画：遺伝子研究ラボ (LABORATORY)",
        location: "【移動先】2階 生徒会室前へ向かってください",
        question: "【調査ミッション 02】\n培養ポッドのセキュリティコードを特定せよ。\n\n『琥珀のDNA配列から欠落している恐竜のコードネームは？』",
        answers: ["RAPTOR", "ラプター"],
        hint: "ポッドの側面に貼られた「A-T-G-C」の変換表をチェック！",
        explanation: "正解は「RAPTOR」でした！小型肉食恐竜の隔離フェンスコードを取得しました。"
    },
    {
        id: 2,
        name: "第3区画",
        shortName: "第3区画",
        title: "第3区画：翼竜観測ドーム (AVIARY)",
        location: "【移動先】2階 渡り廊下へ向かってください",
        question: "【調査ミッション 03】\n上空を旋回する翼竜の監視カメラデータを解析せよ。\n\n『監視カメラNo.12、No.25、No.40の数字の合計を入力せよ』",
        answers: ["77"],
        hint: "掲示された3枚の写真に小さく書かれた番号を足し算してみよう。",
        explanation: "正解は「77」でした！ドーム天井のシャッターが開放されました。"
    },
    {
        id: 3,
        name: "第4区画",
        shortName: "第4区画",
        title: "第4区画：T-REX キングダム (CARNIVORE)",
        location: "【移動先】3階 体育館前特設エリアへ向かってください",
        question: "【調査ミッション 04】\n肉食恐竜エリアの高圧電流フェンスを再起動せよ。\n\n『足跡の化石に刻まれたアルファベット3文字を入力せよ』",
        answers: ["REX", "レックス"],
        hint: "地面の足跡プレートをかかとから爪先へ向かって読んでみよう。",
        explanation: "正解は「REX」でした！メインフェンスの電力が安全に復旧しました。"
    },
    {
        id: 4,
        name: "FINAL",
        shortName: "FINAL",
        title: "最終区画：中央制御タワー (CONTROL CENTER)",
        location: "【移動先】1階 本部受付へ向かってください",
        question: "【最終ミッション】\nパーク全体の制御システムを完全再起動せよ！\n\n『第1〜第4区画の答えの【頭文字】を順番に並べて入力せよ！』\n（例：BRAK → B）",
        answers: ["BR7R", "BRAR"],
        hint: "第1〜第4区画の正解（BRAK, RAPTOR, 77, REX）の頭文字を並べよう。",
        explanation: "全システム再起動成功！パークの全恐竜の隔離が完了し、完全脱出ルートが開かれました！"
    }
];

/* ==========================================================
   システム状態管理
========================================================== */
let teamName = localStorage.getItem("jw_team_name") || "";
let clearedList = JSON.parse(localStorage.getItem("jw_cleared_list") || "[]");
let currentSectorId = parseInt(localStorage.getItem("jw_current_id") || "0");
let isViolationLocked = localStorage.getItem("jw_violation_locked") === "true";
let isGameActive = false;
let isInputFocused = false; // キーボード入力中の誤判定防止フラグ

window.onload = () => {
    bindAntiCheatEvents();

    if (isViolationLocked) {
        triggerSecurityViolation();
        return;
    }

    if (!teamName) {
        renderTeamSetup();
    } else {
        isGameActive = true;
        initGame();
    }
};

/* ==========================================================
   🛡️ 不正検知（誤爆防止チューニング済み）
========================================================== */
function bindAntiCheatEvents() {
    // 1. Page Visibility API（タブ切り替え・バックグラウンド移行の検知）
    document.addEventListener("visibilitychange", () => {
        if (document.hidden && isGameActive && !isViolationLocked) {
            triggerSecurityViolation();
        }
    });

    // 2. 右クリック・コピー・カット禁止
    document.addEventListener("contextmenu", e => e.preventDefault());
    document.addEventListener("copy", e => e.preventDefault());
    document.addEventListener("cut", e => e.preventDefault());

    // 3. 不正ショートカットキー禁止
    document.addEventListener("keydown", (e) => {
        if (
            e.key === "F12" ||
            (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J" || e.key === "C")) ||
            (e.ctrlKey && (e.key === "u" || e.key === "U" || e.key === "s" || e.key === "S"))
        ) {
            e.preventDefault();
            return false;
        }
    });
}

function triggerSecurityViolation() {
    isViolationLocked = true;
    localStorage.setItem("jw_violation_locked", "true");
    document.getElementById("securityLockScreen").style.display = "flex";
}

// フルスクリーン（対応端末のみ安全に実行）
function enterFullscreen() {
    const el = document.documentElement;
    try {
        if (el.requestFullscreen) {
            el.requestFullscreen().catch(() => {});
        } else if (el.webkitRequestFullscreen) {
            el.webkitRequestFullscreen();
        }
    } catch (e) {}
}

function exitFullscreen() {
    try {
        if (document.exitFullscreen) {
            document.exitFullscreen().catch(() => {});
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    } catch (e) {}
}

/* ==========================================================
   文字列正規化（全角/半角/大文字小文字の自動吸収）
========================================================== */
function normalizeText(str) {
    return str
        .trim()
        .toLowerCase()
        // 全角英数を半角に変換
        .replace(/[Ａ-Ｚａ-ｚ０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xFEE0))
        // 全角スペースを半角スペースにして除去
        .replace(/\s+/g, "");
}

/* ==========================================================
   ゲーム進行ロジック
========================================================== */
function renderTeamSetup() {
    isGameActive = false;
    document.getElementById("teamBadge").innerText = "SETUP REQUIRED";
    document.getElementById("sectorNav").style.display = "none";
    document.getElementById("statusBar").style.display = "none";
    document.getElementById("lockIndicator").style.display = "none";

    const main = document.getElementById("mainArea");
    main.innerHTML = `
        <div class="setup-screen">
            <h2>🦖 調査端末初期設定</h2>
            <p>担当する調査チーム名を入力して、ロックモードを開始してください。</p>
            <div class="lock-warning-card">
                🔒 <strong>端末ロックモードが作動します</strong><br>
                ・調査中の別タブ閲覧や画面の切り替えは禁止されています。<br>
                ・画面から離れるとセキュリティロックが発動します。
            </div>
            <div class="input-row" style="margin-bottom:16px;">
                <input type="text" id="teamInput" class="code-input" placeholder="例: チームA / 2班" style="text-align:center;">
            </div>
            <button class="btn-next-sector" onclick="startInvestigation()">ロックして調査を開始</button>
        </div>
    `;
}

function startInvestigation() {
    const input = document.getElementById("teamInput");
    if (!input.value.trim()) {
        alert("チーム名を入力してください！");
        return;
    }
    teamName = input.value.trim();
    localStorage.setItem("jw_team_name", teamName);

    isGameActive = true;
    enterFullscreen();
    initGame();
}

function initGame() {
    document.getElementById("teamBadge").innerText = `TEAM: ${teamName}`;
    document.getElementById("sectorNav").style.display = "flex";
    document.getElementById("statusBar").style
