import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Client-side navigation keeps the previous scroll position and ignores #hash targets.
// The target can live in a lazily loaded page that is not rendered yet, so retry briefly.
export default function useScrollToHash() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return undefined;
    }
    let tries = 0;
    let timer;
    const attempt = () => {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (target) {
        target.scrollIntoView();
      } else if (tries < 20) {
        tries += 1;
        timer = setTimeout(attempt, 100);
      }
    };
    attempt();
    return () => clearTimeout(timer);
  }, [pathname, hash]);
}
