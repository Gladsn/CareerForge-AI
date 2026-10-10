/**
 * Helper to export or open LaTeX code directly in Overleaf
 */
export function openInOverleaf(texContent: string, documentTitle = 'CareerForge_Tailored_Resume') {
  try {
    // Overleaf accepts a form POST to https://www.overleaf.com/docs with snip_uri or snip
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://www.overleaf.com/docs';
    form.target = '_blank';

    const inputSnip = document.createElement('input');
    inputSnip.type = 'hidden';
    inputSnip.name = 'snip';
    inputSnip.value = texContent;
    form.appendChild(inputSnip);

    const inputName = document.createElement('input');
    inputName.type = 'hidden';
    inputName.name = 'snip_name';
    inputName.value = `${documentTitle}.tex`;
    form.appendChild(inputName);

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
    return true;
  } catch (e) {
    console.error('Failed to submit Overleaf form', e);
    // Fallback: open Overleaf homepage
    window.open('https://www.overleaf.com/project', '_blank');
    return false;
  }
}

export function downloadTexFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/x-tex;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.tex') ? filename : `${filename}.tex`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
