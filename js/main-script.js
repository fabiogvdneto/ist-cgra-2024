import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import * as Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { ParametricGeometry } from 'three/addons/geometries/ParametricGeometry.js'


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

const innerRing = new THREE.Object3D();
const midRing = new THREE.Object3D();
const outerRing = new THREE.Object3D();

const foundation = { radius: 4, height: 30, color: 0x123235 };
const plane =      { width: 150, height: 150 };
const skydome =    { radius: plane.width/2,  widthSegments: 64, heightSegments: 32, phiStart: 0, phiLength: 2*Math.PI, ThetaStart: 0, ThetaLength: Math.PI/2 };
const ring1_info =      { innerR: foundation.radius, outerR: foundation.radius + 5, h: 5 , color: 0x003C43 };
const ring2_info =      { innerR: ring1_info.outerR, outerR: ring1_info.outerR + 5, h: 5 , color: 0x135D66 };
const ring3_info =      { innerR: ring2_info.outerR, outerR: ring2_info.outerR + 5, h: 5 , color: 0x77B0AA };

const BasicMaterials = {
    foundation: new THREE.MeshBasicMaterial({ color: 0x123235, wireframe: true }),
    skydomeMaterial: new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("textures/skydome.jpg"), side: THREE.DoubleSide, transparent: true, opacity: 0.7, wireframe: true}),
    ringMaterial1: new THREE.MeshBasicMaterial({ color: ring1_info.color, wireframe: true }),
    ringMaterial2: new THREE.MeshBasicMaterial({ color: ring2_info.color, wireframe: true }),
    ringMaterial3: new THREE.MeshBasicMaterial({ color: ring3_info.color, wireframe: true }),

    donutMaterial: new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true }),
    enneperMaterial: new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true }),
    kleinBottleMaterial : new THREE.MeshStandardMaterial({ color: 0xff0000, wireframe: true }),
    sphereMaterial: new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true }),
    cylinderMaterial: new THREE.MeshBasicMaterial({ color: 0x00ffa0, wireframe: true }),
    boxMaterial: new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: true }),
    coneMaterial: new THREE.MeshBasicMaterial({ color: 0xff00ff, wireframe: true }), 
    hyperboloidMaterial: new THREE.MeshBasicMaterial({ color: 0xaa20af, wireframe: true }) 
}

const NormalMaterials = {
    foundation: new THREE.MeshNormalMaterial({ color: 0x123235, wireframe: false }),
    skydomeMaterial: new THREE.MeshNormalMaterial({ map: new THREE.TextureLoader().load("textures/skydome.jpg"), side: THREE.DoubleSide, transparent: true, opacity: 0.7, wireframe: false}),
    ringMaterial1: new THREE.MeshNormalMaterial({ color: ring1_info.color, wireframe: false }),
    ringMaterial2: new THREE.MeshNormalMaterial({ color: ring2_info.color, wireframe: false }),
    ringMaterial3: new THREE.MeshNormalMaterial({ color: ring3_info.color, wireframe: false }),

    donutMaterial: new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: false }),
    enneperMaterial: new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: false }),
    kleinBottleMaterial : new THREE.MeshStandardMaterial({ color: 0xff0000, wireframe: false }),
    sphereMaterial: new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: false }),
    cylinderMaterial: new THREE.MeshBasicMaterial({ color: 0x00ffa0, wireframe: false }),
    boxMaterial: new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: false }),
    coneMaterial: new THREE.MeshBasicMaterial({ color: 0xff00ff, wireframe: false }), 
    hyperboloidMaterial: new THREE.MeshBasicMaterial({ color: 0xaa20af, wireframe: true }) 
}

const LambertMaterials = {
    foundation: new THREE.MeshLambertMaterial({ color: 0x123235, wireframe: false }),
    skydomeMaterial: new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load("textures/skydome.jpg"), side: THREE.DoubleSide, transparent: true, opacity: 0.7, wireframe: false}),
    ringMaterial1: new THREE.MeshLambertMaterial({ color: ring1_info.color, wireframe: false }),
    ringMaterial2: new THREE.MeshLambertMaterial({ color: ring2_info.color, wireframe: false }),
    ringMaterial3: new THREE.MeshLambertMaterial({ color: ring3_info.color, wireframe: false }),
    
    donutMaterial: new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: false }),
    enneperMaterial: new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: false }),
    kleinBottleMaterial : new THREE.MeshStandardMaterial({ color: 0xff0000, wireframe: true }),
    sphereMaterial: new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true }),
    cylinderMaterial: new THREE.MeshBasicMaterial({ color: 0x00ffa0, wireframe: true }),
    boxMaterial: new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: true }),
    coneMaterial: new THREE.MeshBasicMaterial({ color: 0xff00ff, wireframe: true }), 
    hyperboloidMaterial: new THREE.MeshBasicMaterial({ color: 0xaa20af, wireframe: true }) 
}

const PhongMaterials = {
    foundation: new THREE.MeshPhongMaterial({ color: 0x123235, wireframe: false }),
    skydomeMaterial: new THREE.MeshPhongMaterial({ map: new THREE.TextureLoader().load("textures/skydome.jpg"), side: THREE.DoubleSide, transparent: true, opacity: 0.7, wireframe: false }),
    ringMaterial1: new THREE.MeshPhongMaterial({ color: ring1_info.color, wireframe: false }),
    ringMaterial2: new THREE.MeshPhongMaterial({ color: ring2_info.color, wireframe: false }),
    ringMaterial3: new THREE.MeshPhongMaterial({ color: ring3_info.color, wireframe: false }),

    donutMaterial: new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: false }),
    enneperMaterial: new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: false }),
    kleinBottleMaterial: new THREE.MeshStandardMaterial({ color: 0xff0000, wireframe: false }),
    sphereMaterial: new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: false }),
    cylinderMaterial: new THREE.MeshBasicMaterial({ color: 0x00ffa0, wireframe: false }),
    boxMaterial: new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: false }),
    coneMaterial: new THREE.MeshBasicMaterial({ color: 0xff00ff, wireframe: false }), 
    hyperboloidMaterial: new THREE.MeshBasicMaterial({ color: 0xaa20af, wireframe: false })
}

const CartoonMaterials = {
    foundation: new THREE.MeshToonMaterial({ color: 0x123235, wireframe: false }),
    skydomeMaterial: new THREE.MeshToonMaterial({ map: new THREE.TextureLoader().load("textures/skydome.jpg"), side: THREE.DoubleSide, transparent: true, opacity: 0.35, wireframe: false }),
    ringMaterial1: new THREE.MeshToonMaterial({ color: ring1_info.color, wireframe: false }),
    ringMaterial2: new THREE.MeshToonMaterial({ color: ring2_info.color, wireframe: false }),
    ringMaterial3: new THREE.MeshToonMaterial({ color: ring3_info.color, wireframe: false }),

    donutMaterial: new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: false }),
    enneperMaterial: new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: false }),
    kleinBottleMaterial: new THREE.MeshStandardMaterial({ color: 0xff0000, wireframe: false }),
    sphereMaterial: new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: false }),
    cylinderMaterial: new THREE.MeshBasicMaterial({ color: 0x00ffa0, wireframe: false }),
    boxMaterial: new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: false }),
    coneMaterial: new THREE.MeshBasicMaterial({ color: 0xff00ff, wireframe: false }), 
    hyperboloidMaterial: new THREE.MeshBasicMaterial({ color: 0xaa20af, wireframe: false })
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
}

/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene() {
    'use strict';
    scene.background = new THREE.Color('aliceblue');

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

    addObjectsToRing(ref2, innerRing, ring1_info, 10); // inner ring 
    addObjectsToRing(ref3, midRing, ring2_info, 20); // mid ring
    addObjectsToRing(ref4, outerRing, ring3_info, 30); // outter ring

    obj.add(ref1);
    obj.add(ref2);
    obj.add(ref3);
    obj.add(ref4);
}

function addInnerRing(obj, x, y, z) {
    'use strict';
    ref2.userData.ring = createRing(innerRing, x, y, z, ring1_info.outerR, ring1_info.innerR, ring1_info.h, BasicMaterials.ringMaterial1);
    innerRing.rotation.x = Math.PI / 2;
    obj.add(innerRing);

    innerRing.position.set(x, y, z);
}

function addMidRing(obj, x, y, z) {
    'use strict';
    ref3.userData.ring = createRing(midRing, x, y, z, ring2_info.outerR, ring2_info.innerR, ring2_info.h, BasicMaterials.ringMaterial2)
    midRing.rotation.x = Math.PI / 2;
    obj.add(midRing);

    midRing.position.set(x, y, z);
}

function addOuterRIng(obj, x, y, z) {
    'use strict';
    ref4.userData.ring = createRing(outerRing, x, y, z, ring3_info.outerR, ring3_info.innerR, ring3_info.h, BasicMaterials.ringMaterial3)
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

function addObjectsToRing(ref, ring, ring_info, z_deviation) {
    'use strict';
    const angleIncrement = Math.PI / 4; // 45 degrees
    const numObjects = 8;
    const objectIndices = Array.from({ length: numObjects }, (_, i) => i);

    // Shuffle the array randomly
    objectIndices.sort(() => Math.random() - 0.5);

    for (let i = 0; i < numObjects; i++) {
        const num = objectIndices[i]; 
        const angle = i * angleIncrement; 
        const x = (ring_info.outerR - 2.5) * Math.cos(angle); 
        const y = ring.position.y + 2.5; 
        const z = (ring_info.outerR - 2.5) * Math.sin(angle) + z_deviation; 

        switch(num) {
            case 0:
                addDonut(ref, x, y, z);
                break;
            case 1:
                addEnneper(ref, x, y, z);
                break;
            case 2:
                addKleinBottle(ref, x, y, z);
                break;
            case 3:
                addSphere(ref, x, y, z);
                break;
            case 4:
                addCylinder(ref, x, y, z);
                break;
            case 5:
                addBox(ref, x, y, z);
                break;
            case 6:
                addCone(ref, x, y, z);
                break;
            case 7:
                addHyperboloid(ref, x, y, z);
                break;
            default:
                break;
        }
    }
}

function addDonut(obj, x, y, z) {
    'use strict';
    const geom = new ParametricGeometry(function(u, v, target) {
        const radius = 1; 
        const tubeRadius = 0.3; 
        const phi = 2 * Math.PI * u;
        const theta = 2 * Math.PI * v;
        const posX = (radius + tubeRadius * Math.cos(theta)) * Math.cos(phi);
        const posY = (radius + tubeRadius * Math.cos(theta)) * Math.sin(phi);
        const posZ = tubeRadius * Math.sin(theta);
        target.set(posX, posY, posZ);
    }, 50, 50);
    addMesh(obj, geom, materials.BasicMaterials.donutMaterial, x, y, z);
}

function addEnneper(obj, x, y, z) {
    'use strict';
    const geom = new ParametricGeometry(function(u, v, target) {
        const uVal = 0.5 * Math.PI * (u - 0.5); 
        const vVal = 0.5 * Math.PI * (v - 0.5); 
        const u2 = uVal * uVal;
        const v2 = vVal * vVal;
        const posX = 1.3 * uVal * (1 - v2 / 3 + u2 / 30);
        const posY = 1.3 * vVal * (1 - u2 / 3 + v2 / 30);
        const posZ = 1.3 * (u2 - v2);
        target.set(posX, posY, posZ);
    }, 25, 25);
    addMesh(obj, geom,materials.BasicMaterials.enneperMaterial, x, y, z);
}

function addKleinBottle(obj, x, y, z) {
    'use strict';
    const geom = new ParametricGeometry(function(u, v, target) {
        const posX = 1.2 * (2 + Math.cos(u) * Math.sin(v) - Math.sin(u) * Math.sin(2 * v)) * Math.cos(u);
        const posY = 1.2 * (2 + Math.cos(u) * Math.sin(v) - Math.sin(u) * Math.sin(2 * v)) * Math.sin(u);
        const posZ = 1.2 * (Math.sin(u) * Math.sin(v) + Math.cos(u) * Math.sin(2 * v));
        target.set(posX, posY, posZ);
    }, 25, 25);
    addMesh(obj, geom,materials.BasicMaterials.kleinBottleMaterial, x, y, z);
}

function addSphere(obj, x, y, z) {
    'use strict';
    const geom = new ParametricGeometry(function(u, v, target) {
        const theta = 2 * Math.PI * u;
        const phi = Math.acos(1 - 2 * v);
        const radius = 1.5; 

        const posX = radius * Math.cos(theta) * Math.sin(phi);
        const posY = radius * Math.sin(theta) * Math.sin(phi);
        const posZ = radius * Math.cos(phi);

        target.set(posX, posY, posZ);
    }, 32, 32);

    addMesh(obj, geom,materials.BasicMaterials.sphereMaterial, x, y, z);
}

function addCylinder(obj, x, y, z) {
    'use strict';
    const geom = new ParametricGeometry(function(u, v, target) {
        const theta = 2 * Math.PI * u;
        const height = 3 * (v - 0.5); 
        const radius = 1; 
        const posX = radius * Math.cos(theta);
        const posY = radius * Math.sin(theta);
        const posZ = height;
        target.set(posX, posY, posZ);
    }, 32, 32);
    addMesh(obj, geom,materials.BasicMaterials.cylinderMaterial, x, y, z);
}

function addBox(obj, x, y, z) {
    'use strict';
    const geom = new ParametricGeometry(function(u, v, target) {
        const width = 1.5; 
        const height = 1.5; 
        const depth = 1.5; 
        const posX = (u - 0.5) * width;
        const posY = (v - 0.5) * height;
        const posZ = (Math.random() - 0.5) * depth;
        target.set(posX, posY, posZ);
    }, 32, 32);
    addMesh(obj, geom,materials.BasicMaterials.boxMaterial, x, y, z);
}

function addCone(obj, x, y, z) {
    'use strict';
    const geom = new ParametricGeometry(function(u, v, target) {
        const radius = 1.5; 
        const height = 3;
        const theta = 2 * Math.PI * u;
        const posY = v * height; 
        const posX = radius * (1 - v) * Math.cos(theta); 
        const posZ = radius * (1 - v) * Math.sin(theta); 
        target.set(posX, posY, posZ);
    }, 32, 32);
    addMesh(obj, geom,materials.BasicMaterials.coneMaterial, x, y, z);
}

function addHyperboloid(obj, x, y, z) {
    'use strict';
    const geom = new ParametricGeometry(function(u, v, target) {
        const a = 1.5; 
        const b = 1; 
        const c = 0.5; 
        const theta = 2 * Math.PI * u;
        const phi = Math.PI * v;
        const posX = a * Math.sinh(b * u) * Math.cos(theta);
        const posY = a * Math.sinh(b * u) * Math.sin(theta);
        const posZ = c * Math.cosh(b * u) * Math.cos(phi);
        target.set(posX, posY, posZ);
    }, 50, 50);
    addMesh(obj, geom,materials.BasicMaterials.hyperboloidMaterial, x, y, z);
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

        if(y < -(foundation.height/3 - ring2_info.h)){
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

        if(y < -(foundation.height * (2/3) - ring3_info.h)){
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

        if(y < -(foundation.height - ring3_info.h)){
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