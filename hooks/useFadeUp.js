import { useEffect, useRef } from 'react';

export function useFadeUp() {
  const fadeRefs = useRef([]);

  useEffect(() => {
    const revealAll = () => {
      fadeRefs.current.forEach(el => el && el.classList.add('visible'));
    };

    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
      revealAll();
      return undefined;
    }

    const observer = new IntersectionObserver(
      entries => entries.forEach((entry, i) => {
        if (entry.isIntersecting) setTimeout(() => entry.target.classList.add('visible'), i * 120);
      }),
      { threshold: 0.1 }
    );

    fadeRefs.current.forEach(el => el && observer.observe(el));
    const fallbackTimer = window.setTimeout(revealAll, 900);

    return () => {
      window.clearTimeout(fallbackTimer);
      observer.disconnect();
    };
  }, []);

  const addRef = el => {
    if (el && !fadeRefs.current.includes(el)) fadeRefs.current.push(el);
  };

  return addRef;
}
