// ── UIロジック ────────────────────────────────────────────────

const EXAMPLE = `Gm Am7(-5) D7 D#
Ddim Cm F7 A#M7

Fsus4 G6 Cadd9 Am7
Bdim E Am`;

let semitones = 0;

const textarea    = document.getElementById("chord-input");
const output      = document.getElementById("output");
const semLabel    = document.getElementById("semitone-label");
const btnReset    = document.getElementById("btn-reset");
const btnUp       = document.getElementById("btn-up");
const btnDown     = document.getElementById("btn-down");
const semEquiv    = document.getElementById("semitone-equiv");

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
    semEquiv.classList.add("hidden");
  } else {
    semLabel.textContent = (semitones > 0 ? "+" : "") + semitones;
    semLabel.classList.add("active");
    btnReset.classList.remove("hidden");

    // ±11を超えたらmod12した等価値を表示
    const abs = Math.abs(semitones);
    if (abs > 11) {
      const equiv = (abs % 12) * (semitones > 0 ? 1 : -1);
      const equivStr = equiv === 0 ? "= Original" : `= ${equiv > 0 ? "+" : ""}${equiv}`;
      semEquiv.textContent = equivStr;
      semEquiv.classList.remove("hidden");
    } else {
      semEquiv.classList.add("hidden");
    }
  }
}

function makeChordPill(chord) {
  const span = document.createElement("span");
  span.className = "chord-pill";

  const m = chord.match(/^([A-G][#]?m?)(.*)/);
  const root   = m ? m[1] : chord;
  const suffix = m ? m[2] : "";

  const rootSpan = document.createElement("span");
  rootSpan.className = "chord-root";
  rootSpan.textContent = root;
  span.appendChild(rootSpan);

  if (suffix) {
    const sufSpan = document.createElement("sup");
    sufSpan.className = "chord-suffix";
    sufSpan.textContent = suffix;
    span.appendChild(sufSpan);
  }

  return span;
}

// ── イベント ──────────────────────────────────────────────────

btnUp.addEventListener("click",   () => { semitones++; render(); });
btnDown.addEventListener("click", () => { semitones--; render(); });
btnReset.addEventListener("click", () => { semitones = 0; render(); });
textarea.addEventListener("input", render);

// 初回描画
render();