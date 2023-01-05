import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class Character {

    constructor (params={scale: 1, link: ''}){
        this.link = params.link;
        this.scale = params.scale;
        this.leftController;
        this.rightController;

        this.scene ='';
        this.camera={};
        this.origin = new THREE.Group()
        this.origin.name = 'Origin'
        this.originPlate = new THREE.Group()
        this.ufo = {}

        this.assetPath = params.assetPath;
        this.positions = [];
    }


    init(){
        this.camera.position.set(0, 5, 5);
        this.camera.rotation.x = -0.35
        // this.camera.lookAt(160, 0, 20)
        this.origin.add(this.camera)
        // console.log(this.origin)

        // camera.add( listener ); // Добавление звука

        this.scene.add(this.origin)
      
        this.fileLoader('ufo_edit_fudailshajahan.glb', 0.6) //Загрузка тарелки
    
    }

    registerScene(scene, camera){
        this.scene = scene
        this.camera = camera
    }

    registerControllers(itemLeft,itemRight){
        this.leftController = itemLeft;
        this.rightController = itemRight;
    }
    
    fileLoader(fileName,objScale){    
        const loader = new GLTFLoader();
        loader.setPath(this.assetPath);

        loader.loadAsync(fileName).then(item => {
            let ufo = item.scene
            ufo.scale.set(objScale, objScale, objScale)
            ufo.position.y = 2
            ufo.add(this.spotLight())
            this.ufo = ufo
            // console.log('UFO')
            // console.log(ufo)
            this.originPlate.add(ufo)
            this.origin.add(this.originPlate)
        })
    }

    spotLight () {
        const lightGroup = new THREE.Group()
        const spotLight = new THREE.SpotLight( 0xffffff, 1 );
        spotLight.angle = 0.16;
        spotLight.penumbra = 0.7;
        spotLight.decay = 2;
        spotLight.rotation.x = Math.PI/2
    
        const targetObject = new THREE.Object3D(); // Targer for spot light
        targetObject.position.y = -1;
        lightGroup.add(targetObject);
        spotLight.target = targetObject;
        lightGroup.add(spotLight)

        // CONE
        const geometry = new THREE.ConeGeometry( 1, 5, 32 );
        const material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
        material.transparent = true
        material.opacity = 0.1
        const cone = new THREE.Mesh( geometry, material );
        cone.position.y = -2
        lightGroup.add( cone );

        return lightGroup
    }
    
    updateCharacter(area = 200){
        // if(group.position.x >== area && (group.position.x >== area)){} // Ограничение движения в одной области
        // console.log(this.origin.position.x)
        try {
            // if(this.origin.position.x < 100) {
            //     this.origin.position.x += Math.sin(this.origin.rotation.y + Math.PI / 2) * +this.leftController.get().x/4;
            // }
            this.origin.position.x += Math.sin(this.origin.rotation.y) * + this.rightController.get().y/4; // Движение вперёд
            this.origin.position.z += Math.cos(this.origin.rotation.y) * + this.rightController.get().y/4;
        
            this.origin.position.x += Math.sin(this.origin.rotation.y + Math.PI / 2) * +this.leftController.get().x/4;
            this.origin.position.z += Math.cos(this.origin.rotation.y + Math.PI / 2) * +this.leftController.get().x/4;
        
            this.origin.rotation.y -= +this.rightController.get().x/100; // Разворот
        
            this.ufo.rotation.x = this.rightController.get().y/3  // Наклон вперед
            // this.originPLate.rotation.x = this.rightController.get().y/3  // Наклон вперед   
            this.ufo.rotation.y = +this.rightController.get().x/4*-1
            this.ufo.rotation.z = +this.rightController.get().x/5*-1 + +this.leftController.get().x/5*-1 //Наклон в бок
        } catch (error) {
            
        }

        //group.children[0].rotation.z = +joyLeft.get().x/5*-1
        
        // -------------------------------------- Arrow --------//
        // const n = new THREE.Vector3();
        // const origin = new THREE.Vector3();
        // n.copy(group.children[0].rotation);
     
        // origin.set(group.position.x, 1.9, group.position.z)
    
        //arrowHelper.setDirection(n);
        //arrowHelper.position.copy(origin)
        //arrowHelper.position.set(group.position)

        //raycaster.set(origin, rayDirection)
    
    
    }
    

}