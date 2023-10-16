import React, { useEffect, useRef, useState } from 'react';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  render: (size: { width: number; height: number }) => React.ReactNode;
}
const ReactiveDiv: React.FC<Props> = ({ render, ...divProps }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  useEffect(() => {
    const resizeCallback = () => {
      const rect = ref.current?.getBoundingClientRect();
      if (rect) {
        setSize({
          height: rect.height,
          width: rect.width,
        });
      }
    };
    resizeCallback();
    window.addEventListener('resize', resizeCallback);
    return () => window.removeEventListener('resize', resizeCallback);
  }, []);
  return (
    <div ref={ref} {...divProps}>
      {render(size)}
    </div>
  );
};
export default ReactiveDiv;
