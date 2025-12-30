import { useEffect } from "react";

export function useDisableZoom() {
  useEffect(() => {
    const preventZoom = (e: Event) => {
      // Chặn Ctrl + lăn chuột
      if (e instanceof WheelEvent && e.ctrlKey) {
        e.preventDefault();
      }
      // Chặn Ctrl + (+/-)
      if (e instanceof KeyboardEvent && (e.ctrlKey || e.metaKey)) {
        if (["+", "-", "=", "_"].includes(e.key)) {
          e.preventDefault();
        }
      }
      // Chặn pinch zoom (trackpad / mobile)
      if ((e as any).scale && (e as any).scale !== 1) {
        e.preventDefault();
      }
    };
    
    // Desktop
    document.addEventListener("wheel", preventZoom, { passive: false });
    document.addEventListener("keydown", preventZoom, { passive: false });
    // Mobile Safari / iOS
    document.addEventListener("gesturestart", preventZoom as EventListener, { passive: false });
    
    return () => {
      document.removeEventListener("wheel", preventZoom as EventListener);
      document.removeEventListener("keydown", preventZoom as EventListener);
      document.removeEventListener("gesturestart", preventZoom as EventListener);
    };
  }, []);
}
