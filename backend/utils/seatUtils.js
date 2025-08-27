export function parseSeatLabel(label) {
  if (typeof label !== 'string') return null;
  const m = label.match(/^([A-Z])([1-9][0-9]*)$/);
  if (!m) return null;
  const rowLetter = m[1];
  const colNum = parseInt(m[2], 10);
  const row = rowLetter.charCodeAt(0) - 65; // A -> 0
  const col = colNum - 1; // columns are 1-indexed in labels
  return { row, col, rowLetter, colNum };
}

export function isSeatWithinLayout(label, layout) {
  const p = parseSeatLabel(label);
  if (!p) return false;
  if (!layout || typeof layout.rows !== 'number' || typeof layout.cols !== 'number') return false;
  return p.row >= 0 && p.row < layout.rows && p.col >= 0 && p.col < layout.cols;
}

export function normalizeSeatLabel(label) {
  // Ensure uppercase and trimmed
  if (typeof label !== 'string') return label;
  return label.trim().toUpperCase();
}