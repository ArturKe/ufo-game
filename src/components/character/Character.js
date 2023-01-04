import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class Character {

    constructor (params={scale: 1, link: ''}){

        this.link = params.link;
        this.scale = params.scale;
        this.leftController;
        this.rightController;

        this.scene ='';
        this.origin = new THREE.Group()

        this.assetPath = params.assetPath;
        this.positions = [];

    }


    init(){

        this.scene.add(this.origin)
      
        // camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 0.1, 1000 );
        // camera.position.set(0, 2.8, 5);
        // camera.rotation.x = -0.35
    
        // camera.add( listener ); // Добавление звука
    
        // camera.lookAt(160, 0, 20)
        // this.origin.add(camera)
      
        this.fileLoader('ufo_edit_fudailshajahan.glb', 0.6) //Загрузка тарелки
    
    }

    registerScene(scene){
        this.scene = scene

    }

    registerControllers(itemLeft,itemRight){
        this.leftController = itemLeft;
        this.rightController = itemRight;

    }
    
    fileLoader(fileName,objScale){
        
        let ufo;
        let origin = this.origin
    
        const loader = new GLTFLoader();
        loader.setPath(this.assetPath);
      
        loader.load(fileName, function(object){
            
            object.scene.traverse(function(child){

                if (child.isMesh){

                    child.castShadow = true;
                    //child.receiveShadow = true;
                    }

            })
            
            ufo = object.scene;
                
            //---------------------------------------------------------- Main Spot Light--------------//
            const spotLight = new THREE.SpotLight( 0xffffff, 1 );
            spotLight.angle = 0.16;
            spotLight.penumbra = 0.7;
            spotLight.decay = 2;
            spotLight.rotation.x = Math.PI/2
        
            const targetObject = new THREE.Object3D(); // Targer for spot light
            targetObject.position.y = -1;
            ufo.add(targetObject);
        
            spotLight.target = targetObject;
        
            ufo.add(spotLight)
            //---------------------------------------------------------- CONE------------//
            const geometry = new THREE.ConeGeometry( 1, 5, 32 );
        
            const material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
            material.transparent = true
            material.opacity = 0.1
            const cone = new THREE.Mesh( geometry, material );
            cone.position.y = -2
            ufo.add( cone );
        
            //-------------------------------------------------- Point Light---------------//
        
            // const pLight = new THREE.PointLight( 0xaa0000, 2, 20 );
            // pLight.position.set( 0, -1, 0 );
            // venus.add( pLight );
            
            //------------------------------------------------------------------------------//
        
            origin.add(ufo);
            ufo.scale.set(objScale, objScale, objScale)
            ufo.position.y = 2
        
        }, function(xhr){console.log((xhr.loaded/xhr.total*100)+'% loaded')});
        
      
    }
    
    updateCharacter(area = 200){
    
        // if(group.position.x >== area && (group.position.x >== area)){} // Ограничение движения в одной области
        this.origin.position.x += Math.sin(this.origin.rotation.y) * + this.rightController.get().y/4; // Движение вперёд
        this.origin.position.z += Math.cos(this.origin.rotation.y) * + this.rightController.get().y/4;
    
        this.origin.position.x += Math.sin(this.origin.rotation.y + Math.PI / 2) * +this.leftController.get().x/4;
        this.origin.position.z += Math.cos(this.origin.rotation.y + Math.PI / 2) * +this.leftController.get().x/4;
    
        this.origin.rotation.y -= +this.rightController.get().x/100; // Разворот
    
        this.origin.children[0].rotation.x = this.rightController.get().y/3  // Наклон вперед
    
        this.origin.children[0].rotation.y = +this.rightController.get().x/4*-1
        this.origin.children[0].rotation.z = +this.rightController.get().x/5*-1 + +this.leftController.get().x/5*-1 //Наклон в бок
    
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