/*
  ============================================================
  4 PARTS + FINAL PART クイズ
  ============================================================

  【構成】
  PART 1〜4：
    それぞれ複数の問題を用意できます。
    各PARTの最後に「PARTの答え」を設定します。

  FINAL：
    PART 1〜4 の答えの「頭文字」を順番に並べると、
    最終的な答えになります。

  🟩〇〇🟩 の部分を自由に編集してください。
  ============================================================
*/

// ============================================================
// PART 1
// ============================================================

const part1 = {
  title: "🟩PART 1：パート名🟩",

  questions: [
    {
      question: "🟩PART 1 - 問題1🟩",
      choices: [
        "🟩答えA🟩",
        "🟩答えB🟩",
        "🟩答えC🟩",
        "🟩答えD🟩"
      ],
      answer: 0,
      hint: "🟩ヒント🟩",
      explanation: "🟩解説🟩"
    },

    {
      question: "🟩PART 1 - 問題2🟩",
      choices: [
        "🟩答えA🟩",
        "🟩答えB🟩",
        "🟩答えC🟩",
        "🟩答えD🟩"
      ],
      answer: 1,
      hint: "🟩ヒント🟩",
      explanation: "🟩解説🟩"
    }

    // ↓ 問題を追加できます
  ],

  // このPARTから得られる答え
  finalAnswer: "🟩A🟩"
};


// ============================================================
// PART 2
// ============================================================

const part2 = {
  title: "🟩PART 2：パート名🟩",

  questions: [
    {
      question: "🟩PART 2 - 問題1🟩",
      choices: [
        "🟩答えA🟩",
        "🟩答えB🟩",
        "🟩答えC🟩",
        "🟩答えD🟩"
      ],
      answer: 0,
      hint: "🟩ヒント🟩",
      explanation: "🟩解説🟩"
    },

    {
      question: "🟩PART 2 - 問題2🟩",
      choices: [
        "🟩答えA🟩",
        "🟩答えB🟩",
        "🟩答えC🟩",
        "🟩答えD🟩"
      ],
      answer: 1,
      hint: "🟩ヒント🟩",
      explanation: "🟩解説🟩"
    }
  ],

  finalAnswer: "🟩B🟩"
};


// ============================================================
// PART 3
// ============================================================

const part3 = {
  title: "🟩PART 3：パート名🟩",

  questions: [
    {
      question: "🟩PART 3 - 問題1🟩",
      choices: [
        "🟩答えA🟩",
        "🟩答えB🟩",
        "🟩答えC🟩",
        "🟩答えD🟩"
      ],
      answer: 0,
      hint: "🟩ヒント🟩",
      explanation: "🟩解説🟩"
    },

    {
      question: "🟩PART 3 - 問題2🟩",
      choices: [
        "🟩答えA🟩",
        "🟩答えB🟩",
        "🟩答えC🟩",
        "🟩答えD🟩"
      ],
      answer: 1,
      hint: "🟩ヒント🟩",
      explanation: "🟩解説🟩"
    }
  ],

  finalAnswer: "🟩C🟩"
};


// ============================================================
// PART 4
// ============================================================

const part4 = {
  title: "🟩PART 4：パート名🟩",

  questions: [
    {
      question: "🟩PART 4 - 問題1🟩",
      choices: [
        "🟩答えA🟩",
        "🟩答えB🟩",
        "🟩答えC🟩",
        "🟩答えD🟩"
      ],
      answer: 0,
      hint: "🟩ヒント🟩",
      explanation: "🟩解説🟩"
    },

    {
      question: "🟩PART 4 - 問題2🟩",
      choices: [
        "🟩答えA🟩",
        "🟩答えB🟩",
        "🟩答えC🟩",
        "🟩答えD🟩"
      ],
      answer: 1,
      hint: "🟩ヒント🟩",
      explanation: "🟩解説🟩"
    }
  ],

  finalAnswer: "🟩D🟩"
};


// ============================================================
// FINAL PART
// ============================================================
//
// PART 1〜4の答えの頭文字を使って最終回答を導きます。
//
// 例：
// PART 1 = Apple
// PART 2 = Book
// PART 3 = Cat
// PART 4 = Dog
//
// → A + B + C + D
// → 最終回答「ABCD」
//
// finalAnswer は完成した答えに合わせて設定してください。
// ============================================================

const finalPart = {
  title: "🟩FINAL：最後の謎🟩",

  question:
    "🟩PART 1〜4で得られた答えの頭文字を順番に並べると、何になるでしょう？🟩",

  hint:
    "🟩4つのPARTで得られた答えの最初の文字に注目してください。🟩",

  // PART 1〜4の答えから自動生成されます
  get answer() {
    return [
      clean(part1.finalAnswer),
      clean(part2.finalAnswer),
      clean(part3.finalAnswer),
      clean(part4.finalAnswer)
    ].map(answer => answer.trim().charAt(0)).join("");
  },

  // 必要なら最終答えの説明も編集できます
  explanation:
    "🟩4つのPARTの答えの頭文字を順番に並べたものが最終回答です。🟩"
};


// ============================================================
// 以下は基本的に編集不要
// ============================================================

function clean(text) {
  return String(text).replaceAll("🟩", "");
}

const parts = [part1, part2, part3, part4];

let currentPart = 0;
let currentQuestion = 0;
let score = 0;
let totalQuestions = parts.reduce((sum, part) => sum + part.questions.length, 0);
let answered = false;

function getCurrentQuestion() {
  return parts[currentPart]?.questions[currentQuestion];
}

function render() {
  if (currentPart >= parts.length) {
    renderFinalPart();
    return;
  }

  const part = parts[currentPart];
  const q = getCurrentQuestion();

  if (!q) {
    currentPart++;
    currentQuestion = 0;
    render();
    return;
  }

  answered = false;

  $("quizCard").classList.remove("hidden");
  $("resultCard").classList.add("hidden");

  $("questionNumber").textContent =
    `PART ${currentPart + 1}  /  Q${currentQuestion + 1}`;

  $("progressText").textContent =
    `${currentQuestion + 1} / ${part.questions.length}`;

  $("scoreText").textContent = `正解 ${score}`;

  $("question").textContent =
    `${clean(part.title)}\n\n${clean(q.question)}`;

  $("question").style.whiteSpace = "pre-line";

  $("choices").innerHTML = "";

  q.choices.forEach((choice, index) => {
    const button = document.createElement("button");
    button.className = "choice";
    button.textContent =
      `${String.fromCharCode(65 + index)}. ${clean(choice)}`;

    button.addEventListener("click", () => selectAnswer(index));
    $("choices").appendChild(button);
  });

  $("hint").textContent = clean(q.hint);
  $("hint").classList.add("hidden");
  $("hintBtn").classList.remove("hidden");
  $("hintBtn").textContent = "💡 ヒントを見る";

  $("explanation").textContent = clean(q.explanation);
  $("explanation").classList.add("hidden");

  $("nextBtn").classList.add("hidden");

  updateProgress();
}

function updateProgress() {
  const completed =
    parts
      .slice(0, currentPart)
      .reduce((sum, part) => sum + part.questions.length, 0)
    + currentQuestion;

  $("progressBar").style.width =
    `${(completed / totalQuestions) * 100}%`;
}

function selectAnswer(index) {
  if (answered) return;
  answered = true;

  const q = getCurrentQuestion();
  const buttons = [...document.querySelectorAll(".choice")];

  buttons.forEach((button, i) => {
    button.disabled = true;

    if (i === q.answer) {
      button.classList.add("correct");
    }

    if (i === index && i !== q.answer) {
      button.classList.add("wrong");
    }
  });

  if (index === q.answer) {
    score++;
  }

  $("scoreText").textContent = `正解 ${score}`;
  $("explanation").classList.remove("hidden");
  $("nextBtn").classList.remove("hidden");

  const lastQuestion =
    currentPart === parts.length - 1 &&
    currentQuestion === parts[currentPart].questions.length - 1;

  $("nextBtn").textContent =
    lastQuestion ? "FINALへ →" : "次の問題 →";
}

function nextQuestion() {
  currentQuestion++;

  if (currentQuestion >= parts[currentPart].questions.length) {
    currentPart++;
    currentQuestion = 0;
  }

  render();
}

function renderFinalPart() {
  $("quizCard").classList.remove("hidden");
  $("resultCard").classList.add("hidden");

  $("questionNumber").textContent = "FINAL";
  $("progressText").textContent = "FINAL";
  $("scoreText").textContent = `正解 ${score}`;

  $("progressBar").style.width = "100%";

  $("question").textContent =
    clean(finalPart.title) + "\n\n" + clean(finalPart.question);

  $("choices").innerHTML = "";

  // 最終回答を入力して答え合わせ
  const input = document.createElement("input");
  input.id = "finalInput";
  input.type = "text";
  input.placeholder = "最終回答を入力";
  input.autocomplete = "off";
  input.style.cssText =
    "width:100%;padding:16px;border:2px solid #e3e7ef;border-radius:14px;font:inherit;font-size:18px;";

  $("choices").appendChild(input);

  const submit = document.createElement("button");
  submit.className = "next";
  submit.textContent = "最終回答を確認";
  submit.addEventListener("click", checkFinalAnswer);
  $("choices").appendChild(submit);

  $("hint").textContent = clean(finalPart.hint);
  $("hint").classList.add("hidden");
  $("hintBtn").classList.remove("hidden");
  $("hintBtn").textContent = "💡 ヒントを見る";

  $("explanation").classList.add("hidden");
  $("nextBtn").classList.add("hidden");
}

function checkFinalAnswer() {
  const input = $("finalInput");
  const userAnswer = input.value.trim();
  const correctAnswer = finalPart.answer.trim();

  if (!userAnswer) {
    input.focus();
    return;
  }

  const explanation = $("explanation");

  if (userAnswer.toUpperCase() === correctAnswer.toUpperCase()) {
    score++;
    explanation.textContent =
      `${clean(finalPart.explanation)}\n\n正解：${correctAnswer}`;
    explanation.classList.remove("hidden");

    input.disabled = true;

    const button = document.querySelector("#choices .next");
    button.disabled = true;
    button.textContent = "正解！";

    $("nextBtn").classList.remove("hidden");
    $("nextBtn").textContent = "結果を見る →";
    $("nextBtn").onclick = showResult;
  } else {
    explanation.textContent =
      "答えが一致しません。4つのPARTの答えをもう一度確認してください。";
    explanation.classList.remove("hidden");
  }
}

function showResult() {
  $("quizCard").classList.add("hidden");
  $("resultCard").classList.remove("hidden");

  $("finalScore").textContent = score;
  $("finalTotal").textContent = totalQuestions + 1;

  $("resultMessage").textContent =
    `FINAL ANSWER：${finalPart.answer}`;
}

function restart() {
  currentPart = 0;
  currentQuestion = 0;
  score = 0;
  render();
}

$("hintBtn").addEventListener("click", () => {
  $("hint").classList.toggle("hidden");

  $("hintBtn").textContent =
    $("hint").classList.contains("hidden")
      ? "💡 ヒントを見る"
      : "💡 ヒントを隠す";
});

$("restartBtn").addEventListener("click", restart);

render();
