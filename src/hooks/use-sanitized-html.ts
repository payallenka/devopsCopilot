import { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';

const ALLOWED_TAGS = [
  'h1', 'h2', 'h3', 'h4', 'p', 'ul', 'ol', 'li', 'strong', 'em', 
  'code', 'pre', 'br', 'hr', 'blockquote', 'a', 'table', 'thead', 
  'tbody', 'tr', 'th', 'td', 'div', 'span'
];

const ALLOWED_ATTR = [
  'href', 'target', 'rel', 'class', 'id', 'style', 'data-*',
  'aria-*', 'role', 'tabindex', 'title', 'alt'
];

// Only configure DOMPurify on the client side
if (typeof window !== 'undefined') {
  DOMPurify.setConfig({
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: true,
    ALLOW_ARIA_ATTR: true,
    ALLOW_UNKNOWN_PROTOCOLS: true,
    ADD_ATTR: ['target'],
    ADD_TAGS: ['div', 'span'],
    KEEP_CONTENT: true,
    SANITIZE_DOM: true,
    WHOLE_DOCUMENT: false,
    RETURN_DOM: false,
    RETURN_DOM_FRAGMENT: false,
    RETURN_TRUSTED_TYPE: false,
    FORCE_BODY: false,
    SANITIZE_NAMED_PROPS: false,
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp|xxx):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  });
}

export function useSanitizedHtml(html: string | null) {
  const [sanitizedHtml, setSanitizedHtml] = useState<string | null>(html);

  useEffect(() => {
    if (html && typeof window !== 'undefined') {
      // First, ensure the HTML has proper structure
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      
      // Add any missing required sections
      if (!tempDiv.querySelector('h1')) {
        const h1 = document.createElement('h1');
        h1.textContent = 'Code Review Analysis';
        tempDiv.insertBefore(h1, tempDiv.firstChild);
      }

      // Sanitize the HTML
      const clean = DOMPurify.sanitize(tempDiv.innerHTML, {
        ALLOWED_TAGS,
        ALLOWED_ATTR,
        ALLOW_DATA_ATTR: true,
        ALLOW_ARIA_ATTR: true,
        KEEP_CONTENT: true,
        SANITIZE_DOM: true,
      });

      setSanitizedHtml(clean);
    } else {
      setSanitizedHtml(html);
    }
  }, [html]);

  return sanitizedHtml;
} 