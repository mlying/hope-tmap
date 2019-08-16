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
import { View, Map, Layer } from 'hope-tmap';

const { MapView } = View;
const { TileLayer } = Layer;
const api = 'http://192.168.8.130:8085';

class App extends React.Component {
  render() {
    return (
      <div style={{ width: '100%', height: '400px' }}>
        <MapView api={api}>
          <Map>
            <TileLayer url="https://services.arcgisonline.com/arcgis/rest/services/World_Terrain_Base/MapServer" />
          </Map>
        </MapView>
      </div>
    );
  }
}

ReactDOM.render(<App />, mountNode);
```
