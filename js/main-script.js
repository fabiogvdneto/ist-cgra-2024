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
const objs = new THREE.Group();   


const foundation = { radius: 4, height: 30 };
const plane = { width: 150, height: 150 };
const skydome = { radius: plane.width/2,  widthSegments: 64, heightSegments: 32, phiStart: 0, phiLength: 2*Math.PI, ThetaStart: 0, ThetaLength: Math.PI/2 };
const ring1 = { innerR: foundation.radius, outerR: foundation.radius + 5, h: 5 };
const ring2 = { innerR: ring1.outerR, outerR: ring1.outerR + 5, h: 5 };
const ring3 = { innerR: ring2.outerR, outerR: ring2.outerR + 5, h: 5 };

const materials = {
    foundation: new THREE.MeshBasicMaterial({ color: 0x123235, wireframe: true }),
    skydomeMaterial: new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("textures/skydome.jpg"), side: THREE.DoubleSide, transparent: true, opacity: 0.7}),
    ringMaterial1: new THREE.MeshBasicMaterial({ color: 0x003C43 }),
    ringMaterial2: new THREE.MeshBasicMaterial({ color: 0x135D66 }),
    ringMaterial3: new THREE.MeshBasicMaterial({ color: 0x77B0AA }),
    donutMaterial: new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
    enneperMaterial: new THREE.MeshBasicMaterial({ color: 0xff0000 }),
    kleinMaterial : new THREE.MeshBasicMaterial({ color: 0x0000ff }),
    hyperbolicMaterial : new THREE.MeshBasicMaterial({ color: 0xffff00 }),
    torusKnotMaterial : new THREE.MeshBasicMaterial({ color: 0x0000ff }),
    hyperbolicParaboloidMaterial : new THREE.MeshBasicMaterial({ color: 0xffa500 }),
    helicoidMaterial : new THREE.MeshBasicMaterial({ color: 0x00ffff }),
    boyMaterial : new THREE.MeshBasicMaterial({ color: 0xffffff })
}

/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene() {
    'use strict';
    scene.background = new THREE.Color('aliceblue');
    //addObjects(scene);

    createCamera();
    addPlane(scene, 0, 0, 0);
    addSkydome(scene, 0, 0, 0);
    addCarousel(scene, 0, 0, 0);
}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////
function createCamera() {
    'use strict';
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
    'use strict';
    const mesh = new THREE.Mesh(geom, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
    return mesh;
}


function addFoundation(obj, x, y, z) {
    'use strict';
    const geom = new THREE.CylinderGeometry(foundation.radius, foundation.radius, foundation.height);
    addMesh(obj, geom, materials.foundation, x, y, z);
}

function addCarousel(obj, x, y, z) {
    'use strict';
    ref1.position.set(x, y, z);
    ref2.position.set(x, y, z -10);
    ref3.position.set(x, y, z -20);
    ref4.position.set(x, y, z -30);

    addFoundation(ref1, 0, foundation.height/2, 0);
    addInnerRing(ref2, 0, foundation.height/3, 0);
    addMidRing(ref3, 0, foundation.height * (2/3), 0);
    addOuterRIng(ref4, 0, foundation.height, 0);


    obj.add(ref1);
    obj.add(ref2);
    obj.add(ref3);
    obj.add(ref4);
}

function addInnerRing(obj, x, y, z) {
    'use strict';

    const innerRing = new THREE.Object3D();

    createRing(innerRing, x, y, z, ring1.outerR, ring1.innerR, ring1.h, materials.ringMaterial1);
    innerRing.rotation.x = Math.PI / 2;
    obj.add(innerRing);

    innerRing.position.set(x, y, z);
}

function addMidRing(obj, x, y, z) {
    'use strict';

    const midRing = new THREE.Object3D();

    createRing(midRing, x, y, z, ring2.outerR, ring2.innerR, ring2.h, materials.ringMaterial2)
    midRing.rotation.x = Math.PI / 2;
    obj.add(midRing);

    midRing.position.set(x, y, z);
}

function addOuterRIng(obj, x, y, z) {
    'use strict';

    const outerRing = new THREE.Object3D();

    createRing(outerRing, x, y, z, ring3.outerR, ring3.innerR, ring3.h, materials.ringMaterial3)
    outerRing.rotation.x = Math.PI / 2;
    obj.add(outerRing);

    outerRing.position.set(x, y, z);

}

function createRing(obj, x, y, z, outerRadius, innerRadius, height, material) {
    'use strict';
    let shape = new THREE.Shape();
    shape.moveTo(outerRadius, 0);
    shape.absarc(0, 0, outerRadius, 0, Math.PI * 2, false);

    let holePath = new THREE.Path();
    holePath.moveTo(innerRadius, 0);
    holePath.absarc(0, 0, innerRadius, 0, Math.PI * 2, true);

    shape.holes.push(holePath);

    const extrudeSettings = {
        bevelEnabled: false,
        depth: height
    };

    const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    addMesh(obj, geom, material, x, y, z);
}

function addObjects(obj) {
    'use strict';
    addDonut(objs, 40, 0, -40);
    addEnneper(objs, -35, 4, 50);
    addKlein(objs, -60, 4, 0);
    addTorusKnot(objs, -13, 8, -33);
    addHyperbolic(objs, 60, 9, 5);
    addHyperbolicParaboloid(objs, 10, 20, 20);
    addHelicoid(objs, -30, 10, 15);
    addBoy(objs, 45, 20, 10);
    obj.add(objs);
}

function addDonut(obj, x, y, z) {
    'use strict';
    const geom = new THREE.ParametricGeometry(function(u, v, target) {
        var theta = u * Math.PI * 2;
        var phi = v * Math.PI * 2;
        var radiusTorus = 1;
        var radiusTube = 0.5;
        target.set(
            (radiusTorus + radiusTube * Math.cos(phi)) * Math.cos(theta),
            (radiusTorus + radiusTube * Math.cos(phi)) * Math.sin(theta),
            radiusTube * Math.sin(phi)
        );
    }, 20, 10);

    addMesh(obj, geom, materials.donutMaterial, x, y, z);
}

function addEnneper(obj, x, y, z) {
    'use strict';
    const geom = new THREE.ParametricGeometry(function(u, v, target) {
        var x = u - (u * u * u) / 3 + (u * v * v);
        var y = v - (v * v * v) / 3 + (v * u * u);
        var z = u * u - v * v;
        target.set(x, y, z);
    }, 20, 20);

    addMesh(obj, geom, materials.enneperMaterial, x, y, z);
}

function addKlein(obj, x, y, z) {
    'use strict';
    const geom = new THREE.ParametricGeometry(function(u, v, target) {
        u *= Math.PI;
        v *= 2 * Math.PI;
        var x, y, z;

        var cosU = Math.cos(u);
        var sinU = Math.sin(u);
        var cosV = Math.cos(v);
        var sinV = Math.sin(v);

        var r = 6 * (1 + sinU);
        x = r * cosU * cosV;
        y = r * sinU;
        z = -2 * r * cosU * sinV;

        target.set(x, y, z);
    }, 10, 10);

    addMesh(obj, geom, materials.kleinMaterial, x, y, z);
}

function addTorusKnot(obj, x, y, z) {
    'use strict';
    const geom = new THREE.ParametricGeometry(function(u, v, target) {
        var p = 2, q = 3;
        var phi = p * u;
        var theta = q * v * Math.PI * 2;

        var x = Math.cos(theta) * (1 + Math.sin(phi));
        var y = Math.sin(theta) * (1 + Math.sin(phi));
        var z = Math.cos(phi);

        target.set(x, y, z);
    }, 20, 20);

    addMesh(obj, geom, materials.torusKnotMaterial, x, y, z);
}

function addHyperbolic(obj, x, y, z) {
    'use strict';
    const geom = new THREE.ParametricGeometry(function(u, v, target) {
        var x = Math.cosh(u) * Math.cos(v);
        var y = Math.cosh(u) * Math.sin(v);
        var z = Math.sinh(u);
        target.set(x, y, z);
    }, 20, 20);

    addMesh(obj, geom, materials.hyperbolicMaterial, x, y, z);
}

function addHyperbolicParaboloid(obj, x, y, z) {
    'use strict';
    const geom = new THREE.ParametricGeometry(function(u, v, target) {
        var x = u;
        var y = v;
        var z = u * u - v * v;
        target.set(x, y, z);
    }, 20, 20);

    addMesh(obj, geom, materials.hyperbolicParaboloidMaterial, x, y, z);
}

function addHelicoid(obj, x, y, z) {
    'use strict';
    const geom = new THREE.ParametricGeometry(function(u, v, target) {
        var c = 1;
        var x = u * Math.cos(v);
        var y = u * Math.sin(v);
        var z = c * v;
        target.set(x, y, z);
    }, 20, 20);

    addMesh(obj, geom, materials.helicoidMaterial, x, y, z);
}

function addBoy(obj, x, y, z) {
    'use strict';
    const geom = new THREE.ParametricGeometry(function(u, v, target) {
        var x = Math.sin(u) * Math.cos(v);
        var y = Math.sin(u) * Math.sin(v);
        var z = Math.cos(u) + Math.log(Math.tan(v / 2));
        target.set(x, y, z);
    }, 20, 20);

    addMesh(obj, geom, materials.boyMaterial, x, y, z);
}


function addPlane(obj, x, y, z){
    'use strict';
    const planeMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(150, 150),
        new THREE.MeshBasicMaterial({ color: 0xEF767A, wireframe: false, side: THREE.DoubleSide })
    );

    planeMesh.position.set(x, y, z);
    planeMesh.rotation.x = -Math.PI / 2;

    obj.add(planeMesh);
}

function addSkydome(obj, x,y,z){
    'use strict';

    const geom = new THREE.SphereGeometry(skydome.radius, skydome.widthSegments, skydome.heightSegments, skydome.phiStart, skydome.phiLength, skydome.ThetaStart, skydome.ThetaLength);
    addMesh(obj, geom, materials.skydomeMaterial, x, y, z);
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