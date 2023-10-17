import React, { useContext, useEffect, useState } from 'react';
import { Plot as ChartPlot } from '../../chart/chart/panel/Plot';
import { PanelContext } from './Panel';

interface PlotContextProps {
  plot?: ChartPlot;
}
export const PlotContext = React.createContext<PlotContextProps>({});

interface Props extends React.PropsWithChildren {
  paddingY?: [number, number];
}
const Plot: React.FC<Props> = (props) => {
  const { paddingY } = props;
  const { panel } = useContext(PanelContext);
  const [plot, setPlot] = useState<ChartPlot>();
  useEffect(() => {
    setPlot(panel?.createPlot({ paddingY }));
  }, [panel, ...(paddingY ?? [])]);
  return <PlotContext.Provider value={{ plot }}>{props.children}</PlotContext.Provider>;
};
export default Plot;
