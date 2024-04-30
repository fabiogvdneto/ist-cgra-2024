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

    createCrane(0, 0, 0);
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
    camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, 0.1, 1000);
    camera.position.x = x;
    camera.position.y = y;
    camera.position.z = z;
    camera.zoom = 1000;
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


function addBase(obj, x, y, z) {
    'use strict'
    geometry = new THREE.BoxGeometry(l_base, h_base, l_base);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addTower(obj, x, y, z) {
    'use strict'
    geometry = new THREE.BoxGeometry(l_tower, h_tower, l_tower);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function createCrane(x, y, z) {
    var crane = new THREE.Object3D();

    material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

    addBase(crane, 0, 0, 0);
    addTower(crane, 0, h_base/2 + h_tower/2, 0)

    scene.add(crane);

    crane.position.x = x;
    crane.position.y = y;
    crane.position.z = z;
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