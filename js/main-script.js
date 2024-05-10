import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let camera, cameras = [];

const scene = new THREE.Scene();
const clock = new THREE.Clock();
const renderer = new THREE.WebGLRenderer({ antialias: true });

/* Crane Referentials */
const ref1 = new THREE.Object3D(); // parent
const ref2 = new THREE.Group();    // child
const ref3 = new THREE.Group();    // grandchild
const ref4 = new THREE.Group();    // ggrandchild
const objs = new THREE.Group();    // objects
const claws = new THREE.Group();   // claws
const container = new THREE.Group();

// l = length | w = width | h = height | d = diameter | r = radius | tr = tube radius
const d_base = 8, h_base = 6;                                 // foundation
const l_tower = 5, h_tower = 80;                              // tower
const d_cab = 4, h_cab = 5;                                   // cab
const h_apex = 13;                                            // apex
const w_cjib = 8, l_cjib = 30, h_cjib = 2.5;                  // counterjib
const w_jib = 8, l_jib = 70, h_jib = 3;                       // jib
const l_cweights = 6, h_cweights = 6, c_cweights = 5;         // counterweights
const d_pendants = 0.05;                                      // (rear & fore) pendants
const l_motor = 5, h_motor = 2;                               // motor
const l_trolley = 4, h_trolley = 2;                           // trolley
const d_steelcable = 0.1, h_steelcable = h_tower/4;           // steel cable
const l_hookblock = 5, h_hookblock = 2;                       // hook block
const h_claw = 6;                                             // claw

const max_ref3_z = -(d_cab/2 + l_trolley + 5)
const min_ref3_z = -(d_cab + l_jib - l_trolley);

const max_ref4_y = -(h_trolley);
const min_ref4_y = -(h_tower + h_base/2 - 1);

const max_theta = Math.PI / 6;
const min_theta = -Math.PI / 10;

// Objects to be loaded by the crane
const w_container = 20, h_container = 14.5, l_container = 25; // container
const l_cube = 4, h_cube = 4;                                 // cube
const r_dodecahedron = 4;                                     // dodecahedron
const r_icosahedron = 4;                                      // icosahedron
const r_torus = 4, tr_torus = 1.5;                            // torus
const r_torusknot = 2.5, tr_torusknot = 0.75;                 // torus knot
const ts_torusknot = 50;                                      // Tubular segments for smoothness in torus knot
const rs_torusknot = 10;                                      // Radial segments for smoothness in torus knot
const p_torusknot = 2;                                        // 'p' parameter defines how many times the curve winds around its axis
const q_torusknot = 3;                                        // 'q' parameter defines how many times the curve winds around the tube

// Materials
const material_main = new THREE.MeshBasicMaterial({ color: 0x123235, wireframe: true });     // main color
const material_misc = new THREE.MeshBasicMaterial({ color: 0x128293, wireframe: true });     // miscellaneous color
const material_objs = new THREE.MeshBasicMaterial({ color: 0xd2b2a3, wireframe: true });     // objects color - not used
const material_wire = new THREE.MeshBasicMaterial({ color: 0x121342, wireframe: true });     // cable's color
const material_bcnt = new THREE.MeshBasicMaterial({ color: 0x4FB286, wireframe: true });     // base container color
const material_cont = new THREE.MeshBasicMaterial({ color: 0xA7C4A0, wireframe: true });     // container color
const material_dodd = new THREE.MeshBasicMaterial({ color: 0xBABD8D, wireframe: true });     // dodecahedron color
const material_icod = new THREE.MeshBasicMaterial({ color: 0x355834, wireframe: true });     // icosahedron color
const material_toru = new THREE.MeshBasicMaterial({ color: 0x14281D, wireframe: true });     // torus color
const material_tknt = new THREE.MeshBasicMaterial({ color: 0xC2A878, wireframe: true });     // torus knot color
const material_cube = new THREE.MeshBasicMaterial({ color: 0xB0413E, wireframe: true });     // cube color

// Constants to keep track of key state
const keys = {
    '1': { isActive: false, description: 'Frontal View (1)' },
    '2': { isActive: false, description: 'Lateral View (2)' },
    '3': { isActive: false, description: 'Top View (3)' },
    '4': { isActive: false, description: 'Orthogonal Projection (4)' },
    '5': { isActive: false, description: 'Perspective Projection (5)' },
    '6': { isActive: false, description: 'Mobile (6)' },
    '7': { isActive: false, description: 'Toggle Wireframe (7)' },
    'A': { isActive: false, description: 'Left Rotation (A)' },
    'Q': { isActive: false, description: 'Right Rotation (Q)' },
    'W': { isActive: false, description: 'Move Forward (W)' },
    'S': { isActive: false, description: 'Move Backwards (S)' },
    'E': { isActive: false, description: 'Move Up (E)' },
    'D': { isActive: false, description: 'Move Down (D)' },
    'R': { isActive: false, description: 'Open Claws (R)' },
    'F': { isActive: false, description: 'Close Claws (F)' }
}


/* ---------------- */
/* ---- EVENTS ---- */
/* ---------------- */

function toggleWireframe(){
    'use strict';
    material_main.wireframe = !material_main.wireframe;
    material_misc.wireframe = !material_misc.wireframe;
    material_objs.wireframe = !material_objs.wireframe;
    material_wire.wireframe = !material_wire.wireframe;
    material_bcnt.wireframe = !material_bcnt.wireframe;
    material_cont.wireframe = !material_cont.wireframe;
    material_dodd.wireframe = !material_dodd.wireframe;
    material_icod.wireframe = !material_icod.wireframe;
    material_toru.wireframe = !material_toru.wireframe;
    material_tknt.wireframe = !material_tknt.wireframe;
    material_cube.wireframe = !material_cube.wireframe;
}

function updateCameras() {
    const WIDTH = window.innerWidth;
    const HEIGHT = window.innerHeight;
    const RATIO = WIDTH / HEIGHT;

    cameras.forEach(camera => {
        if (camera.isPerspectiveCamera) {
            camera.aspect = RATIO;
        } else {
            camera.right = WIDTH/8;
            camera.left = -WIDTH/8;
            camera.top = HEIGHT/8;
            camera.bottom = -HEIGHT/8;
        }

        camera.updateProjectionMatrix();
    });
}

function onResize() { 
    'use strict';
    updateCameras();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function updateKeyStatus() {
    const key_status_div = document.getElementById('keyStatus');
    let status_text = '<span style ="color : white">Cameras:</span><br><hr>';

    for (const [key, value] of Object.entries(keys)) {
        const state = value.isActive ? 'Active' : 'Inactive';
        const color = value.isActive ? 'lightGreen' : 'lightGray';
        
        status_text += `<span style="color: ${color};">${value.description}: ${state}</span><br>`;

        if (key == '6') {
            status_text += '<span style ="color : white"><hr>Wireframe:</span><br><hr>';
            continue;
        }

        if (key == '7') {
            status_text += '<span style ="color : white"><hr>Movements:</span><br><hr>';
        }
    }

    key_status_div.innerHTML = status_text;
}

function onKeyDown(e) {
    'use strict';
    const key = e.key.toUpperCase();
    const value = keys[key];

    if (!value) return;

    value.isActive = true;

    if (key >= '1' && key <= '6') {
        camera = cameras[e.keyCode - 49];
        return;
    }
    
    if (key == '7') {
        toggleWireframe();
        return;
    }
    
    // movement-related keys (only enable if animation is not occurring)
    if (!objs.userData.collected) {
        switch (key) {
            // Activate superior rotation to the left
            case 'A':
                ref2.userData.moving_left = true;
                break;
            // Activate superior rotation to the right
            case 'Q':
                ref2.userData.moving_right = true;
                break;
            // Activate handle forward movement
            case 'W':
                ref3.userData.moving_forward = true;
                break;
            // Activate handle backward movement
            case 'S':
                ref3.userData.moving_backwards = true;
                break;
            // Activate hook movement upwards
            case 'E':
                ref4.userData.moving_up = true;
                break;
            // Activate hook movement downwards
            case 'D':
                ref4.userData.moving_down = true;
                break;
            // Activate claws opening movement
            case 'R':
                claws.userData.opening = true;
                break;
            // Activate claws closing movement
            case 'F':
                claws.userData.closing = true;
                break;
        }
    }
}

function onKeyUp(e) {
    'use strict';
    const key = e.key.toUpperCase();
    const value = keys[key];

    if (!value) return;

    value.isActive = false;

    switch (key) {
        // Deactivate superior rotation to the left
        case 'A':
            ref2.userData.moving_left = false;
            break;
        // Deactivate superior rotation to the right
        case 'Q':
            ref2.userData.moving_right = false;
        // Deactivate handle forward movement
        case 'W':
            ref3.userData.moving_forward = false;
        // Deactivate handle backward movement
        case 'S':
            ref3.userData.moving_backwards = false;
            break;
        // Deactivate hook movement upwards
        case 'E':
            ref4.userData.moving_up = false;
            break;
        // Deactivate hook movement downwards
        case 'D':
            ref4.userData.moving_down = false;
            break;
        // Deactivate claws opening movement
        case 'R':
            claws.userData.opening = false;
            break;
        // Deactivate claws closing movement
        case 'F':
            claws.userData.closing = false;
            break;
    }
}


/* -------------------- */
/* ---- COLLISIONS ---- */
/* -------------------- */

function checkCollisions() {
    'use strict';
    // c1: centroid of the hook bounding box (sphere)
    // r1:   radius of the hook bounding box (sphere)
    const c1 = ref4.getWorldPosition(new THREE.Vector3());
    const r1 = h_hookblock + h_claw;

    return objs.userData.collected = objs.children.find(obj => {
        const c2 = obj.position;           // centroid of object bounding box
        const r2 = obj.userData.bbradius;  // radius of object bounding box

        return Math.pow(r1 + r2, 2) >= c1.distanceToSquared(c2);
    });
}

function handleCollisions() {
    'use strict';
    const obj = objs.userData.collected.removeFromParent();

    obj.position.set(0, -(h_hookblock + h_claw/2 + obj.userData.bbradius), 0);

    // distance from the container to the origin (WCS)
    const dist = container.position.length();

    // list of actions to be executed in order
    // * height:      y from referential 3
    // * distance:    z from referential 3 (modulus)
    // * theta:       claws angle
    // * drop:        if the object should be dropped inside the container
    ref4.add(obj).userData.next_points = [
        // 1. move the hook above the container
        { drop: false, distance: dist, theta: min_theta, height: -h_tower/2 },

        // 2. move the hook inside the container and drop the object there
        { drop: true,  distance: dist, theta: max_theta, height: -h_tower+obj.userData.bbradius*2 },

        // 3. move the hook above the container
        { drop: false, distance: dist, theta: max_theta, height: -h_tower/2 },

        // 4. close the claws
        { drop: false, distance: dist, theta: min_theta, height: -h_tower/2 }
    ];
}

/* --------------- */
/* ---- CRANE ---- */
/* --------------- */

function addMesh(obj, geom, material, x, y, z) {
    const mesh = new THREE.Mesh(geom, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
    return mesh;
}

// great-grandchild ref: the hook (1x steel cable, 1x hook block, 4x claws)

function addSteelCable(obj, x, y, z) {
    'use strict';
    const geom = new THREE.CylinderGeometry(d_steelcable, d_steelcable, h_steelcable);
    obj.userData.cable = addMesh(obj, geom, material_wire, x, y, z);
}

function addHookBlock(obj, x, y, z) {
    'use strict';
    const geom = new THREE.BoxGeometry(l_hookblock, h_hookblock, l_hookblock);
    addMesh(obj, geom, material_misc, x, y, z);
}

function addClaws(obj, x, y, z) {
    'use strict';
    const geom = new THREE.BufferGeometry();

    const vertices = [
        0, h_hookblock/2, -5/8 * l_hookblock/2,                 // Vertex 0
        l_hookblock/2, h_hookblock/2, -11/13 * l_hookblock/2,   // Vertex 1
        -l_hookblock/2, h_hookblock/2,-11/13 * l_hookblock/2,   // Vertex 2
        0, -h_claw, -7.5/8 * l_hookblock/2                      // Vertex 3
    ];

    const indices = [
        0, 1, 2,  // Face 0
        0, 3, 1,  // Face 1
        0, 2, 3,  // Face 2
        1, 3, 2   // Face 3
    ];

    geom.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geom.setIndex(indices);

    addMesh(claws, geom, material_toru, x, y, z);
    addMesh(claws, geom, material_toru, x, y, z).rotateY(Math.PI / 2);
    addMesh(claws, geom, material_toru, x, y, z).rotateY(-Math.PI / 2);
    addMesh(claws, geom, material_toru, x, y, z).rotateY(Math.PI);

    obj.add(claws);
}

function addHook(obj, x, y, z) {
    'use strict';
    ref4.position.set(x, y, z);

    addSteelCable(ref4, 0, (h_steelcable/2), 0);
    addHookBlock( ref4, 0, -(h_hookblock/2),  0);
    addClaws(     ref4, 0, -(h_hookblock),    0);

    obj.add(ref4);
}

// grandchild ref: the handle (1x trolley)

function addTrolley(obj, x, y, z) {
    'use strict';
    const geom = new THREE.BoxGeometry(l_trolley, h_trolley, l_trolley);
    addMesh(obj, geom, material_misc, x, y, z);
}

function addHandle(obj, x, y, z) {
    'use strict';
    ref3.position.set(x, y, z);

    addTrolley(ref3, 0, -(h_trolley/2), 0);
    addHook(   ref3, 0, -(h_trolley+h_steelcable), 0);

    obj.add(ref3);
}

// child ref: the superior (1x apex, 1x cab, 1x counterjib, 1x jib, 1x counterweights, 1x rear pendant, 1x fore pendant)

function addCab(obj, x, y, z) {
    'use strict';
    const geom = new THREE.CylinderGeometry(d_cab, d_cab, h_cab, 16);
    addMesh(obj, geom, material_misc, x, y, z);
}

function addApex(obj, x, y, z) {
    'use strict';
    const geom = new THREE.ConeGeometry((Math.pow(2*Math.pow(l_tower,2), 1/2)/2), h_apex, 4, 1, false, 0.782, 6.3);
    addMesh(obj, geom, material_main, x, y, z);
}

function addCounterjib(obj, x, y, z) {
    'use strict';
    const geom = new THREE.BoxGeometry(w_jib, h_cjib, l_cjib);
    addMesh(obj, geom, material_main, x, y, z);
}

function addJib(obj, x, y, z) {
    'use strict';
    const geom = new THREE.BoxGeometry(w_cjib, h_jib, l_jib);
    addMesh(obj, geom, material_main, x, y, z);
}

function addCounterweigths(obj, x, y, z) {
    'use strict';
    const geom = new THREE.BoxGeometry(c_cweights, h_cweights, l_cweights);
    addMesh(obj, geom, material_misc, x, y, z);
}

function addMotors(obj, x, y, z) { 
    'use strict';
    const geom = new THREE.BoxGeometry(w_jib, h_motor, l_motor);
    addMesh(obj, geom, material_misc, x, y, z);
}

function addRearPendant(obj, x, y, z) {
    'use strict';
    const c1 = (h_apex - h_cjib);
    const c2 = (l_tower/2 + l_cjib*3/4);

    const length = Math.hypot(c1, c2); // h² = c² + c²
    const angle = Math.atan(c2 / c1);  // angle = arctan(c2 / c1)

    const geom = new THREE.CylinderGeometry(d_pendants, d_pendants, length, 16);
    const mesh = addMesh(obj, geom, material_wire, x, y, z);

    mesh.rotateX(-angle);
}

function addForePendant(obj, x, y, z) {
    'use strict';
    const c1 = (h_apex - h_jib);
    const c2 = (l_tower/2 + l_jib*3/4);

    const length = Math.hypot(c1, c2); // h² = c² + c²
    const angle = Math.atan(c2 / c1);  // angle = arctan(c2 / c1)

    const geom = new THREE.CylinderGeometry(d_pendants, d_pendants, length, 16);
    const mesh = addMesh(obj, geom, material_wire, x, y, z);

    mesh.rotateX(angle);
}

function addSuperior(obj, x, y, z) {
    'use strict';
    ref2.position.set(x, y, z);

    addCab(           ref2, 0, (h_cab/2), 0);
    addApex(          ref2, 0, (h_cab + h_apex/2), 0);
    addCounterjib(    ref2, 0, (h_cab + h_cjib/2),             (l_tower/2 + l_cjib/2));
    addJib(           ref2, 0, (h_cab + h_jib/2),             -(l_tower + l_jib)/2);
    addCounterweigths(ref2, 0, (h_cab - h_cweights/2),         (l_tower/2 + l_cjib - l_cweights));
    addMotors(        ref2, 0, (h_cab + h_motor/2 + h_cjib),   (l_cjib + l_tower/2 - l_motor/2));
    addRearPendant(   ref2, 0, (h_cab + h_apex/2 + h_cjib/2),  (l_tower/2 + l_cjib*3/4)/2);
    addForePendant(   ref2, 0, (h_cab + h_apex/2 + h_jib/2),  -(l_tower/2 + l_jib*3/4)/2);
    addHandle(        ref2, 0,  h_cab,                         max_ref3_z);
    obj.add(ref2);
}

// parent ref: WCS (1x foundation, 1x tower)

function addFoundation(obj, x, y, z) {
    'use strict';
    const geom = new THREE.CylinderGeometry(d_base, d_base, h_base, 16);
    addMesh(obj, geom, material_misc, x, y, z);
}

function addTower(obj, x, y, z) {
    'use strict';
    const geom = new THREE.BoxGeometry(l_tower, h_tower, l_tower);
    addMesh(obj, geom, material_main, x, y, z);
}

function addCrane(obj, x, y, z) {
    'use strict';
    ref1.position.set(x, y, z);
    
    addFoundation(ref1, 0, (h_base/2), 0);
    addTower(ref1, 0, (h_base + h_tower/2), 0);
    addSuperior(ref1, 0, (h_base + h_tower), 0);

    obj.add(ref1);
}

/* ----------------------- */
/* ---- OTHER OBJECTS ---- */
/* ----------------------- */

function addObjects(obj) {
    'use strict';
    addContainer(objs, 40, 0, -40);
    addDodecahedron(objs, -35, r_dodecahedron, 50);
    addIcosahedron(objs, -60, r_icosahedron, 0);
    addTorus(objs, -13, r_torus + tr_torus, -33);
    addTorusKnot(objs, 60, r_torusknot + 1.5, 5);
    addCube(objs, 10, h_cube/2, 20);
    obj.add(objs);
}

function addContainer(obj, x, y, z) {
    'use strict';
    const side1_geom = new THREE.BoxGeometry(w_container, h_container, 0.2, 3, 3);
    const side2_geom = new THREE.BoxGeometry(l_container, h_container, 0.2, 3, 3);
    const floor_geom = new THREE.PlaneGeometry(w_container, l_container, 3, 3);

    const front_wall = addMesh(container, side1_geom, material_cont, 0, h_container/2, -l_container/2);
    const back_wall = addMesh(container, side1_geom, material_cont, 0, h_container/2, l_container/2);
    const left_wall = addMesh(container, side2_geom, material_cont, -w_container/2, h_container/2, 0);
    const right_wall = addMesh(container, side2_geom, material_cont, w_container/2, h_container/2, 0);
    const base_platform = addMesh(container, floor_geom, material_bcnt, 0, 0, 0);

    base_platform.rotation.x = -Math.PI / 2;  // Rotate the base platform to lie flat
    right_wall.rotation.y = -Math.PI / 2;     // Rotate to face the correct direction
    left_wall.rotation.y = Math.PI / 2;       // Rotate to face the correct direction

    container.position.set(x, y, z);
    obj.add(container);
}

function addCube(obj, x, y, z) {
    'use strict';
    const geom = new THREE.BoxGeometry(l_cube, h_cube, l_cube);
    const mesh = addMesh(obj, geom, material_cube, x, y, z);

    mesh.userData.bbradius = h_cube;
}

function addDodecahedron(obj, x, y, z) {
    'use strict';
    const geom = new THREE.DodecahedronGeometry(r_dodecahedron);
    const mesh = addMesh(obj, geom, material_dodd, x, y, z);
    
    mesh.userData.bbradius = r_dodecahedron;
}

function addIcosahedron(obj, x, y, z) {
    'use strict';
    const geom = new THREE.IcosahedronGeometry(r_icosahedron);
    const mesh = addMesh(obj, geom, material_icod, x, y, z);

    mesh.userData.bbradius = r_icosahedron
}

function addTorus(obj, x, y, z) {
    'use strict';
    const geom = new THREE.TorusGeometry(r_torus, tr_torus);
    const mesh = addMesh(obj, geom, material_toru, x, y, z);

    mesh.userData.bbradius = r_torus;
}

function addTorusKnot(obj, x, y, z) {
    'use strict';
    const geom = new THREE.TorusKnotGeometry(r_torusknot, tr_torusknot, ts_torusknot, rs_torusknot, p_torusknot, q_torusknot);
    const mesh = addMesh(obj, geom, material_tknt, x, y, z);

    mesh.userData.bbradius = r_torusknot;
}

function addPlane(obj, x, y, z){
    'use strict';
    const planeMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(200, 200),
        new THREE.MeshBasicMaterial({ color: 0x808076, wireframe: false, side: THREE.DoubleSide })
    );

    planeMesh.position.set(x, y, z);
    planeMesh.rotation.x = -Math.PI / 2;

    obj.add(planeMesh);
}


/* -------------- */
/* ---- INIT ---- */
/* -------------- */

function createOrthographicCamera(x, y, z, lookAtY) {
    'use strict';
    camera = new THREE.OrthographicCamera();
    camera.position.set(x, y, z);
    camera.lookAt(0, lookAtY, 0);
    cameras.push(camera);
}

function createPerspectiveCamera(x, y, z, lookAtY) {
    'use strict';
    camera = new THREE.PerspectiveCamera();
    camera.position.set(x, y, z);
    camera.lookAt(0, lookAtY, 0);
    cameras.push(camera);
}

function createCameras() {
    'use strict';
    createOrthographicCamera(120,  h_tower/2, 0, h_tower/2);                            // frontal view
    createOrthographicCamera(0, h_tower/2, 120, h_tower/2);                             // side view
    createOrthographicCamera(0, h_tower+40, 0, 0);                                      // top view
    createOrthographicCamera(120, h_tower, 120, h_tower/2);                             // orthogonal projection
    createPerspectiveCamera( 160, h_tower*2, 160, 0);                                   // perspective projection
    createPerspectiveCamera(0, -(h_hookblock + h_claw/4), 0, -(h_hookblock+h_claw)-1);  // movel camera
    updateCameras(); // sync cameras with window aspect ratio
    ref4.add(cameras[5]);
    camera = cameras[3];
}

function createScene() {
    'use strict';
    scene.background = new THREE.Color('aliceblue');

    addPlane(scene, 0, -1 , 0);
    addCrane(scene, 0, 0, 0);
    addObjects(scene);
    createCameras();
}

function render() {
    'use strict';
    renderer.render(scene, camera);
}

function init() {
    'use strict';
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    
    ref2.userData = { moving_left: false,    moving_right: false               };
    ref3.userData = { moving_forward: false, moving_backwards: false           };
    ref4.userData = { moving_up: false,      moving_down: false                };
    claws.userData = { opening: false,       closing: false,          theta: 0 };
    
    createScene();
    
    new OrbitControls(camera, renderer.domElement);
    
    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    
    render();
}


/* ------------------- */
/* ---- ANIMATION ---- */
/* ------------------- */

function animateCollision() {
    const destination = ref4.userData.next_points[0];
    
    ref2.userData.moving_left = false;
    ref2.userData.moving_right = false;
    ref4.userData.moving_up = false;
    ref4.userData.moving_down = false;
    ref3.userData.moving_forward = false;
    claws.userData.closing = false;
    claws.userData.opening = false;

    if (claws.userData.theta > destination.theta + 0.2) {
        claws.userData.closing = true;
        return;
    }

    if (ref4.position.y < destination.height - 0.4) {
        ref4.userData.moving_up = true;
        return;
    }

    if (ref4.position.y > destination.height + 0.4) {
        ref4.userData.moving_down = true;
        return;
    }

    if (-ref3.position.z < destination.distance) {
        ref3.userData.moving_forward = true;
        return;
    }
    
    const vector = ref3.getWorldPosition(new THREE.Vector3()).setY(0);

    if (vector.angleTo(container.position) > 0.1) {
        let local = ref2.worldToLocal(container.position.clone());

        if (local.x > 0) {
            ref2.userData.moving_right = true;
        } else {
            ref2.userData.moving_left = true;
        }

        return;
    }

    if (claws.userData.theta < destination.theta - 0.2) {
        claws.userData.opening = true;
        return;
    }

    if (destination.drop) {
        const obj = objs.userData.collected.removeFromParent();

        obj.position.set(container.position.x, obj.userData.bbradius*2, container.position.z);

        ref1.add(obj);
    }

    ref4.userData.next_points.shift();

    if (ref4.userData.next_points.length == 0) {
        objs.userData.collected = undefined;
    }
}

function update() {
    'use strict';
    const delta = clock.getDelta();

    // if there is an object being collected, process collision animation
    if (objs.userData.collected) {
        animateCollision();
    }

    // move to the right/left if key is being pressed
    if (ref2.userData.moving_left != ref2.userData.moving_right) {
        const step = (ref2.userData.moving_left ? 0.5 : -0.5) * delta;

        ref2.rotateY(step);
    }

    // move forward/backwards if key is being pressed
    if (ref3.userData.moving_forward != ref3.userData.moving_backwards) {
        const step = (ref3.userData.moving_forward ? -10 : 10) * delta;
        const z = step + ref3.position.z;

        ref3.position.z = THREE.MathUtils.clamp(z, min_ref3_z, max_ref3_z);
    }

    // move up/down if key is being pressed
    if (ref4.userData.moving_up != ref4.userData.moving_down) {
        const step = (ref4.userData.moving_down ? -10 : 10) * delta;
        const y = step + ref4.position.y;

        if (y > min_ref4_y && y < max_ref4_y) {
            ref4.position.y = y;
            ref4.userData.cable.position.y -= step/2;
            ref4.userData.cable.scale.y -= step/h_steelcable;
        }
    }

    // open/close claws if key is being pressed
    if (claws.userData.opening != claws.userData.closing) {
        const rotation_step = (claws.userData.opening ? 0.5 : -0.5) * delta;
        const theta = claws.userData.theta + rotation_step;

        if (theta < max_theta && theta > min_theta) {
            claws.userData.theta = theta;
            claws.children.forEach(claw => claw.rotateX(rotation_step));
        }
    }

    // check for collision with objects (only if no object is being collected)
    if (!objs.userData.collected && checkCollisions()) {
        handleCollisions();
    }

    // update HUD
    updateKeyStatus();
}

function animate() {
    'use strict';
    update();
    render();
    requestAnimationFrame(animate);
}

init();
animate();