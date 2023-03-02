/* global document */
import React, { Component } from 'react';
import { createRoot } from 'react-dom/client';
import DeckGL, { COORDINATE_SYSTEM, PolygonLayer, PointCloudLayer, MapView, FirstPersonView, TripsLayer } from 'deck.gl/typed';
import { Map } from 'react-map-gl';


// Source data CSV
const DATA_URL = {
    BUILDINGS:
        'https://raw.githubusercontent.com/uber-common/deck.gl-data/master/examples/trips/buildings.json', // eslint-disable-line
    TRIPS:
        'https://raw.githubusercontent.com/uber-common/deck.gl-data/master/examples/trips/trips.json' // eslint-disable-line
};

// Set your mapbox token here
const MAPBOX_TOKEN = "pk.eyJ1IjoibGVzY2htb28iLCJhIjoiY2psY2FqY3l3MDhqNDN3cDl1MzFmZnkwcCJ9.HRoFwmz1j80gyz18ruggqw";

const LIGHT_SETTINGS = {
    lightsPosition: [-74.05, 40.7, 8000, -73.5, 41, 5000],
    ambientRatio: 0.05,
    diffuseRatio: 0.6,
    specularRatio: 0.8,
    lightsStrength: [3.0, 0.0, 0.5, 0.0],
    numberOfLights: 2
};

const DEFAULT_VIEWPORT_PROPS = {
    longitude: -74,
    latitude: 40.72,
    zoom: 13,
    bearing: 270,
    minPitch: 0,
    maxPitch: 85,
};

// class Root extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             time: 1000,
//             trailLength: 50,
//             viewStates: {
//                 firstPerson: { ...DEFAULT_VIEWPORT_PROPS, pitch: 0, zoom: 0, position: [0, 0, 2] },
//                 baseMap: { ...DEFAULT_VIEWPORT_PROPS, pitch: 80 }
//             }
//         };

//         this._onViewStateChange = this._onViewStateChange.bind(this);
//     }

//     _onViewStateChange({ viewId, viewState }) {
//         const viewStates = { ...this.state.viewStates, [viewId]: viewState };

//         if (viewId === 'baseMap') {
//             viewStates.firstPerson = {
//                 ...viewStates.firstPerson,
//                 ...viewState,
//                 pitch: viewStates.firstPerson.pitch,
//                 zoom: viewStates.firstPerson.zoom
//             };
//         }
//         if (viewId === 'firstPerson') {
//             viewStates.baseMap = {
//                 ...viewStates.baseMap,
//                 ...viewState,
//                 pitch: viewStates.baseMap.pitch,
//                 zoom: viewStates.baseMap.zoom
//             };
//         }

//         this.setState({ viewStates });
//     }

//     _renderLayers() {
//         const { longitude, latitude } = DEFAULT_VIEWPORT_PROPS;
//         const { trailLength, time } = this.state;

//         return [
//             new TripsLayer({
//                 id: 'trips',
//                 data: DATA_URL.TRIPS,
//                 getPath: d => d.segments,
//                 getColor: d => (d.vendor === 0 ? [253, 128, 93] : [23, 184, 190]),
//                 opacity: 0.3,
//                 getWidth: 2,
//                 widthMinPixels: 2,
//                 trailLength,
//                 currentTime: time
//             }),
//             new PolygonLayer({
//                 id: 'buildings',
//                 data: DATA_URL.BUILDINGS,
//                 extruded: true,
//                 wireframe: false,
//                 fp64: true,
//                 opacity: 0.5,
//                 getPolygon: f => f.polygon,
//                 getElevation: f => f.height,
//                 getFillColor: f => [74, 80, 87],
//                 lightSettings: LIGHT_SETTINGS
//             }),
//             new PointCloudLayer({
//                 id: 'ref-point',
//                 data: [
//                     {
//                         position: [0, 0, 2],
//                         color: [255, 0, 0, 255]
//                     }
//                 ],
//                 getColor: d => d.color,
//                 coordinateSystem: COORDINATE_SYSTEM.METER_OFFSETS,
//                 coordinateOrigin: [longitude, latitude],
//                 opacity: 1,
//                 pointSize: 5
//             })
//         ];
//     }

//     _renderMap({ width, height, viewState }) {
//         return (
//             <Map
//                 {...viewState}
//                 width={width}
//                 height={height}
//                 mapStyle="mapbox://styles/mapbox/dark-v9"
//                 mapboxApiAccessToken={MAPBOX_TOKEN}
//             />
//         );
//     }

//     render() {
//         return (
//             <DeckGL
//                 id="first-person"
//                 width="100%"
//                 height="100%"
//                 viewState={this.state.viewStates}
//                 onViewStateChange={this._onViewStateChange}
//                 layers={this._renderLayers()}
//             >
//                 <FirstPersonView id="firstPerson" controller={true} height="50%" fovy={50} />
//                 <MapView id="baseMap" controller={true} y="50%" height="50%" position={[0, 0, 0]}>
//                     {this._renderMap}
//                 </MapView>
//             </DeckGL>
//         );
//     }
// }

interface Root2Props {
}

export const Root2: React.FunctionComponent<Root2Props> = ({
}) => {
    const [state, setState] = React.useState({
        time: 1000,
        trailLength: 50,
        viewStates: {
            firstPerson: { ...DEFAULT_VIEWPORT_PROPS, pitch: 0, zoom: 0, position: [0, 0, 10], minPitch: undefined, maxPitch: undefined },
            baseMap: { ...DEFAULT_VIEWPORT_PROPS, pitch: 80 },
            // transitionInterpolator: new LinearInterpolator(['target', 'zoom'])
        }
    });

    const onViewStateChange = React.useCallback(({ viewId, viewState }: { viewId: string, viewState: any }) => {
        const viewStates = { ...state.viewStates, [viewId]: viewState };

        console.log(viewId);
        // if (viewId === 'baseMap') {
        viewStates.firstPerson = {
            ...viewStates.firstPerson,
            // ...viewState,
            // pitch: viewStates.firstPerson.pitch,
            // zoom: viewStates.firstPerson.zoom
            longitude: DEFAULT_VIEWPORT_PROPS.longitude,
            latitude: DEFAULT_VIEWPORT_PROPS.latitude,
        };
        if (viewId === 'baseMap') {
            viewStates.firstPerson.bearing = viewStates.baseMap.bearing;
            viewStates.firstPerson.zoom = viewStates.baseMap.zoom;
        }
        // }
        // if (viewId === 'firstPerson') {
        viewStates.baseMap = {
            ...viewStates.baseMap,
            longitude: DEFAULT_VIEWPORT_PROPS.longitude,
            latitude: DEFAULT_VIEWPORT_PROPS.latitude,

            // ...viewState,
            // pitch: viewStates.baseMap.pitch,
            // zoom: viewStates.baseMap.zoom
        };
        if (viewId === 'firstPerson') {
            console.log(viewStates.firstPerson.position);
            viewStates.baseMap.bearing = viewStates.firstPerson.bearing;
            viewStates.baseMap.position = [...viewStates.firstPerson.position];
        }
        // }

        setState({ ...state, viewStates });
    }, []);

    const renderLayers = React.useCallback(() => {
        const { longitude, latitude } = DEFAULT_VIEWPORT_PROPS;
        const { trailLength, time } = state;

        return [
            new TripsLayer({
                id: 'trips',
                data: DATA_URL.TRIPS,
                getPath: d => d.segments,
                getColor: d => (d.vendor === 0 ? [253, 128, 93] : [23, 184, 190]),
                opacity: 0.3,
                getWidth: 2,
                widthMinPixels: 2,
                trailLength,
                currentTime: time
            }),
            new PolygonLayer({
                id: 'buildings',
                data: DATA_URL.BUILDINGS,
                extruded: true,
                wireframe: false,
                fp64: true,
                opacity: 0.5,
                getPolygon: f => f.polygon,
                getElevation: f => f.height,
                getFillColor: f => [74, 80, 87],
                lightSettings: LIGHT_SETTINGS
            }),
            new PointCloudLayer({
                id: 'ref-point',
                data: [
                    {
                        position: [0, 0, 2],
                        color: [255, 0, 0, 255]
                    }
                ],
                getColor: d => d.color,
                coordinateSystem: COORDINATE_SYSTEM.METER_OFFSETS,
                coordinateOrigin: [longitude, latitude],
                opacity: 1,
                pointSize: 5
            })
        ];
    }, []);


    return <DeckGL
        id="first-person"
        width="100%"
        height="100%"
        viewState={state.viewStates}
        onViewStateChange={onViewStateChange}
        layers={renderLayers()}
    >
        <FirstPersonView id="firstPerson" controller={true} height="50%" fovy={50} />
        <MapView id="baseMap" controller={true} y="50%" height="50%" position={[0, 0, 0]}>
            <Map
                {...state.viewStates.baseMap}
                // width={width}
                // height={height}
                mapStyle="mapbox://styles/mapbox/dark-v9"
                mapboxAccessToken={MAPBOX_TOKEN}
            />
        </MapView>
    </DeckGL>

};

const root = createRoot(document.body.appendChild(document.createElement('div')));
root.render(<Root2 />,);

