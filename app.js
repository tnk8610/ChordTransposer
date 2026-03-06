// ── UIロジック ────────────────────────────────────────────────

const EXAMPLE = `Am  F  C  G
Dm7  E7  Am
Fsus4  G  Cadd9  Am7
Bdim  E  Am`;

let semitones = 0;

const textarea    = document.getElementById("chord-input");
const output      = document.getElementById("output");
const semLabel    = document.getElementById("semitone-label");
const btnReset    = document.getElementById("btn-reset");
const btnUp       = document.getElementById("btn-up");
const btnDown     = document.getElementById("btn-down");

// 初期値
textarea.value = EXAMPLE;

// ── レンダリング ──────────────────────────────────────────────

function render() {
  const lines = textarea.value.split("\n");
  output.innerHTML = "";

  lines.forEach(line => {
    const div = document.createElement("div");
    div.className = "chord-line";

    if (line.trim() === "") {
      const empty = document.createElement("span");
      empty.className = "empty-line";
      empty.textContent = "—";
      div.appendChild(empty);
    } else {
      const tokens = transposeLine(line, semitones);
      tokens.forEach(tok => {
        if (tok.type === "space") {
          const span = document.createElement("span");
          span.className = "chord-space";
          span.textContent = tok.value;
          div.appendChild(span);
        } else if (tok.type === "chord") {
          div.appendChild(makeChordPill(tok.value));
        } else {
          const span = document.createElement("span");
          span.className = "chord-space";
          span.textContent = tok.value;
          div.appendChild(span);
        }
      });
    }

    output.appendChild(div);
  });

  // セミトーン表示更新
  if (semitones === 0) {
    semLabel.textContent = "Original";
    semLabel.classList.remove("active");
    btnReset.classList.add("hidden");
  } else {
    semLabel.textContent = (semitones > 0 ? "+" : "") + semitones;
    semLabel.classList.add("active");
    btnReset.classList.remove("hidden");
  }
}

function makeChordPill(chord) {
  const span = document.createElement("span");
  span.className = "chord-pill";

  const m = chord.match(/^([A-G][#b]?)(.*)/);
  const root   = m ? m[1] : chord;
  const suffix = m ? m[2] : "";

  const rootSpan = document.createElement("span");
  rootSpan.className = "chord-root";
  rootSpan.textContent = root;
  span.appendChild(rootSpan);

  if (suffix) {
    const sufSpan = document.createElement("span");
    sufSpan.className = "chord-suffix";
    sufSpan.textContent = suffix;
    span.appendChild(sufSpan);
  }

  return span;
}

// ── イベント ──────────────────────────────────────────────────

btnUp.addEventListener("click", () => { semitones++; render(); });
btnDown.addEventListener("click", () => { semitones--; render(); });
btnReset.addEventListener("click", () => { semitones = 0; render(); });
textarea.addEventListener("input", render);

// 初回描画
render();
