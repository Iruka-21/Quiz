/* ==========================================================
   🔑 管理者パスコード
========================================================== */
const ADMIN_PASSWORD = "admin";

/* ==========================================================
   🟩 問題プール（画像イメージの一区画〜四区画＋FINAL対応） 🟩
========================================================== */
const SECTOR_POOLS = [
    {
        id: 0,
        name: "一区画",
        shortName: "一区画",
        areaName: "JUNGLE AREA",
        icon: "🦖",
        patterns: [
            {
                patternName: "A",
                title: "一区画：ジャングルエリア (JUNGLE AREA A)",
                location: "1階 101教室前へ向かってください",
                question: "【調査ミッション 01-A】\nジャングルの看板右下の影が指し示す4文字の英単語を入力せよ。",
                answers: ["BRAK", "ブラキオ"],
                hint: "矢印の先にあるアルファベットを順に読んでみよう。",
                explanation: "正解は「BRAK」！草食恐竜の手がかりを回収しました。"
            },
            {
                patternName: "B",
                title: "一区画：ジャングルエリア (JUNGLE AREA B)",
                location: "1階 101教室前へ向かってください",
                question: "【調査ミッション 01-B】\n3本の角を持つ恐竜の足元にある暗号を解読せよ。\n『3本のツノが指すアルファベット4文字は？』",
                answers: ["TRIC", "トリケラ"],
                hint: "頭骨プレートのツノの方向を確認しよう。",
                explanation: "正解は「TRIC」！草食恐竜の手がかりを回収しました。"
            }
        ]
    },
    {
        id: 1,
        name: "二区画",
        shortName: "二区画",
        areaName: "RIVER AREA",
        icon: "🦕",
        patterns: [
            {
                patternName: "A",
                title: "二区画：リバーエリア (RIVER AREA A)",
                location: "2階 生徒会室前へ向かってください",
                question: "【調査ミッション 02-A】\n川沿いの監視カメラコードを特定せよ。\n『琥珀のDNA配列から欠落している恐竜のコードネームは？』",
                answers: ["RAPTOR", "ラプター"],
                hint: "ポッド側面の「A-T-G-C」変換表をチェック！",
                explanation: "正解は「RAPTOR」！水辺の肉食恐竜フェンスコードを取得。"
            },
            {
                patternName: "B",
                title: "二区画：リバーエリア (RIVER AREA B)",
                location: "2階 生徒会室前へ向かってください",
                question: "【調査ミッション 02-B】\nボート乗り場の緊急キーを割り出せ。\n『水門レバーに刻まれた頭文字3文字を入力せよ』",
                answers: ["IND", "インドラ"],
