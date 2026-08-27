/* ==========================================================
   🔑 管理者パスコード
========================================================== */
const ADMIN_PASSWORD = "admin";

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
        answers: ["BRAK", "ブラキオ"],
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
   システム制御ロジック
========================================================== */
let teamName = localStorage.getItem("jw_team_name") || "";
let clearedList = JSON.parse(localStorage.getItem("jw_cleared_list") || "[]");
let currentSectorId = parseInt(localStorage.getItem("jw_current_id") || "0");
let isViolationLocked = localStorage.getItem("jw_violation_locked") === "true";
let isGameActive = false;

document.addEventListener("DOMContentLoaded", () => {
    bindAntiCheat();

    if (isViolationLocked) {
        triggerViolation();
        return;
    }

    if (!teamName) {
        renderTeamSetup();
    } else {
        isGameActive = true;
        initGame();
    }
});

function bindAntiCheat() {
    document.addEventListener("visibilitychange", () => {
        if (document.hidden && isGameActive && !isViolationLocked) {
            triggerViolation();
        }
    });

    document.addEventListener("contextmenu", e => e.preventDefault());
    document.addEventListener("copy", e => e.preventDefault());
    document.addEventListener("cut", e => e.preventDefault());

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

function triggerViolation() {
    isViolationLocked = true;
    localStorage.setItem("jw_violation_locked", "true");
    document.getElementById("securityLockScreen").style.display = "flex";
}

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

function normalizeText(str) {
    return str
        .trim()
        .toLowerCase()
        .replace(/[Ａ-Ｚａ-ｚ０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xFEE0))
        .replace(/\s+/g, "");
}

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
            <button type="button" class="btn-next-sector" onclick="startInvestigation()">ロックして調査を開始</button>
        </div>
    `;

    document.getElementById("teamInput").addEventListener("keypress", (e) => {
        if (e.key === "Enter") startInvestigation();
    });
}

function startInvestigation() {
    const input = document.getElementById("teamInput");
    if (!input || !input.value.trim()) {
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
    document.getElementById("statusBar").style.display = "flex";
    document.getElementById("lockIndicator").style.display = "inline-block";

    const maxUnlocked = clearedList.length;
    if (currentSectorId > maxUnlocked) {
        currentSectorId = maxUnlocked;
    }

    renderNavigation();
    renderSector(currentSectorId);
}

function renderNavigation() {
    const nav = document.getElementById("sectorNav");
    nav.innerHTML = "";
    const maxUnlocked = clearedList.length;

    SECTORS.forEach((sec, idx) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "nav-item";
        
        const isCleared = clearedList.includes(sec.id);
        const isCurrent = sec.id === currentSectorId;
        const isUnlocked = idx <= maxUnlocked;

        let icon = "🔒";
        if (isCleared) {
            icon = "✓";
            btn.classList.add("cleared");
        } else if (isUnlocked) {
            icon = "●";
        } else {
            btn.classList.add("locked");
        }

        if (isCurrent) btn.classList.add("active");

        btn.innerHTML = `<span>${icon}</span><span>${sec.shortName}</span>`;

        if (isUnlocked) {
            btn.onclick = () => {
                currentSectorId = sec.id;
                localStorage.setItem("jw_current_id", currentSectorId);
                renderNavigation();
                renderSector(currentSectorId);
            };
        }

        nav.appendChild(btn);
    });

    document.getElementById("progressCount").innerText = `${clearedList.length} / ${SECTORS.length} CLEARED`;
}

function renderSector(id) {
    const sec = SECTORS[id];
    const isCleared = clearedList.includes(sec.id);
    const main = document.getElementById("mainArea");
    const isLastSector = (id === SECTORS.length - 1);

    main.innerHTML = `
        <div class="sector-title-card">
            <div class="sector-name">${sec.title}</div>
            <span class="status-pill ${isCleared ? 'pill-cleared' : 'pill-investigating'}">
                ${isCleared ? '✓ 調査完了' : '● 調査中'}
            </span>
        </div>

        <div style="color: var(--jurassic-cyan); font-size:0.9rem; font-weight:bold; margin-bottom:12px;">
            📍 ${sec.location}
        </div>

        <div class="puzzle-card">${sec.question}</div>

        ${!isCleared ? `
            <div class="form-area">
                <div class="input-row">
                    <input type="text" id="answerInput" class="code-input" placeholder="回答・コードを入力" autocomplete="off">
                    <button type="button" class="btn-submit" onclick="submitAnswer()">送信</button>
                </div>
                <div id="errorAlert" class="error-alert">⚠ パスコードが一致しません。周囲の手がかりを再調査してください。</div>
            </div>
        ` : `
            <div class="cleared-action-box">
                <div class="msg">✓ この区画の調査データは認証完了しています！</div>
                ${!isLastSector ? `
                    <button type="button" class="btn-next-sector" onclick="goToNextSector()">次の区画へ進む →</button>
                ` : `
                    <div style="color: var(--jurassic-amber); font-weight:bold; font-size:1.1rem;">
                        🎉 全ての調査が完了しました！受付へ向かってください！
                    </div>
                `}
            </div>
        `}

        <div class="accordion-box">
            <details>
                <summary>💡 調査ヒントを確認する</summary>
                <div class="accordion-body">${sec.hint}</div>
            </details>
            ${isCleared ? `
                <details open>
                    <summary>📄 調査レポート・解説</summary>
                    <div class="accordion-body">${sec.explanation}</div>
                </details>
            ` : ''}
        </div>
    `;

    if (!isCleared) {
        document.getElementById("answerInput").addEventListener("keypress", (e) => {
            if (e.key === "Enter") submitAnswer();
        });
    }
}

function submitAnswer() {
    const input = document.getElementById("answerInput");
    const errorAlert = document.getElementById("errorAlert");
    if (!input) return;

    const userVal = normalizeText(input.value);
    const sec = SECTORS[currentSectorId];

    const isMatch = sec.answers.some(ans => normalizeText(ans) === userVal);

    if (isMatch) {
        errorAlert.style.display = "none";
        if (!clearedList.includes(sec.id)) {
            clearedList.push(sec.id);
            localStorage.setItem("jw_cleared_list", JSON.stringify(clearedList));
        }
        showSuccessModal(sec);
    } else {
        errorAlert.style.display = "block";
    }
}

function showSuccessModal(sec) {
    const modal = document.getElementById("modalLayer");
    const title = document.getElementById("modalTitle");
    const desc = document.getElementById("modalDesc");
    const btn = document.getElementById("modalBtn");

    if (sec.id === SECTORS.length - 1) {
        title.innerText = "🦖 MISSION COMPLETE!";
        title.style.color = "var(--jurassic-amber)";
        desc.innerText = `チーム【${teamName}】の皆さん、お見事です！\n全区画のセキュリティ再起動に成功しました。\n\n端末を持ったまま【本部受付】へ向かい、クリアの証を受け取ってください！`;
        btn.innerText = "最終結果画面へ";
    } else {
        title.innerText = "ACCESS GRANTED";
        title.style.color = "var(--jurassic-green)";
        const nextSec = SECTORS[sec.id + 1];
        desc.innerText = `【${sec.name}】の調査データを取得しました！\n\n次の区画のアクセス制限が解除されました。\n${nextSec.location}`;
        btn.innerText = `「${nextSec.shortName}」へ進む`;
    }

    modal.style.display = "flex";
}

function nextFromModal() {
    document.getElementById("modalLayer").style.display = "none";
    goToNextSector();
}

function goToNextSector() {
    if (currentSectorId < SECTORS.length - 1) {
        currentSectorId++;
        localStorage.setItem("jw_current_id", currentSectorId);
    }
    renderNavigation();
    renderSector(currentSectorId);
}

/* ==========================================================
   管理者モーダル操作
========================================================== */
function openAdminModal() {
    const modal = document.getElementById("adminModalLayer");
    document.getElementById("adminPasswordInput").value = "";
    document.getElementById("adminErrorMsg").style.display = "none";
    modal.style.display = "flex";
    setTimeout(() => document.getElementById("adminPasswordInput").focus(), 100);
}

function closeAdminModal() {
    document.getElementById("adminModalLayer").style.display = "none";
}

function verifyAdmin(actionType) {
    const pass = document.getElementById("adminPasswordInput").value;
    const errorMsg = document.getElementById("adminErrorMsg");

    if (pass === ADMIN_PASSWORD) {
        closeAdminModal();

        if (actionType === "resume") {
            isViolationLocked = false;
            localStorage.removeItem("jw_violation_locked");
            document.getElementById("securityLockScreen").style.display = "none";
            enterFullscreen();
        } else if (actionType === "reset") {
            exitFullscreen();
            localStorage.clear();
            teamName = "";
            clearedList = [];
            currentSectorId = 0;
            isViolationLocked = false;
            document.getElementById("securityLockScreen").style.display = "none";
            renderTeamSetup();
        }
    } else {
        errorMsg.style.display = "block";
    }
}
