import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import * as Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { ParametricGeometry } from 'three/addons/geometries/ParametricGeometry.js'


////////////////////////////////
/* GLOBAL VARIABLES/CONSTANTS */
////////////////////////////////
const mainCamera = new THREE.PerspectiveCamera();
const scene = new THREE.Scene();
const clock = new THREE.Clock();

const renderer = new THREE.WebGLRenderer();

const ref1 = new THREE.Object3D();
const ref2 = new THREE.Object3D();
const ref3 = new THREE.Object3D();
const ref4 = new THREE.Object3D();
const objs = new THREE.Object3D();

let lightsOn = false;

const foundation = { radius: 4, height: 30, color: 0x123235 };
const plane =      { width: 150, height: 150 };
const skydome =    { radius: plane.width/2,  widthSegments: 64, heightSegments: 32, phiStart: 0, phiLength: 2*Math.PI, ThetaStart: 0, ThetaLength: Math.PI/2 };
const ring1_info =      { innerR: foundation.radius, outerR: foundation.radius + 5, h: 5 , color: 0x003C43 };
const ring2_info =      { innerR: ring1_info.outerR, outerR: ring1_info.outerR + 5, h: 5 , color: 0x135D66 };
const ring3_info =      { innerR: ring2_info.outerR, outerR: ring2_info.outerR + 5, h: 5 , color: 0x77B0AA };

const basicMaterials = {
    foundation: new THREE.MeshBasicMaterial({ color: 0x123235 }),
    skydome: new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("textures/skydome.jpg"), side: THREE.DoubleSide, transparent: true, opacity: 0.35}),
    ring1: new THREE.MeshBasicMaterial({ color: ring1_info.color }),
    ring2: new THREE.MeshBasicMaterial({ color: ring2_info.color }),
    ring3: new THREE.MeshBasicMaterial({ color: ring3_info.color }),
    mobiusStrip: new THREE.MeshBasicMaterial({ color: 0x135D66}),
    donut: new THREE.MeshBasicMaterial({ color: 0xdddd00 }),
    enneper: new THREE.MeshBasicMaterial({ color: 0x990000 }),
    kleinBottle : new THREE.MeshBasicMaterial({ color: 0x11111 }),   
    scherkSurface: new THREE.MeshBasicMaterial({ color: 0xaaa00 }),
    cylinder: new THREE.MeshBasicMaterial({ color: 0x00ffa0 }),
    box: new THREE.MeshBasicMaterial({ color: 0x0000ff }),
    ellipsoid: new THREE.MeshBasicMaterial({ color: 0xfffaaa }), 
    hyperboloid: new THREE.MeshBasicMaterial({ color: 0xaa20af }) 
}

const normalMaterials = {
    foundation: new THREE.MeshNormalMaterial({ color: 0x123235 }),
    skydome: new THREE.MeshNormalMaterial({ map: new THREE.TextureLoader().load("textures/skydome.jpg"), side: THREE.DoubleSide, transparent: true, opacity: 0.7}),
    ring1: new THREE.MeshNormalMaterial({ color: ring1_info.color }),
    ring2: new THREE.MeshNormalMaterial({ color: ring2_info.color }),
    ring3: new THREE.MeshNormalMaterial({ color: ring3_info.color }),
    mobiusStrip: new THREE.MeshBasicMaterial({ color: 0x135D66}),
    donut: new THREE.MeshNormalMaterial({ color: 0xdddd00 }),
    enneper: new THREE.MeshNormalMaterial({ color: 0x990000 }),
    kleinBottle : new THREE.MeshNormalMaterial({ color: 0x11111 }),
    scherkSurface: new THREE.MeshNormalMaterial({ color: 0xaaa00 }),
    cylinder: new THREE.MeshNormalMaterial({ color: 0x00ffa0 }),
    box: new THREE.MeshNormalMaterial({ color: 0x0000ff }),
    ellipsoid: new THREE.MeshNormalMaterial({ color: 0xff00ff }), 
    hyperboloid: new THREE.MeshNormalMaterial({ color: 0xaa20af }) 
}

const lambertMaterials = {
    foundation: new THREE.MeshLambertMaterial({ color: 0x123235 }),
    skydome: new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load("textures/skydome.jpg"), side: THREE.DoubleSide, transparent: true, opacity: 0.7}),
    ring1: new THREE.MeshLambertMaterial({ color: ring1_info.color }),
    ring2: new THREE.MeshLambertMaterial({ color: ring2_info.color }),
    ring3: new THREE.MeshLambertMaterial({ color: ring3_info.color }),
    mobiusStrip: new THREE.MeshBasicMaterial({ color: 0x135D66}),
    donut: new THREE.MeshLambertMaterial({ color: 0xdddd00 }),
    enneper: new THREE.MeshLambertMaterial({ color: 0xff0000 }),
    kleinBottle : new THREE.MeshLambertMaterial({ color: 0xff0000 }),
    scherkSurface: new THREE.MeshLambertMaterial({ color: 0xaaa00 }),
    cylinder: new THREE.MeshLambertMaterial({ color: 0x00ffa0 }),
    box: new THREE.MeshLambertMaterial({ color: 0x0000ff }),
    ellipsoid: new THREE.MeshLambertMaterial({ color: 0xff00ff }), 
    hyperboloid: new THREE.MeshLambertMaterial({ color: 0xaa20af }) 
}

const phongMaterials = {
    foundation: new THREE.MeshPhongMaterial({ color: 0x123235 }),
    skydome: new THREE.MeshPhongMaterial({ map: new THREE.TextureLoader().load("textures/skydome.jpg"), side: THREE.DoubleSide, transparent: true, opacity: 0.7 }),
    ring1: new THREE.MeshPhongMaterial({ color: ring1_info.color }),
    ring2: new THREE.MeshPhongMaterial({ color: ring2_info.color }),
    ring3: new THREE.MeshPhongMaterial({ color: ring3_info.color }),
    mobiusStrip: new THREE.MeshBasicMaterial({ color: 0x135D66}),
    donut: new THREE.MeshPhongMaterial({ color: 0xdddd00 }),
    enneper: new THREE.MeshPhongMaterial({ color: 0xff0000 }),
    kleinBottle: new THREE.MeshPhongMaterial({ color: 0xff0000 }),
    scherkSurface: new THREE.MeshPhongMaterial({ color: 0xaaa00 }),
    cylinder: new THREE.MeshPhongMaterial({ color: 0x00ffa0 }),
    box: new THREE.MeshPhongMaterial({ color: 0x0000ff }),
    ellipsoid: new THREE.MeshPhongMaterial({ color: 0xff00ff }), 
    hyperboloid: new THREE.MeshPhongMaterial({ color: 0xaa20af })
}

const cartoonMaterials = {
    foundation: new THREE.MeshToonMaterial({ color: 0x123235 }),
    skydome: new THREE.MeshToonMaterial({ map: new THREE.TextureLoader().load("textures/skydome.jpg"), side: THREE.DoubleSide, transparent: true, opacity: 0.35 }),
    ring1: new THREE.MeshToonMaterial({ color: ring1_info.color }),
    ring2: new THREE.MeshToonMaterial({ color: ring2_info.color }),
    ring3: new THREE.MeshToonMaterial({ color: ring3_info.color }),
    mobiusStrip: new THREE.MeshBasicMaterial({ color: 0x135D66}),
    donut: new THREE.MeshToonMaterial({ color: 0xdddd00 }),
    enneper: new THREE.MeshToonMaterial({ color: 0xff0000 }),
    kleinBottle: new THREE.MeshToonMaterial({ color: 0xff0000 }),
    scherkSurface: new THREE.MeshToonMaterial({ color: 0xaaa00 }),
    cylinder: new THREE.MeshToonMaterial({ color: 0x00ffa0 }),
    box: new THREE.MeshToonMaterial({ color: 0x0000ff }),
    ellipsoid: new THREE.MeshToonMaterial({ color: 0xff00ff }), 
    hyperboloid: new THREE.MeshToonMaterial({ color: 0xaa20af })
}

let changeLambert = false;
let changePhong = false;
let changeCartoon = false;
let changeNormal = false;

const materials = {
    NormalMaterials: normalMaterials,
    LambertMaterials: lambertMaterials,
    PhongMaterials: phongMaterials,
    CartoonMaterials: cartoonMaterials,
    BasicMaterials: basicMaterials
};

let currentMaterialType = 'BasicMaterials';

////////////////////////
/* AUXILIAR FUNCTIONS */
////////////////////////

function setCurrentMaterial() {
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
    ref1.userData.skydome.material = materials[currentMaterialType].skydome;
    ref1.userData.mobiusStrip.material = materials[currentMaterialType].mobiusStrip;
    ref2.userData.ring.material = materials[currentMaterialType].ring1;
    ref3.userData.ring.material = materials[currentMaterialType].ring2;
    ref4.userData.ring.material = materials[currentMaterialType].ring3;
    objs.userData.donut.material = materials[currentMaterialType].donut;
    objs.userData.enneper.material = materials[currentMaterialType].enneper;
    objs.userData.klein.material = materials[currentMaterialType].kleinBottle;
    objs.userData.scherkSurface.material = materials[currentMaterialType].scherkSurface;
    objs.userData.cylinder.material = materials[currentMaterialType].cylinder;
    objs.userData.box.material = materials[currentMaterialType].box;
    objs.userData.ellipsoid.material = materials[currentMaterialType].ellipsoid;
    objs.userData.hyperboloid.material = materials[currentMaterialType].hyperboloid;
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
    addMobiusStrip(ref1, 15, 15, 30, 0, foundation.height*2, 0); 
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
    obj.userData.foundation = addMesh(obj, geom, basicMaterials.foundation, x, y, z);
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

    addObjectsToRing(ref2, ref2.userData.ring, ring1_info);  
    addObjectsToRing(ref3, ref3.userData.ring, ring2_info); 
    addObjectsToRing(ref4, ref4.userData.ring, ring3_info); 
    
    obj.add(ref1, ref2, ref3, ref4);
}

function addInnerRing(obj, x, y, z) {
    'use strict';
    obj.userData.ring = addRing(obj, x, y, z, ring1_info.outerR, ring1_info.innerR, ring1_info.h, basicMaterials.ring1);
}

function addMidRing(obj, x, y, z) {
    'use strict';
    obj.userData.ring = addRing(obj, x, y, z, ring2_info.outerR, ring2_info.innerR, ring2_info.h, basicMaterials.ring2);
}

function addOuterRing(obj, x, y, z) {
    'use strict';
    obj.userData.ring = addRing(obj, x, y, z, ring3_info.outerR, ring3_info.innerR, ring3_info.h, basicMaterials.ring3);
}

function addRing(obj, x, y, z, outerRadius, innerRadius, height, material) {
    'use strict';
    const shape = new THREE.Shape();
    const holePath = new THREE.Path();

    shape.moveTo(outerRadius, 0).absarc(0, 0, outerRadius, 0, 2*Math.PI, false);
    holePath.moveTo(innerRadius, 0).absarc(0, 0, innerRadius, 0, 2*Math.PI, true);

    shape.holes.push(holePath);

    const extrudeSettings = { bevelEnabled: false, depth: height };
    const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    
    return addMesh(obj, geom, material, x, y, z).rotateX(Math.PI / 2);
}

function addMobiusStrip(obj, r, w, segments, x, y, z) {
    const geometry = new THREE.BufferGeometry();
    
    const vertices = [];
    const indices = [];

    for (let i = 0; i <= segments; i++) {
        const u = i / segments * Math.PI * 2;
        
        for (let j = 0; j <= segments; j++) {
            const v = (j - segments / 2) / segments * w;

            //  Equation of a Möbius Strip
            const xCoord = (r + v * Math.cos(u / 2) / 2) * Math.cos(u);
            const yCoord = (r + v * Math.cos(u / 2) / 2) * Math.sin(u);
            const zCoord = v * Math.sin(u / 2) / 2;

            vertices.push(xCoord, yCoord, zCoord);
        }
    }

    for (let i = 0; i < segments; i++) {
        for (let j = 0; j < segments; j++) {
            const a = (i * (segments + 1)) + j;
            const b = a + segments + 1;

            indices.push(a, b, a + 1);
            indices.push(b, b + 1, a + 1);
        }
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    ref1.userData.mobiusStrip = addMesh(obj, geometry, basicMaterials.mobiusStrip, x, y, z);
    ref1.userData.mobiusStrip.rotation.x = Math.PI / 2;
}

function createRotatingSurface(geometry, material, rotationAxis, rotationSpeed) {
    const surface = new THREE.Mesh(geometry, material);
    surface.userData.rotationAxis = rotationAxis;
    surface.userData.rotationSpeed = rotationSpeed;
    return surface;
}

function addRotatingSurface(ref, geom, material, rotationSpeed, x, y, z) {
    const rotationAxis = new THREE.Vector3(0, 1, 0); // Y-axis
    const surface = createRotatingSurface(geom, material, rotationAxis, rotationSpeed);
    surface.position.set(x, y, z);
    ref.add(surface);

    return surface;
}

function addObjectsToRing(ref, ring, ring_info) {
    'use strict';
    const angleIncrement = Math.PI / 4; // 45 degrees
    const numObjects = 8;
    const objectIndices = Array.from({ length: numObjects }, (_, i) => i);

    // Shuffle the array randomly
    objectIndices.sort(() => Math.random() - 0.5);

    for (let i = 0; i < numObjects; i++) {
        const angle = i * angleIncrement; 
        const x = (ring_info.outerR) * Math.cos(angle); 
        const y = ring.position.y; 
        const z = (ring_info.outerR) * Math.sin(angle); 

        switch (objectIndices[i]) {
            case 0:
                objs.userData.donut = addDonut(ref, x, y, z);
                break;
            case 1:
                objs.userData.enneper = addEnneper(ref, x, y, z);
                break;
            case 2:
                objs.userData.klein = addKleinBottle(ref, x, y, z);
                break;
            case 3:
                objs.userData.scherkSurface = addScherkSurface(ref, x, y, z);
                break;
            case 4:
                objs.userData.cylinder = addCylinder(ref, x, y, z);
                break;
            case 5:
                objs.userData.box = addBox(ref, x, y, z);
                break;
            case 6:
                objs.userData.ellipsoid = addEllipsoid(ref, x, y, z);
                break;
            case 7:
                objs.userData.hyperboloid = addHyperboloid(ref, x, y, z);
                break;
        }
    }
}

function addSpotLight(ref, target, x, y, z) {
    'use strict';
    const light = new THREE.SpotLight(0xffffff);

    light.position.set(x, y + 2, z);
    light.target = target;
    light.intensity = 10;
    light.distance = 15;
    light.penumbra = 0;
    light.decay = 2;

    ref.add(light);
    target.userData.light = light;
}

function addDonut(ref, x, y, z) {
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

    const rotationSpeed = 0.75;
    const donut = addRotatingSurface(ref, geom, basicMaterials.donut, rotationSpeed, x, y, z);

    addSpotLight(ref, donut, x, y, z);

    return donut;
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

    const rotationSpeed = 0.85;
    const enneper = addRotatingSurface(ref, geom, basicMaterials.enneper, rotationSpeed, x, y, z);

    addSpotLight(ref, enneper, x, y, z);

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

    const rotationSpeed = 0.5;
    const kleinBottle = addRotatingSurface(ref, geom, basicMaterials.kleinBottle, rotationSpeed, x, y, z);

    addSpotLight(ref, kleinBottle, x, y, z); 

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

    const rotationSpeed = 0.6;
    const scherkSurface = addRotatingSurface(ref, geom, basicMaterials.scherkSurface, rotationSpeed, x, y, z);

    addSpotLight(ref, scherkSurface, x, y, z); 

    return scherkSurface;
}

function addCylinder(ref, x, y, z) {
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

    const rotationSpeed = 0.75;
    const cylinder = addRotatingSurface(ref, geom, basicMaterials.cylinder, rotationSpeed, x, y, z);

    addSpotLight(ref, cylinder, x, y, z); 

    return cylinder;
}

function addBox(ref, x, y, z) {
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

    const rotationSpeed = 0.75;
    const box = addRotatingSurface(ref, geom, materials.BasicMaterials.box, rotationSpeed, x, y, z);

    addSpotLight(ref, box, x, y, z); 

    return box;
}

function addEllipsoid(ref, x, y, z) {
    'use strict';
    const geom = new ParametricGeometry(function(u, v, target) {
        const a = 1.5; // X-axis radius
        const b = 1;   // Y-axis radius
        const c = 1;   // Z-axis radius
        const posX = a * Math.cos(u * Math.PI * 2) * Math.sin(v * Math.PI);
        const posY = b * Math.sin(u * Math.PI * 2) * Math.sin(v * Math.PI);
        const posZ = c * Math.cos(v * Math.PI);
        target.set(posX, posY, posZ);
    }, 64, 64);

    const rotationSpeed = 0.7;
    const ellipsoid = addRotatingSurface(ref, geom, basicMaterials.ellipsoid, rotationSpeed, x, y, z);

    addSpotLight(ref, ellipsoid, x, y, z); 

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

    const rotationSpeed = 0.75;
    const hyperboloid = addRotatingSurface(ref, geom, basicMaterials.hyperboloid, rotationSpeed, x, y, z);

    addSpotLight(ref, hyperboloid, x, y, z); 

    return hyperboloid;
}

function addPlane(obj, x, y, z) {
    'use strict';
    const planeMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(150, 150),
        new THREE.MeshBasicMaterial({ color: 0xEF767A, wireframe: false, side: THREE.DoubleSide })
    );
    
    planeMesh.rotateX(Math.PI / 2).position.set(x, y, z);

    obj.add(planeMesh);
}

function addSkydome(obj, x,y,z) {
    'use strict';
    const geom = new THREE.SphereGeometry(skydome.radius, skydome.widthSegments, skydome.heightSegments, skydome.phiStart, skydome.phiLength, skydome.ThetaStart, skydome.ThetaLength);
    ref1.userData.skydome = addMesh(obj, geom, basicMaterials.skydome, x, y, z);
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

        if (newY < ring1_info.h) {
            ref2.userData.direction = 1;
            ref2.position.y = ring1_info.h;
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

        if (newY < ring2_info.h) {
            ref3.userData.direction = 1;
            ref3.position.y = ring2_info.h;
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

        if (newY < ring3_info.h) {
            ref4.userData.direction = 1;
            ref4.position.y = ring3_info.h;
        } else if (newY > foundation.height) {
            ref4.userData.direction = -1;
            ref4.position.y = foundation.height;
        } else {
            ref4.position.y = newY;
        }
    }

    // rotation of parametric surfaces
    [ref2, ref3, ref4].forEach(ref => {
        ref.children.forEach(mesh => {
            if (mesh.userData.rotationAxis && mesh.userData.rotationSpeed) {
                mesh.rotateOnAxis(mesh.userData.rotationAxis, mesh.userData.rotationSpeed * delta);
            }
        });
    });

    // spotlight of parametric surfaces
    [ref2, ref3, ref4].forEach(ref => {
        ref.children.forEach(mesh => {
            if (mesh.userData.light) {
                mesh.userData.light.visible = lightsOn;
            }
        });
    });

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
    switch (e.key) {
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
        // Change material - Lambert
        case 'q':
            changeLambert = true;
            break;
        // Change material - Phong
        case 'w':
            changePhong = true;
            break;
        // Change material - Cartoon
        case 'e':
            changeCartoon = true;
            break;
        // Change material - Normal
        case 'r':
            changeNormal = true;
            break;
        // Activate the lights of the parametric surfaces
        case 'p':
            lightsOn = true;
            break;
        // Deactivate the lights of the parametric surfaces
        case 's':
            lightsOn = false;
            break;
    }
}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e) {
    'use strict';
    switch (e.key) {
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
        case 'q':
            changeLambert = false;
            break;
        // Change material - Phong
        case 'w':
            changePhong = false;
            break;
        // Change material - Cartoon
        case 'e':
            changeCartoon = false;
            break;
        // Change material - Normal
        case 'r':
            changeNormal = false;
            break;  
    }
}

init();
animate();