import { LatexValidationResult, LatexValidationWarning, LatexStats } from '../types/resume';

export function validateLatex(texCode: string): LatexValidationResult {
  const warnings: LatexValidationWarning[] = [];
  const lines = texCode.split('\n');

  let braceBalance = 0;
  let hasBeginDoc = false;
  let hasEndDoc = false;
  let documentClass = 'Unknown';
  let sectionCount = 0;
  let commandCount = 0;

  // Track environments in a stack
  const envStack: { name: string; line: number }[] = [];

  // Check documentclass
  const docClassMatch = texCode.match(/\\documentclass(?:\[[^\]]*\])?\{([^}]+)\}/);
  if (docClassMatch) {
    documentClass = docClassMatch[1];
  } else {
    warnings.push({
      severity: 'error',
      message: 'Missing \\documentclass declaration at top of document',
      rule: 'document_structure',
    });
  }

  // Scan line by line
  for (let i = 0; i < lines.length; i++) {
    const lineNum = i + 1;
    const rawLine = lines[i];

    // Strip comments for structural parsing, but keep track of raw line
    // Handle escaped \% vs comment %
    let codePart = '';
    let isComment = false;
    for (let charIdx = 0; charIdx < rawLine.length; charIdx++) {
      const char = rawLine[charIdx];
      const prevChar = charIdx > 0 ? rawLine[charIdx - 1] : '';

      if (char === '%' && prevChar !== '\\') {
        isComment = true;
        break;
      }
      codePart += char;
    }

    // Count LaTeX commands (\command)
    const commandsOnLine = codePart.match(/\\[a-zA-Z]+/g);
    if (commandsOnLine) {
      commandCount += commandsOnLine.length;
    }

    // Check for sections
    if (/\\(?:section|subsection|subsubsection)\*?\{/.test(codePart)) {
      sectionCount++;
    }

    // Check begin/end document
    if (/\\begin\{document\}/.test(codePart)) {
      hasBeginDoc = true;
    }
    if (/\\end\{document\}/.test(codePart)) {
      hasEndDoc = true;
    }

    // Track \begin{...} and \end{...}
    const beginMatches = [...codePart.matchAll(/\\begin\{([a-zA-Z*]+)\}/g)];
    for (const match of beginMatches) {
      envStack.push({ name: match[1], line: lineNum });
    }

    const endMatches = [...codePart.matchAll(/\\end\{([a-zA-Z*]+)\}/g)];
    for (const match of endMatches) {
      const endEnv = match[1];
      if (envStack.length === 0) {
        warnings.push({
          line: lineNum,
          severity: 'error',
          message: `Unexpected \\end{${endEnv}} with no matching \\begin`,
          rule: 'environment_mismatch',
        });
      } else {
        const top = envStack.pop()!;
        if (top.name !== endEnv) {
          warnings.push({
            line: lineNum,
            severity: 'error',
            message: `Environment mismatch: \\begin{${top.name}} on line ${top.line} closed with \\end{${endEnv}}`,
            rule: 'environment_mismatch',
          });
        }
      }
    }

    // Check brace balance on non-comment code
    for (let charIdx = 0; charIdx < codePart.length; charIdx++) {
      const char = codePart[charIdx];
      const prevChar = charIdx > 0 ? codePart[charIdx - 1] : '';
      if (prevChar === '\\') continue; // Escaped \{ or \}

      if (char === '{') braceBalance++;
      if (char === '}') braceBalance--;

      if (braceBalance < 0) {
        warnings.push({
          line: lineNum,
          severity: 'error',
          message: `Unmatched closing brace '}' found`,
          rule: 'brace_balance',
        });
        braceBalance = 0; // Reset to avoid cascade
      }
    }

    // Check for unescaped & outside tabular/tabularx/array
    // Check if currently inside a table-like environment
    const isInTable = envStack.some((e) =>
      ['tabular', 'tabularx', 'table', 'align', 'matrix', 'array'].includes(e.name)
    );
    if (!isInTable && /(?<!\\)&/.test(codePart)) {
      warnings.push({
        line: lineNum,
        severity: 'warning',
        message: `Unescaped '&' found outside table/align environment. Should this be '\\&'?`,
        rule: 'special_characters',
      });
    }

    // Check for unescaped _ outside math ($...$)
    // Quick heuristic: unescaped underscore not preceded by \
    const hasUnescapedUnderscore = /(?<!\\)_/.test(codePart);
    const hasMathDollar = (codePart.match(/(?<!\\)\$/g) || []).length % 2 !== 0;
    if (hasUnescapedUnderscore && !hasMathDollar && !/\\(?:href|url|includegraphics)/.test(codePart)) {
      warnings.push({
        line: lineNum,
        severity: 'info',
        message: `Unescaped '_' found. If this is a URL or identifier, use '\\_' or \\href{...}`,
        rule: 'special_characters',
      });
    }
  }

  // End of document checks
  if (!hasBeginDoc) {
    warnings.push({
      severity: 'error',
      message: 'Missing \\begin{document}',
      rule: 'document_structure',
    });
  }

  if (!hasEndDoc) {
    warnings.push({
      severity: 'error',
      message: 'Missing \\end{document} at end of file',
      rule: 'document_structure',
    });
  }

  if (braceBalance > 0) {
    warnings.push({
      severity: 'error',
      message: `${braceBalance} unclosed opening brace(s) '{' detected in the document`,
      rule: 'brace_balance',
    });
  }

  // Check remaining open environments
  while (envStack.length > 0) {
    const unclosed = envStack.pop()!;
    if (unclosed.name !== 'document') {
      warnings.push({
        line: unclosed.line,
        severity: 'error',
        message: `Unclosed environment \\begin{${unclosed.name}} opened on line ${unclosed.line}`,
        rule: 'environment_mismatch',
      });
    }
  }

  // Check for common packages
  const hasGeometry = /\\usepackage(?:\[[^\]]*\])?\{geometry\}/.test(texCode);
  const hasHyperref = /\\usepackage(?:\[[^\]]*\])?\{hyperref\}/.test(texCode);
  if (!hasGeometry) {
    warnings.push({
      severity: 'info',
      message: 'Recommended package "geometry" not detected. Margins may use default LaTeX spacing.',
      rule: 'best_practices',
    });
  }
  if (!hasHyperref) {
    warnings.push({
      severity: 'info',
      message: 'Recommended package "hyperref" not detected for clickable email/portfolio links.',
      rule: 'best_practices',
    });
  }

  const isValid = !warnings.some((w) => w.severity === 'error');

  const stats: LatexStats = {
    lineCount: lines.length,
    sectionCount,
    commandCount,
    documentClass,
    braceBalance,
    hasBeginDoc,
    hasEndDoc,
  };

  return {
    isValid,
    warnings,
    stats,
  };
}
