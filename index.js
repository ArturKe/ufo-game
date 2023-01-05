import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Joystick } from './src/components/Joystick'
import { Scatter } from './src/components/scatter/Scatter';
import { ScatterLOD } from './src/components/scatter_lod/ScatterLOD';
import { Character } from './src/components/character/Character';


console.log('Hello')
let scene, renderer, reflectionCube, camera, helper, distance = 0, angle = 0, group, arrowHelper;
const assetPath = './src/assets/';
const sceneMeshes = []
const catchedObjects = []

const joy = new Joystick('body',{ right: 20, bottom: 20})
const joyLeft = new Joystick('body',{ left: 20, bottom: 20})
const ufoPlate = new Character({assetPath})

// //--------------------------------------------------- Audio
// const listener = new THREE.AudioListener();

// // create a global audio source
// const sound = new THREE.Audio( listener );

// // load a sound and set it as the Audio object's buffer
// const audioLoader = new THREE.AudioLoader();
// audioLoader.load( './assets/sounds/bubble-shot.ogg', function( buffer ) {
// 	sound.setBuffer( buffer );
// 	//sound.setLoop( true );
// 	sound.setVolume( 0.5 );
// 	//sound.play();
// });

init();

function init(){

    sceneInit()
    geometryInit()

    cubesInit()
    //cubesRoundInit()

    // Cows
    // const sc = new Scatter(assetPath, 'cow_edit_ver1.glb', 1, 40)
    // sc.registerScene(scene)
    // sc.generate()

    // Trees
    const scl = new ScatterLOD(assetPath, 'pine_tree_triple_no_tank_ver2.glb', 0.6, 2000, 250)
    scl.registerScene(scene)
    scl.generateDimple()

    // scl.generateSimple()

    // Ufo Plate
    ufoPlate.registerScene(scene, camera)
    ufoPlate.init()
    ufoPlate.registerControllers(joyLeft,joy)

    //----------------------------------------------------------------//
    // const mat = new THREE.MeshPhongMaterial({
    //     color: new THREE.Color('red'),
    //     envMap: reflectionCube
    // });

    // instLoader('cow_edit_ver1.glb', 1, 50, 200)
    // instLoader('pine_tree_triple_no_tank_ver2.glb', 2, 1000, 300)

    let g =[]
    g = posGen(30)
    console.log(g)

    update()  
      
}

//-----------------------------------------------------------------Scene Init -------------------------------//
function sceneInit() { 

    scene = new THREE.Scene();
    //scene.background = new THREE.Color(0x00aaff);
    //scene.fog = new THREE.FogExp2(0x00aaff, 0.01);
      
    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspect = width/height;
    //clock = new THREE.Clock();

    //----------------------- Lights -----------------------//
    
    const ambient = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.5);
    scene.add(ambient);
  
    // const hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.7 );
      // 			hemiLight.color.setHSL( 0.6, 1, 0.6 );
      // 			hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
      // 			hemiLight.position.set( 0, 50, 0 );
      // 			scene.add( hemiLight );
  
    const light = new THREE.DirectionalLight(0xFFFFFF, 2);
    light.position.set( 0, 1, 10);
    light.rotation.y = 1;
    scene.add(light);
  
    cubeTextureInit()

    // renderer
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );


    // camera & controls
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    // camera.position.set(3,2,0);
    // const controls = new OrbitControls( camera, renderer.domElement );
    // controls.target.set(1,2,0);
    // controls.update();

    window.addEventListener( 'resize', resize, false); 
}

function resize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function cubeTextureInit() {
    reflectionCube = new THREE.CubeTextureLoader()
                      .setPath( assetPath + 'textures/cube/' )
                      .load( [ 'px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg' ] );
                  reflectionCube.encoding = THREE.sRGBEncoding;
  
                  // scene = new THREE.Scene();
                  scene.background = reflectionCube;
    
}

function update(){
    requestAnimationFrame( update );
    renderer.render( scene, camera );
    //const dt = clock.getDelta();
    //objControll()

    ufoPlate.updateCharacter();
}

// Geometry ------------------------------------------------------------------//

function geometryInit() {
    // Floor -----------------//
    const floorGeometry = new THREE.PlaneGeometry( 500, 500 );
    const floorMaterial = new THREE.MeshStandardMaterial( {
        color: 0xeeeeee,
        roughness: 1.0,
        metalness: 0.0
    } );
    const floor = new THREE.Mesh( floorGeometry, floorMaterial );
    floor.rotation.x = - Math.PI / 2;
    floor.receiveShadow = true;
    scene.add( floor );
    floor.position.y = -0.6;
  
    // Grid -------------------//
    const grid = new THREE.GridHelper(500,100)
    scene.add(grid)
    grid.position.y = -0.6
}
  
   
function cubesInit(){
    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    geometry.translate( 0, 0.5, 0 );

    const material = new THREE.MeshPhongMaterial({
        color: new THREE.Color('grey'),
        envMap: reflectionCube
    });
  
    for ( let i = 0; i < 500; i ++ ) {
      const mesh = new THREE.Mesh( geometry, material );
      mesh.position.x = Math.random() * 400-200;
      mesh.position.y = 0;
      mesh.position.z = Math.random() * 400-200;
      mesh.scale.x = Math.random() * 4 + 2;
      mesh.scale.y = Math.random() * 1.5 + 0.1;
      mesh.scale.z = Math.random() * 3 + 1;
      mesh.updateMatrix();
      mesh.matrixAutoUpdate = false;
      scene.add( mesh );
    };
}

// Position Generator
function posGen (count) {
    const positions =[]; 
    const raycaster = new THREE.Raycaster();

    let rayOrigin = new THREE.Vector3(0, 5, 0)
    let rayDirection = new THREE.Vector3(0, -1, 0)
    raycaster.set(rayOrigin, rayDirection)
    raycaster.far = 20

    for( let i = 0; i < count; i ++ ){
        const itemPosition = new THREE.Vector3();

        itemPosition.x = Math.random() * 20+1;
        itemPosition.y = Math.random() * 20+1;
        itemPosition.z = Math.random() * 20+1;

        positions.push(itemPosition)
    }
    return positions;
}
