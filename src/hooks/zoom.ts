import React, { useEffect, useRef } from 'react';

interface WheelControlOptions {
  onZoomChange: (value: number) => void;
  delay?: number;
}
export function useZoomControl({
  onZoomChange,
  delay = 10,
}: WheelControlOptions): Pick<React.HTMLAttributes<HTMLDivElement>, 'onWheel' | 'onTouchMove'> {
  const wheelTimeout = useRef<NodeJS.Timeout>();
  const wheelValue = useRef<number>(0);
  const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    wheelValue.current += e.deltaY;
    if (wheelTimeout.current) {
      clearTimeout(wheelTimeout.current);
    }
    wheelTimeout.current = setTimeout(() => {
      onZoomChange(wheelValue.current);
      wheelValue.current = 0;
    }, delay);
  };

  // const preDistance = useRef<number>();
  // const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
  //     if (e.touches.length !== 2) {
  //         return;
  //     }
  //     const distance = Math.sqrt(
  //         (e.touches[0].screenX - e.touches[1].screenX) ** 2 + (e.touches[0].screenX - e.touches[1].screenX) ** 2
  //     );
  //     if (!preDistance.current) {
  //         preDistance.current = distance;
  //         return;
  //     }
  //     wheelValue.current += preDistance.current - distance;
  //     preDistance.current = distance;
  //     if (wheelTimeout.current) {
  //         clearTimeout(wheelTimeout.current);
  //     }
  //     wheelTimeout.current = setTimeout(() => {
  //         onZoomChange(wheelValue.current);
  //         wheelValue.current = 0;
  //     }, delay);
  // };

  useEffect(() => {
    return () => {
      if (wheelTimeout.current) {
        clearTimeout(wheelTimeout.current);
      }
    };
  }, []);

  return { onWheel };
}
