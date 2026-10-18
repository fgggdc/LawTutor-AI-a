import html2pdf from 'html2pdf.js';

export const downloadPDF = (elementId: string, filename: string = 'Document.pdf') => {
  const element = document.getElementById(elementId);
  if (!element) {
    return;
  }

  // Hide elements with 'no-print' class temporarily for the PDF generation
  const noPrintElements = element.querySelectorAll('.no-print');
  const originalDisplays: string[] = [];
  noPrintElements.forEach((el: any, index) => {
    originalDisplays[index] = el.style.display;
    el.style.display = 'none';
  });

  const originalGetComputedStyle = window.getComputedStyle;

  // Monkey-patch getComputedStyle to intercept oklch colors which crash html2canvas
  window.getComputedStyle = function(el, pseudoElt) {
    const style = originalGetComputedStyle(el, pseudoElt);
    return new Proxy(style, {
      get(target, prop) {
        if (prop === 'getPropertyValue') {
          return function(propName: string) {
            let val = target.getPropertyValue(propName);
            if (typeof val === 'string' && (val.includes('oklch') || val.includes('oklab'))) {
              if (propName.includes('background')) return 'rgb(255, 255, 255)';
              if (propName.includes('color')) return 'rgb(0, 0, 0)';
              if (propName.includes('border')) return 'rgb(229, 231, 235)';
              return 'transparent';
            }
            return val;
          };
        }
        let val = target[prop as keyof CSSStyleDeclaration];
        if (typeof val === 'string' && (val.includes('oklch') || val.includes('oklab'))) {
          if (typeof prop === 'string') {
            if (prop.includes('background') || prop.includes('Background')) return 'rgb(255, 255, 255)';
            if (prop.includes('color') || prop.includes('Color')) return 'rgb(0, 0, 0)';
            if (prop.includes('border') || prop.includes('Border')) return 'rgb(229, 231, 235)';
          }
          return 'transparent';
        }
        if (typeof val === 'function') {
          return (val as Function).bind(target);
        }
        return val;
      }
    });
  };

  const opt = {
    margin:       15,
    filename:     filename,
    image:        { type: 'jpeg' as const, quality: 0.98 },
    html2canvas:  { scale: 2, useCORS: true, letterRendering: true },
    jsPDF:        { unit: 'mm' as const, format: 'a4', orientation: 'portrait' as const }
  };

  html2pdf().set(opt).from(element).save().then(() => {
    // Restore original getComputedStyle
    window.getComputedStyle = originalGetComputedStyle;
    
    // Restore 'no-print' elements
    noPrintElements.forEach((el: any, index) => {
      el.style.display = originalDisplays[index];
    });
  }).catch((err: any) => {
    console.error("PDF generation error:", err);
    window.getComputedStyle = originalGetComputedStyle;
  });
};

export const downloadTextFile = (content: string, filename: string = 'LawTutor_Document.txt') => {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
