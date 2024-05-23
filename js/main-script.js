import * as THREE from 'three';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import Stats from 'three/addons/libs/stats.module.js';
import { ParametricGeometry } from 'three/addons/geometries/ParametricGeometry.js'


////////////////////////////////
/* GLOBAL VARIABLES/CONSTANTS */
////////////////////////////////
const renderer = new THREE.WebGLRenderer();
const camera = new THREE.PerspectiveCamera();
const scene = new THREE.Scene();
const clock = new THREE.Clock();

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
const ambientLight = new THREE.AmbientLight(0xffa500, 0.4);

const stats = new Stats();

const ref1 = new THREE.Object3D();
const ref2 = new THREE.Object3D();
const ref3 = new THREE.Object3D();
const ref4 = new THREE.Object3D();

const foundation =  { radius: 4, height: 30 };
const plane =       { width: 300, depth: 2 };
const skydome =     { radius: plane.width/2,  widthSegments: 64, heightSegments: 32, phiStart: 0, phiLength: 2*Math.PI, thetaStart: 0, thetaLength: Math.PI/2 };
const ring1 =       { iRadius: 4,  oRadius: 10, height: 3, objectScalingFactor: 0.7 };
const ring2 =       { iRadius: 10, oRadius: 16, height: 3, objectScalingFactor: 0.9 };
const ring3 =       { iRadius: 16, oRadius: 22, height: 3, objectScalingFactor: 1.2 };

const basicMaterials = {
    plane:         new THREE.MeshBasicMaterial({ color: 0xF2C18D }),
    foundation:    new THREE.MeshBasicMaterial({ color: 0x123235 }),
    ring1:         new THREE.MeshBasicMaterial({ color: 0x5BBCFF }),
    ring2:         new THREE.MeshBasicMaterial({ color: 0xA0DEFF }),
    ring3:         new THREE.MeshBasicMaterial({ color: 0x5AB2FF }),
    mobiusStrip:   new THREE.MeshBasicMaterial({ color: 0x6AD4DD, side: THREE.DoubleSide }),
    torus:         new THREE.MeshBasicMaterial({ color: 0xdddd00, side: THREE.DoubleSide }),
    enneper:       new THREE.MeshBasicMaterial({ color: 0x990000, side: THREE.DoubleSide }),
    kleinBottle :  new THREE.MeshBasicMaterial({ color: 0x011111, side: THREE.DoubleSide }),
    scherkSurface: new THREE.MeshBasicMaterial({ color: 0x0aaa00, side: THREE.DoubleSide }),
    paraboloid:    new THREE.MeshBasicMaterial({ color: 0x00ffa0, side: THREE.DoubleSide }),
    cylinder:      new THREE.MeshBasicMaterial({ color: 0x0000ff, side: THREE.DoubleSide }),
    ellipsoid:     new THREE.MeshBasicMaterial({ color: 0xfffaaa, side: THREE.DoubleSide }),
    hyperboloid:   new THREE.MeshBasicMaterial({ color: 0xaa20af, side: THREE.DoubleSide })
}

const lambertMaterials = {
    plane:         new THREE.MeshLambertMaterial({ color: 0xF2C18D }),
    foundation:    new THREE.MeshLambertMaterial({ color: 0x123235 }),
    ring1:         new THREE.MeshLambertMaterial({ color: 0x5BBCFF }),
    ring2:         new THREE.MeshLambertMaterial({ color: 0xA0DEFF }),
    ring3:         new THREE.MeshLambertMaterial({ color: 0x5AB2FF }),
    mobiusStrip:   new THREE.MeshLambertMaterial({ color: 0x6AD4DD, side: THREE.DoubleSide}),
    torus:         new THREE.MeshLambertMaterial({ color: 0xdddd00, side: THREE.DoubleSide }),
    enneper:       new THREE.MeshLambertMaterial({ color: 0xff0000, side: THREE.DoubleSide }),
    kleinBottle :  new THREE.MeshLambertMaterial({ color: 0xff0000, side: THREE.DoubleSide }),
    scherkSurface: new THREE.MeshLambertMaterial({ color: 0x0aaa00, side: THREE.DoubleSide }),
    paraboloid:    new THREE.MeshLambertMaterial({ color: 0x00ffa0, side: THREE.DoubleSide }),
    cylinder:      new THREE.MeshLambertMaterial({ color: 0x0000ff, side: THREE.DoubleSide }),
    ellipsoid:     new THREE.MeshLambertMaterial({ color: 0xff00ff, side: THREE.DoubleSide }),
    hyperboloid:   new THREE.MeshLambertMaterial({ color: 0xaa20af, side: THREE.DoubleSide })
}

const phongMaterials = {
    plane:         new THREE.MeshPhongMaterial({ color: 0xF2C18D }),
    foundation:    new THREE.MeshPhongMaterial({ color: 0x123235 }),
    ring1:         new THREE.MeshPhongMaterial({ color: 0x5BBCFF }),
    ring2:         new THREE.MeshPhongMaterial({ color: 0xA0DEFF }),
    ring3:         new THREE.MeshPhongMaterial({ color: 0x5AB2FF }),
    mobiusStrip:   new THREE.MeshPhongMaterial({ color: 0x6AD4DD, side: THREE.DoubleSide}),
    torus:         new THREE.MeshPhongMaterial({ color: 0xdddd00, side: THREE.DoubleSide }),
    enneper:       new THREE.MeshPhongMaterial({ color: 0xff0000, side: THREE.DoubleSide }),
    kleinBottle:   new THREE.MeshPhongMaterial({ color: 0xff0000, side: THREE.DoubleSide }),
    scherkSurface: new THREE.MeshPhongMaterial({ color: 0x0aaa00, side: THREE.DoubleSide }),
    paraboloid:    new THREE.MeshPhongMaterial({ color: 0x00ffa0, side: THREE.DoubleSide }),
    cylinder:      new THREE.MeshPhongMaterial({ color: 0x0000ff, side: THREE.DoubleSide }),
    ellipsoid:     new THREE.MeshPhongMaterial({ color: 0xff00ff, side: THREE.DoubleSide }),
    hyperboloid:   new THREE.MeshPhongMaterial({ color: 0xaa20af, side: THREE.DoubleSide })
}

const cartoonMaterials = {
    plane:         new THREE.MeshToonMaterial({ color: 0xF2C18D }),
    foundation:    new THREE.MeshToonMaterial({ color: 0x123235 }),
    ring1:         new THREE.MeshToonMaterial({ color: 0x5BBCFF }),
    ring2:         new THREE.MeshToonMaterial({ color: 0xA0DEFF }),
    ring3:         new THREE.MeshToonMaterial({ color: 0x5AB2FF }),
    mobiusStrip:   new THREE.MeshToonMaterial({ color: 0x6AD4DD, side: THREE.DoubleSide}),
    torus:         new THREE.MeshToonMaterial({ color: 0xdddd00, side: THREE.DoubleSide}),
    enneper:       new THREE.MeshToonMaterial({ color: 0xff0000, side: THREE.DoubleSide }),
    kleinBottle:   new THREE.MeshToonMaterial({ color: 0xff0000, side: THREE.DoubleSide }),
    scherkSurface: new THREE.MeshToonMaterial({ color: 0x0aaa00, side: THREE.DoubleSide }),
    paraboloid:    new THREE.MeshToonMaterial({ color: 0x00ffa0, side: THREE.DoubleSide }),
    cylinder:      new THREE.MeshToonMaterial({ color: 0x0000ff, side: THREE.DoubleSide }),
    ellipsoid:     new THREE.MeshToonMaterial({ color: 0xff00ff, side: THREE.DoubleSide }), 
    hyperboloid:   new THREE.MeshToonMaterial({ color: 0xaa20af, side: THREE.DoubleSide })
}

const normalMaterials = {
    plane:         new THREE.MeshNormalMaterial(),
    foundation:    new THREE.MeshNormalMaterial(),
    ring1:         new THREE.MeshNormalMaterial(),
    ring2:         new THREE.MeshNormalMaterial(),
    ring3:         new THREE.MeshNormalMaterial(),
    mobiusStrip:   new THREE.MeshNormalMaterial({ side: THREE.DoubleSide }),
    torus:         new THREE.MeshNormalMaterial({ side: THREE.DoubleSide }),
    enneper:       new THREE.MeshNormalMaterial({ side: THREE.DoubleSide }),
    kleinBottle :  new THREE.MeshNormalMaterial({ side: THREE.DoubleSide }),
    scherkSurface: new THREE.MeshNormalMaterial({ side: THREE.DoubleSide }),
    paraboloid:    new THREE.MeshNormalMaterial({ side: THREE.DoubleSide }),
    cylinder:      new THREE.MeshNormalMaterial({ side: THREE.DoubleSide }),
    ellipsoid:     new THREE.MeshNormalMaterial({ side: THREE.DoubleSide }),
    hyperboloid:   new THREE.MeshNormalMaterial({ side: THREE.DoubleSide })
}

let materials = lambertMaterials; // materials currently in use
let lightsOn = true;


////////////////////////
/* AUXILIAR FUNCTIONS */
////////////////////////
function randomVector() {
    return new THREE.Vector3().random().normalize();
}

function updateMaterials() {
    'use strict';
    const materialsArray = lightsOn ? materials : basicMaterials;

    scene.traverse(obj => {
        if (obj.material && obj.name) {
            obj.material = materialsArray[obj.name];
        }
    });
}

function togglePointLights() {
    'use strict'
    if (ref1.userData.mobiusStrip) {
        const mobiusStrip = ref1.userData.mobiusStrip;
        const numLights = 8; 

        for (let i = 0; i < numLights; i++) {
            const light = mobiusStrip.userData[`light${i}`];
            if (light) {
                light.visible = !light.visible;
            }
        }
    }
}

function toggleSpotLigths() {
    'use strict';
    scene.traverse(obj => {
        if (obj.isSpotLight) {
            obj.visible = !obj.visible;
        }
    });
}

function toggleDirectionalLight() {
    'use strict';
    directionalLight.visible = !directionalLight.visible;
}

function toggleLights() {
    lightsOn = !lightsOn;
    updateMaterials();
}


/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene() {
    'use strict';
    scene.background = new THREE.Color('aliceblue');

    createCamera();
    createLigths();
    addPlane(scene, 0, -plane.depth/2, 0);
    addSkydome(scene, 0, 0, 0);
    addCarousel(scene, 0, 0, 0);
    addMobiusStrip(ref1, 0, foundation.height*2, 0); 
}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////
function createCamera() {
    'use strict';
    const wrapper = new THREE.Group();

    scene.add(wrapper.add(camera));

    wrapper.position.set(0.25*plane.width, 0.2*plane.width, 0.25*plane.width);
    camera.lookAt(scene.position.clone().setY(foundation.height/1.2));
}

/////////////////////
/* CREATE LIGHT(S) */
/////////////////////

function createLigths() {   
    'use strict';
    directionalLight.position.set(10, 100, -10); // angle
    
    scene.add(directionalLight, ambientLight);
}

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////
function setRotationData(obj, speed, axis = THREE.Object3D.DEFAULT_UP) {
    obj.userData.shouldRotate = true;
    obj.userData.rotationAxis = axis;
    obj.userData.rotationSpeed = speed;
}

function addMesh(obj, geom, material, x, y, z) {
    'use strict';
    const mesh = new THREE.Mesh(geom, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
    return mesh;
}

function addFoundation(obj, x, y, z) {
    'use strict';
    const rotationSpeed = 0.5;
    const geom = new THREE.CylinderGeometry(foundation.radius, foundation.radius, foundation.height);
    const mesh = addMesh(obj, geom, materials.foundation, x, y, z);

    setRotationData(mesh, rotationSpeed);
    mesh.name = 'foundation';
}

function addCarousel(obj, x, y, z) {
    'use strict';
    ref1.position.set(x, y, z);
    ref2.position.set(x, y + foundation.height/3,   z);
    ref3.position.set(x, y + foundation.height*2/3, z);
    ref4.position.set(x, y + foundation.height,     z);

    addFoundation(ref1, 0, foundation.height/2, 0);
    addInnerRing( ref2, 0, 0, 0);
    addMidRing(   ref3, 0, 0, 0);
    addOuterRing( ref4, 0, 0, 0);

    addObjectsToRing(ref2, ring1);
    addObjectsToRing(ref3, ring2);
    addObjectsToRing(ref4, ring3);
    
    obj.add(ref1, ref2, ref3, ref4);
    
    const rotationSpeed = 0.2;

    setRotationData(ref2, rotationSpeed);
    setRotationData(ref3, rotationSpeed);
    setRotationData(ref4, rotationSpeed);
}

function addInnerRing(obj, x, y, z) {
    'use strict';
    const mesh = addRing(obj, x, y, z, ring1, materials.ring1);

    mesh.rotation.x = Math.PI / 2;
    mesh.name = "ring1";
}

function addMidRing(obj, x, y, z) {
    'use strict';
    const mesh = addRing(obj, x, y, z, ring2, materials.ring2);

    mesh.rotation.x = Math.PI / 2;
    mesh.name = "ring2";
}

function addOuterRing(obj, x, y, z) {
    'use strict';
    const mesh = addRing(obj, x, y, z, ring3, materials.ring3);

    mesh.rotation.x = Math.PI / 2;
    mesh.name = "ring3";
}

function addRing(obj, x, y, z, ring, material) {
    'use strict';
    const oRadius = ring.oRadius;
    const iRadius = ring.iRadius;
    const height = ring.height;

    const shape = new THREE.Shape();
    const holePath = new THREE.Path();

    shape.moveTo(oRadius, 0).absarc(0, 0, oRadius, 0, 2*Math.PI, false);
    holePath.moveTo(iRadius, 0).absarc(0, 0, iRadius, 0, 2*Math.PI, true);

    shape.holes.push(holePath);

    const extrudeSettings = { bevelEnabled: false, depth: height };
    const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    
    return addMesh(obj, geom, material, x, y, z);
}

function addSpotLight(ref, target, x, y, z) {
    'use strict';
    const light = new THREE.SpotLight(0xffffff);

    light.position.set(x + 2, y - 2, z + 2);
    light.target = target;
    light.intensity = 20;
    light.distance = 8;

    ref.add(light);
    target.userData.light = light;
}

function getRandomVertices(geometry) {
    const positions = geometry.getAttribute('position');
    const totalVertices = positions.count;
    const numVertices = 8;
    const randomVertices = [];

    for (let i = 0; i < numVertices; i++) {
        const randomIndex = Math.floor(Math.random() * totalVertices);
        const x = positions.getX(randomIndex);
        const y = positions.getY(randomIndex);
        const z = positions.getZ(randomIndex);
        randomVertices.push(new THREE.Vector3(x, y, z));
    }

    return randomVertices;
}

function addPointLightsToMobiusStrip(mobiusStrip, geometry) {
    const numLights = 8;
    const vertices = getRandomVertices(geometry);

    for (let i = 0; i < numLights; i++) {
        const light = new THREE.PointLight(0xffffff);
        const { x, y, z } = vertices[i]; 
        light.position.set(x, y, z);
        light.intensity = 20;

        mobiusStrip.add(light);
        mobiusStrip.userData[`light${i}`] = light;
    }
}

function addMobiusStrip(obj, x, y, z) {
    const geometry = new THREE.BufferGeometry();

    const vertices = new Float32Array([
        20, 0, 0,      
        16, 6, 2,      
        12, 12, 4,     
        6, 16, 2,      
        0, 20, 0,      
        -6, 16, -2,    
        -12, 12, -4,   
        -16, 6, -2,    
        -20, 0, 0,     
        -16, -6, 2,    
        -12, -12, 4,   
        -6, -16, 2,    
        0, -20, 0,     
        6, -16, -2,    
        12, -12, -4,   
        16, -6, -2,    
        16, 0, 4,      
        12, 5, 5,      
        8, 10, 6,      
        4, 12, 4,      
        0, 16, 4,      
        -4, 12, 3,     
        -8, 10, 2,     
        -12, 5, 3,     
        -16, 0, 4,     
        -12, -5, 5,    
        -8, -10, 6,    
        -4, -12, 4,    
        0, -16, 4,     
        4, -12, 3,     
        8, -10, 2,     
        12, -5, 3      
    ]);

    const indices = new Uint16Array([
        0, 1, 16,
        1, 17, 16,
        1, 2, 17,
        2, 18, 17,
        2, 3, 18,
        3, 19, 18,
        3, 4, 19,
        4, 20, 19,
        4, 5, 20,
        5, 21, 20,
        5, 6, 21,
        6, 22, 21,
        6, 7, 22,
        7, 23, 22,
        7, 8, 23,
        8, 24, 23,
        8, 9, 24,
        9, 25, 24,
        9, 10, 25,
        10, 26, 25,
        10, 11, 26,
        11, 27, 26,
        11, 12, 27,
        12, 28, 27,
        12, 13, 28,
        13, 29, 28,
        13, 14, 29,
        14, 30, 29,
        14, 15, 30,
        15, 31, 30,
        15, 0, 31,
        0, 16, 31,
        16, 17, 1,
        17, 18, 2,
        18, 19, 3,
        19, 20, 4,
        20, 21, 5,
        21, 22, 6,
        22, 23, 7,
        23, 24, 8,
        24, 25, 9,
        25, 26, 10,
        26, 27, 11,
        27, 28, 12,
        28, 29, 13,
        29, 30, 14,
        30, 31, 15,
        31, 16, 0
    ]);

    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.setIndex(new THREE.BufferAttribute(indices, 1));
    geometry.computeVertexNormals();

    const mobiusStrip = addMesh(obj, geometry, materials.mobiusStrip, x, y, z);
    mobiusStrip.rotation.x = Math.PI / 2;
    mobiusStrip.name = "mobiusStrip";

    obj.userData.mobiusStrip = mobiusStrip;
    addPointLightsToMobiusStrip(mobiusStrip, geometry);
}

function addObjectsToRing(parent, ring) {
    'use strict';
    const angleIncrement = Math.PI / 4; // 45 degrees
    const numObjects = 8;
    const objectIndices = Array.from({ length: numObjects }, (_, i) => i);

    // Shuffle the array randomly
    objectIndices.sort(() => Math.random() - 0.5);

    for (let i = 0; i < numObjects; i++) {
        const angle = i * angleIncrement;
        const x = Math.cos(angle) * (ring.oRadius + ring.iRadius) / 2;
        const y = ring.height;
        const z = Math.sin(angle) * (ring.oRadius + ring.iRadius) / 2;

        let obj;

        switch (objectIndices[i]) {
            case 0:
                obj = addTorus(parent, x, y, z);
                break;
            case 1:
                obj = addEnneper(parent, x, y, z);
                break;
            case 2:
                obj = addKleinBottle(parent, x, y, z);
                break;
            case 3:
                obj = addScherkSurface(parent, x, y, z);
                break;
            case 4:
                obj = addParaboloid(parent, x, y, z);
                break;
            case 5:
                obj = addCylinder(parent, x, y, z);
                break;
            case 6:
                obj = addEllipsoid(parent, x, y, z);
                break;
            case 7:
                obj = addHyperboloid(parent, x, y, z);
                break;
        }

        obj.scale.multiplyScalar(ring.objectScalingFactor);
    }
}

function addTorus(ref, x, y, z) {
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

    const rotationSpeed = Math.random();
    const rotationAxis = randomVector();
    const torus = addMesh(ref, geom, materials.torus, x, y, z);

    setRotationData(torus, rotationSpeed, rotationAxis);
    addSpotLight(ref, torus, x, y, z);

    torus.name = "torus";
    return torus;
}

function addEnneper(ref, x, y, z) {
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

    const rotationSpeed = Math.random();
    const rotationAxis = randomVector();
    const enneper = addMesh(ref, geom, materials.enneper, x, y, z);

    setRotationData(enneper, rotationSpeed, rotationAxis);
    addSpotLight(ref, enneper, x, y, z);

    enneper.name = "enneper";
    return enneper;
}

function addKleinBottle(ref, x, y, z) {
    'use strict';
    const geom = new ParametricGeometry(function(u, v, target) {
        const posX = 1.2 * (2 + Math.cos(u) * Math.sin(v) - Math.sin(u) * Math.sin(2 * v)) * Math.cos(u);
        const posY = 1.2 * (2 + Math.cos(u) * Math.sin(v) - Math.sin(u) * Math.sin(2 * v)) * Math.sin(u);
        const posZ = 1.2 * (Math.sin(u) * Math.sin(v) + Math.cos(u) * Math.sin(2 * v));
        target.set(posX, posY, posZ);
    }, 25, 25);

    const rotationSpeed = Math.random();
    const rotationAxis = randomVector();
    const kleinBottle = addMesh(ref, geom, materials.kleinBottle, x, y, z);

    setRotationData(kleinBottle, rotationSpeed, rotationAxis);
    addSpotLight(ref, kleinBottle, x, y, z);

    kleinBottle.name = "kleinBottle"
    return kleinBottle;
}

function addScherkSurface(ref, x, y, z) {
    'use strict';
    const geom = new ParametricGeometry(function(u, v, target) {
        const scale = 2.5;
        const posX = scale * u;
        const posY = scale * v;
        const posZ = scale * Math.log(Math.cos(v) / Math.cos(u));
        target.set(posX, posY, posZ);
    }, 64, 64);

    const rotationSpeed = Math.random();
    const rotationAxis = randomVector();
    const scherkSurface = addMesh(ref, geom, materials.scherkSurface, x, y, z);

    setRotationData(scherkSurface, rotationSpeed, rotationAxis);
    addSpotLight(ref, scherkSurface, x, y, z); 

    scherkSurface.name = "scherkSurface";
    return scherkSurface;
}

function addParaboloid(ref, x, y, z) {
    'use strict';
    const geom = new ParametricGeometry(function(u, v, target) {
        const theta = 1 * Math.PI * u;
        const height = 2* v;
        const radius = height;
        const posX = radius * Math.cos(theta);
        const posY = radius * Math.sin(theta);
        const posZ = height - 1.5;
        target.set(posX, posY, posZ);
    }, 64, 64); 

    const rotationSpeed = Math.random();
    const rotationAxis = randomVector();
    const paraboloid = addMesh(ref, geom, materials.paraboloid, x, y, z);

    setRotationData(paraboloid, rotationSpeed, rotationAxis);
    addSpotLight(ref, paraboloid, x, y, z);

    paraboloid.name = "paraboloid";
    return paraboloid;
}

function addCylinder(ref, x, y, z) {
    'use strict';
    const geom = new ParametricGeometry(function(u, v, target) {
        const radius = 0.75;
        const height = 1.5;
        const theta = u * Math.PI * 2;
        const posX = radius * Math.cos(theta);
        const posY = (v - 0.5) * height;
        const posZ = radius * Math.sin(theta);
        target.set(posX, posY, posZ);
    }, 32, 32);

    const rotationSpeed = Math.random();
    const rotationAxis = randomVector();
    const cylinder = addMesh(ref, geom, materials.cylinder, x, y, z);

    setRotationData(cylinder, rotationSpeed, rotationAxis);
    addSpotLight(ref, cylinder, x, y, z);

    cylinder.name = "cylinder";
    return cylinder;
}

function addEllipsoid(ref, x, y, z) {
    'use strict';
    const geom = new ParametricGeometry(function(u, v, target) {
        const a = 1; // X-axis radius
        const b = 1;   // Y-axis radius
        const c = 1;   // Z-axis radius
        const posX = a * Math.cos(u * Math.PI * 2) * Math.sin(v * Math.PI);
        const posY = b * Math.sin(u * Math.PI * 2) * Math.sin(v * Math.PI);
        const posZ = c * Math.cos(v * Math.PI);
        target.set(posX, posY, posZ);
    }, 64, 64);

    const rotationSpeed = Math.random();
    const rotationAxis = randomVector();
    const ellipsoid = addMesh(ref, geom, materials.ellipsoid, x, y, z);

    setRotationData(ellipsoid, rotationSpeed, rotationAxis);
    addSpotLight(ref, ellipsoid, x, y, z); 

    ellipsoid.name = "ellipsoid";
    return ellipsoid;
}

function addHyperboloid(ref, x, y, z) {
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

    const rotationSpeed = Math.random();
    const rotationAxis = randomVector();
    const hyperboloid = addMesh(ref, geom, materials.hyperboloid, x, y, z);

    setRotationData(hyperboloid, rotationSpeed, rotationAxis);
    addSpotLight(ref, hyperboloid, x, y, z); 

    hyperboloid.name = "hyperboloid";
    return hyperboloid;
}

function addPlane(obj, x, y, z) {
    'use strict';
    const geom = new THREE.BoxGeometry(plane.width, plane.width, plane.depth);
    const mesh = addMesh(obj, geom, materials.plane, x, y, z);
    
    mesh.rotation.x = Math.PI / 2;
    mesh.name = "plane";
}

function addSkydome(obj, x, y, z) {
    'use strict';

    let map = new THREE.TextureLoader().load("textures/skydome2.jpeg");
    let bmap = new THREE.TextureLoader().load("textures/skydome2-bump.jpeg");
    let dmap = new THREE.TextureLoader().load("textures/skydome2-displacement.jpeg");

    const material = new THREE.MeshPhongMaterial({
        bumpMap: bmap,
        bumpScale: 1.3,
        displacementMap: dmap,
        displacementScale: 5,
        map: map,
        side: THREE.DoubleSide,
    });

    const geom = new THREE.SphereGeometry(skydome.radius, skydome.widthSegments, skydome.heightSegments, skydome.phiStart, skydome.phiLength, skydome.thetaStart, skydome.thetaLength);
    
    addMesh(obj, geom, material, x, y, z);
}

//////////////////////
/* CHECK COLLISIONS */
//////////////////////
function checkCollisions() {
    'use strict';

}

///////////////////////
/* HANDLE COLLISIONS */
///////////////////////
function handleCollisions() {
    'use strict';

}

////////////
/* UPDATE */
////////////
function update() {
    'use strict';
    const delta = clock.getDelta();
    const speed = 10;

    if (ref2.userData.moving) {
        const step = speed * ref2.userData.direction * delta;
        const newY = step + ref2.position.y;

        if (newY < ring1.height) {
            ref2.userData.direction = 1;
            ref2.position.y = ring1.height;
        } else if (newY > foundation.height) {
            ref2.userData.direction = -1;
            ref2.position.y = foundation.height;
        } else {
            ref2.position.y = newY;
        }
    }

    if (ref3.userData.moving) {
        const step = speed * ref3.userData.direction * delta;
        const newY = step + ref3.position.y;

        if (newY < ring2.height) {
            ref3.userData.direction = 1;
            ref3.position.y = ring2.height;
        } else if (newY > foundation.height) {
            ref3.userData.direction = -1;
            ref3.position.y = foundation.height;
        } else {
            ref3.position.y = newY;
        }
    }

    if (ref4.userData.moving) {
        const step = speed * ref4.userData.direction * delta;
        const newY = step + ref4.position.y;

        if (newY < ring3.height) {
            ref4.userData.direction = 1;
            ref4.position.y = ring3.height;
        } else if (newY > foundation.height) {
            ref4.userData.direction = -1;
            ref4.position.y = foundation.height;
        } else {
            ref4.position.y = newY;
        }
    }

    // rotation of parametric surfaces
    scene.traverse(obj => {
        if (obj.userData.shouldRotate) {
            obj.rotateOnAxis(obj.userData.rotationAxis, obj.userData.rotationSpeed * delta);
        }
    });
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
    renderer.xr.enabled = true;

    document.body.appendChild(stats.dom);
    document.body.appendChild(renderer.domElement);
    document.body.appendChild(VRButton.createButton(renderer));

    ref2.userData = { moving: true, direction: 1 };
    ref3.userData = { moving: true, direction: 1 };
    ref4.userData = { moving: true, direction: 1 };
    
    createScene(); // create scene: cameras, objects, light
    onResize();    // update window size
    
    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKeyDown);
}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////
function animate() {
    'use strict';
    update();
    render();
    stats.update();
    renderer.setAnimationLoop(animate);
}

////////////////////////////
/* RESIZE WINDOW CALLBACK */
////////////////////////////
function onResize() {
    'use strict';
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}

///////////////////////
/* KEY DOWN CALLBACK */
///////////////////////
function onKeyDown(e) {
    'use strict';
    switch (e.key.toUpperCase()) {
        // Toggle movement of inner ring
        case '1':
            ref2.userData.moving = !ref2.userData.moving;
            break;
        // Toggle movement of mid ring
        case '2':
            ref3.userData.moving = !ref3.userData.moving;
            break;
        // Toggle movement of outer ring
        case '3':
            ref4.userData.moving = !ref4.userData.moving;
            break;
        // Select Lambert materials
        case 'Q':
            materials = lambertMaterials;
            updateMaterials();
            break;
        // Select Phong materials
        case 'W':
            materials = phongMaterials;
            updateMaterials();
            break;
        // Select Cartoon materials
        case 'E':
            materials = cartoonMaterials;
            updateMaterials();
            break;
        // Select Normal materials
        case 'R':
            materials = normalMaterials;
            updateMaterials();
            break;
        // Lights of the parametric surfaces
        case 'P':
            togglePointLights();
            break;
        // Lights of the mobius strip
        case 'S':
            toggleSpotLigths();
            break;
        // Toggle directional lights
        case 'D':
            toggleDirectionalLight();
            break;
        // Toggle lights
        case 'T':
            toggleLights();
            break;
    }
}

init();
animate();