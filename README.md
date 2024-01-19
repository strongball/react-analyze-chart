# React Chart(canvas)
[DEMO](https://strongball.github.io/react-analyze-chart/)  
![Preview](/preview.png?raw=true "Preview")
## Class

### ClassDiagram
![Preview](/classDiagram.png?raw=true "Preview")

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
