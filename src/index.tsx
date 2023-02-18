import React from 'react'
import ReactDOM from 'react-dom/client'

// globalThis.THREE = await import("three");
// globalThis.THREEx = await import("@ar-js-org/ar.js/three.js/build/ar-threex-location-only.js") as any;

import { MyMap } from './map/myMap';

import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <MyMap />
  </React.StrictMode>
)

const splitPanel = document.getElementById('split-panel') as HTMLElement

window.onresize = resize;
resize();

function resize() {
  splitPanel.setAttribute("orientation", window.innerHeight > window.innerWidth ? "vertical" : "horizontal");
}
