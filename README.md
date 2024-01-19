# React Chart(canvas)
[DEMO](https://strongball.github.io/react-analyze-chart/)  
![Preview](/preview.png?raw=true "Preview")
## Class

### ClassDiagram

```mermaid
classDiagram
  class Scale~T~ {
    range: [T, T]
    domain: [number, number]

    convert(v: T): number
    invert(pixel: number): T
    addScaleListener(cb): void
    removeScaleListener(cb): void

    move(pixel: number)
    zoom(z: number)
  }

  NumberScale --|> Scale
  class NumberScale {
    mode: Linear|Log|%
    percentBase: number
  }

  TimeScale --|> Scale
  class TimeScale {
    ticks: Timetamp[]
    rangeTimestamp: [Timetamp, Timetamp]
  }


  Scaleable .. Scale
  class Scaleable {
    xScale: Scale
    yScale: Scale

    onScaleChange()
  }

  Panel  --|> Scaleable
  Layer --|>  Scaleable
  Plot --|> Scaleable

  class Panel {
    el: HTMLElement

    width: number
    height: number

    addEventListener(cb): void
  }

  class Layer {
    painter: Painter
       mouseEventListeners?: Map~EventName, Callback[]~
    render(): void
    hitTest(x: number, y: number): boolean
    toCanvasImageSource(): CanvasImageSource
        addMouseListener(type: EventName, l: Callback): void
  }

  Series --|> Layer
  class Series~T~{
    data: T[]
    dataInView: T[]
    setData(d: T[]): void
    getRange(): [number, number]
    getDataInView(): T[]
  }

  CanvasPanel --|>  Panel
  class CanvasPanel {
    el: HTMLCanvasElement
    layers: Layer[]

    addLayer(layer: Layer): void
    removeLayer(layer: Layer): void
    composite(): void
  }

  ChartPanel --|> Panel
  class ChartPanel {
    key: string
    content: CanvasPanel
    leftAxisPanels: CanvasPanel[]
    rightAxisPanels: CanvasPanel[]

    plots: Plot[]
    addPlot(plot: Plot): void
  }

  class Plot {
    series: Series[]
    percentageBase?: Map~Timestamp, number~
    mouseEventListeners?: Map~EventName, Callback[]~

    addSyncPlot(plot: Plot): void
    addSeries(serie: Series): void
    addMouseListener(type: EventName, l: Callback): void
    bindHTMLEvent(): void
    getRangeBySeries(): [number, number]
    updatePercentBase(): void
    syncYScaleBySeries(): void
    syncSubPlots(): void
  }

  FinancialChart --|> Panel
  class FinancialChart {
    chartPanels: ChartPanel[]
    xAxisPanel: CanvasPanel
    findOrCreatePanel(key string) ChartPanel
    addChartPanel(chartPanel ChartPanel) void
  }
```

### Description

| Name           | Description                                                                                                                                |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Scale          | Manage data and canvas domain. Convert data to canvas coordinates.                                                                         |
| Panel          | Having scale and html element.                                                                                                             |
| CanvasPanel    | Having a real canvas element. All layer render on this one.                                                                                |
| FinancialChart | Having multiple ChartPanels. The root and entry point of all panel.                                                                        |
| ChartPanel     | Basic chart element. Having multiple CanvasPanels. One for chart content and several y-axis panels                                         |
| Plot           | Virtual class. To support different YScale in one ChartPanel(CanvasPanel)                                                                  |
| Layer          | The minimal unit to draw on canvas.                                                                                                        |
| Series         | Extends layer. Received data and draw items on canvas.                                                                                     |
| Painter        | Core drawing tool. Providing basic drawing method to help layer draw item on canvas. Can be implemented in different tech(canvas2D, WebGL) |

## Feature

| Name                     | Description                                                   |
| ------------------------ | ------------------------------------------------------------- |
| Different YAxis(scale)   | Linear, log, percentage                                       |
| Multiple YAxis           | Can show different YAxis for different scale                  |
| Different series by data | Each series can load different data according to requirements |

## Flow

### Add series

```mermaid
flowchart LR;
  ADS(Add Series)
  ADS --> MC{Match ChartPanel}
  MC --Yes--> ChartPanel
  MC --No--> CreateChartPanel--> ChartPanel

  ChartPanel --> MP{Match main Plot}
  MP --Yes--> Plot
  MP --No--> CreatePlot --> Plot
  Plot --> Plot.addSerie --> CanvasPanel.addLayer
```

### Update layer

```mermaid
flowchart LR;
  C(Move/Zoom/Width/Height change)
  C --> UpdateScale --> Layer.onScaleChange --> Layer.render
  C --> FinancialChart.checkData --> FinancialChart.loadData --> Layer.render
  Layer.render --> CanvasPanel.composite
```

## Different part

### Data

#### Now

Should be recalculated every time when view changed.

```mermaid
flowchart LR;
  LoadData --> Chart --> IndicatorSeries --> SliceByView --> Calculate --> Render
  ChartPanning --> Chart
```

#### New

Only data changes need to be recalculated.

```mermaid
flowchart LR;
  LoadData --> Indicator --> Calculate --> AddSeries --> SliceByView  --> Render
  ChartPanning --> SliceByView
```

### Render

#### Now

Every chagne always rerender all chart. While there is a way to do parial rerender, it's hard to use. Current code always uses `render(*)` to trigger rerender.

```mermaid
flowchart LR;
  Change --> Chart --> Render --> Viewport --> SL(All or select layer) --> Layer.render --> Viewport.composite
```

#### New

Layer will update itself when something changed.

```mermaid
flowchart LR;
  Change --> Layer.render --> RCU(Require CanvasPanel update) --> BatchRequire --> CanvasPanel.composite
```

### Hit

#### Now

We need draw two shape on different canvas at each render. One for display and another is for hittest. HitCanvas can be treated as a 3D array([W, H, C]). The color of each position is the mark of item. If the mouse position has color, it means it touch something.

```mermaid
flowchart LR;
  Render --> RenderLayer --> RenderHitCanvas
  Event --> Layer.hittest --> GetHitTargetByCanvasData --> Result
```

#### Plan

Calculate mouse position and graphics by algorithm. Reduce render time but may cause more loading during hittest.

```mermaid
flowchart LR;
  Render
  Event --> Layer.hittest --> Calculate --> Result
```
