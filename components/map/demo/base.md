---
order: 0
title:
  zh-CN: 在线资源
  en-US: Map Online
---

## zh-CN

加载在线 arcgis for javascript 资源

```jsx
import { Map, Layer } from 'hope-tmap';

const { GroupLayer } = Layer;

const map = new Map({
  target: 'Web3DCtrl',
});

const groupLayer = new GroupLayer({});

map.addLayer(groupLayer);
```
