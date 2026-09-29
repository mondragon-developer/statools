import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import QuietBoundary from './QuietBoundary';

const Spline = lazy(() => import('@splinetool/react-spline'));

const SCENE = 'https://prod.spline.design/71R0PmKp72sQaYqg/scene.splinecode';

const query = (q) => typeof window !== 'undefined' && window.matchMedia(q).matches;

function useMediaQuery(q) {
  const [matches, setMatches] = useState(() => query(q));
  useEffect(() => {
    const mq = window.matchMedia(q);
    const onChange = (e) => setMatches(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [q]);
  return matches;
}

// Decorative 3D robot fixed behind every page (-z-10 paints it above the body color
// but below the transparent sections), so the opaque cards cover it as you scroll.
const RobotCompanion = () => {
  const wide = useMediaQuery('(min-width: 768px)');
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  const { pathname } = useLocation();
  const appRef = useRef(null);
  const reducedRef = useRef(reduced);
  reducedRef.current = reduced;

  // react-spline reads onLoad only once, so later motion-preference changes and
  // tab visibility are applied to the stored app instance here.
  useEffect(() => {
    const sync = () => {
      const app = appRef.current;
      if (!app) return;
      if (reducedRef.current || document.hidden) app.stop();
      else app.play();
    };
    sync();
    document.addEventListener('visibilitychange', sync);
    return () => document.removeEventListener('visibilitychange', sync);
  }, [reduced]);

  // Phones get no robot: the scene is heavy and would sit behind all the text.
  if (!wide) return null;

  const onLoad = (app) => {
    appRef.current = app;
    app.setBackgroundColor('rgba(0, 0, 0, 0)');
    if (reducedRef.current || document.hidden) app.stop();
  };

  // Full strength only on the home page; elsewhere it stays faint so text drawn
  // directly on the page background keeps its contrast.
  const home = pathname === '/';

  return (
    <div
      aria-hidden="true"
      className={`print:hidden fixed inset-y-0 right-0 -z-10 w-1/2 pointer-events-none transition-opacity ${home ? 'opacity-100' : 'opacity-30'}`}
    >
      <QuietBoundary>
        <Suspense fallback={null}>
          <Spline scene={SCENE} onLoad={onLoad} />
        </Suspense>
      </QuietBoundary>
    </div>
  );
};

export default RobotCompanion;
