import React, { useContext, useEffect, useState } from 'react';
import { ChartPanel } from '../../chart/chart/panel/ChartPanel';
import { ChartContext } from './Chart';
import { PlotContext } from './Plot';

interface PanelContextProps {
  panel?: ChartPanel;
}
export const PanelContext = React.createContext<PanelContextProps>({});

interface Props extends React.PropsWithChildren {
  name: string;
}

const Panel: React.FC<Props> = (props) => {
  const { name } = props;
  const { chart } = useContext(ChartContext);
  const [panel, setPanel] = useState<ChartPanel>();
  useEffect(() => {
    if (chart && name) {
      setPanel(chart.findOrCreatePanel('main')!);
    }
  }, [chart, name]);
  return (
    <PanelContext.Provider value={{ panel }}>
      <PlotContext.Provider value={{ plot: panel?.plots[0] }}>{props.children}</PlotContext.Provider>
    </PanelContext.Provider>
  );
};
export default Panel;
