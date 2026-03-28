import { useEffect, useRef, ReactNode } from 'react';
import Lenis from 'lenis';

interface SmoothScrollWrapperProps {
  children: ReactNode;
}

const SmoothScrollWrapper = ({ children }: SmoothScrollWrapperProps) => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    lenisRef.current = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenisRef.current?.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Scroll to top on mount
    window.scrollTo(0, 0);

    return () => {
      lenisRef.current?.destroy();
    };
  }, []);

  return <>{children}</>;
};

export default SmoothScrollWrapper;
