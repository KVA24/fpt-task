import {useEffect, useRef, useState} from "react";

export default function MarqueeItem({text}: { text: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [animate, setAnimate] = useState(false);
  
  useEffect(() => {
    const container = containerRef.current;
    const content = textRef.current;
    
    if (container && content) {
      if (content.scrollWidth > container.clientWidth) {
        setAnimate(true);
      }
    }
  }, [text]);
  
  return (
    <div
      ref={containerRef}
      className=" overflow-hidden whitespace-nowrap"
    >
      <span
        ref={textRef}
        className={`text-sm text-gray-800 font-medium leading-tight px-1 text-left w-full ${
          animate ? "animate-marquee" : ""
        }`}
      >
        {text}
      </span>
    </div>
  );
}
