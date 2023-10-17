import React, { useEffect, useRef } from 'react';
import { init } from '../chart/example';

interface Props {}
const SimplaeChart: React.FC<Props> = (props) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) {
      return;
    }
    init({ el: ref.current, height: 300, width: 500 });
  }, []);
  return <div ref={ref} style={{ width: 500, height: 300 }}></div>;
};
export default SimplaeChart;
