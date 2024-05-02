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
let theta_1 = 0;
let z_trolley = 20;
let y_steelcable = 20;

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
let pedants_material = new THREE.MeshBasicMaterial({ color: 0x1FFBF00, wireframe: false });
let motors_material = new THREE.MeshBasicMaterial({ color: 0x00408B, wireframe: false });
let steel = new THREE.MeshBasicMaterial({ color: 0xB5C0C9, wireframe: false });
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

    handle.userData = { ForwardTranslation: false, BackwardTranslation: false };

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
    jib.userData = { RigthRotation: false, LeftRotation: false };

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

function addObjects(obj) {
    'use strict';
    material = new THREE.MeshBasicMaterial({ color: 0x104340, wireframe: true });

    addContainer(obj, 20, -20, -60);
    addDodecahedron(obj, -20, -20, -45);
    addIcosahedron(obj, -20, -20, -70);
    addTorus(obj, 20, -20, -20);
    addTorusKnot(obj, 0, -20, -35);
}

function addContainer(obj, x, y, z) {
    'use strict';

    const geom = new THREE.BufferGeometry();

    // Define the vertices for the base and the four walls of the container
    const vertices = new Float32Array([
        // Base (bottom face)
        w_container / 2, -h_container / 2, l_container / 2,   // Bottom front right
        -w_container / 2, -h_container / 2, l_container / 2,  // Bottom front left
        -w_container / 2, -h_container / 2, -l_container / 2, // Bottom back left
        w_container / 2, -h_container / 2, -l_container / 2,  // Bottom back right
        
        // Top corners of the walls
        w_container / 2, h_container / 2, l_container / 2,    // Top front right
        -w_container / 2, h_container / 2, l_container / 2,   // Top front left
        -w_container / 2, h_container / 2, -l_container / 2,  // Top back left
        w_container / 2, h_container / 2, -l_container / 2,   // Top back right
    ]);

    // Define the indices for the geometry (triangles)
    const indices = [
        // Base (bottom face)
        0, 1, 2, 0, 2, 3,

        // Front wall
        4, 5, 0, 4, 0, 1,

        // Back wall
        6, 7, 2, 6, 2, 3,

        // Left wall
        5, 6, 1, 6, 1, 2,
        
        // Right wall
        7, 4, 3, 4, 3, 0,
    ];

    geom.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geom.setIndex(indices);
    
    const mesh = new THREE.Mesh(geom, steel);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addDodecahedron(obj, x, y, z) {
    'use strict';
    const detail = 0; // Detail level (0 is default)
    const geom = new THREE.DodecahedronGeometry(r_dodecahedron, detail);
    const mesh = new THREE.Mesh(geom, steel);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addIcosahedron(obj, x, y, z) {
    'use strict';
    const detail = 0; // Detail level (0 is default)
    const geom = new THREE.IcosahedronGeometry(d_icosahedron, detail);
    const mesh = new THREE.Mesh(geom, steel);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addTorus(obj, x, y, z) {
    'use strict';
    const radialSegments = 24; 
    const tubularSegments = 48; 
    const arc = Math.PI * 2; // Full circle arc
    const geom = new THREE.TorusGeometry(r_torus, tr_torus, radialSegments, tubularSegments, arc);
    const mesh = new THREE.Mesh(geom, steel);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addTorusKnot(obj, x, y, z) {
    'use strict';
    const geom = new THREE.TorusKnotGeometry(r_torusknot, tr_torusknot, ts_torusknot, rs_torusknot, p_torusknot, q_torusknot);
    const mesh = new THREE.Mesh(geom, steel);
    mesh.position.set(x, y, z);
    obj.add(mesh);
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
    pedants_material.wireframe = !pedants_material.wireframe;
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

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    render();
}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////
function animate() {
    'use strict';

    if(jib.userData.LeftRotation){
        
    }
    if(jib.userData.RigthRotation){
        
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
            jib.userData.LeftRotation = true;
            break;
        case 81:
        case 113:
            // Rotate the superior to the rigth when pressing keys {Q,q}
            jib.userData.RigthRotation = true;
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