import * as React from "react";
import * as ReactDOM from "react-dom";
import DeckGL from '@deck.gl/react/typed';
import { MapView, FirstPersonView } from '@deck.gl/core/typed';
import { StaticMap, MapContext, NavigationControl } from 'react-map-gl';
import { ScenegraphLayer } from '@deck.gl/mesh-layers/typed';
import { cube } from "../basic-cube.js";
import { useAR } from "../ar/index";

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json';
const NAV_CONTROL_STYLE = {
    position: 'absolute',
    top: 10,
    left: 10
};

// import "react-gl.css";

//  Default key should be in sync with packages/map/src/leaflet/MapBox.ts
if (!(window as any).__hpcc_mapbox_apikey) {
    console.warn("__hpcc_mapbox_apikey does not contain a valid API key, reverting to developers key (expect limited performance)");
}
const MAPBOX_ACCESS_TOKEN = (window as any).__hpcc_mapbox_apikey || "pk.eyJ1IjoibGVzY2htb28iLCJhIjoiY2psY2FqY3l3MDhqNDN3cDl1MzFmZnkwcCJ9.HRoFwmz1j80gyz18ruggqw";

// Viewport settings
const INITIAL_VIEW_STATE = {
    longitude: -122.41669,
    latitude: 37.7853,
    zoom: 13,
    pitch: 33,
    bearing: 0
};

function radians_to_degrees(radians: number) {
    var pi = Math.PI;
    return radians * (180 / pi);
}


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

    const [x, y, rotX, rotY, rotZ, fov, zoom] = useAR();

    const [viewState, setViewState] = React.useState(INITIAL_VIEW_STATE);

    React.useEffect(() => {
        setViewState({
            ...viewState,
            longitude: x,
            latitude: y,
            pitch: radians_to_degrees(rotX),
            bearing: radians_to_degrees(rotY),
            // zoom: camera.zoom
        });
        console.log(x, y, radians_to_degrees(rotX), radians_to_degrees(rotY), rotZ, fov, zoom)
    }, [x, y, rotX, rotY, rotZ, fov, zoom]);

    return <DeckGL
        viewState={viewState}
        controller={true}
        ContextProvider={MapContext.Provider as any}
        layers={[]}>
        <StaticMap mapStyle={MAP_STYLE} />
        <NavigationControl style={NAV_CONTROL_STYLE} />
    </DeckGL>;
}
