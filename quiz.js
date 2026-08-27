/* =========================================================================
   ISLA NUBLAR RESEARCH LAB — QUIZ EXPEDITION
   quiz.js (完全版・スコア＆2種QR対応)
   ========================================================================= */

const CONFIG = {
  STORAGE_KEY: 'jw_quiz_expedition_state_v1',
  ADMIN_PASSCODE: 'admin', // ★ 必ず変更してください
  SECTOR_COUNT: 4,
};

/* ★★★ SECTOR_POOLS / FINAL_SECTOR は前回と同じ（スペース省略のため割愛）★★★ */
// 実際のファイルには下記の全データを含めてください。
const SECTOR_POOLS = [ /* ... 全区画データ ... */ ];
const FINAL_SECTOR = { /* ... FINALデータ ... */ };

/* ============================== 状態管理 =============================== */
function createDefaultState() {
  return {
    teamName: '',
    createdAt: null,
    selectedPatterns: [],
    clearedSectors: 0,
    clues: [],
    wrongAttempts: [0,0,0,0],
    finalCleared: false,
    completedAt: null,
    locked: false,
    lockReason: '',
  };
}
let state = createDefaultState();
let viewIndex = 0;

function loadState() { /* 前回と同じ */ }
function saveState() { /* 前回と同じ */ }
function clearState() { /* 前回と同じ */ }

/* ============================ 入力正規化 ============================ */
function normalizeAnswer(input) { /* 前回と同じ */ }
function isCorrectAnswer(pattern, rawInput) { /* 前回と同じ */ }

/* ============================ セキュリティ ============================ */
let securityArmed = false;
let adminActionInProgress = false;
function enterFullscreenSafe() { /* 前回と同じ */ }
function exitFullscreenSafe() { /* 前回と同じ */ }
function armSecurity() { /* 前回と同じ */ }
function disarmSecurity() { /* 前回と同じ */ }
function triggerViolation(reason) { /* 前回と同じ */ }
function attachSecurityListeners() { /* 前回と同じ */ }

/* ============================ ADMIN ============================ */
let adminAuthenticated = false;
function openAdminModal() { /* 前回と同じ */ }
function closeAdminModal() { /* 前回と同じ */ }
function submitAdminPasscode() { /* 前回と同じ */ }
function adminUnlock() { /* 前回と同じ */ }
function adminResetDevice() { /* 前回と同じ */ }

/* ============================ UI描画 ============================ */
function showScreen(name) { /* 前回と同じ */ }
function showLockScreen() { /* 前回と同じ */ }
function hideLockScreen() { /* 前回と同じ */ }
function maxViewIndex() { /* 前回と同じ */ }
function getSectorForIndex(idx) { /* 前回と同じ */ }
function renderTeamName() { /* 前回と同じ */ }
function renderBriefingPanel() { /* 前回と同じ */ }
function renderStatusPanel() { /* 前回と同じ */ }
function sectorCardStateClass(idx) { /* 前回と同じ */ }
function renderSectorCards() { /* 前回と同じ */ }
function renderActionBar() { /* 前回と同じ */ }
function renderAll() { /* 前回と同じ */ }

/* ============================ クイズ ============================ */
function openQuizModal() { /* 前回と同じ */ }
function closeQuizModal() { /* 前回と同じ */ }
function submitQuizAnswer() { /* 前回と同じ */ }
function openFinalModal() { /* 前回と同じ */ }
function closeFinalModal() { /* 前回と同じ */ }
function submitFinalAnswer() { /* 前回と同じ */ }

/* ============================ スコア計算 ============================ */
function calculateScore(ms) {
  const seconds = ms / 1000;
  if (seconds < 180) return 30000;      // 3分未満
  if (seconds < 300) return 25000;      // 5分未満
  if (seconds < 420) return 20000;      // 7分未満
  if (seconds < 600) return 15000;      // 10分未満
  if (seconds < 900) return 10000;      // 15分未満
  return 5000;                          // 15分以上
}

/* ============================ 完了画面 ============================ */
function formatDuration(ms) {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}分${String(s).padStart(2, '0')}秒`;
}

function renderCompleteScreen() {
  document.getElementById('complete-team-name').textContent = state.teamName;
  const duration = state.completedAt && state.createdAt ? state.completedAt - state.createdAt : 0;
  const score = calculateScore(duration);
  
  document.getElementById('complete-duration').textContent = formatDuration(duration);
  document.getElementById('complete-score').textContent = score.toLocaleString() + ' pt';
  document.getElementById('complete-code').textContent = state.clues.map((c) => c.code).join(' - ');
  const listEl = document.getElementById('complete-clue-list');
  listEl.innerHTML = state.clues.map((c) => `<li>${c.sectorName}：<b>${c.code}</b></li>`).join('');

  // ★ 1. ページURLのQRコード（この完了画面自体）
  const pageContainer = document.getElementById('qr-page-url');
  pageContainer.innerHTML = '';
  try {
    const pageUrl = window.location.href;
    new QRCode(pageContainer, {
      text: pageUrl,
      width: 100,
      height: 100,
      colorDark: '#2bf078',
      colorLight: '#09131a',
      correctLevel: QRCode.CorrectLevel.H,
    });
  } catch (e) {
    pageContainer.innerHTML = '<p style="font-size:11px;color:var(--c-text-dim);">QR生成エラー</p>';
  }

  // ★ 2. コラムURLのQRコード
  const columnContainer = document.getElementById('qr-column-url');
  columnContainer.innerHTML = '';
  try {
    const columnUrl = window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '/') + 'dino-column.html';
    new QRCode(columnContainer, {
      text: columnUrl,
      width: 100,
      height: 100,
      colorDark: '#f59e0b',
      colorLight: '#09131a',
      correctLevel: QRCode.CorrectLevel.H,
    });
  } catch (e) {
    columnContainer.innerHTML = '<p style="font-size:11px;color:var(--c-text-dim);">QR生成エラー</p>';
  }
}

/* ============================ 画像ダウンロード（スコア＋コラムQR） ============================ */
function downloadResultImage() {
  const team = state.teamName || 'Unknown';
  const duration = document.getElementById('complete-duration').textContent;
  const scoreText = document.getElementById('complete-score').textContent;
  const code = document.getElementById('complete-code').textContent;

  const canvas = document.createElement('canvas');
  const w = 800, h = 540;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  // 背景
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, '#04080b');
  grad.addColorStop(1, '#0d1b24');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // 枠
  ctx.strokeStyle = '#2bf078';
  ctx.lineWidth = 6;
  ctx.strokeRect(15, 15, w - 30, h - 30);

  // タイトル
  ctx.fillStyle = '#2bf078';
  ctx.font = 'bold 34px Orbitron, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('ISLA NUBLAR LAB', 40, 80);
  ctx.font = '18px Orbitron, sans-serif';
  ctx.fillStyle = '#f59e0b';
  ctx.fillText('EXPEDITION COMPLETE', 40, 120);

  // チーム名
  ctx.fillStyle = '#d7ece4';
  ctx.font = '28px Noto Sans JP, sans-serif';
  ctx.fillText('TEAM: ' + team, 40, 190);

  // スコア（ポイント）
  ctx.fillStyle = '#f59e0b';
  ctx.font = 'bold 30px Orbitron, sans-serif';
  ctx.fillText('🏅 SCORE: ' + scoreText, 40, 260);

  // 所要時間（サブ表示）
  ctx.fillStyle = '#8fa8ab';
  ctx.font = '18px Noto Sans JP, sans-serif';
  ctx.fillText('⏱ Time: ' + duration, 40, 310);

  // コード
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 28px Orbitron, sans-serif';
  ctx.fillText('CODE: ' + code, 40, 380);

  // フッター
  ctx.fillStyle = '#8fa8ab';
  ctx.font = '16px Noto Sans JP, sans-serif';
  ctx.fillText('© ISLA NUBLAR RESEARCH LAB', 40, h - 30);

  // ★ コラムQRコードを画像に埋め込み
  const columnUrl = window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '/') + 'dino-column.html';
  const qrImg = new Image();
  qrImg.crossOrigin = 'Anonymous';
  qrImg.src = 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=' + encodeURIComponent(columnUrl);
  
  qrImg.onload = function() {
    ctx.drawImage(qrImg, w - 220, 120, 160, 160);
    ctx.fillStyle = '#8fa8ab';
    ctx.font = '14px Noto Sans JP, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Scan for Dino Column', w - 140, 310);
    downloadCanvas(canvas, team);
  };
  qrImg.onerror = function() {
    // QRが読み込めなくても画像はダウンロード
    ctx.fillStyle = '#8fa8ab';
    ctx.font = '16px Noto Sans JP, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('QR Code unavailable', w - 140, 200);
    downloadCanvas(canvas, team);
  };
}

function downloadCanvas(canvas, team) {
  const link = document.createElement('a');
  link.download = `expedition_${team}_${new Date().toISOString().slice(0,10)}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

/* ============================ モーダル制御 ============================ */
function openModal(id) { document.getElementById(id).classList.add('active'); }
function closeModal(id) { document.getElementById(id).classList.remove('active'); }

/* ============================ 登録 ============================ */
function handleStartTeam() { /* 前回と同じ */ }

/* ============================ 再開 ============================ */
function showResumeOverlay() { /* 前回と同じ */ }
function hideResumeOverlay() { /* 前回と同じ */ }

/* ============================ イベントバインド / 初期化 ============================ */
function bindEvents() {
  document.getElementById('btn-start-team').addEventListener('click', handleStartTeam);
  document.getElementById('team-name-input').addEventListener('keydown', (e) => { if (e.key === 'Enter') handleStartTeam(); });

  document.getElementById('btn-concept').addEventListener('click', () => openModal('modal-concept'));
  document.getElementById('btn-concept-close').addEventListener('click', () => closeModal('modal-concept'));
  document.getElementById('btn-howto').addEventListener('click', () => openModal('modal-howto'));
  document.getElementById('btn-howto-close').addEventListener('click', () => closeModal('modal-howto'));
  document.getElementById('btn-notice').addEventListener('click', () => openModal('modal-notice'));
  document.getElementById('btn-notice-close').addEventListener('click', () => closeModal('modal-notice'));

  document.getElementById('btn-prev').addEventListener('click', () => { if (viewIndex > 0) { viewIndex -= 1; renderAll(); } });
  document.getElementById('btn-next').addEventListener('click', () => { if (viewIndex < maxViewIndex()) { viewIndex += 1; renderAll(); } });
  document.getElementById('btn-quiz').addEventListener('click', openQuizModal);

  document.getElementById('btn-quiz-submit').addEventListener('click', submitQuizAnswer);
  document.getElementById('quiz-answer-input').addEventListener('keydown', (e) => { if (e.key === 'Enter') submitQuizAnswer(); });
  document.getElementById('btn-quiz-hint').addEventListener('click', () => { document.getElementById('quiz-hint-box').classList.remove('hidden'); });
  document.getElementById('btn-quiz-close').addEventListener('click', closeQuizModal);
  document.getElementById('btn-quiz-close-review').addEventListener('click', closeQuizModal);

  document.getElementById('btn-final-submit').addEventListener('click', submitFinalAnswer);
  document.getElementById('final-answer-input').addEventListener('keydown', (e) => { if (e.key === 'Enter') submitFinalAnswer(); });
  document.getElementById('btn-final-close').addEventListener('click', closeFinalModal);

  document.getElementById('btn-admin-fixed').addEventListener('click', openAdminModal);
  document.getElementById('btn-admin-close').addEventListener('click', closeAdminModal);
  document.getElementById('btn-admin-auth-submit').addEventListener('click', submitAdminPasscode);
  document.getElementById('admin-passcode-input').addEventListener('keydown', (e) => { if (e.key === 'Enter') submitAdminPasscode(); });
  document.getElementById('btn-admin-unlock').addEventListener('click', adminUnlock);
  document.getElementById('btn-admin-reset').addEventListener('click', adminResetDevice);

  document.getElementById('btn-download-result').addEventListener('click', downloadResultImage);

  document.getElementById('btn-resume').addEventListener('click', () => {
    enterFullscreenSafe();
    armSecurity();
    hideResumeOverlay();
  });

  document.querySelectorAll('.modal-overlay[data-dismissible="true"]').forEach((overlay) => {
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.classList.remove('active'); });
  });
}

function init() {
  attachSecurityListeners();
  bindEvents();
  state = loadState();
  if (state.teamName && state.completedAt) {
    showScreen('complete');
    renderCompleteScreen();
  } else if (state.teamName) {
    viewIndex = maxViewIndex();
    showScreen('dashboard');
    renderAll();
    if (state.locked) {
      showLockScreen();
      armSecurity();
    } else {
      showResumeOverlay();
    }
  } else {
    showScreen('registration');
  }
}

document.addEventListener('DOMContentLoaded', init);
