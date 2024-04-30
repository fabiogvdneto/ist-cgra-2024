import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import * as Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

//////////////////////
/* GLOBAL VARIABLES */
//////////////////////
var camera, scene, renderer;
let cameras = [];

/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene() {
    'use strict';
    scene = new THREE.Scene();
    scene.add(new THREE.AxesHelper(10));
    scene.background = new THREE.Color('aliceblue');

    createCane(0, -20, 0);
}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////
function createPerpectiveCamera(x, y, z) {
    'use strict';
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.x = x;
    camera.position.y = y;
    camera.position.z = z;
    camera.lookAt(scene.position);

    cameras.push(camera);

}

function createOrthographicCamera(x, y, z) {
    'use strict';
    camera = new THREE.OrthographicCamera(window.innerWidth / -12, window.innerWidth / 12, window.innerHeight / 12, window.innerHeight / -12, 0.1, 1000);
    camera.position.x = x;
    camera.position.y = y;
    camera.position.z = z;
    camera.lookAt(scene.position);
 
    cameras.push(camera);
}

function initializeCameras() {
    'use strict';
    createOrthographicCamera(110, 0, 0);
    createOrthographicCamera(0,110,0);
    createOrthographicCamera(0,0,110);
    createOrthographicCamera(140, 140, 140);
    createPerpectiveCamera(140, 140, 140);
    // createOrthographicCamera(); - movel camera

    camera = cameras[0];
}

/////////////////////
/* CREATE LIGHT(S) */
/////////////////////

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////
var geometry, mesh, material;
const l_base = 15, h_base = 5;
const l_tower = 8, h_tower = 40;
const l_cab = 10, h_cab = 5;
const l_jib = 8, c_jib = 35, h_jib = 3;
const c_counterJib = 20, h_counterJib = 2.5;
const h_pl = 15;
const l_counterWeigth = 6, h_counterWeigth = 6, c_counterWeigth = 5;
const l_motor = 5, h_motor = 2;
const l_suport = 4, h_suport = 2;
const r_cane = 0.5, h_cane = 20;
const l_claw = 6, h_claw = 4;

// Base's referential

function addBase(obj, x, y, z) {
    'use strict';
    geometry = new THREE.BoxGeometry(l_base, h_base, l_base);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addTower(obj, x, y, z) {
    'use strict';
    geometry = new THREE.BoxGeometry(l_tower, h_tower, l_tower);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function createCane(x, y, z) {
    'use strict';
    var crane = new THREE.Object3D();

    material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

    addBase(crane, 0, h_base/2, 0);
    addTower(crane, 0, h_base + h_tower/2, 0)
    createSuperior(crane, 0, h_base + h_tower, 0);

    scene.add(crane);

    crane.position.x = x;
    crane.position.y = y;
    crane.position.z = z;
}

// Superior's referentiaL

function addCab(obj, x, y, z) {
    'use strict';
    geometry = new THREE.BoxGeometry(l_cab, h_cab, l_cab);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addCounterJib(obj, x, y, z) {
    'use strict';
    geometry = new THREE.BoxGeometry(l_jib, h_counterJib, c_counterJib);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addJib(obj, x, y, z) {
    'use strict';
    geometry = new THREE.BoxGeometry(l_jib, h_jib, c_jib);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addApex(obj, x, y, z) {
    'use strict';

    geometry = new THREE.ConeGeometry((Math.pow(2*Math.pow(l_tower,2), 1/2)/2), h_pl, 4, 1, false, 0.782, 6.3);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addCounterWeigth(obj, x, y, z) {
    'use strict';

    geometry = new THREE.BoxGeometry(c_counterWeigth, h_counterWeigth, l_counterWeigth);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addMotors(obj, x, y, z) { 
    'use strict';

    geometry = new THREE.BoxGeometry(l_jib, h_motor, l_motor);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);

}

function addPendants(obj, x, y, z) {
    'use strict';

    const material = new THREE.LineBasicMaterial( { color: 0x00ff00, wireframe: true } );

    const points1 = []; // first pendant
    points1.push(new THREE.Vector3(0, h_cab + h_pl, 0)); // Start point
    points1.push(new THREE.Vector3(0, h_cab + h_counterJib, -1 + l_cab/2 + c_counterJib/2)); // End point

    geometry = new THREE.BufferGeometry().setFromPoints(points1);
    mesh = new THREE.Line(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);

    const points2 = []; // secound pendant
    points2.push(new THREE.Vector3(0, h_cab + h_pl, 0)); // Start point
    points2.push(new THREE.Vector3(0, h_cab + h_jib, - (1 + l_cab/2 + c_jib*(3/4)))); // End point12

    geometry = new THREE.BufferGeometry().setFromPoints(points2);
    mesh = new THREE.Line(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}3

function createSuperior(obj, x, y, z) {
    'use strict';21
    var jib = new THREE.Object3D();

    material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

    addCab(jib, -1, h_cab/2, -1);
    addJib(jib, 0, h_cab + h_jib/2, -(1 + l_cab/2 + c_jib/2));
    addCounterJib(jib, 0, h_cab + h_counterJib/2, -1 + l_cab/2 + c_counterJib/2);
    addApex(jib, 0, h_cab + h_pl/2, -1);
    addCounterWeigth(jib, 0, h_cab - h_counterWeigth/2, -1 + l_cab/2 + 5/6*c_counterJib - c_counterWeigth/2);
    addMotors(jib, 0, h_cab + h_counterJib + h_motor/2, -1 + l_cab/2 + c_counterJib - c_counterWeigth/2);
    addPendants(jib, 0, 0, -1);
    createCar(jib, 0,h_cab, - (l_cab/2 + c_jib - l_suport/2));

    jib.position.x = x;
    jib.position.y = y;
    jib.position.z = z;

    obj.add(jib);

}

// Car's referential

function addCar(obj, x, y, z) {
    'use strict';

    geometry = new THREE.BoxGeometry(l_suport, h_suport, l_suport);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}


function createCar(obj, x, y, z) {
    'use strict';
    var car = new THREE.Object3D();

    material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

    addCar(car, 0, -h_suport/2, 0);
    createSteelCable(car, 0, -h_suport -h_cane/2, 0);

    car.position.x = x;
    car.position.y = y;
    car.position.z = z;

    obj.add(car);
}

function addSteelCable(obj, x, y, z) {
    'use strict';
    geometry = new THREE.CylinderGeometry(r_cane, r_cane, h_cane, 32);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addClaw(obj, x, y, z) {
    'use strict';

    geometry = new THREE.ConeGeometry((Math.pow(2*Math.pow(l_claw,2), 1/2)/2), h_claw , 4, 1, false, 0.782, 6.3);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function createSteelCable(obj, x, y, z) {
    'use strict';
    var cable = new THREE.Object3D();

    material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });21

    addSteelCable(cable, 0, 0, 0);
    addClaw(cable, 0, -h_cane/2 - h_claw/2, 0);

    cable.position.x = x;
    cable.position.y = y;
    cable.position.z = z;

    obj.add(cable);
}


//////////////////////
/* CHECK COLLISIONS */
//////////////////////
function checkCollisions(){
    'use strict';

}

///////////////////////
/* HANDLE COLLISIONS */
///////////////////////
function handleCollisions(){
    'use strict';

}

////////////
/* UPDATE */
////////////
function update(){
    'use strict';

}

/////////////
/* DISPLAY */
/////////////
function render() {
    'use strict';
    renderer.render(scene, camera);
}

////////////////////////////////
/* INITIALIZE ANIMATION CYCLE */
////////////////////////////////
function init() {
    'use strict';
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    createScene();
    initializeCameras();

    window.addEventListener("keydown", onKeyDown);

    render();
}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////
function animate() {
    'use strict';

}

////////////////////////////
/* RESIZE WINDOW CALLBACK */
////////////////////////////
function onResize() { 
    'use strict';

}

///////////////////////
/* KEY DOWN CALLBACK */
///////////////////////
function onKeyDown(e) {
    'use strict';

    switch (e.keyCode) {
        case 49: // Key '1'
            camera = cameras[0];
            break;
        case 50: // Key '2'
            camera = cameras[1];  
            break;
        case 51: // Key '3'
            camera = cameras[2]; 
            break;
        case 52: // Key '4'
            camera = cameras[3];
            break;
        case 53: // Key '5'
            camera = cameras[4];  
            break;
        case 54: // Key '6'
            camera = cameras[5]; 
            break;

    }
    render();
}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e){
    'use strict';
}

init();
animate();