# hope-tmap

基于三维平台（ActiveX），实现的一套三维地图 js 组件

## 使用

```js
import { Map, Layer } from 'hope-tmap';

const { LabelLayer } = Layer;

const div = document.createElement('div');

const mapOptions = {};

const map = new Map(div, mapOptions);

const layer = new LabelLayer();

map.addLayer(layer);
```

## 模块划分说明

```bash
├── Map
├── Feature
├── Layer
|  ├── LabelLayer
|  └── VectorLayer -- 矢量图层
├── Geometry
|  ├── Point -- 点
|  ├── Polyline -- 线
|  ├── Polygon -- 面
|  └── Text -- 文字
└── Sketch -- 绘制
```
