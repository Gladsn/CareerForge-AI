export interface DiffLine {
  type: 'same' | 'added' | 'removed';
  masterLine?: string;
  tailoredLine?: string;
  lineNum: number;
}

export function computeSimpleDiff(masterText: string, tailoredText: string): DiffLine[] {
  const masterLines = masterText.split('\n');
  const tailoredLines = tailoredText.split('\n');
  const result: DiffLine[] = [];

  const maxLen = Math.max(masterLines.length, tailoredLines.length);

  for (let i = 0; i < maxLen; i++) {
    const m = masterLines[i];
    const t = tailoredLines[i];

    if (m === undefined) {
      result.push({
        type: 'added',
        tailoredLine: t,
        lineNum: i + 1,
      });
    } else if (t === undefined) {
      result.push({
        type: 'removed',
        masterLine: m,
        lineNum: i + 1,
      });
    } else if (m.trim() === t.trim()) {
      result.push({
        type: 'same',
        masterLine: m,
        tailoredLine: t,
        lineNum: i + 1,
      });
    } else {
      // Changed line: show as removal of master + addition of tailored
      result.push({
        type: 'removed',
        masterLine: m,
        lineNum: i + 1,
      });
      result.push({
        type: 'added',
        tailoredLine: t,
        lineNum: i + 1,
      });
    }
  }

  return result;
}
