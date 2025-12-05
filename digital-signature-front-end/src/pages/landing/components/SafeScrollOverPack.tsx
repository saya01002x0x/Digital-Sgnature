/**
 * SafeScrollOverPack
 * Wrapper an toàn cho ScrollOverPack để tránh lỗi với React 19
 */

import React, { useRef, useEffect } from 'react';

type SafeScrollOverPackProps = {
  id?: string;
  className?: string;
  playScale?: number;
  children: React.ReactNode;
}

export const SafeScrollOverPack: React.FC<SafeScrollOverPackProps> = ({ 
  id, 
  className, 
  children 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = React.useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -10% 0px'
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      id={id} 
      className={`${className} ${isVisible ? 'scroll-visible' : ''}`}
    >
      {children}
    </div>
  );
};

