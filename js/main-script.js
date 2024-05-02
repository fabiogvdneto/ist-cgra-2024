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
    addObjects(scene);
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

    camera = cameras[3];
}


/////////////////////
/* CREATE LIGHT(S) */
/////////////////////


////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////
let geom, mesh;
let theta_1 = 0;
let z_trolley = 20;
let y_steelcable = 20;

// Crane Objects
let crane, superior, handle, hook;

// l = length | w = width | h = height | d = diameter | r = radius | tr = tube radius
const l_base = 15, h_base = 5;                                // foundation
const l_tower = 8, h_tower = 50;                              // tower
const l_cab = 6, h_cab = 5;                                   // cab
const h_apex = 15;                                            // apex
const w_cjib = 8, l_cjib = 20, h_cjib = 2.5;                  // counterjib
const w_jib = 8, l_jib = 35, h_jib = 3;                       // jib
const l_cweights = 6, h_cweights = 6, c_cweights = 5;         // counterweights
const d_pendants = 0;                                         // (rear & fore) pendants
const l_motor = 5, h_motor = 2;                               // motor
const l_trolley = 4, h_trolley = 2;                           // trolley
const d_steelcable = 0.1;                                     // steel cable
const l_hookblock = 5, h_hookblock = 2;                       // hook block
const l_claw = 6, h_claw = 4;                                 // claw

// Objects to be loaded by the crane
const w_container = 20, h_container = 14.5, l_container = 25; // container
const r_dodecahedron = 4;                                     // dodecahedron
const d_icosahedron = 4;                                      // icosahedron
const r_torus = 4, tr_torus = 1.5;                            // torus
const r_torusknot = 2.5, tr_torusknot = 0.75;                 // torus knot
const ts_torusknot = 50;                                      // Tubular segments for smoothness in torus knot
const rs_torusknot = 10;                                      // Radial segments for smoothness in torus knot
const p_torusknot = 2;                                        // 'p' parameter defines how many times the curve winds around its axis
const q_torusknot = 3;                                        // 'q' parameter defines how many times the curve winds around the tube

// Materials 
let foundation_material = new THREE.MeshBasicMaterial({ color: 0x1a7ef3, wireframe: false });
let tower_material = new THREE.MeshBasicMaterial({ color: 0xFFC300 , wireframe: false });
let metal_material = new THREE.MeshBasicMaterial({ color: 0x1FFBF00, wireframe: false });
let cab_material = new THREE.MeshBasicMaterial({ color: 0x1a7ef3, wireframe: false });
let pendants_material = new THREE.MeshBasicMaterial({ color: 0x1FFBF00, wireframe: false });
let motors_material = new THREE.MeshBasicMaterial({ color: 0x00408B, wireframe: false });
let steel = new THREE.MeshBasicMaterial({ color: 0xB5C0C9, wireframe: false });
let counterweights_material = new THREE.MeshBasicMaterial({ color: 0x00408B, wireframe: false });
let container_material = new THREE.MeshBasicMaterial({ color: 0xcacdcd, side: THREE.DoubleSide });

function createMesh(geom, material, x, y, z) {
    const mesh = new THREE.Mesh(geom, material);
    mesh.position.set(x, y, z);
    return mesh;
}

// great-grandchild ref: the hook (1x steel cable, 1x hook block, 4x claws)

function addSteelCable(obj, x, y, z) {
    'use strict';
    geom = new THREE.CylinderGeometry(d_steelcable, d_steelcable, y_steelcable, 16);
    obj.add(createMesh(geom, steel, x, y, z));
}

function addHookBlock(obj, x, y, z) {
    'use strict';
    geom = new THREE.BoxGeometry(l_hookblock, h_hookblock, l_hookblock);
    obj.add(createMesh(geom, cab_material, x, y, z));
}

function addClaws(obj, x, y, z) {
    'use strict';
    geom = new THREE.ConeGeometry((Math.pow(2*Math.pow(l_claw,2), 1/2)/2), -h_claw , 4, 1, false, 0.782, 6.3);
    obj.add(createMesh(geom, cab_material, x, y, z));
}

function addHook(obj, x, y, z) {
    'use strict';
    hook = new THREE.Object3D();

    addSteelCable(hook, 0, (y_steelcable/2), 0);
    addHookBlock(hook, 0, -(h_hookblock/2), 0);
    addClaws(hook, 0, -(h_hookblock + h_claw/2), 0);

    hook.position.set(x, y, z);

    obj.add(hook);
}

// grandchild ref: the handle (1x trolley)

function addTrolley(obj, x, y, z) {
    'use strict';
    geom = new THREE.BoxGeometry(l_trolley, h_trolley, l_trolley);
    obj.add(createMesh(geom, cab_material, x, y, z));
}

function addHandle(obj, x, y, z) {
    'use strict';
    handle = new THREE.Object3D();
    handle.userData = { ForwardTranslation: false, BackwardTranslation: false };

    addTrolley(handle, 0, -h_trolley/2, 0);
    addHook(handle, 0, -(h_trolley + y_steelcable), 0);

    handle.position.set(x, y, z);

    obj.add(handle);
}

// child ref: the superior (1x apex, 1x cab, 1x counterjib, 1x jib, 1x counterweights, 1x rear pendant, 1x fore pendant)

function addCab(obj, x, y, z) {
    'use strict';
    geom = new THREE.BoxGeometry(l_cab, h_cab, l_cab);
    obj.add(createMesh(geom, cab_material, x, y, z));
}

function addApex(obj, x, y, z) {
    'use strict';
    geom = new THREE.ConeGeometry((Math.pow(2*Math.pow(l_tower,2), 1/2)/2), h_apex, 4, 1, false, 0.782, 6.3);
    obj.add(createMesh(geom, tower_material, x, y, z));
}

function addCounterjib(obj, x, y, z) {
    'use strict';
    geom = new THREE.BoxGeometry(w_jib, h_cjib, l_cjib);
    obj.add(createMesh(geom, metal_material, x, y, z));
}

function addJib(obj, x, y, z) {
    'use strict';
    geom = new THREE.BoxGeometry(w_cjib, h_jib, l_jib);
    obj.add(createMesh(geom, metal_material, x, y, z));
}

function addCounterweigths(obj, x, y, z) {
    'use strict';
    geom = new THREE.BoxGeometry(c_cweights, h_cweights, l_cweights);
    obj.add(createMesh(geom, counterweights_material, x, y, z));
}

function addMotors(obj, x, y, z) { 
    'use strict';
    geom = new THREE.BoxGeometry(w_jib, h_motor, l_motor);
    obj.add(createMesh(geom, motors_material, x, y, z));
}

function addRearPendant(obj, x, y, z) {
    'use strict';
    const c1 = (h_apex - h_cjib);
    const c2 = (l_tower/2 + l_cjib*3/4);

    const length = Math.hypot(c1, c2); // h² = c² + c²
    const angle = Math.atan(c2 / c1);  // angle = arctan(c2 / c1)

    geom = new THREE.CylinderGeometry(d_pendants, d_pendants, length, 16);
    mesh = createMesh(geom, pendants_material, x, y, z);
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
    mesh = createMesh(geom, pendants_material, x, y, z);
    mesh.rotateX(angle);
    obj.add(mesh);
}

function addSuperior(obj, x, y, z) {
    'use strict';
    superior = new THREE.Object3D();
    superior.userData = { RigthRotation: false, LeftRotation: false };

    addCab(superior, 0, -(h_cab/2), -(l_tower/2 + l_cab/2));
    addApex(superior, 0, (h_apex/2), 0);
    addCounterjib(superior, 0, (h_cjib/2), (l_tower/2 + l_cjib/2));
    addJib(superior, 0, h_jib/2, -(l_tower + l_jib)/2);
    addCounterweigths(superior, 0, -(h_cweights)/2, (l_tower/2 + l_cjib - l_cweights));
    addMotors(superior, 0, (h_motor/2 + h_cjib), (l_cjib + l_tower/2 - l_motor/2));
    addRearPendant(superior, 0, (h_apex + h_cjib)/2, (l_tower/2 + l_cjib*3/4)/2);
    addForePendant(superior, 0, (h_apex + h_jib)/2, -(l_tower/2 + l_jib*3/4)/2);
    addHandle(superior, 0, 0, -(l_tower/2 + l_cab + l_trolley + z_trolley));

    superior.position.set(x, y, z);

    obj.add(superior);
}

// parent ref: WCS (1x foundation, 1x tower)

function addFoundation(obj, x, y, z) {
    'use strict';
    geom = new THREE.BoxGeometry(l_base, h_base, l_base);
    obj.add(createMesh(geom, foundation_material, x, y, z));
}

function addTower(obj, x, y, z) {
    'use strict';
    geom = new THREE.BoxGeometry(l_tower, h_tower, l_tower);
    obj.add(createMesh(geom, tower_material, x, y, z));
}

function addCrane(obj, x, y, z) {
    'use strict';
    crane = new THREE.Object3D();
    
    addFoundation(crane, 0, (h_base/2), 0);
    addTower(crane, 0, (h_base + h_tower/2), 0);
    addSuperior(crane, 0, (h_base + h_tower), 0);

    crane.position.set(x, y, z);
    obj.add(crane);
}

function addObjects(obj) {
    'use strict';
    addContainer(obj, 20, -20, -60);
    addDodecahedron(obj, -20, -20, -45);
    addIcosahedron(obj, -20, -20, -70);
    addTorus(obj, 20, -20, -20);
    addTorusKnot(obj, 0, -20, -35);
}

function addContainer(obj, x, y, z) {
    'use strict';
    const frontGeometry = new THREE.PlaneGeometry(w_container, h_container);
    const backGeometry = new THREE.PlaneGeometry(w_container, h_container);
    const leftGeometry = new THREE.PlaneGeometry(l_container, h_container);
    const rightGeometry = new THREE.PlaneGeometry(l_container, h_container);
    const baseGeometry = new THREE.PlaneGeometry(w_container, l_container);

    // Add the front wall
    const frontWall = createMesh(frontGeometry, container_material, x, y, z - l_container / 2);
    obj.add(frontWall);

    // Add the back wall
    const backWall = createMesh(backGeometry, container_material, x, y, z + l_container / 2);
    obj.add(backWall);

    // Add the left wall
    const leftWall = createMesh(leftGeometry, container_material, x - w_container / 2, y, z);
    leftWall.rotation.y = Math.PI / 2; // Rotate to face the correct direction
    obj.add(leftWall);

    // Add the right wall
    const rightWall = createMesh(rightGeometry, container_material, x + w_container / 2, y, z);
    rightWall.rotation.y = -Math.PI / 2; // Rotate to face the correct direction
    obj.add(rightWall);

    // Add the base platform
    const basePlatform = createMesh(baseGeometry, steel, x, y - h_container / 2, z);
    basePlatform.rotation.x = -Math.PI / 2; // Rotate the base platform to lie flat
    obj.add(basePlatform);
}

function addDodecahedron(obj, x, y, z) {
    'use strict';
    const detail = 0; // Detail level (0 is default)
    const geom = new THREE.DodecahedronGeometry(r_dodecahedron, detail);
    obj.add(createMesh(geom, steel, x, y, z));
}

function addIcosahedron(obj, x, y, z) {
    'use strict';
    const detail = 0; // Detail level (0 is default)
    const geom = new THREE.IcosahedronGeometry(d_icosahedron, detail);
    obj.add(createMesh(geom, steel, x, y, z));
}

function addTorus(obj, x, y, z) {
    'use strict';
    const radialSegments = 24; 
    const tubularSegments = 48; 
    const arc = Math.PI * 2; // Full circle arc
    const geom = new THREE.TorusGeometry(r_torus, tr_torus, radialSegments, tubularSegments, arc);
    obj.add(createMesh(geom, steel, x, y, z));
}

function addTorusKnot(obj, x, y, z) {
    'use strict';
    const geom = new THREE.TorusKnotGeometry(r_torusknot, tr_torusknot, ts_torusknot, rs_torusknot, p_torusknot, q_torusknot);
    obj.add(createMesh(geom, steel, x, y, z));
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


///////////////////////
/* HANDLE WIREFRAME */
///////////////////////
function toggleWireframe(){
    'use strict';
    foundation_material.wireframe = !foundation_material.wireframe;
    tower_material.wireframe = !tower_material.wireframe;
    metal_material.wireframe = !metal_material.wireframe;
    cab_material.wireframe = !cab_material.wireframe;
    pendants_material.wireframe = !pendants_material.wireframe;
    motors_material.wireframe = !motors_material.wireframe;
    steel.wireframe = !steel.wireframe;
    counterweights_material.wireframe = !counterweights_material.wireframe; 
    material.wireframe = !material.wireframe;
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

    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    render();
}


/////////////////////
/* ANIMATION CYCLE */
/////////////////////
function animate() {
    'use strict';
    if(superior.userData.LeftRotation){
        
    }

    if(superior.userData.RigthRotation){
        
    }

    if(handle.userData.ForwardTranslation){
        
    }

    if(handle.userData.BackwardTranslation){
        
    }

    render();
    requestAnimationFrame(animate);
}


////////////////////////////
/* RESIZE WINDOW CALLBACK */
////////////////////////////
function onResize() { 
    'use strict';
    renderer.setSize(window.innerWidth, window.innerHeight);
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
            toggleWireframe();
            break;
        case 65:
        case 97:
            // Rotate the superior to the left when pressing keys {A,a}
            superior.userData.LeftRotation = true;
            break;
        case 81:
        case 113:
            // Rotate the superior to the rigth when pressing keys {Q,q}
            superior.userData.RigthRotation = true;
            break;
        
        case 87:
        case 119:
            // Move the trolley forward when pressing keys {W,w}
            handle.userData.ForwardTranslation = true;
            break;
        case 83:
        case 115:
            // Move the trolley backwards when pressing keys {S,s}
            handle.userData.BackwardTranslation = true;
            break;
    }
    
    render();
}


///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e){
    'use strict';
    switch (e.keyCode) {
        case 65:
        case 97:
            // Stop rotating the superior to the left 
            jib.userData.LeftRotation = false;
            break;
        case 81:
        case 113:
            // Stop rotating the superior to the rigth
            jib.userData.RigthRotation = false;
            break;
        case 87:
        case 119:
            // Stop the trolley going forward 
            handle.userData.ForwardTranslation = false;
            break;
        case 83:
        case 115:
            // Stop the trolley backwards 
            handle.userData.BackwardTranslation = false;
                break;
    }  
    render();
}

init();
animate();