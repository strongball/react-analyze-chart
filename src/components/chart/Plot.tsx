import React, { useContext, useEffect, useState } from 'react';
import { Plot as ChartPlot, PercentageBase } from '../../chart/chart/panel/Plot';
import { PanelContext } from './Panel';

interface PlotContextProps {
  plot?: ChartPlot;
}
export const PlotContext = React.createContext<PlotContextProps>({});

interface Props extends React.PropsWithChildren {
  paddingY?: [number, number];
  percentageBase?: PercentageBase;
  sync?: boolean;
}
const Plot: React.FC<Props> = (props) => {
  const { paddingY, percentageBase, sync } = props;
  const { panel } = useContext(PanelContext);
  const [plot, setPlot] = useState<ChartPlot>();
  const { plot: parentPlot } = useContext(PlotContext);

  useEffect(() => {
    setPlot(panel?.createPlot({ paddingY }));
  }, [panel, ...(paddingY ?? [])]);

  useEffect(() => {
    plot?.setPercentageBase(percentageBase ?? new Map());
  }, [plot, percentageBase]);

  useEffect(() => {
    if (!plot || !parentPlot || !sync) {
      return;
    }
    parentPlot.addSyncPlot(plot);
    return () => {
      if (plot && parentPlot) parentPlot?.removeSyncPlot(plot);
    };
  }, [sync, plot, parentPlot]);
  return <PlotContext.Provider value={{ plot }}>{props.children}</PlotContext.Provider>;
};
export default Plot;
