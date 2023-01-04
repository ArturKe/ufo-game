import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class ScatterInstance {

    constructor (link,scale,count=1,material=''){

        this.link = link;
        this.scale = scale;
        this.count = count;
        this.material = material;
        this.scene ='';

        this.assetPath = './assets/';
        this.positions = [];
        this.init();

    }

    clean() {

        const meshes = [];
    
        scene.traverse( function ( object ) {
    
            if ( object.isMesh ) meshes.push( object );
    
        } );
    
        for ( let i = 0; i < meshes.length; i ++ ) {
    
            const mesh = meshes[ i ];
            mesh.material.dispose();
            mesh.geometry.dispose();
    
            scene.remove( mesh );
        }
    
    }

    instLoader(link,scale,count,distance,material){

        const loader = new GLTFLoader();
        loader.setPath(assetPath);
    
        loader.load(link, function(object){
            object.scene.traverse(function(child){
    
                if (child.isMesh){ 
    
                    child.castShadow = true;
                    child.receiveShadow = true;
    
                    if(material){
                        child.material = material
                    }
    
                    const matrix = new THREE.Matrix4();
                    const instancedMesh = new THREE.InstancedMesh(child.geometry, child.material, count);
                    
                    for ( let i = 0; i < count; i ++ ) {
    
                        //randomizeMatrix( matrix );
                        matrix.copy(this.randomizeMatrix_ver2({area:distance, scale: scale, scaleDivider:2}));
                        instancedMesh.setMatrixAt( i, matrix );
        
                    }
    
                    scene.add(instancedMesh);
                    console.log(instancedMesh)
                                    
                    }
              })
            
        });
    
    }

    randomizeMatrix = function () {

        const position = new THREE.Vector3();
        const rotation = new THREE.Euler();
        const quaternion = new THREE.Quaternion();
        const scale = new THREE.Vector3();
    
        return function ( matrix ) {
    
            position.x = Math.random() * 40 - 20;
            position.y = Math.random() * 40;
            position.z = Math.random() * 40 - 20;
    
            rotation.x = Math.random() * 2 * Math.PI;
            rotation.y = Math.random() * 2 * Math.PI;
            rotation.z = Math.random() * 2 * Math.PI;
    
            quaternion.setFromEuler( rotation );
    
            scale.x = scale.y = scale.z = Math.random() * 1;
    
            matrix.compose( position, quaternion, scale );
    
        };
    
    }();

    randomizeMatrix_ver2(params) {

        const defaultParams = {area:10, scale:1, scaleDivider:1};
        params ={...defaultParams, ...params};
    
        const matrix = new THREE.Matrix4();
        const position = new THREE.Vector3();
        const rotation = new THREE.Euler();
        const quaternion = new THREE.Quaternion();
        const scale = new THREE.Vector3();
        
        position.x = Math.random() * params.area - params.area/2;
        // position.y = Math.random() * params.area;
        position.z = Math.random() * params.area - params.area/2;
    
        // rotation.x = Math.random() * 2 * Math.PI;
        rotation.y = Math.random() * 2 * Math.PI;
        // rotation.z = Math.random() * 2 * Math.PI;
    
        quaternion.setFromEuler( rotation );
    
        if(params.scaleDivider>1){
            scale.x = scale.y = scale.z = Math.random() * params.scale+params.scale/params.scaleDivider;
        } else {
            scale.x = scale.y = scale.z = params.scale
        }
    
        matrix.compose( position, quaternion, scale );
    
        return matrix;
    
    
    }




}