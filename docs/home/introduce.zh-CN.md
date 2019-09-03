---
order: 0
title: hope-tmap
---

基于三维平台（ActiveX）实现的一套三维地图组件库

## 模块划分

```bash
├── Map
├── Graphic
├── Layer
|  ├── TileLayer -- 瓦片图层
|  ├── VectorLayer -- 矢量图层
|  └── GraphicsLayer -- 图案图层
├── Geometry
|  ├── Point -- 点
|  ├── Polyline -- 线
|  └── Polygon -- 面
└── MapSymbol
   ├── SimpleFillSymbol -- 填充样式
   ├── SimpleLineSymbol -- 线样式
   ├── SimpleMarkerSymbol -- 几何样式
   └── TextSymbol -- 文字样式
```

## 示例

```jsx
import { Map, Layer } from 'hope-tmap';

const { LabelLayer } = Layer;

const div = document.createElement('div');

const mapOptions = {};

const map = new Map(div, mapOptions);

const layer = new LabelLayer();

map.addLayer(layer);
```
