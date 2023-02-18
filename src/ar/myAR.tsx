import * as React from "react";
import * as THREE from 'three';

// @ts-ignore
import * as  THREEx from '../../three.js/src/location-based/index.js';

const info = document.getElementById('info') as HTMLDivElement;

const canvas = document.getElementById('canvas1') as HTMLCanvasElement;


function radians_to_degrees(radians: number) {
    var pi = Math.PI;
    return radians * (180 / pi);
}

export function useAR() {

    const [x, setX] = React.useState(0);
    const [y, setY] = React.useState(0);
    const [rotX, setRotX] = React.useState(0);
    const [rotY, setRotY] = React.useState(0);
    const [rotZ, setRotZ] = React.useState(0);
    const [fov, setFov] = React.useState(0);
    const [zoom, setZoom] = React.useState(0);
    const [error, setError] = React.useState(0);
    const [tick, setTick] = React.useState(0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1.33, 0.1, 10000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas });

    const arjs = new THREEx.LocationBased(scene, camera);
    const cam = new THREEx.WebcamRenderer(renderer);

    const deviceOrientationControls = new THREEx.DeviceOrientationControls(camera);

    const geom = new THREE.BoxGeometry(20, 20, 20);
    const mtl = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const box = new THREE.Mesh(geom, mtl);
    arjs.add(box, -0.72, 51.051);

    React.useEffect(() => {

        arjs.on("gpsupdate", async (pos: any, deltaDist: number) => {
            setX(pos.coords.longitude);
            setY(pos.coords.latitude);
            setRotX(camera.rotation.x);
            setRotY(camera.rotation.y);
            setRotZ(camera.rotation.z);

            // setFov(camera.fov);
            // setZoom(camera.zoom);
            // setTick(tick + 1);
        });

        // window.addEventListener("gps-camera-update-positon", async (pos) => {
        //     debugger;
        // });

        // window.addEventListener("gps-camera-origin-coord-set", async (pos) => {
        //     debugger;
        // });

        // window.addEventListener("gps-entity-place-loaded", async (pos) => {
        //     debugger;
        // });

        // window.addEventListener("gps-entity-place-update-position", async (pos) => {
        //     debugger;
        // });

        // arjs.fakeGps(-0.72, 51.05);
        arjs.startGps();

        // initEvents(camera);
        let requestID: number;
        const render = () => {
            if (canvas.width != canvas.clientWidth || canvas.height != canvas.clientHeight) {
                renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
                const aspect = canvas.clientWidth / canvas.clientHeight;
                camera.aspect = aspect;
                camera.updateProjectionMatrix();
            }
            setTick(Date.now());
            try {
                deviceOrientationControls.update();
            } catch (e: any) {
                setError(e.message);
            }

            cam.update();
            renderer.render(scene, camera);

            setRotX(camera.rotation.x);
            setRotY(camera.rotation.y);
            setRotZ(camera.rotation.z);
            requestID = requestAnimationFrame(render);
        };
        requestID = requestAnimationFrame(render);

        return () => {
            arjs.stopGps();
            clearInterval(requestID);
        }

    }, []);

    return [x, y, rotX, rotY, rotZ, fov, zoom, error, tick];
}

// function initEvents(camera: THREE.PerspectiveCamera) {
//     const rotationStep = THREE.MathUtils.degToRad(1);

//     let mousedown = false, lastX = 0, lastY = 0;

//     window.addEventListener("mousedown", e => {
//         mousedown = true;
//     });

//     window.addEventListener("mouseup", e => {
//         mousedown = false;
//     });

//     window.addEventListener("mousemove", e => {
//         if (!mousedown) return;
//         if (e.clientX < lastX) {
//             camera.rotation.y -= rotationStep;
//             if (camera.rotation.y < 0) {
//                 camera.rotation.y += 2 * Math.PI;
//             }
//         } else if (e.clientX > lastX) {
//             camera.rotation.y += rotationStep;
//             if (camera.rotation.y > 2 * Math.PI) {
//                 camera.rotation.y -= 2 * Math.PI;
//             }
//         }
//         if (e.clientY < lastY) {
//             camera.rotation.x -= rotationStep;
//             if (camera.rotation.x < 0) {
//                 camera.rotation.x += 2 * Math.PI;
//             }
//         } else if (e.clientY > lastY) {
//             camera.rotation.x += rotationStep;
//             if (camera.rotation.x > 2 * Math.PI) {
//                 camera.rotation.x -= 2 * Math.PI;
//             }
//         }
//         lastX = e.clientX;
//         lastY = e.clientY;
//     });
// }