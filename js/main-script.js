import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import * as Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

let camera, cameras = [];

const scene = new THREE.Scene();
const clock = new THREE.Clock();
const renderer = new THREE.WebGLRenderer({ antialias: true });

/* Crane Referentials */
const ref1 = new THREE.Object3D(); // parent
const ref2 = new THREE.Group();    // child
const ref3 = new THREE.Group();    // grandchild
const ref4 = new THREE.Group();    // ggrandchild
const claws = new THREE.Group();   // claws

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

const max_ref4_y = -(h_tower/4);
const min_ref4_y = -(h_tower);

// Objects to be loaded by the crane
const w_container = 20, h_container = 14.5, l_container = 25; // container
const l_cube = 4, h_cube = 4;                                 // cube
const r_dodecahedron = 4;                                     // dodecahedron
const d_icosahedron = 4;                                      // icosahedron
const r_torus = 4, tr_torus = 1.5;                            // torus
const r_torusknot = 2.5, tr_torusknot = 0.75;                 // torus knot
const ts_torusknot = 50;                                      // Tubular segments for smoothness in torus knot
const rs_torusknot = 10;                                      // Radial segments for smoothness in torus knot
const p_torusknot = 2;                                        // 'p' parameter defines how many times the curve winds around its axis
const q_torusknot = 3;                                        // 'q' parameter defines how many times the curve winds around the tube

// Materials
const material_main = new THREE.MeshBasicMaterial({ color: 0x123235, wireframe: true });        // main color
const material_misc = new THREE.MeshBasicMaterial({ color: 0x128293, wireframe: true });        // miscellaneous color
const material_objs = new THREE.MeshBasicMaterial({ color: 0xd2b2a3, wireframe: true });        // objects color - not used
const material_wire = new THREE.MeshBasicMaterial({ color: 0x121342, wireframe: true });        // cable's color
const material_bcnt = new THREE.MeshBasicMaterial({ color: 0xB5C0C9, wireframe: true });        // base container color
const material_cont = new THREE.MeshBasicMaterial({ color: 0xcacdcd, wireframe: true });        // container color
const material_dodd = new THREE.MeshBasicMaterial({ color: 0xBABD8D, wireframe: true });        // dodecahedron color
const material_icod = new THREE.MeshBasicMaterial({ color: 0x355834, wireframe: true });        // icosahedron color
const material_toru = new THREE.MeshBasicMaterial({ color: 0x14281D, wireframe: true });        // torus color
const material_tknt = new THREE.MeshBasicMaterial({ color: 0xC2A878, wireframe: true });        // torus knot color
const material_cube = new THREE.MeshBasicMaterial({ color: 0xcacdcd, wireframe: true });        // cube color

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
            camera.right = WIDTH/10;
            camera.left = -WIDTH/10;
            camera.top = HEIGHT/10;
            camera.bottom = -HEIGHT/10;
        }
        camera.updateProjectionMatrix();
    });
}

function onResize() { 
    'use strict';
    updateCameras();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onKeyDown(e) {
    'use strict';
    switch (e.key) {
        // Switch camera when pressing numkeys (1-6)
        case '1':  
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
            camera = cameras[e.keyCode - 49];
            break;
        // Toggle wireframe mode
        case '7':  
            toggleWireframe();
            break;
        // Activate superior rotation to the left
        case 'a':
        case 'A':
            ref2.userData.moving_left = true;
            break;
        // Activate superior rotation to the right
        case 'q':
        case 'Q':
            ref2.userData.moving_right = true;
            break;
        // Activate handle forward movement
        case 'w':
        case 'W':
            ref3.userData.moving_forward = true;
            break;
        // Activate handle backwards movement
        case 's':
        case 'S':
            ref3.userData.moving_backwards = true;
            break;
        // Activate hook movement upwards
        case 'e':
        case 'E':
            ref4.userData.moving_up = true;
            break;
        // Activate hook movement downwards
        case 'd':
        case 'D':
            ref4.userData.moving_down = true;
            break;
        // Activate claws movement
        case 'r':
        case 'R':
            claws.userData.opening = true;
            break;
        case 'f':
        case 'F':
            claws.userData.closing = true;
            break;
    }

    render();
}

function onKeyUp(e) {
    'use strict';
    switch (e.key) {
        // Deactivate superior rotation to the left
        case 'a':
        case 'A':
            ref2.userData.moving_left = false;
            break;
        // Deactivate superior rotation to the right
        case 'q':
        case 'Q':
            ref2.userData.moving_right = false;
            break;
        // Deactivate handle forward movement
        case 'w':
        case 'W':
            ref3.userData.moving_forward = false;
            break;
        // Deactivate handle backwards movement
        case 's':
        case 'S':
            ref3.userData.moving_backwards = false;
            break;
        // Deactivate hook movement upwards
        case 'e':
        case 'E':
            ref4.userData.moving_up = false;
            break;
        // Deactivate hook movement downwards
        case 'd':
        case 'D':
            ref4.userData.moving_down = false;
            break;
        // Deactivate claws movement
        case 'r':
        case 'R':
            claws.userData.opening = false;
            break;
        case 'f':
        case 'F':
            claws.userData.closing = false;
            break;
    }

    render();
}

/* -------------------- */
/* ---- COLLISIONS ---- */
/* -------------------- */

function checkCollisions(){
    'use strict';

}

function handleCollisions(){
    'use strict';

}

/* --------------- */
/* ---- CRANE ---- */
/* --------------- */

function createMesh(geom, material, x, y, z) {
    const mesh = new THREE.Mesh(geom, material);
    mesh.position.set(x, y, z);
    return mesh;
}

// great-grandchild ref: the hook (1x steel cable, 1x hook block, 4x claws)

function addSteelCable(obj, x, y, z) {
    'use strict';
    const geom = new THREE.CylinderGeometry(d_steelcable, d_steelcable, h_steelcable);
    const mesh = createMesh(geom, material_wire, x, y, z);
    obj.add(mesh);
    obj.userData.cable = mesh;
}

function addHookBlock(obj, x, y, z) {
    'use strict';
    const geom = new THREE.BoxGeometry(l_hookblock, h_hookblock, l_hookblock);
    obj.add(createMesh(geom, material_misc, x, y, z));
}

function addClaws(obj, x, y, z) {
    'use strict';


    const geom = new THREE.BufferGeometry();

    let vertices = [
        0, 0, -5/8 * l_hookblock/2,               // Vertex 0
        l_hookblock/2, 0, -l_hookblock/2,         // Vertex 1
        -l_hookblock/2, 0, -l_hookblock/2,        // Vertex 2
        0, -h_claw, -7.5/8 * l_hookblock/2        // Vertex 3
    ];

    let indices = [
        0, 1, 2,  // Face 0
        0, 3, 1,  // Face 1
        0, 2, 3,  // Face 2
        1, 3, 2   // Face 3
    ];

    geom.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geom.setIndex(indices);

    let claw1 = createMesh(geom, material_toru, x, y, z);
    let claw2 = createMesh(geom, material_toru, x, y, z);
    let claw3 = createMesh(geom, material_toru, x, y, z);
    let claw4 = createMesh(geom, material_toru, x, y, z);

    claw2.rotateY(Math.PI / 2); // Adjust rotation for claw 2
    claw3.rotateY(-Math.PI / 2); // Adjust rotation for claw 3
    claw4.rotateY(Math.PI); // Adjust rotation for claw 4

    claws.add(claw1);
    claws.add(claw2);
    claws.add(claw3);
    claws.add(claw4);

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
    obj.add(createMesh(geom, material_misc, x, y, z));
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
    obj.add(createMesh(geom, material_misc, x, y, z));
}

function addApex(obj, x, y, z) {
    'use strict';
    const geom = new THREE.ConeGeometry((Math.pow(2*Math.pow(l_tower,2), 1/2)/2), h_apex, 4, 1, false, 0.782, 6.3);
    obj.add(createMesh(geom, material_main, x, y, z));
}

function addCounterjib(obj, x, y, z) {
    'use strict';
    const geom = new THREE.BoxGeometry(w_jib, h_cjib, l_cjib);
    obj.add(createMesh(geom, material_main, x, y, z));
}

function addJib(obj, x, y, z) {
    'use strict';
    const geom = new THREE.BoxGeometry(w_cjib, h_jib, l_jib);
    obj.add(createMesh(geom, material_main, x, y, z));
}

function addCounterweigths(obj, x, y, z) {
    'use strict';
    const geom = new THREE.BoxGeometry(c_cweights, h_cweights, l_cweights);
    obj.add(createMesh(geom, material_misc, x, y, z));
}

function addMotors(obj, x, y, z) { 
    'use strict';
    const geom = new THREE.BoxGeometry(w_jib, h_motor, l_motor);
    obj.add(createMesh(geom, material_misc, x, y, z));
}

function addRearPendant(obj, x, y, z) {
    'use strict';
    const c1 = (h_apex - h_cjib);
    const c2 = (l_tower/2 + l_cjib*3/4);

    const length = Math.hypot(c1, c2); // h² = c² + c²
    const angle = Math.atan(c2 / c1);  // angle = arctan(c2 / c1)

    const geom = new THREE.CylinderGeometry(d_pendants, d_pendants, length, 16);
    const mesh = createMesh(geom, material_wire, x, y, z);
    mesh.rotateX(-angle);
    obj.add(mesh);
}

function addForePendant(obj, x, y, z) {
    'use strict';
    const c1 = (h_apex - h_jib);
    const c2 = (l_tower/2 + l_jib*3/4);

    const length = Math.hypot(c1, c2); // h² = c² + c²
    const angle = Math.atan(c2 / c1);  // angle = arctan(c2 / c1)

    const geom = new THREE.CylinderGeometry(d_pendants, d_pendants, length, 16);
    const mesh = createMesh(geom, material_wire, x, y, z);
    mesh.rotateX(angle);
    obj.add(mesh);
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
    obj.add(createMesh(geom, material_misc, x, y, z));
}

function addTower(obj, x, y, z) {
    'use strict';
    const geom = new THREE.BoxGeometry(l_tower, h_tower, l_tower);
    obj.add(createMesh(geom, material_main, x, y, z));
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
    addContainer(obj, 20, h_container/2, -30);
    addDodecahedron(obj, -15, r_dodecahedron, 30);
    addIcosahedron(obj, -30, d_icosahedron, 0);
    addTorus(obj, -13, r_torus + tr_torus, -33);
    addTorusKnot(obj, 20, r_torusknot + 1.5, 5);
    addCube(obj, 15, h_cube/2, 30);
}

function addContainer(obj, x, y, z) {
    'use strict';
    const container = new THREE.Group();

    const side1_geom = new THREE.BoxGeometry(w_container, h_container, 0.2, 3, 3);
    const side2_geom = new THREE.BoxGeometry(l_container, h_container, 0.2, 3, 3);
    const floor_geom = new THREE.PlaneGeometry(w_container, l_container, 3, 3);

    const front_wall = createMesh(side1_geom, material_cont, x, y, z - l_container / 2);
    const back_wall = createMesh(side1_geom, material_cont, x, y, z + l_container / 2);
    const left_wall = createMesh(side2_geom, material_cont, x - w_container / 2, y, z);
    const right_wall = createMesh(side2_geom, material_cont, x + w_container / 2, y, z);
    const base_platform = createMesh(floor_geom, material_bcnt, x, y - h_container / 2, z);

    base_platform.rotation.x = -Math.PI / 2; // Rotate the base platform to lie flat
    right_wall.rotation.y = -Math.PI / 2; // Rotate to face the correct direction
    left_wall.rotation.y = Math.PI / 2; // Rotate to face the correct direction
    
    container.add(front_wall);
    container.add(back_wall);
    container.add(left_wall);
    container.add(right_wall);
    container.add(base_platform);

    obj.add(container);
}

function addCube(obj, x, y, z) {
    'use strict';
    const geom = new THREE.BoxGeometry(l_cube, h_cube, l_cube);
    obj.add(createMesh(geom, material_cube, x, y, z));
}

function addDodecahedron(obj, x, y, z) {
    'use strict';
    const geom = new THREE.DodecahedronGeometry(r_dodecahedron);
    obj.add(createMesh(geom, material_dodd, x, y, z));
}

function addIcosahedron(obj, x, y, z) {
    'use strict';
    const geom = new THREE.IcosahedronGeometry(d_icosahedron);
    obj.add(createMesh(geom, material_icod, x, y, z));
}

function addTorus(obj, x, y, z) {
    'use strict';
    const geom = new THREE.TorusGeometry(r_torus, tr_torus);
    obj.add(createMesh(geom, material_toru, x, y, z));
}

function addTorusKnot(obj, x, y, z) {
    'use strict';
    const geom = new THREE.TorusKnotGeometry(r_torusknot, tr_torusknot, ts_torusknot, rs_torusknot, p_torusknot, q_torusknot);
    obj.add(createMesh(geom, material_tknt, x, y, z));
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
    camera.far = 3000;
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
    createOrthographicCamera(120,  h_tower/2, 0, h_tower/2);                            // frontal camera
    createOrthographicCamera(0, h_tower/2, 120, h_tower/2);                             // side camera
    createOrthographicCamera(0, h_tower+40, 0, 0);                                      // top camera
    createOrthographicCamera(120, h_tower, 120, h_tower/2);                             // orthogonal projection
    createPerspectiveCamera( 120, h_tower, 120, h_tower/2);                             // perspective projection
    createPerspectiveCamera(0, -(h_hookblock + h_claw), 0, -(h_hookblock+h_claw)-1);    // movel camera
    updateCameras();                                                                    // sync cameras with window dimension
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

    ref2.userData = { moving_left: false,    moving_right: false };
    ref3.userData = { moving_forward: false, moving_backwards: false };
    ref4.userData = { moving_up: false,      moving_down: false };

    createScene();

    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    render();
}

/* ------------------- */
/* ---- ANIMATION ---- */
/* ------------------- */

function update() {
    'use strict';
    const delta = clock.getDelta();

    if (ref2.userData.moving_left != ref2.userData.moving_right) {
        const step = (ref2.userData.moving_left ? -0.5 : 0.5) * delta;

        ref2.rotateY(step);
    }

    if (ref3.userData.moving_forward != ref3.userData.moving_backwards) {
        const step = (ref3.userData.moving_forward ? -10 : 10) * delta;
        const z = step + ref3.position.z;

        if (z > min_ref3_z && z < max_ref3_z) {
            ref3.position.z = z;
        }
    }

    if (ref4.userData.moving_up != ref4.userData.moving_down) {
        const step = (ref4.userData.moving_down ? -10 : 10) * delta;
        const y = step + ref4.position.y;

        if (y > min_ref4_y && y < max_ref4_y) {
            ref4.position.y = y;
            ref4.userData.cable.position.y -= step/2;
            ref4.userData.cable.scale.y -= step/h_steelcable;
        }
    }
}

function animate() {
    'use strict';
    update();
    render();
    requestAnimationFrame(animate);
}

init();
animate();