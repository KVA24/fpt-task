import {useEffect, useRef, useState} from 'react';

export const usePullToRefresh = (threshold = 200) => {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const startY = useRef(0);
  const isRefreshing = useRef(false);
  
  useEffect(() => {
    const handleTouchStart = (e: any) => {
      if (window.scrollY === 0 && !isRefreshing.current) {
        startY.current = e.touches[0].clientY;
        setIsPulling(true);
      }
    };
    
    const handleTouchMove = (e: any) => {
      if (!isPulling || window.scrollY > 0 || isRefreshing.current) return;
      
      const currentY = e.touches[0].clientY;
      const distance = currentY - startY.current;
      
      if (distance > 0) {
        setPullDistance(Math.min(distance, threshold * 1.5));
        if (distance > 10) {
          e.preventDefault();
        }
      }
    };
    
    const handleTouchEnd = () => {
      if (pullDistance >= threshold && !isRefreshing.current) {
        isRefreshing.current = true;
        
        // Delay nhỏ để animation mượt hơn
        setTimeout(() => {
          window.location.reload();
        }, 300);
      } else {
        setIsPulling(false);
        setPullDistance(0);
      }
    };
    
    document.addEventListener('touchstart', handleTouchStart, {passive: true});
    document.addEventListener('touchmove', handleTouchMove, {passive: false});
    document.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isPulling, pullDistance, threshold]);
  
  const progress = Math.min((pullDistance / threshold) * 100, 100);
  const isReady = pullDistance >= threshold;
  
  return {isPulling, pullDistance, isReady, progress};
};

