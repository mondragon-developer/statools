import { useEffect } from 'react';

export default function useDocumentTitle(title) {
  useEffect(() => {
    const prev = document.title;
    document.title = title ? `${title} — MDragon Data Tools` : 'MDragon Data Tools';
    return () => { document.title = prev; };
  }, [title]);
}
