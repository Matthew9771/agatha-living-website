import { useRef } from 'react';

export function useSwipeGallery(imageCount, setActiveIndex) {
  const gesture = useRef(null);
  const suppressClickUntil = useRef(0);

  return {
    onPointerDown(event) {
      if (!event.isPrimary) {
        gesture.current = null;
        return;
      }
      suppressClickUntil.current = 0;
      if (imageCount < 2 || !['touch', 'pen'].includes(event.pointerType)) return;
      gesture.current = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY };
    },
    onPointerUp(event) {
      const start = gesture.current;
      gesture.current = null;
      if (!start || start.pointerId !== event.pointerId) return;
      const horizontal = event.clientX - start.startX;
      const vertical = event.clientY - start.startY;
      if (Math.abs(horizontal) < 45 || Math.abs(horizontal) < Math.abs(vertical) * 1.4) return;
      suppressClickUntil.current = Date.now() + 600;
      setActiveIndex(current => (current + (horizontal < 0 ? 1 : -1) + imageCount) % imageCount);
    },
    onPointerCancel() {
      gesture.current = null;
    },
    onClickCapture(event) {
      if (Date.now() < suppressClickUntil.current) {
        event.preventDefault();
        event.stopPropagation();
      }
    },
  };
}
