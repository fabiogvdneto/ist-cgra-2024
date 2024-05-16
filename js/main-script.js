import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import * as Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

//////////////////////
/* GLOBAL VARIABLES */
//////////////////////
const mainCamera = new THREE.PerspectiveCamera();
const scene = new THREE.Scene();
const clock = new THREE.Clock();
const renderer = new THREE.WebGLRenderer({ antialias: true });

const ref1 = new THREE.Object3D();
const ref2 = new THREE.Object3D();
const ref3 = new THREE.Object3D();
const ref4 = new THREE.Object3D();

const foundation = { radiusTop: 2, radiusBottom: 2, height: 20 };

const materials = {
    foundation: new THREE.MeshBasicMaterial({ color: 0x123235, wireframe: true })
}

/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene() {
    'use strict';
    scene.background = new THREE.Color('aliceblue');

    createCamera();
    addCarousel(scene, 0, 0, 0);
}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////
function createCamera() {
    'use strict'
    mainCamera.position.set(80, 100, 80);
    mainCamera.lookAt(scene.position);
}

/////////////////////
/* CREATE LIGHT(S) */
/////////////////////


////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////
function addMesh(obj, geom, material, x, y, z) {
    'use strict'
    const mesh = new THREE.Mesh(geom, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
    return mesh;
}

function addFoundation(obj, x, y, z) {
    'use strict'
    const geom = new THREE.CylinderGeometry(4, 4, 20);
    addMesh(obj, geom, materials.foundation, x, y, z);
}

function addCarousel(obj, x, y, z) {
    'use strict'
    ref1.position.set(x, y, z);

    addFoundation(ref1, 0, 0, 0);

    obj.add(ref1);
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
    renderer.render(scene, mainCamera);
}

////////////////////////////////
/* INITIALIZE ANIMATION CYCLE */
////////////////////////////////
function init() {
    'use strict';
    document.body.appendChild(renderer.domElement);
    
    createScene(); // create scene: cameras, objects, light
    onResize();    // update window size
    
    new OrbitControls(mainCamera, renderer.domElement);
    
    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////
function animate() {
    'use strict';
    update();
    render();
    requestAnimationFrame(animate);
}

////////////////////////////
/* RESIZE WINDOW CALLBACK */
////////////////////////////
function onResize() { 
    'use strict';
    renderer.setSize(window.innerWidth, window.innerHeight);
    mainCamera.aspect = window.innerWidth / window.innerHeight;
}

///////////////////////
/* KEY DOWN CALLBACK */
///////////////////////
function onKeyDown(e) {
    'use strict';

}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e){
    'use strict';
}

init();
animate();