// ── 音楽ロジック ────────────────────────────────────────────────

const CHROMATIC = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

const FLAT_TO_SHARP = {
  Db: "C#", Eb: "D#", Fb: "E",
  Gb: "F#", Ab: "G#", Bb: "A#", Cb: "B"
};

// スペース区切りのトークンがコードかどうか判定（完全一致）
const CHORD_RE = /^[A-G][#b]?(?:maj(?:7|9|11|13)?|min(?:7|9|11|13)?|m(?:aj)?(?:7|9|11|13)?|M(?:7|9|11|13)?|dim7?|aug7?|sus[24]?|add(?:9|11|13)?|[0-9]+)?(?:\/[A-G][#b]?)?$/;

function normalizeNote(note) {
  return FLAT_TO_SHARP[note] ?? note;
}

function transposeNote(note, semitones) {
  const norm = normalizeNote(note);
  const idx = CHROMATIC.indexOf(norm);
  if (idx === -1) return note;
  return CHROMATIC[((idx + semitones) % 12 + 12) % 12];
}

function transposeChord(chord, semitones) {
  // スラッシュコード対応 (例: G/B)
  return chord.split("/").map(part => {
    const m = part.match(/^([A-G][#b]?)/);
    if (!m) return part;
    return transposeNote(m[1], semitones) + part.slice(m[1].length);
  }).join("/");
}

// 1行をスペース区切りでトークン化し、コードか否かを判定
function tokenizeLine(line) {
  const parts = line.split(/(\s+)/);
  return parts.map(part => {
    if (/^\s+$/.test(part) || part === "") {
      return { type: "space", value: part };
    } else if (CHORD_RE.test(part)) {
      return { type: "chord", value: part };
    } else {
      return { type: "text", value: part };
    }
  });
}

function transposeLine(line, semitones) {
  if (semitones === 0) return tokenizeLine(line);
  return tokenizeLine(line).map(tok => {
    if (tok.type === "chord") {
      return { type: "chord", value: transposeChord(tok.value, semitones) };
    }
    return tok;
  });
}
