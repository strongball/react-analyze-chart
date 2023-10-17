import React, { useEffect, useRef, useState } from 'react';
import { FinancialChart } from '../../chart/chart/FinancialChart';
import { panningX } from '../../chart/eventHandler';

interface ChartContextProps {
  chart?: FinancialChart;
}
export const ChartContext = React.createContext<ChartContextProps>({});

interface Props extends React.PropsWithChildren {}
const Chart: React.FC<Props> = (props) => {
  const [chart, setChart] = useState<FinancialChart>();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) {
      return;
    }
    setChart(
      new FinancialChart({
        el: ref.current,
        width: 500,
        height: 300,
      })
    );
  }, []);
  useEffect(() => {
    if (!chart) {
      return;
    }
    panningX(chart);
  }, [chart]);
  return (
    <ChartContext.Provider value={{ chart }}>
      <div ref={ref} style={{ width: 500, height: 300 }}>
        {props.children}
      </div>
    </ChartContext.Provider>
  );
};
export default Chart;
