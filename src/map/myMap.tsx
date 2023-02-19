import * as React from "react";
// import * as ReactDOM from "react-dom";
import { MapboxOverlay as DeckOverlay } from '@deck.gl/mapbox/typed';
import DeckGL from '@deck.gl/react/typed';
// import { MapView, FirstPersonView } from '@deck.gl/core/typed';
import { StaticMap, MapContext, NavigationControl } from 'react-map-gl';
import { ScenegraphLayer } from '@deck.gl/mesh-layers/typed';

// import { ScenegraphLayer } from '@deck.gl/mesh-layers/typed';
import { cube } from "../basic-cube";

import { useAR } from "../ar/myAR";

const info = document.getElementById('info') as HTMLDivElement;

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json';
const NAV_CONTROL_STYLE = {
    position: 'absolute',
    top: 10,
    left: 10
};

// import "react-gl.css";

//  Default key should be in sync with packages/map/src/leaflet/MapBox.ts
// if (!(window as any).__hpcc_mapbox_apikey) {
//     console.warn("__hpcc_mapbox_apikey does not contain a valid API key, reverting to developers key (expect limited performance)");
// }
// const MAPBOX_ACCESS_TOKEN = (window as any).__hpcc_mapbox_apikey || "pk.eyJ1IjoibGVzY2htb28iLCJhIjoiY2psY2FqY3l3MDhqNDN3cDl1MzFmZnkwcCJ9.HRoFwmz1j80gyz18ruggqw";

// Viewport settings
const INITIAL_VIEW_STATE = {
    longitude: -122.41669,
    latitude: 37.7853,
    zoom: 16,
    pitch: 90,
    bearing: 0,
    minPitch: 0,
    maxPitch: 85,
    altitude: 0.1
};

export function MyMap() {
    /**
     * Data format:
     * [
     *   {name: 'Colma (COLM)', address: '365 D Street, Colma CA 94014', exits: 4214, coordinates: [-122.466233, 37.684638]},
     *   ...
     * ]
     */
    // const layer = new ScenegraphLayer({
    //     id: 'scenegraph-layer',
    //     data: undefined,
    //     pickable: true,
    //     scenegraph: cube,
    //     getPosition: d => d.coordinates,
    //     getOrientation: d => [0, Math.random() * 180, 90],
    //     _animations: {
    //         '*': { speed: 5 }
    //     },
    //     sizeScale: 500,
    //     _lighting: 'pbr'
    // });

    const [xOrig, yOrig, zOrig, x, y, rotX, rotY, rotZ, fov, zoom, error] = useAR();

    const [viewState, setViewState] = React.useState(INITIAL_VIEW_STATE);

    React.useEffect(() => {
        const pitch = 90 - rotX;
        setViewState({
            ...viewState,
            longitude: x,
            latitude: y,
            pitch: pitch > INITIAL_VIEW_STATE.maxPitch ? INITIAL_VIEW_STATE.maxPitch : pitch,
            bearing: rotY,
            // zoom: camera.zoom
        });
        info.innerText = `error: ${error}, x: ${x}, y: ${y}, rotX: ${pitch}, rotY: ${rotY}, rotZ: ${rotZ}, fov: ${fov}, zoom: ${zoom}`;
        // console.log(x, y, radians_to_degrees(rotX), radians_to_degrees(rotY), rotZ, fov, zoom)
    }, [xOrig, yOrig, x, y, rotX, rotY, rotZ, fov, zoom, error]);

    const layer = new ScenegraphLayer({
        id: 'scenegraph-layer',
        data: [cube],
        pickable: true,
        scenegraph: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoxAnimated/glTF-Binary/BoxAnimated.glb',
        getPosition: d => {
            return [xOrig, yOrig, 0];
        },
        getOrientation: d => [0, 0, 90],
        sizeScale: 20,
        _lighting: 'pbr'
    });

    return <DeckGL
        viewState={viewState}
        controller={true}
        ContextProvider={MapContext.Provider as any}
        layers={[layer]}>
        <StaticMap mapStyle={MAP_STYLE} />
        <NavigationControl style={NAV_CONTROL_STYLE} />
    </DeckGL>;
}
