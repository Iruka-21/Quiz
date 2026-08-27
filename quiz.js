/* =========================================================================
   ISLA NUBLAR RESEARCH LAB — QUIZ EXPEDITION
   quiz.js
   -------------------------------------------------------------------------
   文化祭・校内周遊リアル謎解きゲーム用スクリプト
   構成:
     1. CONFIG / 指示書・問題プール データ定義  ← 制作担当者はここを編集
     2. 状態管理 (localStorage)
     3. 入力正規化・判定ロジック
     4. セキュリティ (フルスクリーン / 離脱検知 / 操作禁止 / 緊急ロック)
     5. 管理者 (ADMIN) 機能
     6. UI描画・画面制御
     7. イベントバインド / 初期化
   ========================================================================= */

/* ============================== 1. CONFIG =============================== */

const CONFIG = {
  STORAGE_KEY: 'jw_quiz_expedition_state_v1',
  // ★★★ 編集エリア：管理者パスワードを変更する ★★★
  ADMIN_PASSCODE: 'CHANGE_ME', // 🔑 ここを任意のパスワードに変更してください
  SECTOR_COUNT: 4,
};

/* --------------------------------------------------------------------------
   📋 SECTOR_POOLS — 区画ごとの指示書＆問題プール
   ★★★ 編集エリア：問題・指示書の編集は以下の SECTOR_POOLS 内で行います ★★★
   -------------------------------------------------------------------------- */
const SECTOR_POOLS = [
  {
    id: 0,
    name: '一区画',
    shortName: '一区画',
    areaName: 'JUNGLE AREA',
    icon: '🦖',
    location: '1階 101教室前「ジャングル・パドック」',
    instructions:
      '【CHAPTER 1 - JUNGLE AREA】\n' +
      '監視ドローンからの通信が途絶えた。まず 1階 101教室前 の「ジャングル・パドック」展示エリアへ向かえ。\n' +
      '現地の展示パネルに残された足跡と記録を調査し、逃走した草食竜を特定してセキュリティコードを解読せよ。\n' +
      '解読したコードはこの端末のQUIZ入力欄へ送信すること。',
    patterns: [
      // ========== パターンA ==========
      {
        patternName: 'A',
        title: '一区画：ジャングルエリア (Pattern A)',
        // 問題文（編集可）
        question:
          'パドックの記録には「体長20m級。小さな頭部と長い首を持つ、竜脚類の中でも屈指の大きさを誇る草食竜」と記されている。\n' +
          'この恐竜の名前を英語（アルファベット）で入力せよ。',
        // 正解バリエーション（編集可：複数追加可能）
        answers: ['BRACHIOSAURUS', 'ブラキオサウルス'],
        // ヒント（編集可）
        hint: 'ヒント：首がとても長く、キリンのように高い木の葉を食べる巨大な竜脚類だ。',
        // 解説（編集可）
        explanation: '正解は「ブラキオサウルス」。竜脚類の中でも特に首が長く、映画シリーズの象徴的存在として度々登場する草食恐竜だ。',
        // 起動コードの欠片（編集可）
        clueCode: 'J7',
      },
      // ========== パターンB ==========
      {
        patternName: 'B',
        title: '一区画：ジャングルエリア (Pattern B)',
        question:
          'パドックのモニターには「頭部に3本の角と、大きなフリル（えり飾り）を持つ草食竜が柵を突破」と警告表示が出ている。\n' +
          'この恐竜の名前をカタカナで入力せよ。',
        answers: ['トリケラトプス', 'TRICERATOPS'],
        hint: 'ヒント：鼻先と両目の上に、合計3本の角を持つ姿が特徴的な草食恐竜だ。',
        explanation: '正解は「トリケラトプス」。3本の角と大きなフリルを持ち、力強い突進で肉食恐竜にも対抗する草食恐竜だ。',
        clueCode: 'J3',
      },
    ],
  },
  {
    id: 1,
    name: '二区画',
    shortName: '二区画',
    areaName: 'RIVER AREA',
    icon: '🌊',
    location: '2階 図書室前「リバー・アドベンチャー」乗船口',
    instructions:
      '【CHAPTER 2 - RIVER AREA】\n' +
      '次の調査エリアは 2階 図書室前 の「リバー・アドベンチャー」乗船口だ。\n' +
      '水位センサーが異常な水しぶきを検知している。ログに残された痕跡を調査し、氾濫の原因となった水棲の爬虫類を特定せよ。',
    patterns: [
      // ========== パターンA ==========
      {
        patternName: 'A',
        title: '二区画：リバーエリア (Pattern A)',
        question:
          '河川に生息し、ワニのように長い顎と、背中に帆のような大きな棘を持つ肉食恐竜がセンサーに記録された。\n' +
          'この恐竜の名前を英語（アルファベット）で入力せよ。',
        answers: ['SPINOSAURUS', 'スピノサウルス'],
        hint: 'ヒント：背中に帆のようなトゲの並びがあり、水辺を好む珍しい肉食恐竜だ。',
        explanation: '正解は「スピノサウルス」。背中の棘状突起（帆）と細長い顎が特徴で、水辺を生活圏とする肉食恐竜だ。',
        clueCode: 'R9',
      },
      // ========== パターンB ==========
      {
        patternName: 'B',
        title: '二区画：リバーエリア (Pattern B)',
        question:
          '乗船口下の巨大水槽に、水上ショーの主役として知られる超巨大な海棲爬虫類の影が記録された。\n' +
          'この生物の名前をカタカナで入力せよ。',
        answers: ['モササウルス', 'MOSASAURUS'],
        hint: 'ヒント：恐竜ではなく海棲爬虫類。巨大水槽の底から飛び出し、サメを一飲みにするほどの怪物だ。',
        explanation: '正解は「モササウルス」。恐竜ではなく海棲爬虫類の一種で、巨大な水上ショー施設の主役として知られる。',
        clueCode: 'R4',
      },
    ],
  },
  {
    id: 2,
    name: '三区画',
    shortName: '三区画',
    areaName: 'AVIARY AREA',
    icon: '🦅',
    location: '3階 視聴覚室前「プテラノドン・アビアリー」',
    instructions:
      '【CHAPTER 3 - AVIARY AREA】\n' +
      '巨大な鳥かご式ドーム「アビアリー」のゲートが開放状態になっている。3階 視聴覚室前 へ急行せよ。\n' +
      'ドーム内に残された鳴き声データを解析し、逃走した翼竜を突き止めよ。',
    patterns: [
      // ========== パターンA ==========
      {
        patternName: 'A',
        title: '三区画：アビアリーエリア (Pattern A)',
        question:
          '翼を広げると7mを超え、歯のないクチバシと後頭部の大きなトサカを持つ翼竜がドームから消えた。\n' +
          'この翼竜の名前を英語（アルファベット）で入力せよ。',
        answers: ['PTERANODON', 'プテラノドン'],
        hint: 'ヒント：後頭部から伸びる大きなトサカと、歯のないクチバシが特徴の巨大な翼竜だ。',
        explanation: '正解は「プテラノドン」。歯のないクチバシと後頭部の大きなトサカが特徴的な、代表的な翼竜だ。',
        clueCode: 'A2',
      },
      // ========== パターンB ==========
      {
        patternName: 'B',
        title: '三区画：アビアリーエリア (Pattern B)',
        question:
          '群れで行動し、鋭い歯の並ぶ細長い顎を持つ小〜中型の翼竜が、複数体ドームの外へ逃走した記録がある。\n' +
          'この翼竜の名前をカタカナで入力せよ。',
        answers: ['ディモルフォドン', 'DIMORPHODON'],
        hint: 'ヒント：小柄だが群れで襲ってくる、鋭い歯を持つ翼竜だ。',
        explanation: '正解は「ディモルフォドン」。小柄な体に鋭い歯を持ち、群れで行動する翼竜として知られる。',
        clueCode: 'A6',
      },
    ],
  },
  {
    id: 3,
    name: '四区画',
    shortName: '四区画',
    areaName: 'LAB AREA',
    icon: '🧬',
    location: '特別棟1階 理科室「創世研究ラボ」',
    instructions:
      '【CHAPTER 4 - LAB AREA】\n' +
      '最終調査区画は 特別棟1階 理科室 の「創世研究ラボ」だ。\n' +
      '遺伝子シーケンサーに残されたロック画面のクイズに正解し、最終起動コードの最後の欠片を入手せよ。',
    patterns: [
      // ========== パターンA ==========
      {
        patternName: 'A',
        title: '四区画：ラボエリア (Pattern A)',
        question:
          '研究チームは、琥珀の中に閉じ込められた古代の吸血生物から恐竜のDNAを採取したという。\n' +
          'この吸血生物の名前を日本語で入力せよ。',
        answers: ['蚊', 'か', 'カ', 'MOSQUITO'],
        hint: 'ヒント：血を吸う小さな昆虫。夏になるとブンブン飛んでくるアレだ。',
        explanation: '正解は「蚊」。琥珀に閉じ込められた古代の蚊の体内に残る血液から、恐竜のDNAが採取されたという設定だ。',
        clueCode: 'L5',
      },
      // ========== パターンB ==========
      {
        patternName: 'B',
        title: '四区画：ラボエリア (Pattern B)',
        question:
          '研究者たちが「全ての恐竜を統べる、最強最大の存在」として作り出したと噂される新種の肉食恐竜がいる。\n' +
          'この恐竜の名前を英語（アルファベット）で入力せよ。',
        answers: ['INDOMINUS REX', 'INDOMINUSREX', 'インドミナスレックス', 'インドミナス・レックス'],
        hint: 'ヒント：「征服できない」という意味の名を持つ、人工的に作られたとされる新種の肉食恐竜だ。',
        explanation: '正解は「インドミナス・レックス」。研究者たちの手によって生み出されたとされる、最強クラスの新種肉食恐竜だ。',
        clueCode: 'L8',
      },
    ],
  },
];

/* ★★★ 編集エリア：FINAL区画の指示書を編集する場合 ★★★ */
const FINAL_SECTOR = {
  id: 'final',
  name: 'FINAL',
  shortName: 'FINAL',
  areaName: 'CONTROL CENTER',
  icon: '🚨',
  location: '体育館ステージ前「メインコントロールセンター」',
  instructions:
    '【FINAL CHAPTER - CONTROL CENTER】\n' +
    '全区画の調査、お疲れさまでした。体育館ステージ前 の「メインコントロールセンター」に集合せよ。\n' +
    'これまで入手した4つの起動コード欠片を、調査した順番のまま連結して入力し、施設の緊急ロックダウンを解除せよ。',
};

/* ============================== 2. 状態管理 =============================== */

/** デフォルト状態を生成 */
function createDefaultState() {
  return {
    teamName: '',
    createdAt: null,
    selectedPatterns: [],   // 各区画で選ばれた patterns[] のインデックス
    clearedSectors: 0,      // クリア済み区画数 (0-4)
    clues: [],               // { sectorName, code } を収集順に格納
    wrongAttempts: [0, 0, 0, 0],
    finalCleared: false,
    completedAt: null,
    locked: false,
    lockReason: '',
  };
}

let state = createDefaultState();
let viewIndex = 0;

function loadState() {
  try {
    const raw = localStorage.getItem(CONFIG.STORAGE_KEY);
    if (!raw) return createDefaultState();
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return createDefaultState();
    const def = createDefaultState();
    return Object.assign(def, parsed);
  } catch (e) {
    console.warn('状態の読み込みに失敗しました。初期状態を使用します。', e);
    return createDefaultState();
  }
}

function saveState() {
  try {
    localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('状態の保存に失敗しました。', e);
  }
}

function clearState() {
  try {
    localStorage.removeItem(CONFIG.STORAGE_KEY);
  } catch (e) { /* noop */ }
  state = createDefaultState();
  viewIndex = 0;
}

/* ============================ 3. 入力正規化 ============================ */

function normalizeAnswer(input) {
  if (input == null) return '';
  let s = String(input);
  s = s.replace(/[\uFF01-\uFF5E]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xFEE0));
  s = s.replace(/\u3000/g, ' ');
  s = s.trim();
  s = s.replace(/[\s・\-_/]/g, '');
  s = s.toLowerCase();
  return s;
}

function isCorrectAnswer(pattern, rawInput) {
  const norm = normalizeAnswer(rawInput);
  if (!norm) return false;
  return pattern.answers.some((a) => normalizeAnswer(a) === norm);
}

/* ============================ 4. セキュリティ ============================ */

let securityArmed = false;
let adminActionInProgress = false;

function enterFullscreenSafe() {
  try {
    const el = document.documentElement;
    const req =
      el.requestFullscreen ||
      el.webkitRequestFullscreen ||
      el.msRequestFullscreen ||
      el.mozRequestFullScreen;
    if (req) {
      const p = req.call(el);
      if (p && typeof p.catch === 'function') {
        p.catch(() => { /* iOS Safari 等 非対応環境はフォールバックして無視 */ });
      }
    }
  } catch (e) {
    /* フルスクリーンAPI非対応環境でも処理を止めない */
  }
}

function exitFullscreenSafe() {
  try {
    const ex = document.exitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen;
    if (ex && (document.fullscreenElement || document.webkitFullscreenElement)) {
      const p = ex.call(document);
      if (p && typeof p.catch === 'function') p.catch(() => {});
    }
  } catch (e) { /* noop */ }
}

function armSecurity() {
  securityArmed = true;
}
function disarmSecurity() {
  securityArmed = false;
}

function triggerViolation(reason) {
  if (!securityArmed) return;
  if (adminActionInProgress) return;
  if (state.locked) return;
  state.locked = true;
  state.lockReason = reason || '不審な操作を検知しました';
  saveState();
  showLockScreen();
}

function attachSecurityListeners() {
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      triggerViolation('別のタブ／アプリへの切り替えを検知しました (SECURITY VIOLATION)');
    }
  });

  const fsHandler = () => {
    const fsEl = document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
    if (!fsEl) {
      triggerViolation('フルスクリーンモードの解除を検知しました (SECURITY VIOLATION)');
    }
  };
  document.addEventListener('fullscreenchange', fsHandler);
  document.addEventListener('webkitfullscreenchange', fsHandler);
  document.addEventListener('MSFullscreenChange', fsHandler);

  document.addEventListener('contextmenu', (e) => e.preventDefault());
  document.addEventListener('copy', (e) => e.preventDefault());
  document.addEventListener('cut', (e) => e.preventDefault());

  document.addEventListener('keydown', (e) => {
    const k = (e.key || '').toUpperCase();
    const blocked =
      k === 'F12' ||
      (e.ctrlKey && e.shiftKey && ['I', 'J', 'C', 'K'].includes(k)) ||
      (e.metaKey && e.altKey && ['I', 'J', 'C'].includes(k)) ||
      (e.ctrlKey && k === 'U') ||
      (e.ctrlKey && k === 'S') ||
      (e.ctrlKey && k === 'P');
    if (blocked) e.preventDefault();
  });
}

/* ============================ 5. 管理者 (ADMIN) ============================ */

let adminAuthenticated = false;

function openAdminModal() {
  adminAuthenticated = false;
  const passInput = document.getElementById('admin-passcode-input');
  const authPanel = document.getElementById('admin-auth-panel');
  const actionPanel = document.getElementById('admin-action-panel');
  const errorEl = document.getElementById('admin-auth-error');
  if (passInput) passInput.value = '';
  if (errorEl) errorEl.textContent = '';
  if (authPanel) authPanel.classList.remove('hidden');
  if (actionPanel) actionPanel.classList.add('hidden');
  document.getElementById('modal-admin').classList.add('active');
  if (passInput) setTimeout(() => passInput.focus(), 50);
}

function closeAdminModal() {
  document.getElementById('modal-admin').classList.remove('active');
}

function submitAdminPasscode() {
  const passInput = document.getElementById('admin-passcode-input');
  const errorEl = document.getElementById('admin-auth-error');
  const val = passInput ? passInput.value : '';
  if (val === CONFIG.ADMIN_PASSCODE) {
    adminAuthenticated = true;
    document.getElementById('admin-auth-panel').classList.add('hidden');
    document.getElementById('admin-action-panel').classList.remove('hidden');
    if (errorEl) errorEl.textContent = '';
  } else {
    if (errorEl) errorEl.textContent = '❌ パスコードが正しくありません。';
  }
}

function adminUnlock() {
  adminActionInProgress = true;
  state.locked = false;
  state.lockReason = '';
  saveState();
  hideLockScreen();
  closeAdminModal();
  enterFullscreenSafe();
  setTimeout(() => { adminActionInProgress = false; }, 800);
}

function adminResetDevice() {
  const ok = window.confirm('端末を初期化し、次のチーム用の登録画面に戻します。よろしいですか？\n（現在の進行データは完全に削除されます）');
  if (!ok) return;
  adminActionInProgress = true;
  clearState();
  hideLockScreen();
  closeAdminModal();
  disarmSecurity();
  exitFullscreenSafe();
  showScreen('registration');
  setTimeout(() => { adminActionInProgress = false; }, 800);
}

/* ============================ 6. UI描画・画面制御 ============================ */

function showScreen(name) {
  document.querySelectorAll('.screen').forEach((el) => el.classList.remove('active'));
  const target = document.getElementById(`screen-${name}`);
  if (target) target.classList.add('active');
}

function showLockScreen() {
  document.getElementById('lock-screen').classList.add('active');
  document.getElementById('lock-reason-text').textContent = state.lockReason || '不審な操作を検知しました';
  document.body.classList.add('is-locked');
}

function hideLockScreen() {
  document.getElementById('lock-screen').classList.remove('active');
  document.body.classList.remove('is-locked');
}

function maxViewIndex() {
  if (state.clearedSectors >= CONFIG.SECTOR_COUNT) return 4;
  return Math.min(state.clearedSectors, CONFIG.SECTOR_COUNT - 1);
}

function getSectorForIndex(idx) {
  return idx >= CONFIG.SECTOR_COUNT ? FINAL_SECTOR : SECTOR_POOLS[idx];
}

function renderTeamName() {
  const el = document.getElementById('team-name-display');
  if (el) el.textContent = state.teamName || '---';
}

function renderBriefingPanel() {
  const sector = getSectorForIndex(viewIndex);
  document.getElementById('briefing-sector-name').textContent = `${sector.icon} ${sector.areaName}｜${sector.shortName}`;
  document.getElementById('briefing-location').textContent = `📍 ${sector.location}`;
  const isLocked = viewIndex > maxViewIndex();
  const textEl = document.getElementById('briefing-text');
  if (isLocked) {
    textEl.textContent = '🔒 この区画はまだ未解放です。前の区画をクリアすると指示書が表示されます。';
  } else if (viewIndex === 4) {
    textEl.textContent = FINAL_SECTOR.instructions;
  } else {
    textEl.textContent = sector.instructions;
  }
}

function renderStatusPanel() {
  document.getElementById('status-count-text').textContent = `${state.clearedSectors} / ${CONFIG.SECTOR_COUNT}`;
  const bar = document.getElementById('status-progress-bar');
  if (bar) bar.style.width = `${(state.clearedSectors / CONFIG.SECTOR_COUNT) * 100}%`;

  const cluesList = document.getElementById('clues-list');
  cluesList.innerHTML = '';
  if (state.clues.length === 0) {
    cluesList.innerHTML = '<li class="clue-empty">まだ手がかりは発見されていません</li>';
  } else {
    state.clues.forEach((c) => {
      const li = document.createElement('li');
      li.className = 'clue-item';
      li.innerHTML = `<span class="clue-sector">${c.sectorName}</span><span class="clue-code">${c.code}</span>`;
      cluesList.appendChild(li);
    });
  }
}

function sectorCardStateClass(idx) {
  if (idx < state.clearedSectors) return 'cleared';
  if (idx === state.clearedSectors && state.clearedSectors < CONFIG.SECTOR_COUNT) return 'active';
  return 'locked';
}

function renderSectorCards() {
  const container = document.getElementById('sector-cards');
  container.innerHTML = '';

  SECTOR_POOLS.forEach((sector, idx) => {
    const st = sectorCardStateClass(idx);
    const card = document.createElement('button');
    card.type = 'button';
    card.className = `sector-card ${st} ${idx === viewIndex ? 'is-viewing' : ''}`;
    card.setAttribute('data-idx', idx);
    let badge = '';
    if (st === 'cleared') badge = '<span class="badge badge-cleared">✓ クリア</span>';
    else if (st === 'active') badge = '<span class="badge badge-active">調査中</span>';
    else badge = '<span class="badge badge-locked">🔒 未解放</span>';

    card.innerHTML = `
      <div class="sector-card-icon">${sector.icon}</div>
      <div class="sector-card-name">${sector.shortName}</div>
      <div class="sector-card-area">${sector.areaName}</div>
      ${badge}
    `;
    card.addEventListener('click', () => {
      if (idx <= maxViewIndex()) {
        viewIndex = idx;
        renderAll();
      }
    });
    container.appendChild(card);
  });

  const finalSt = state.finalCleared ? 'cleared' : state.clearedSectors >= CONFIG.SECTOR_COUNT ? 'active' : 'locked';
  const finalCard = document.createElement('button');
  finalCard.type = 'button';
  finalCard.className = `sector-card final-card ${finalSt} ${viewIndex === 4 ? 'is-viewing' : ''}`;
  let finalBadge = '';
  if (finalSt === 'cleared') finalBadge = '<span class="badge badge-cleared">✓ 完了</span>';
  else if (finalSt === 'active') finalBadge = '<span class="badge badge-active">起動可能</span>';
  else finalBadge = '<span class="badge badge-locked">🔒 未解放</span>';
  finalCard.innerHTML = `
    <div class="sector-card-icon">${FINAL_SECTOR.icon}</div>
    <div class="sector-card-name">${FINAL_SECTOR.shortName}</div>
    <div class="sector-card-area">${FINAL_SECTOR.areaName}</div>
    ${finalBadge}
  `;
  finalCard.addEventListener('click', () => {
    if (state.clearedSectors >= CONFIG.SECTOR_COUNT) {
      viewIndex = 4;
      renderAll();
    }
  });
  container.appendChild(finalCard);
}

function renderActionBar() {
  const prevBtn = document.getElementById('btn-prev');
  const nextBtn = document.getElementById('btn-next');
  const quizBtn = document.getElementById('btn-quiz');

  prevBtn.disabled = viewIndex <= 0;
  nextBtn.disabled = viewIndex >= maxViewIndex();

  quizBtn.classList.remove('btn-disabled');
  if (viewIndex === 4) {
    if (state.finalCleared) {
      quizBtn.textContent = '✅ ミッションコンプリート';
      quizBtn.disabled = true;
    } else if (state.clearedSectors >= CONFIG.SECTOR_COUNT) {
      quizBtn.textContent = '🚨 起動コードを入力する ➔';
      quizBtn.disabled = false;
    } else {
      quizBtn.textContent = '🔒 未解放';
      quizBtn.disabled = true;
    }
  } else if (viewIndex < state.clearedSectors) {
    quizBtn.textContent = '📖 解説を見る（クリア済み）';
    quizBtn.disabled = false;
  } else if (viewIndex === state.clearedSectors) {
    quizBtn.textContent = 'クイズに挑戦する ➔';
    quizBtn.disabled = false;
  } else {
    quizBtn.textContent = '🔒 未解放';
    quizBtn.disabled = true;
  }
}

function renderAll() {
  renderTeamName();
  renderBriefingPanel();
  renderStatusPanel();
  renderSectorCards();
  renderActionBar();
}

/* -------- クイズモーダル -------- */

function openQuizModal() {
  if (viewIndex === 4) {
    openFinalModal();
    return;
  }
  const idx = viewIndex;
  const isReview = idx < state.clearedSectors;
  const sector = SECTOR_POOLS[idx];
  const patternIdx = state.selectedPatterns[idx];
  const pattern = sector.patterns[patternIdx];

  document.getElementById('quiz-modal-title').textContent = pattern.title;
  document.getElementById('quiz-modal-question').textContent = pattern.question;
  document.getElementById('quiz-answer-input').value = '';
  document.getElementById('quiz-feedback').textContent = '';
  document.getElementById('quiz-feedback').className = 'quiz-feedback';
  document.getElementById('quiz-hint-box').classList.add('hidden');
  document.getElementById('quiz-hint-box').textContent = pattern.hint;
  document.getElementById('quiz-explanation-box').classList.add('hidden');
  document.getElementById('quiz-explanation-box').textContent = pattern.explanation;

  const submitBtn = document.getElementById('btn-quiz-submit');
  const hintBtn = document.getElementById('btn-quiz-hint');
  const answerInput = document.getElementById('quiz-answer-input');
  const closeReviewBtn = document.getElementById('btn-quiz-close-review');

  if (isReview) {
    submitBtn.classList.add('hidden');
    hintBtn.classList.add('hidden');
    answerInput.classList.add('hidden');
    closeReviewBtn.classList.remove('hidden');
    document.getElementById('quiz-feedback').textContent = '✅ この区画はクリア済みです。解説を確認できます。';
    document.getElementById('quiz-feedback').className = 'quiz-feedback feedback-correct';
    document.getElementById('quiz-explanation-box').classList.remove('hidden');
  } else {
    submitBtn.classList.remove('hidden');
    hintBtn.classList.remove('hidden');
    answerInput.classList.remove('hidden');
    closeReviewBtn.classList.add('hidden');
    if (state.wrongAttempts[idx] >= 2) {
      document.getElementById('quiz-hint-box').classList.remove('hidden');
    }
  }

  document.getElementById('modal-quiz').classList.add('active');
  if (!isReview) setTimeout(() => answerInput.focus(), 50);
}

function closeQuizModal() {
  document.getElementById('modal-quiz').classList.remove('active');
}

function submitQuizAnswer() {
  const idx = viewIndex;
  const sector = SECTOR_POOLS[idx];
  const patternIdx = state.selectedPatterns[idx];
  const pattern = sector.patterns[patternIdx];
  const input = document.getElementById('quiz-answer-input').value;
  const feedbackEl = document.getElementById('quiz-feedback');

  if (isCorrectAnswer(pattern, input)) {
    state.clearedSectors += 1;
    state.wrongAttempts[idx] = 0;
    state.clues.push({ sectorName: sector.shortName, code: pattern.clueCode });
    saveState();

    feedbackEl.textContent = `🎉 正解！ 起動コード欠片 [${pattern.clueCode}] を入手した。`;
    feedbackEl.className = 'quiz-feedback feedback-correct';
    document.getElementById('quiz-explanation-box').classList.remove('hidden');
    document.getElementById('btn-quiz-submit').classList.add('hidden');
    document.getElementById('btn-quiz-hint').classList.add('hidden');
    document.getElementById('quiz-answer-input').classList.add('hidden');
    document.getElementById('btn-quiz-close-review').classList.remove('hidden');
    document.getElementById('btn-quiz-close-review').textContent = '次の区画へ進む ➔';

    document.getElementById('btn-quiz-close-review').onclick = () => {
      closeQuizModal();
      viewIndex = maxViewIndex();
      renderAll();
      document.getElementById('btn-quiz-close-review').textContent = '閉じる';
      document.getElementById('btn-quiz-close-review').onclick = closeQuizModal;
    };
  } else {
    state.wrongAttempts[idx] += 1;
    saveState();
    feedbackEl.textContent = '❌ 不正解…もう一度データを確認せよ。';
    feedbackEl.className = 'quiz-feedback feedback-wrong';
    if (state.wrongAttempts[idx] >= 2) {
      document.getElementById('quiz-hint-box').classList.remove('hidden');
    }
  }
}

/* -------- FINALモーダル -------- */

function openFinalModal() {
  document.getElementById('final-clue-list').innerHTML = state.clues
    .map((c) => `<span class="final-clue-chip">${c.sectorName}: <b>${c.code}</b></span>`)
    .join('');
  document.getElementById('final-answer-input').value = '';
  document.getElementById('final-feedback').textContent = '';
  document.getElementById('final-feedback').className = 'quiz-feedback';
  document.getElementById('modal-final').classList.add('active');
  setTimeout(() => document.getElementById('final-answer-input').focus(), 50);
}

function closeFinalModal() {
  document.getElementById('modal-final').classList.remove('active');
}

function submitFinalAnswer() {
  const expected = state.clues.map((c) => c.code).join('');
  const input = document.getElementById('final-answer-input').value;
  const feedbackEl = document.getElementById('final-feedback');

  if (normalizeAnswer(input) === normalizeAnswer(expected)) {
    state.finalCleared = true;
    state.completedAt = Date.now();
    saveState();
    closeFinalModal();
    renderCompleteScreen();
    showScreen('complete');
    disarmSecurity();
  } else {
    feedbackEl.textContent = '❌ コードが一致しません。手がかりの並び順を確認せよ。';
    feedbackEl.className = 'quiz-feedback feedback-wrong';
  }
}

/* -------- 完了画面 -------- */

function formatDuration(ms) {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}分${String(s).padStart(2, '0')}秒`;
}

function renderCompleteScreen() {
  document.getElementById('complete-team-name').textContent = state.teamName;
  const duration = state.completedAt && state.createdAt ? state.completedAt - state.createdAt : 0;
  document.getElementById('complete-duration').textContent = formatDuration(duration);
  document.getElementById('complete-code').textContent = state.clues.map((c) => c.code).join(' - ');
  const listEl = document.getElementById('complete-clue-list');
  listEl.innerHTML = state.clues.map((c) => `<li>${c.sectorName}：<b>${c.code}</b></li>`).join('');
}

/* -------- 遊び方 / 注意事項モーダル -------- */

function openModal(id) {
  document.getElementById(id).classList.add('active');
}
function closeModal(id) {
  document.getElementById(id).classList.remove('active');
}

/* -------- 登録画面 -------- */

function handleStartTeam() {
  const input = document.getElementById('team-name-input');
  const errorEl = document.getElementById('registration-error');
  const name = (input.value || '').trim();
  if (!name) {
    errorEl.textContent = '⚠️ チーム名を入力してください。';
    return;
  }
  errorEl.textContent = '';

  state = createDefaultState();
  state.teamName = name;
  state.createdAt = Date.now();
  state.selectedPatterns = SECTOR_POOLS.map((sector) => Math.floor(Math.random() * sector.patterns.length));
  saveState();

  viewIndex = 0;
  showScreen('dashboard');
  renderAll();

  enterFullscreenSafe();
  armSecurity();
}

/* -------- 再開オーバーレイ -------- */

function showResumeOverlay() {
  document.getElementById('resume-overlay').classList.add('active');
}
function hideResumeOverlay() {
  document.getElementById('resume-overlay').classList.remove('active');
}

/* ============================ 7. 初期化 / イベントバインド ============================ */

function bindEvents() {
  document.getElementById('btn-start-team').addEventListener('click', handleStartTeam);
  document.getElementById('team-name-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleStartTeam();
  });

  document.getElementById('btn-howto').addEventListener('click', () => openModal('modal-howto'));
  document.getElementById('btn-notice').addEventListener('click', () => openModal('modal-notice'));
  document.getElementById('btn-howto-close').addEventListener('click', () => closeModal('modal-howto'));
  document.getElementById('btn-notice-close').addEventListener('click', () => closeModal('modal-notice'));

  document.getElementById('btn-prev').addEventListener('click', () => {
    if (viewIndex > 0) {
      viewIndex -= 1;
      renderAll();
    }
  });
  document.getElementById('btn-next').addEventListener('click', () => {
    if (viewIndex < maxViewIndex()) {
      viewIndex += 1;
      renderAll();
    }
  });
  document.getElementById('btn-quiz').addEventListener('click', openQuizModal);

  document.getElementById('btn-quiz-submit').addEventListener('click', submitQuizAnswer);
  document.getElementById('quiz-answer-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submitQuizAnswer();
  });
  document.getElementById('btn-quiz-hint').addEventListener('click', () => {
    document.getElementById('quiz-hint-box').classList.remove('hidden');
  });
  document.getElementById('btn-quiz-close').addEventListener('click', closeQuizModal);
  document.getElementById('btn-quiz-close-review').addEventListener('click', closeQuizModal);

  document.getElementById('btn-final-submit').addEventListener('click', submitFinalAnswer);
  document.getElementById('final-answer-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submitFinalAnswer();
  });
  document.getElementById('btn-final-close').addEventListener('click', closeFinalModal);

  document.getElementById('btn-admin-fixed').addEventListener('click', openAdminModal);
  document.getElementById('btn-admin-close').addEventListener('click', closeAdminModal);
  document.getElementById('btn-admin-auth-submit').addEventListener('click', submitAdminPasscode);
  document.getElementById('admin-passcode-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submitAdminPasscode();
  });
  document.getElementById('btn-admin-unlock').addEventListener('click', adminUnlock);
  document.getElementById('btn-admin-reset').addEventListener('click', adminResetDevice);

  document.getElementById('btn-resume').addEventListener('click', () => {
    enterFullscreenSafe();
    armSecurity();
    hideResumeOverlay();
  });

  document.querySelectorAll('.modal-overlay[data-dismissible="true"]').forEach((overlay) => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.classList.remove('active');
    });
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
