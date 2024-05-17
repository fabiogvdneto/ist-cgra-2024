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

const foundation = { radius: 4, height: 30, color: 0x123235 };
const plane =      { width: 150, height: 150 };
const skydome =    { radius: plane.width/2,  widthSegments: 64, heightSegments: 32, phiStart: 0, phiLength: 2*Math.PI, ThetaStart: 0, ThetaLength: Math.PI/2 };
const ring1 =      { innerR: foundation.radius, outerR: foundation.radius + 5, h: 5 , color: 0x003C43 };
const ring2 =      { innerR: ring1.outerR, outerR: ring1.outerR + 5, h: 5 , color: 0x135D66 };
const ring3 =      { innerR: ring2.outerR, outerR: ring2.outerR + 5, h: 5 , color: 0x77B0AA };
const donut =      { color: 0x00ff00 };
const enneper =    { color: 0xff0000 };
const klein =      { color: 0x0000ff };
const hyperbolic = { color: 0xffff00 };
const torusKnot =  { color: 0x0000ff };
const hyperbolicParaboloid = { color: 0xffa500 };
const helicoid =   { color: 0x00ffff };
const boy =        { color: 0xffffff };

const BasicMaterials = {
    foundation: new THREE.MeshBasicMaterial({ color: 0x123235, wireframe: true }),
    skydomeMaterial: new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("textures/skydome.jpg"), side: THREE.DoubleSide, transparent: true, opacity: 0.7, wireframe: true}),
    ringMaterial1: new THREE.MeshBasicMaterial({ color: ring1.color, wireframe: true }),
    ringMaterial2: new THREE.MeshBasicMaterial({ color: ring2.color, wireframe: true }),
    ringMaterial3: new THREE.MeshBasicMaterial({ color: ring3.color, wireframe: true }),
    donutMaterial: new THREE.MeshBasicMaterial({ color: donut.color, wireframe: true }),
    enneperMaterial: new THREE.MeshBasicMaterial({ color: enneper.color, wireframe: true }),
    kleinMaterial : new THREE.MeshBasicMaterial({ color: klein.color, wireframe: true }),
    hyperbolicMaterial : new THREE.MeshBasicMaterial({ color: hyperbolic.color, wireframe: true }),
    torusKnotMaterial : new THREE.MeshBasicMaterial({ color: torusKnot.color, wireframe: true }),
    hyperbolicParaboloidMaterial : new THREE.MeshBasicMaterial({ color: hyperbolicParaboloid.color, wireframe: true }),
    helicoidMaterial : new THREE.MeshBasicMaterial({ color: helicoid.color, wireframe: true }),
    boyMaterial : new THREE.MeshBasicMaterial({ color: boy.color, wireframe: true })
}

const NormalMaterials = {
    foundation: new THREE.MeshNormalMaterial({ color: 0x123235, wireframe: false }),
    skydomeMaterial: new THREE.MeshNormalMaterial({ map: new THREE.TextureLoader().load("textures/skydome.jpg"), side: THREE.DoubleSide, transparent: true, opacity: 0.7, wireframe: false}),
    ringMaterial1: new THREE.MeshNormalMaterial({ color: ring1.color, wireframe: false }),
    ringMaterial2: new THREE.MeshNormalMaterial({ color: ring2.color, wireframe: false }),
    ringMaterial3: new THREE.MeshNormalMaterial({ color: ring3.color, wireframe: false }),
    donutMaterial: new THREE.MeshNormalMaterial({ color: donut.color, wireframe: false }),
    enneperMaterial: new THREE.MeshNormalMaterial({ color: enneper.color, wireframe: false }),
    kleinMaterial : new THREE.MeshNormalMaterial({ color: klein.color, wireframe: false }),
    hyperbolicMaterial : new THREE.MeshNormalMaterial({ color: hyperbolic.color, wireframe: false }),
    torusKnotMaterial : new THREE.MeshNormalMaterial({ color: torusKnot.color, wireframe: false }),
    hyperbolicParaboloidMaterial : new THREE.MeshNormalMaterial({ color: hyperbolicParaboloid.color, wireframe: false }),
    helicoidMaterial : new THREE.MeshNormalMaterial({ color: helicoid.color, wireframe: false }),
    boyMaterial : new THREE.MeshNormalMaterial({ color: boy.color, wireframe: false })
}

const LambertMaterials = {
    foundation: new THREE.MeshLambertMaterial({ color: 0x123235, wireframe: false }),
    skydomeMaterial: new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load("textures/skydome.jpg"), side: THREE.DoubleSide, transparent: true, opacity: 0.7, wireframe: false}),
    ringMaterial1: new THREE.MeshLambertMaterial({ color: ring1.color, wireframe: false }),
    ringMaterial2: new THREE.MeshLambertMaterial({ color: ring2.color, wireframe: false }),
    ringMaterial3: new THREE.MeshLambertMaterial({ color: ring3.color, wireframe: false }),
    donutMaterial: new THREE.MeshLambertMaterial({ color: donut.color, wireframe: false }),
    enneperMaterial: new THREE.MeshLambertMaterial({ color: enneper.color, wireframe: false }),
    kleinMaterial : new THREE.MeshLambertMaterial({ color: klein.color, wireframe: false }),
    hyperbolicMaterial : new THREE.MeshLambertMaterial({ color: hyperbolic.color, wireframe: false }),
    torusKnotMaterial : new THREE.MeshLambertMaterial({ color: torusKnot.color, wireframe: false }),
    hyperbolicParaboloidMaterial : new THREE.MeshLambertMaterial({ color: hyperbolicParaboloid.color, wireframe: false }),
    helicoidMaterial : new THREE.MeshLambertMaterial({ color: helicoid.color, wireframe: false }),
    boyMaterial : new THREE.MeshLambertMaterial({ color: boy.color, wireframe: false })
}

const PhongMaterials = {
    foundation: new THREE.MeshPhongMaterial({ color: 0x123235, wireframe: false }),
    skydomeMaterial: new THREE.MeshPhongMaterial({ map: new THREE.TextureLoader().load("textures/skydome.jpg"), side: THREE.DoubleSide, transparent: true, opacity: 0.7, wireframe: false}),
    ringMaterial1: new THREE.MeshPhongMaterial({ color: ring1.color, wireframe: false }),
    ringMaterial2: new THREE.MeshPhongMaterial({ color: ring2.color, wireframe: false }),
    ringMaterial3: new THREE.MeshPhongMaterial({ color: ring3.color, wireframe: false }),
    donutMaterial: new THREE.MeshPhongMaterial({ color: donut.color, wireframe: false }),
    enneperMaterial: new THREE.MeshPhongMaterial({ color: enneper.color, wireframe: false }),
    kleinMaterial : new THREE.MeshPhongMaterial({ color: klein.color, wireframe: false }),
    hyperbolicMaterial : new THREE.MeshPhongMaterial({ color: hyperbolic.color, wireframe: false }),
    torusKnotMaterial : new THREE.MeshPhongMaterial({ color: torusKnot.color, wireframe: false }),
    hyperbolicParaboloidMaterial : new THREE.MeshPhongMaterial({ color: hyperbolicParaboloid.color, wireframe: false }),
    helicoidMaterial : new THREE.MeshPhongMaterial({ color: helicoid.color, wireframe: false }),
    boyMaterial : new THREE.MeshPhongMaterial({ color: boy.color, wireframe: false })
}

const CartoonMaterials = {
    foundation: new THREE.MeshToonMaterial({ color: 0x123235, wireframe: false }),
    skydomeMaterial: new THREE.MeshToonMaterial({ map: new THREE.TextureLoader().load("textures/skydome.jpg"), side: THREE.DoubleSide, transparent: true, opacity: 0.7, wireframe: false}),
    ringMaterial1: new THREE.MeshToonMaterial({ color: ring1.color, wireframe: false }),
    ringMaterial2: new THREE.MeshToonMaterial({ color: ring2.color, wireframe: false }),
    ringMaterial3: new THREE.MeshToonMaterial({ color: ring3.color, wireframe: false }),
    donutMaterial: new THREE.MeshToonMaterial({ color: donut.color, wireframe: false }),
    enneperMaterial: new THREE.MeshToonMaterial({ color: enneper.color, wireframe: false }),
    kleinMaterial : new THREE.MeshToonMaterial({ color: klein.color, wireframe: false }),
    hyperbolicMaterial : new THREE.MeshToonMaterial({ color: hyperbolic.color, wireframe: false }),
    torusKnotMaterial : new THREE.MeshToonMaterial({ color: torusKnot.color, wireframe: false }),
    hyperbolicParaboloidMaterial : new THREE.MeshToonMaterial({ color: hyperbolicParaboloid.color, wireframe: false }),
    helicoidMaterial : new THREE.MeshToonMaterial({ color: helicoid.color, wireframe: false }),
    boyMaterial : new THREE.MeshToonMaterial({ color: boy.color, wireframe: false })
}

let changeLambert = false;
let changePhong = false;
let changeCartoon = false;
let changeNormal = false;

const materials = {
    NormalMaterials: NormalMaterials,
    LambertMaterials: LambertMaterials,
    PhongMaterials: PhongMaterials,
    CartoonMaterials: CartoonMaterials,
    BasicMaterials: BasicMaterials
};

let currentMaterialType = 'BasicMaterials';

////////////////////////
/* AUXILIAR FUNCTIONS */
////////////////////////
function toggleWireframe(){
    'use strict';

    let currentMaterial = materials[currentMaterialType];

    console.log(currentMaterial);

    for(let key in currentMaterial){
        console.log(currentMaterial[key]);
        currentMaterial[key].wireframe = !currentMaterial[key].wireframe;
    }
}

function setCurrentMaterial(){
    'use strict';

    if (changeLambert) {
        currentMaterialType = 'LambertMaterials';
    } else if (changePhong) {
        currentMaterialType = 'PhongMaterials';
    } else if (changeCartoon) {
        currentMaterialType = 'CartoonMaterials';
    } else if (changeNormal) {
        currentMaterialType = 'NormalMaterials';
    } else {
        currentMaterialType = 'BasicMaterials'; 
    }

    ref1.userData.foundation.material = materials[currentMaterialType].foundation;
    ref1.userData.skydome.material = materials[currentMaterialType].skydomeMaterial;
    ref2.userData.ring.material = materials[currentMaterialType].ringMaterial1;
    ref3.userData.ring.material = materials[currentMaterialType].ringMaterial2;
    ref4.userData.ring.material = materials[currentMaterialType].ringMaterial3;
    // objs.userData.donut.material = materials[currentMaterialType].donutMaterial;
    // objs.userData.enneper.material = materials[currentMaterialType].enneperMaterial;
    // objs.userData.klein.material = materials[currentMaterialType].kleinMaterial;
    // objs.userData.hyperbolic.material = materials[currentMaterialType].hyperbolicMaterial;
    // objs.userData.torusKnot.material = materials[currentMaterialType].torusKnotMaterial;
    // objs.userData.hyperbolicParaboloid.material = materials[currentMaterialType].hyperbolicParaboloidMaterial;
    // objs.userData.helicoid.material = materials[currentMaterialType].helicoid
    // objs.userData.boy.material = materials[currentMaterialType].boyMaterial;
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
    obj.userData.foundation = addMesh(obj, geom, BasicMaterials.foundation, x, y, z);
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

    ref2.userData.ring = createRing(innerRing, x, y, z, ring1.outerR, ring1.innerR, ring1.h, BasicMaterials.ringMaterial1);
    innerRing.rotation.x = Math.PI / 2;
    obj.add(innerRing);

    innerRing.position.set(x, y, z);
}

function addMidRing(obj, x, y, z) {
    'use strict';

    const midRing = new THREE.Object3D();

    ref3.userData.ring = createRing(midRing, x, y, z, ring2.outerR, ring2.innerR, ring2.h, BasicMaterials.ringMaterial2)
    midRing.rotation.x = Math.PI / 2;
    obj.add(midRing);

    midRing.position.set(x, y, z);
}

function addOuterRIng(obj, x, y, z) {
    'use strict';

    const outerRing = new THREE.Object3D();

    ref4.userData.ring = createRing(outerRing, x, y, z, ring3.outerR, ring3.innerR, ring3.h, BasicMaterials.ringMaterial3)
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
    return addMesh(obj, geom, material, x, y, z);
}

function addObjects(obj) {
    'use strict';
    obj.userData.donut = addDonut(objs, 40, 0, -40);
    obj.userData.enneper = addEnneper(objs, -35, 4, 50);
    obj.userData.klein = addKlein(objs, -60, 4, 0);
    obj.userData.TorusKnot = addTorusKnot(objs, -13, 8, -33);
    obj.userData.hyperbolic = addHyperbolic(objs, 60, 9, 5);
    obj.userData.hyperbolicParaboloid = addHyperbolicParaboloid(objs, 10, 20, 20);
    obj.userData.helicoid = addHelicoid(objs, -30, 10, 15);
    obj.userData.boy = addBoy(objs, 45, 20, 10);
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

    addMesh(obj, geom, BasicMaterials.donutMaterial, x, y, z);
}

function addEnneper(obj, x, y, z) {
    'use strict';
    const geom = new THREE.ParametricGeometry(function(u, v, target) {
        var x = u - (u * u * u) / 3 + (u * v * v);
        var y = v - (v * v * v) / 3 + (v * u * u);
        var z = u * u - v * v;
        target.set(x, y, z);
    }, 20, 20);

    addMesh(obj, geom, BasicMaterials.enneperMaterial, x, y, z);
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

    addMesh(obj, geom, BasicMaterials.kleinMaterial, x, y, z);
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

    addMesh(obj, geom, BasicMaterials.torusKnotMaterial, x, y, z);
}

function addHyperbolic(obj, x, y, z) {
    'use strict';
    const geom = new THREE.ParametricGeometry(function(u, v, target) {
        var x = Math.cosh(u) * Math.cos(v);
        var y = Math.cosh(u) * Math.sin(v);
        var z = Math.sinh(u);
        target.set(x, y, z);
    }, 20, 20);

    addMesh(obj, geom, BasicMaterials.hyperbolicMaterial, x, y, z);
}

function addHyperbolicParaboloid(obj, x, y, z) {
    'use strict';
    const geom = new THREE.ParametricGeometry(function(u, v, target) {
        var x = u;
        var y = v;
        var z = u * u - v * v;
        target.set(x, y, z);
    }, 20, 20);

    addMesh(obj, geom, BasicMaterials.hyperbolicParaboloidMaterial, x, y, z);
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

    addMesh(obj, geom, BasicMaterials.helicoidMaterial, x, y, z);
}

function addBoy(obj, x, y, z) {
    'use strict';
    const geom = new THREE.ParametricGeometry(function(u, v, target) {
        var x = Math.sin(u) * Math.cos(v);
        var y = Math.sin(u) * Math.sin(v);
        var z = Math.cos(u) + Math.log(Math.tan(v / 2));
        target.set(x, y, z);
    }, 20, 20);

    addMesh(obj, geom, BasicMaterials.boyMaterial, x, y, z);
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
    ref1.userData.skydome = addMesh(obj, geom, BasicMaterials.skydomeMaterial, x, y, z);
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

    const delta = clock.getDelta();
    const speed = 10;

    if(ref2.userData.moving){
        const step = speed * ref2.userData.direction * delta;
        const y = step + ref2.position.y;

        if(y < -(foundation.height/3 - ring2.h)){
            ref2.userData.direction = 1;
            ref2.position.y = 0;
        } else if(y > foundation.height - foundation.height/3){
            ref2.userData.direction = -1;
            ref2.position.y = foundation.height;
        }

        ref2.position.y = y;
    }

    if(ref3.userData.moving){
        const step = speed * ref3.userData.direction * delta;
        const y = step + ref3.position.y;

        if(y < -(foundation.height * (2/3) - ring3.h)){
            ref3.userData.direction = 1;
            ref3.position.y = 0;
        } else if(y > foundation.height - foundation.height * (2/3)){
            ref3.userData.direction = -1;
            ref3.position.y = foundation.height;
        }  

        ref3.position.y = y;
    }

    if(ref4.userData.moving){
        const step = speed * ref4.userData.direction * delta;
        const y = step + ref4.position.y;

        if(y < -(foundation.height - ring3.h)){
            ref4.userData.direction = 1;
            ref4.position.y = 0;
        } else if(y > 0){
            ref4.userData.direction = -1;
            ref4.position.y = foundation.height;
        }  

        ref4.position.y = y;
    }

   setCurrentMaterial();
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

    ref2.userData = { moving: false, direction: 1 };
    ref3.userData = { moving: false, direction: 1 };
    ref4.userData = { moving: false, direction: 1 };
    
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

    const key = e.key.toUpperCase();

    switch(key){
        // Active ring 1 movement
        case '1':
            ref2.userData.moving = true;
            break;
        // Active ring 2 movement
        case '2':
            ref3.userData.moving = true;
            break;
        // Active ring 3 movement
        case '3':
            ref4.userData.moving = true;
            break;
        // Toggle wireframe
        case '7':
            toggleWireframe();
            break;
        // Change material - Lambert
        case 'Q':
            changeLambert = true;
            break;
        // Change material - Phong
        case 'W':
            changePhong = true;
            break;
        // Change material - Cartoon
        case 'E':
            changeCartoon = true;
            break;
        // Change material - Normal
        case 'R':
            changeNormal = true;
            break;
    }


}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e){
    'use strict';

    const key = e.key.toUpperCase();

    switch(key){
        // Deactivate ring 1 movement
        case '1':
            ref2.userData.moving = false;
            break;
        // Deactivate ring 2 movement
        case '2':
            ref3.userData.moving = false;
            break;
        // Deactivate ring 3 movement
        case '3':
            ref4.userData.moving = false;
            break;
        // Change material - Lambert
        case 'Q':
            changeLambert = false;
            break;
        // Change material - Phong
        case 'W':
            changePhong = false;
            break;
        // Change material - Cartoon
        case 'E':
            changeCartoon = false;
            break;
        // Change material - Normal
        case 'R':
            changeNormal = false;
            break;  
    }
}

init();
animate();