const lessons = [
  {
    id: "neuron",
    title: "01. Что такое нейрон",
    html: `<h3>Биологическая метафора и математика</h3><p>Искусственный нейрон — это функция. Он берёт входы, умножает их на веса, добавляет смещение и пропускает сумму через активацию.</p><p><code>y = f(w1x1 + w2x2 + b)</code></p><ul><li><b>Веса</b> говорят, насколько важен каждый вход.</li><li><b>Смещение (bias)</b> сдвигает порог.</li><li><b>Активация</b> делает ответ нелинейным.</li></ul><div class="quiz"><p><b>Проверка:</b> что произойдёт, если все веса равны нулю?</p><button data-q="a">Выход равен активации от bias</button><button data-q="b">Сеть выучит XOR</button><button data-q="c">Выход станет случайным</button><div class="feedback"></div></div>`,
    answer: "a", ok: "Верно. Без весов остаётся только f(b).", bad: "При нулевых весах z = b, значит y = f(b)."
  },
  {
    id: "perceptron", title: "02. Перцептрон",
    html: `<h3>Линейный классификатор</h3><p>Перцептрон рисует прямую на плоскости. XOR одной прямой не отделить.</p><div class="quiz"><p><b>Проверка:</b> какую задачу один перцептрон решит легко?</p><button data-q="a">XOR</button><button data-q="b">AND / OR</button><button data-q="c">Кошку на фото</button><div class="feedback"></div></div>`,
    answer: "b", ok: "Да. AND и OR линейно разделимы.", bad: "XOR нелинейно разделим."
  },
  {
    id: "activation", title: "03. Функции активации",
    html: `<h3>Зачем нелинейность</h3><ul><li>sigmoid</li><li>tanh</li><li>ReLU</li><li>ступенька</li></ul><div class="quiz"><p><b>Проверка:</b> что чаще в скрытых слоях?</p><button data-q="a">ступенька</button><button data-q="b">ReLU</button><button data-q="c">только softmax</button><div class="feedback"></div></div>`,
    answer: "b", ok: "ReLU и варианты — рабочая лошадка скрытых слоёв.", bad: "Ступенька плохо дифференцируется."
  },
  {
    id: "learning", title: "04. Ошибка и обучение",
    html: `<h3>Градиентный спуск</h3><p><code>w ← w − η · ∂L/∂w</code></p><div class="quiz"><p><b>Проверка:</b> что такое градиентный спуск?</p><button data-q="a">Случайно менять веса</button><button data-q="b">Шагать к уменьшению ошибки</button><button data-q="c">Добавлять нейроны</button><div class="feedback"></div></div>`,
    answer: "b", ok: "Идём против градиента ошибки.", bad: "Градиент указывает рост ошибки — идём против."
  },
  {
    id: "mlp", title: "05. Многослойные сети",
    html: `<h3>Скрытые слои</h3><p>Скрытый слой перекодирует пространство, чтобы XOR стал линейно разделимым.</p><div class="quiz"><p><b>Проверка:</b> зачем скрытый слой для XOR?</p><button data-q="a">Хранить картинки</button><button data-q="b">Сделать пространство линейно разделимым</button><button data-q="c">Убрать активацию</button><div class="feedback"></div></div>`,
    answer: "b", ok: "Да, скрытые нейроны строят новые признаки.", bad: "Нужна нелинейная перекодировка."
  },
  {
    id: "xor", title: "06. XOR своими руками",
    html: `<h3>Сеть 2 → 2 → 1</h3><div class="xor-grid"><div class="xor-cell">0 XOR 0 → <b id="xor00">?</b></div><div class="xor-cell">0 XOR 1 → <b id="xor01">?</b></div><div class="xor-cell">1 XOR 0 → <b id="xor10">?</b></div><div class="xor-cell">1 XOR 1 → <b id="xor11">?</b></div></div><button class="mini-btn" id="runXor" type="button">Посчитать сеть</button><div class="quiz"><p><b>Проверка:</b> XOR(1, 1)?</p><button data-q="a">1</button><button data-q="b">0</button><button data-q="c">0.5</button><div class="feedback"></div></div>`,
    answer: "b", ok: "XOR(1,1) = 0.", bad: "XOR истинен только если входы разные."
  }
];
const xorParams = { w11: 5.2, w12: 5.2, b1: -2.2, w21: -5.4, w22: -5.4, b2: 8.0, wo1: 6.0, wo2: 6.0, bo: -8.8 };
function $(sel) { return document.querySelector(sel); }
function bindRanges() {
  ["x1","x2","w1","w2","bias"].forEach((id) => {
    const el = document.getElementById(id);
    const out = document.getElementById(id + "v");
    const fmt = id.startsWith("x") ? (v) => Number(v).toFixed(1) : (v) => Number(v).toFixed(2);
    const sync = () => { out.textContent = fmt(el.value); drawNeuron(); };
    el.addEventListener("input", sync);
    sync();
  });
  $("#act").addEventListener("change", drawNeuron);
}
function drawNeuron() {
  const x1 = +$("#x1").value, x2 = +$("#x2").value;
  const w1 = +$("#w1").value, w2 = +$("#w2").value, b = +$("#bias").value;
  const act = $("#act").value;
  const z = w1 * x1 + w2 * x2 + b;
  const y = activate(act, z);
  $("#zVal").textContent = z.toFixed(3);
  $("#yVal").textContent = y.toFixed(3);
  $("#formula").textContent = `z = ${w1.toFixed(2)}·${x1.toFixed(1)} + ${w2.toFixed(2)}·${x2.toFixed(1)} + ${b.toFixed(2)}`;
  const canvas = $("#neuronCanvas");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const nodes = [
    { x: 80, y: 80, label: "x1", val: x1 },
    { x: 80, y: 200, label: "x2", val: x2 },
    { x: 260, y: 140, label: "S", val: z },
    { x: 430, y: 140, label: "f", val: y }
  ];
  [[0, 2, w1],[1, 2, w2],[2, 3, 1]].forEach(([a, b, weight]) => {
    const A = nodes[a], B = nodes[b];
    ctx.beginPath(); ctx.moveTo(A.x + 22, A.y); ctx.lineTo(B.x - 22, B.y);
    ctx.strokeStyle = weight >= 0 ? "rgba(110,168,255,.85)" : "rgba(248,113,113,.85)";
    ctx.lineWidth = 2 + Math.min(6, Math.abs(weight) * 2); ctx.stroke();
  });
  nodes.forEach((n) => {
    ctx.beginPath(); ctx.arc(n.x, n.y, 22, 0, Math.PI * 2);
    ctx.fillStyle = "#121a2e"; ctx.fill(); ctx.strokeStyle = "#6ea8ff"; ctx.stroke();
    ctx.fillStyle = "#e8edf7"; ctx.font = "14px Manrope"; ctx.textAlign = "center";
    ctx.fillText(n.label, n.x, n.y + 5);
    ctx.fillStyle = "#8b97b3"; ctx.font = "12px JetBrains Mono";
    ctx.fillText(Number(n.val).toFixed(2), n.x, n.y + 42);
  });
}
function renderNav(active) {
  const nav = $("#lessonNav");
  nav.innerHTML = lessons.map((l, i) => `<button data-i="${i}" class="${i === active ? "active" : ""}">${l.title}</button>`).join("");
  nav.querySelectorAll("button").forEach((btn) => btn.addEventListener("click", () => showLesson(+btn.dataset.i)));
}
function showLesson(i) {
  const lesson = lessons[i];
  renderNav(i);
  const body = $("#lessonBody");
  body.innerHTML = `<div class="progress"><i style="width:${((i + 1) / lessons.length) * 100}%"></i></div>` + lesson.html;
  body.querySelectorAll(".quiz button[data-q]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const fb = body.querySelector(".feedback");
      const good = btn.dataset.q === lesson.answer;
      fb.className = "feedback " + (good ? "ok" : "bad");
      fb.textContent = good ? lesson.ok : lesson.bad;
    });
  });
  const run = $("#runXor");
  if (run) run.addEventListener("click", () => {
    [[0,0,"xor00"],[0,1,"xor01"],[1,0,"xor10"],[1,1,"xor11"]].forEach(([a,b,id]) => {
      document.getElementById(id).textContent = xorForward(a, b, xorParams).y.toFixed(3);
    });
  });
}
document.getElementById("themeToggle").addEventListener("click", () => {
  const dark = getComputedStyle(document.documentElement).getPropertyValue("--bg").trim() === "#07090f";
  document.documentElement.style.setProperty("--bg", dark ? "#f4f6fb" : "#07090f");
  document.documentElement.style.setProperty("--card", dark ? "#ffffff" : "#101522");
  document.documentElement.style.setProperty("--text", dark ? "#121826" : "#e8edf7");
  document.documentElement.style.setProperty("--muted", dark ? "#5b6780" : "#8b97b3");
  document.documentElement.style.setProperty("--line", dark ? "#d8deea" : "#1e2740");
});
bindRanges();
showLesson(0);
