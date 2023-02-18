import React from 'react'
import ReactDOM from 'react-dom/client'
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

// MyAR();
