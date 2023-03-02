import * as React from "react";
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// @ts-ignore
import * as  THREEx from '../../three.js/src/location-based/index.js';
import { cube } from "../basic-cube";

const canvas = document.getElementById('canvas1') as HTMLCanvasElement;

export function useAR(): [number, number, number, number, number, number, number, number, number, number, string] {

    const [xOrig, setXOrig] = React.useState(0);
    const [yOrig, setYOrig] = React.useState(0);
    const [zOrig, setZOrig] = React.useState(0);
    const [x, setX] = React.useState(0);
    const [y, setY] = React.useState(0);
    const [rotX, setRotX] = React.useState<number>(0);
    const [rotY, setRotY] = React.useState<number>(0);
    const [rotZ, setRotZ] = React.useState(0);
    const [fov, setFov] = React.useState(0);
    const [zoom, setZoom] = React.useState(0);
    const [error, setError] = React.useState("");

    React.useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, 1.33, 0.1, 10000);
        const renderer = new THREE.WebGLRenderer({ canvas: canvas });
        const arjs = new THREEx.LocationBased(scene, camera);

        let first = true;

        const cam = new THREEx.WebcamRenderer(renderer);
        const deviceOrientationControls = new THREEx.DeviceOrientationControls(camera);

        // const geom = new THREE.BoxGeometry(20, 20, 20);
        // const mtl = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        // const box = new THREE.Mesh(geom, mtl);
        // arjs.add(box, 0, 0, 0);

        arjs.on("gpsupdate", async (pos: any, deltaDist: number) => {
            setX(pos.coords.longitude);
            setY(pos.coords.latitude);
            if (first) {
                first = false;
                setXOrig(pos.coords.longitude);
                setYOrig(pos.coords.latitude - 0.001);
                setZOrig(pos.coords.altitude);
                const geom = new THREE.BoxGeometry(20, 20, 20);
                const mtl = new THREE.MeshBasicMaterial({ color: 0xff0000 });
                const box = new THREE.Mesh(geom, mtl);
                const loader = new GLTFLoader();
                loader.parse(JSON.stringify(cube), "", (gltf) => {
                    arjs.add(gltf.scene, pos.coords.longitude, pos.coords.latitude - 0.001, 0);
                });
            }
        });

        // arjs.startGps();
        arjs.fakeGPS(-0.72, 51.051);

        // initEvents(camera);
        let requestID: number;
        const render = () => {
            if (canvas.width != canvas.clientWidth || canvas.height != canvas.clientHeight) {
                renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
                const aspect = canvas.clientWidth / canvas.clientHeight;
                camera.aspect = aspect;
                camera.updateProjectionMatrix();
            }
            try {
                deviceOrientationControls.update();
            } catch (e: any) {
                setError(e.message);
            }

            cam.update();
            renderer.render(scene, camera);

            setRotX(THREE.MathUtils.radToDeg(-camera.rotation.x));
            setRotY(THREE.MathUtils.radToDeg(-camera.rotation.y));
            setRotZ(camera.rotation.z);
            requestID = requestAnimationFrame(render);
        };
        requestID = requestAnimationFrame(render);

        return () => {
            cancelAnimationFrame(requestID);

            arjs.stopGps();
            arjs.on("gpsupdate", undefined);

            deviceOrientationControls.dispose();
            cam.dispose();
            renderer.dispose();
            // camera.dispose();
            // scene.dispose();
        }
    }, []);

    return [xOrig, yOrig, zOrig, x, y, rotX, rotY, rotZ, fov, zoom, error];
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