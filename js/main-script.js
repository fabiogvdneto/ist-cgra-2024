import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import * as Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

//////////////////////
/* GLOBAL VARIABLES */
//////////////////////
let camera, scene, renderer;
let cameras = [];

/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene() {
    'use strict';
    scene = new THREE.Scene();
    scene.add(new THREE.AxesHelper(10));
    scene.background = new THREE.Color('aliceblue');

    addCrane(scene, 0, -20, 0);
}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////
function createPerpectiveCamera(x, y, z) {
    'use strict';
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(x, y, z);
    camera.lookAt(scene.position);

    cameras.push(camera);
}

function createOrthographicCamera(x, y, z) {
    'use strict';
    camera = new THREE.OrthographicCamera(window.innerWidth / -12, window.innerWidth / 12, window.innerHeight / 12, window.innerHeight / -12, 0.1, 1000);
    camera.position.set(x, y, z);
    camera.lookAt(scene.position);

    cameras.push(camera);
}

function initializeCameras() {
    'use strict';
    createOrthographicCamera(110, 0, 0);      // frontal camera
    createOrthographicCamera(0,0,110);        // side camera
    createOrthographicCamera(0,110,0);        // top camera
    createOrthographicCamera(140, 140, 140);  // orthogonal projection
    createPerpectiveCamera(140, 140, 140);    // perspective projection
    // createOrthographicCamera(); - movel camera

    camera = cameras[0];
}

/////////////////////
/* CREATE LIGHT(S) */
/////////////////////

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////
let geom, mesh, material;
let theta_1 = 0;
let z_trolley = 20;
let y_steelcable = 20;

// l = length | w = width | h = height | d = diameter
const l_base = 15, h_base = 5;                        // foundation
const l_tower = 8, h_tower = 50;                      // tower
const l_cab = 6, h_cab = 5;                           // cab
const h_apex = 15;                                    // apex
const w_cjib = 8, l_cjib = 20, h_cjib = 2.5;          // counterjib
const w_jib = 8, l_jib = 35, h_jib = 3;               // jib
const l_cweights = 6, h_cweights = 6, c_cweights = 5; // counterweights
const d_pendants = 0;                                 // (rear & fore) pendants
const l_motor = 5, h_motor = 2;                       // motor
const l_trolley = 4, h_trolley = 2;                   // trolley
const d_steelcable = 0.1;                             // steel cable
const l_hookblock = 5, h_hookblock = 2;               // hook block
const l_claw = 6, h_claw = 4;                         // claw

// Materials 
let foundation_material = new THREE.MeshBasicMaterial({ color: 0x1a7ef3, wireframe: false });
let tower_material = new THREE.MeshBasicMaterial({ color: 0xFFC300 , wireframe: false });
let metal_material = new THREE.MeshBasicMaterial({ color: 0x1FFBF00, wireframe: false });
let cab_material = new THREE.MeshBasicMaterial({ color: 0x1a7ef3, wireframe: false });
let pedants_material = new THREE.MeshBasicMaterial({ color: 0x1FFBF00, wireframe: true });
let motors_material = new THREE.MeshBasicMaterial({ color: 0x00408B, wireframe: false });
let steel = new THREE.MeshBasicMaterial({ color: 0xB5C0C9, wireframe: true });
let counterweights_material = new THREE.MeshBasicMaterial({ color: 0x00408B, wireframe: false });

// great-grandchild ref: the hook (1x steel cable, 1x hook block, 4x claws)

function addSteelCable(obj, x, y, z) {
    'use strict';
    geom = new THREE.CylinderGeometry(d_steelcable, d_steelcable, y_steelcable, 16);
    mesh = new THREE.Mesh(geom, steel);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addHookBlock(obj, x, y, z) {
    'use strict';
    geom = new THREE.BoxGeometry(l_hookblock, h_hookblock, l_hookblock);
    mesh = new THREE.Mesh(geom, cab_material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}


function addClaws(obj, x, y, z) {
    'use strict';
    geom = new THREE.ConeGeometry((Math.pow(2*Math.pow(l_claw,2), 1/2)/2), -h_claw , 4, 1, false, 0.782, 6.3);
    mesh = new THREE.Mesh(geom, cab_material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addHook(obj, x, y, z) {
    'use strict';
    const cable = new THREE.Object3D();

    material = new THREE.MeshBasicMaterial({ color: 0x104340, wireframe: true });21

    addSteelCable(cable, 0, (y_steelcable/2), 0);
    addHookBlock(cable, 0, -(h_hookblock/2), 0);
    addClaws(cable, 0, -(h_hookblock + h_claw/2), 0);

    cable.position.set(x, y, z);

    obj.add(cable);
}

// grandchild ref: the handle (1x trolley)

function addTrolley(obj, x, y, z) {
    'use strict';
    geom = new THREE.BoxGeometry(l_trolley, h_trolley, l_trolley);
    mesh = new THREE.Mesh(geom, cab_material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addHandle(obj, x, y, z) {
    'use strict';
    const handle = new THREE.Object3D();

    material = new THREE.MeshBasicMaterial({ color: 0x104340, wireframe: true });

    addTrolley(handle, 0, -h_trolley/2, 0);
    addHook(handle, 0, -(h_trolley + y_steelcable), 0);

    handle.position.set(x, y, z);

    obj.add(handle);
}

// child ref: the superior (1x apex, 1x cab, 1x counterjib, 1x jib, 1x counterweights, 1x rear pendant, 1x fore pendant)

function addCab(obj, x, y, z) {
    'use strict';
    geom = new THREE.BoxGeometry(l_cab, h_cab, l_cab);
    mesh = new THREE.Mesh(geom, cab_material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addApex(obj, x, y, z) {
    'use strict';
    geom = new THREE.ConeGeometry((Math.pow(2*Math.pow(l_tower,2), 1/2)/2), h_apex, 4, 1, false, 0.782, 6.3);
    mesh = new THREE.Mesh(geom, tower_material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addCounterjib(obj, x, y, z) {
    'use strict';
    geom = new THREE.BoxGeometry(w_jib, h_cjib, l_cjib);
    mesh = new THREE.Mesh(geom, metal_material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addJib(obj, x, y, z) {
    'use strict';
    geom = new THREE.BoxGeometry(w_cjib, h_jib, l_jib);
    mesh = new THREE.Mesh(geom, metal_material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addCounterweigths(obj, x, y, z) {
    'use strict';
    geom = new THREE.BoxGeometry(c_cweights, h_cweights, l_cweights);
    mesh = new THREE.Mesh(geom, counterweights_material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addMotors(obj, x, y, z) { 
    'use strict';
    geom = new THREE.BoxGeometry(w_jib, h_motor, l_motor);
    mesh = new THREE.Mesh(geom, motors_material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addRearPendant(obj, x, y, z) {
    'use strict';
    const c1 = (h_apex - h_cjib);
    const c2 = (l_tower/2 + l_cjib*3/4);

    const length = Math.hypot(c1, c2); // h² = c² + c²
    const angle = Math.atan(c2 / c1);  // angle = arctan(c2 / c1)

    geom = new THREE.CylinderGeometry(d_pendants, d_pendants, length, 16);
    mesh = new THREE.Mesh(geom, pedants_material);
    mesh.position.set(x, y, z);
    mesh.rotateX(-angle);
    obj.add(mesh);
}

function addForePendant(obj, x, y, z) {
    'use strict';
    const c1 = (h_apex - h_jib);
    const c2 = (l_tower/2 + l_jib*3/4);

    const length = Math.hypot(c1, c2); // h² = c² + c²
    const angle = Math.atan(c2 / c1);  // angle = arctan(c2 / c1)

    geom = new THREE.CylinderGeometry(d_pendants, d_pendants, length, 16);
    mesh = new THREE.Mesh(geom, pedants_material);
    mesh.position.set(x, y, z);
    mesh.rotateX(angle);
    obj.add(mesh);
}

function addSuperior(obj, x, y, z) {
    'use strict';
    const jib = new THREE.Object3D();

    addCab(jib, 0, -(h_cab/2), -(l_tower/2 + l_cab/2));
    addApex(jib, 0, (h_apex/2), 0);
    addCounterjib(jib, 0, (h_cjib/2), (l_tower/2 + l_cjib/2));
    addJib(jib, 0, h_jib/2, -(l_tower + l_jib)/2);
    addCounterweigths(jib, 0, -(h_cweights)/2, (l_tower/2 + l_cjib - l_cweights));
    addMotors(jib, 0, (h_motor/2 + h_cjib), (l_cjib + l_tower/2 - l_motor/2));
    addRearPendant(jib, 0, (h_apex + h_cjib)/2, (l_tower/2 + l_cjib*3/4)/2);
    addForePendant(jib, 0, (h_apex + h_jib)/2, -(l_tower/2 + l_jib*3/4)/2);
    addHandle(jib, 0, 0, -(l_tower/2 + l_cab + l_trolley + z_trolley));

    jib.position.set(x, y, z);

    obj.add(jib);
}

// parent ref: WCS (1x foundation, 1x tower)

function addFoundation(obj, x, y, z) {
    'use strict';
    geom = new THREE.BoxGeometry(l_base, h_base, l_base);
    mesh = new THREE.Mesh(geom, foundation_material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addTower(obj, x, y, z) {
    'use strict';
    geom = new THREE.BoxGeometry(l_tower, h_tower, l_tower);
    mesh = new THREE.Mesh(geom, tower_material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addCrane(obj, x, y, z) {
    'use strict';
    const crane = new THREE.Object3D();
    
    addFoundation(crane, 0, (h_base/2), 0);
    addTower(crane, 0, (h_base + h_tower/2), 0);
    addSuperior(crane, 0, (h_base + h_tower), 0);

    crane.position.set(x, y, z);

    obj.add(crane);
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
        // Switch camera when pressing keys {1, 2, 3, 4, 5, 6}
        case 49:
        case 50:
        case 51:
        case 52:
        case 53:
        case 54:
            camera = cameras[e.keyCode - 49];
            break;
        case 55:
            scene.traverse(function (node) {
                if (node instanceof THREE.Mesh) {
                    node.material.wireframe = !node.material.wireframe;
                }
            });
            break;
        case 87:
        case 119:
            // Move the trolley forward when pressing keys {W,w}
            z_trolley += 1;
            break;
        case 83:
        case 115:
            // Move the trolley backwards when pressing keys {S,s}
            z_trolley -= 1;
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