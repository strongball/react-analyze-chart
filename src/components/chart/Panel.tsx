import React, { useContext, useEffect, useState } from 'react';
import { ChartPanel } from '../../chart/chart/panel/ChartPanel';
import { ChartContext } from './Chart';
import { PlotContext } from './Plot';
import { panningY } from '../../chart/eventHandler';
import { PercentageBase } from '../../chart/chart/panel/Plot';

interface PanelContextProps {
  panel?: ChartPanel;
}
export const PanelContext = React.createContext<PanelContextProps>({});

interface Props extends React.PropsWithChildren {
  name: string;
  percentageBase?: PercentageBase;
}

const Panel: React.FC<Props> = (props) => {
  const { name, percentageBase } = props;
  const { chart } = useContext(ChartContext);
  const [panel, setPanel] = useState<ChartPanel>();
  const mainPlot = panel?.plots[0];
  useEffect(() => {
    if (chart && name) {
      setPanel(chart.findOrCreatePanel('main')!);
    }
  }, [chart, name]);

  useEffect(() => {
    mainPlot?.setPercentageBase(percentageBase ?? new Map());
  }, [mainPlot, percentageBase]);

  return (
    <PanelContext.Provider value={{ panel }}>
      <PlotContext.Provider value={{ plot: panel?.plots[0] }}>{props.children}</PlotContext.Provider>
    </PanelContext.Provider>
  );
};
export default Panel;
