/**
 * Converts LaTeX to HTML, handling common LaTeX patterns
 */
export function convertLatexToHtml(latex: string): string {
  if (!latex) return '';

  // Replace LaTeX math delimiters with HTML
  let html = latex
    // Replace inline math
    .replace(/\$([^$]+)\$/g, '<code>$1</code>')
    // Replace display math
    .replace(/\$\$([^$]+)\$\$/g, '<pre><code>$1</code></pre>')
    // Replace LaTeX commands
    .replace(/\\textbf{([^}]+)}/g, '<strong>$1</strong>')
    .replace(/\\textit{([^}]+)}/g, '<em>$1</em>')
    .replace(/\\underline{([^}]+)}/g, '<u>$1</u>')
    // Replace LaTeX environments
    .replace(/\\begin{itemize}([\s\S]*?)\\end{itemize}/g, '<ul>$1</ul>')
    .replace(/\\begin{enumerate}([\s\S]*?)\\end{enumerate}/g, '<ol>$1</ol>')
    .replace(/\\item\s*/g, '<li>')
    .replace(/\\end{itemize}|\\end{enumerate}/g, '</li>')
    // Replace LaTeX sections
    .replace(/\\section{([^}]+)}/g, '<h2>$1</h2>')
    .replace(/\\subsection{([^}]+)}/g, '<h3>$1</h3>')
    .replace(/\\paragraph{([^}]+)}/g, '<h4>$1</h4>')
    // Replace LaTeX special characters
    .replace(/\\&/g, '&amp;')
    .replace(/\\%/g, '%')
    .replace(/\\_/g, '_')
    .replace(/\\#/g, '#')
    .replace(/\\{/g, '{')
    .replace(/\\}/g, '}')
    // Replace LaTeX quotes
    .replace(/``([^'']+)''/g, '"$1"')
    .replace(/`([^'']+)'/g, "'$1'")
    // Replace LaTeX spaces
    .replace(/\\,/g, ' ')
    .replace(/\\;/g, ' ')
    .replace(/\\:/g, ' ')
    // Replace LaTeX newlines
    .replace(/\\\\/g, '<br>')
    // Replace LaTeX code blocks
    .replace(/\\begin{verbatim}([\s\S]*?)\\end{verbatim}/g, '<pre><code>$1</code></pre>')
    .replace(/\\begin{lstlisting}([\s\S]*?)\\end{lstlisting}/g, '<pre><code>$1</code></pre>')
    // Replace LaTeX tables
    .replace(/\\begin{tabular}([\s\S]*?)\\end{tabular}/g, '<table>$1</table>')
    .replace(/\\hline/g, '<tr><td colspan="100%"><hr></td></tr>')
    .replace(/&/g, '</td><td>')
    .replace(/\\\\/g, '</td></tr><tr><td>')
    // Clean up any remaining LaTeX commands
    .replace(/\\[a-zA-Z]+{([^}]+)}/g, '$1')
    // Clean up any remaining LaTeX delimiters
    .replace(/[{}]/g, '');

  // Ensure proper HTML structure
  if (!html.includes('<h1>')) {
    html = `<h1>Code Review Analysis</h1>\n${html}`;
  }

  // Ensure proper list structure
  html = html.replace(/<li>([^<]*?)(?=<li>|$)/g, '<li>$1</li>');

  return html;
} 