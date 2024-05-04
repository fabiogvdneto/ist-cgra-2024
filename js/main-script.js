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
let geom, mesh, material;
let y_steelcable = 20;

// Crane Objects
let crane;    // parent
let superior; // child
let handle;   // grandchild
let hook;     // ggrandchild

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
const material_main = new THREE.MeshBasicMaterial({ color: 0x123235, wireframe: false });
const material_misc = new THREE.MeshBasicMaterial({ color: 0x128293, wireframe: false });
const material_objs = new THREE.MeshBasicMaterial({ color: 0xd2b2a3, wireframe: false });
const material_wire = new THREE.MeshBasicMaterial({ color: 0x121342, wireframe: false });

function createMesh(geom, material, x, y, z) {
    const mesh = new THREE.Mesh(geom, material);
    mesh.position.set(x, y, z);
    return mesh;
}

// great-grandchild ref: the hook (1x steel cable, 1x hook block, 4x claws)

function addSteelCable(obj, x, y, z) {
    'use strict';
    geom = new THREE.CylinderGeometry(d_steelcable, d_steelcable, y_steelcable, 16);
    obj.add(createMesh(geom, material_wire, x, y, z));
}

function addHookBlock(obj, x, y, z) {
    'use strict';
    geom = new THREE.BoxGeometry(l_hookblock, h_hookblock, l_hookblock);
    obj.add(createMesh(geom, material_misc, x, y, z));
}

function addClaws(obj, x, y, z) {
    'use strict';
    geom = new THREE.ConeGeometry((Math.pow(2*Math.pow(l_claw,2), 1/2)/2), -h_claw , 4, 1, false, 0.782, 6.3);
    obj.add(createMesh(geom, material_misc, x, y, z));
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
    obj.add(createMesh(geom, material_misc, x, y, z));
}

function addHandle(obj, x, y, z) {
    'use strict';
    handle = new THREE.Object3D();
    handle.userData = { moving: false, step: 0.0 };

    addTrolley(handle, 0, -h_trolley/2, 0);
    addHook(handle, 0, -(h_trolley + y_steelcable), 0);

    handle.position.set(x, y, z);

    obj.add(handle);
}

// child ref: the superior (1x apex, 1x cab, 1x counterjib, 1x jib, 1x counterweights, 1x rear pendant, 1x fore pendant)

function addCab(obj, x, y, z) {
    'use strict';
    geom = new THREE.BoxGeometry(l_cab, h_cab, l_cab);
    obj.add(createMesh(geom, material_misc, x, y, z));
}

function addApex(obj, x, y, z) {
    'use strict';
    geom = new THREE.ConeGeometry((Math.pow(2*Math.pow(l_tower,2), 1/2)/2), h_apex, 4, 1, false, 0.782, 6.3);
    obj.add(createMesh(geom, material_main, x, y, z));
}

function addCounterjib(obj, x, y, z) {
    'use strict';
    geom = new THREE.BoxGeometry(w_jib, h_cjib, l_cjib);
    obj.add(createMesh(geom, material_main, x, y, z));
}

function addJib(obj, x, y, z) {
    'use strict';
    geom = new THREE.BoxGeometry(w_cjib, h_jib, l_jib);
    obj.add(createMesh(geom, material_main, x, y, z));
}

function addCounterweigths(obj, x, y, z) {
    'use strict';
    geom = new THREE.BoxGeometry(c_cweights, h_cweights, l_cweights);
    obj.add(createMesh(geom, material_misc, x, y, z));
}

function addMotors(obj, x, y, z) { 
    'use strict';
    geom = new THREE.BoxGeometry(w_jib, h_motor, l_motor);
    obj.add(createMesh(geom, material_misc, x, y, z));
}

function addRearPendant(obj, x, y, z) {
    'use strict';
    const c1 = (h_apex - h_cjib);
    const c2 = (l_tower/2 + l_cjib*3/4);

    const length = Math.hypot(c1, c2); // h² = c² + c²
    const angle = Math.atan(c2 / c1);  // angle = arctan(c2 / c1)

    geom = new THREE.CylinderGeometry(d_pendants, d_pendants, length, 16);
    mesh = createMesh(geom, material_wire, x, y, z);
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
    mesh = createMesh(geom, material_wire, x, y, z);
    mesh.rotateX(angle);
    obj.add(mesh);
}

function addSuperior(obj, x, y, z) {
    'use strict';
    superior = new THREE.Object3D();
    superior.userData = { moving: false, step: 0.0 };

    addCab(superior, 0, h_cab/2, 0);
    addApex(superior, 0, (h_cab + h_apex/2), 0);
    addCounterjib(superior, 0, (h_cab + h_cjib/2), (l_tower/2 + l_cjib/2));
    addJib(superior, 0, (h_cab + h_jib/2), -(l_tower + l_jib)/2);
    addCounterweigths(superior, 0, (h_cab - h_cweights/2), (l_tower/2 + l_cjib - l_cweights));
    addMotors(superior, 0, (h_cab + h_motor/2 + h_cjib), (l_cjib + l_tower/2 - l_motor/2));
    addRearPendant(superior, 0, (h_cab + h_apex/2 + h_cjib/2), (l_tower/2 + l_cjib*3/4)/2);
    addForePendant(superior, 0, (h_cab + h_apex/2 + h_jib/2),  -(l_tower/2 + l_jib*3/4)/2);
    addHandle(superior, 0, h_cab, -(l_tower/2 + l_trolley));

    superior.position.set(x, y, z);

    obj.add(superior);
}

// parent ref: WCS (1x foundation, 1x tower)

function addFoundation(obj, x, y, z) {
    'use strict';
    geom = new THREE.BoxGeometry(l_base, h_base, l_base);
    obj.add(createMesh(geom, material_misc, x, y, z));
}

function addTower(obj, x, y, z) {
    'use strict';
    geom = new THREE.BoxGeometry(l_tower, h_tower, l_tower);
    obj.add(createMesh(geom, material_main, x, y, z));
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
    const frontWall = createMesh(frontGeometry, material_objs, x, y, z - l_container / 2);
    obj.add(frontWall);

    // Add the back wall
    const backWall = createMesh(backGeometry, material_objs, x, y, z + l_container / 2);
    obj.add(backWall);

    // Add the left wall
    const leftWall = createMesh(leftGeometry, material_objs, x - w_container / 2, y, z);
    leftWall.rotation.y = Math.PI / 2; // Rotate to face the correct direction
    obj.add(leftWall);

    // Add the right wall
    const rightWall = createMesh(rightGeometry, material_objs, x + w_container / 2, y, z);
    rightWall.rotation.y = -Math.PI / 2; // Rotate to face the correct direction
    obj.add(rightWall);

    // Add the base platform
    const basePlatform = createMesh(baseGeometry, material_objs, x, y - h_container / 2, z);
    basePlatform.rotation.x = -Math.PI / 2; // Rotate the base platform to lie flat
    obj.add(basePlatform);
}

function addDodecahedron(obj, x, y, z) {
    'use strict';
    const detail = 0; // Detail level (0 is default)
    const geom = new THREE.DodecahedronGeometry(r_dodecahedron, detail);
    obj.add(createMesh(geom, material_objs, x, y, z));
}

function addIcosahedron(obj, x, y, z) {
    'use strict';
    const detail = 0; // Detail level (0 is default)
    const geom = new THREE.IcosahedronGeometry(d_icosahedron, detail);
    obj.add(createMesh(geom, material_objs, x, y, z));
}

function addTorus(obj, x, y, z) {
    'use strict';
    const radialSegments = 24; 
    const tubularSegments = 48; 
    const arc = Math.PI * 2; // Full circle arc
    const geom = new THREE.TorusGeometry(r_torus, tr_torus, radialSegments, tubularSegments, arc);
    obj.add(createMesh(geom, material_objs, x, y, z));
}

function addTorusKnot(obj, x, y, z) {
    'use strict';
    const geom = new THREE.TorusKnotGeometry(r_torusknot, tr_torusknot, ts_torusknot, rs_torusknot, p_torusknot, q_torusknot);
    obj.add(createMesh(geom, material_objs, x, y, z));
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


///////////////////////
/* HANDLE WIREFRAME */
///////////////////////
function toggleWireframe(){
    'use strict';
    material_main.wireframe = !material_main.wireframe;
    material_misc.wireframe = !material_misc.wireframe;
    material_objs.wireframe = !material_objs.wireframe;
    material_wire.wireframe = !material_wire.wireframe;
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
function update(){
    'use strict';
    if (superior.userData.moving) {
        superior.rotateY(superior.userData.step);
    }

    if (handle.userData.moving) {
        handle.position.z -= handle.userData.step;
        handle.position.z = Math.min(handle.position.z, -(l_tower/2 + l_trolley));
        handle.position.z = Math.max(-(l_tower/2 + l_jib - l_trolley/2), handle.position.z)
    }
}

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
}


///////////////////////
/* KEY DOWN CALLBACK */
///////////////////////
function onKeyDown(e) {
    'use strict';
    switch (e.keyCode) {
        // Switch camera when pressing numkeys (1-6)
        case 49:  /* 1 */
        case 50:  /* 2 */
        case 51:  /* 3 */
        case 52:  /* 4 */
        case 53:  /* 5 */
        case 54:  /* 6 */
            camera = cameras[e.keyCode - 49];
            break;
        // Toggle wireframe mode
        case 55:  /* 7 */
            toggleWireframe();
            break;
        // Activate superior rotation to the left
        case 65:  /* A */
        case 97:  /* a */
            superior.userData.moving = true;
            superior.userData.step = 0.02;
            break;
        // Activate superior rotation to the right
        case 81:  /* Q */
        case 113: /* q */
            superior.userData.moving = true;
            superior.userData.step = -0.02;
            break;
        // Activate handle forward movement
        case 87:  /* W */
        case 119: /* w */
            handle.userData.moving = true;
            handle.userData.step = 0.1;
            break;
        // Activate handle backwards movement
        case 83:  /* S */
        case 115: /* s */
            handle.userData.moving = true;
            handle.userData.step = -0.1;
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
        // Deactivate superior rotation
        case 65:  /* A */
        case 81:  /* Q */
        case 97:  /* a */
        case 113: /* q */
            superior.userData.moving = false;
            break;
        // Deactivate handle movement
        case 83:  /* S */
        case 87:  /* W */
        case 115: /* s */
        case 119: /* w */
            handle.userData.moving = false;
            break;
    }

    render();
}

init();
animate();