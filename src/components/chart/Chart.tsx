import React, { useEffect, useRef, useState } from 'react';
import { FinancialChart } from '../../chart/chart/FinancialChart';
import { panningX } from '../../chart/eventHandler';
import { NumericalType } from '../../chart/types';

interface ChartContextProps {
  chart?: FinancialChart;
}
export const ChartContext = React.createContext<ChartContextProps>({});

interface Props extends React.PropsWithChildren {
  mode?: NumericalType;
}
const Chart: React.FC<Props> = (props) => {
  const { mode = 'Linear' } = props;
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
    console.log('change mode');
    chart?.setMainPlotYMode(mode);
  }, [chart, mode]);

  return (
    <ChartContext.Provider value={{ chart }}>
      <div ref={ref} style={{ width: 500, height: 300 }}>
        {props.children}
      </div>
    </ChartContext.Provider>
  );
};
export default Chart;
