# React Chart(canvas)
[DEMO](https://strongball.github.io/react-chart-canvas/)
![Preview](/preview.png?raw=true "Preview")

## Feature
* Display auxiliary lines with cursor.
* Swipe to change the view.
* Mouse scroll up(down) to change display size.

## Description

Base on [this](https://github.com/strongball/stock-chart) project.   Replace svg render by canvas. In the SVG backend, components will return SVG HTML tags. In the canvas backend, components will draw something canvas from the provider and return null.

### Main files
| Name | Desc |
|  ----  | ----  |
| BaseChart    | Control the chart and provide necessary functions.|
| CanvasRender | A canvas helper contains some high level draw functions(`line`, `rect`, `text`).|
| X(Y)Axis     | Drawing from the axis `BaseChart` provided. Supported category and series.|
| Candlestick  | Draw candlesticks from data on `BaseChart`.|
| HelperLine   | Display auxiliary lines on `BaseChart` with cursor.|
| StockChart   | High level component is composed of with `BaseChart`, `Candlestick`, `X(Y)Axis`, `HelperLine`.|
| ReactiveDiv  | Pass actual width and height in number for child compoents.
| uilts        | Helper functions, convert px to ticks or ticks to px. Category in `ticksToPxFactory` will use map to optimize search speed. |

### Process for react render and canvas draw.
* Initialization: `BaseChart`(wihtout `CanvasRender`) -> children (render without draw) -> `BaseChart`(useffect and set `CanvasRender`) -> context change -> children (render and draw).
* Update(Trigger `BaseChart` rerender): `BaseChart`(render and clear canvas) -> context change -> children (render and draw).

