import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class ScatterLOD {
    constructor (assetPath,link, scale, count=1, area=10, material=''){

        this.link = link;
        this.scale = scale;
        this.count = count;
        this.area = area
        this.material = material;
        this.scene ='';

        this.assetPath = assetPath;
        this.positions = [];
    }

    // Генерирует массив рандомных векторов позиций
    init(){
        for (let i = 0; i < this.count; i++) {
            
            this.positions.push({
                x: Math.random() * this.area - this.area/2,
                y: 0,
                z: Math.random() * this.area - this.area/2
            })
        }
        console.log(this.posGen(10))
    }


    registerScene(scene){
        this.scene = scene
        this.init();
    }

    // Генерирует ЛОДы составленные из примитивов, для наглядной демонстрации работы ЛОДов
    generateSimple(){  

        const geometryBox = new THREE.BoxGeometry( 1, 2, 1 );
        const geometryCone = new THREE.ConeGeometry( 1, 2, 16 );
        const geometrySphere = new THREE.IcosahedronGeometry( 1, 3 )

        const materialBox = new THREE.MeshBasicMaterial( {color: 0x0fff00} );
        const materialCone = new THREE.MeshBasicMaterial( {color: 0xff0000} );
        const materialSphere = new THREE.MeshBasicMaterial( {color: 0x0000ff} );

        const mapSprite = new THREE.TextureLoader().load( this.assetPath + 'textures/food-lemon.png' );
        const materialSprite = new THREE.SpriteMaterial( { map: mapSprite } );

        const cube = new THREE.Mesh( geometryBox, materialBox );
        const cone = new THREE.Mesh( geometryCone, materialCone );
        const sphere = new THREE.Mesh( geometrySphere, materialSphere );


        this.positions.forEach((item)=>{

            const lod = new THREE.LOD()
            let meshLod

            const sprite = new THREE.Sprite( materialSprite );

            meshLod = sphere.clone()
            // meshLod.updateMatrix();
			// meshLod.matrixAutoUpdate = false;
            meshLod.scale.set(this.scale, this.scale, this.scale)
            lod.addLevel( meshLod, 10 );

            meshLod = cone.clone()
            meshLod.scale.set(this.scale, this.scale, this.scale)
            lod.addLevel( meshLod, 35 );

            meshLod = sprite.clone()
            meshLod.scale.set(this.scale*3, this.scale*3, this.scale*3)
            lod.addLevel( meshLod, 50);

            lod.position.copy(item)
            this.scene.add( lod );
 
        })
        
            
    }

    // Основной генератор ЛОДов с асинхронной загрузкой файлов
    async generateDimple(){

        let highDetail, midleDetail, lowDetail

        // await this.fileLoader2('pine_tree_triple_no_tank_ver2.glb').then((item)=>{ console.log(this.addProperties(item)) })

        await this.fileLoader2('pine_tree_triple_no_tank_ver2.glb')
        .then((item)=>{ highDetail = this.addProperties(item).scene })

        await this.fileLoader2('pine_tree_triple_no_tank_MIDLE_ver2.glb')
        .then((item)=>{ midleDetail = this.addProperties(item).scene })

        await this.fileLoader2('pine_tree_triple_no_tank_LOW_ver2.glb')
        .then((item)=>{ lowDetail = this.addProperties(item).scene })

        await this.positioner(highDetail, midleDetail, lowDetail)
    }

    async positioner (highDetail, midleDetail, lowDetail) {
        this.positions.forEach((item)=>{

            const lod = new THREE.LOD()
            let meshLod

            const mapSprite = new THREE.TextureLoader().load(this.assetPath + 'textures/pine_sprite_ver3.png' );
            const materialSprite = new THREE.SpriteMaterial( { map: mapSprite } );
            const sprite = new THREE.Sprite( materialSprite );

            meshLod = highDetail.clone()
            meshLod.scale.set(this.scale, this.scale, this.scale)
            lod.addLevel( meshLod, 15 );

            meshLod = midleDetail.clone()
            meshLod.scale.set(this.scale, this.scale, this.scale)
            lod.addLevel( meshLod, 35 );

            meshLod = lowDetail.clone()
            meshLod.scale.set(this.scale, this.scale, this.scale)
            lod.addLevel( meshLod, 80 );

            meshLod = sprite.clone()
            meshLod.scale.set(this.scale*4, this.scale*4, this.scale*4)
            lod.addLevel( meshLod, 130);

            lod.position.copy(item)
            lod.rotation.y = Math.random() * 3
            let scaleLod = Math.random() * 1.6 + 0.4
            lod.scale.set(scaleLod,scaleLod,scaleLod)

            this.scene.add( lod );
        })
    }

    // Загружает файл
    async fileLoader2(url){
        const loader = new GLTFLoader();
        loader.setPath(this.assetPath);
        return loader.loadAsync(url);
    }

    addProperties (object) {
        object.scene.traverse(function(child){
            if (child.isMesh){  
                child.castShadow = true;
                //child.receiveShadow = true;
                // if(material){
                //     child.material = this.material
                // }
            }
        })
        return object
    }

    // Position Generator
    posGen (count) {
        const positions =[]; 
        const raycaster = new THREE.Raycaster();

        let rayOrigin = new THREE.Vector3(0, 0, 5)
        let rayDirection = new THREE.Vector3(0, 0, -1)
        raycaster.set(rayOrigin, rayDirection)
        raycaster.far = 20

        // calculate objects intersecting the picking ray
	    const intersects = raycaster.intersectObjects( this.scene.children, false );
        let INTERSECTED;

        if ( intersects.length > 0 ) {
            if ( INTERSECTED != intersects[ 0 ].object ) {
                // if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
                INTERSECTED = intersects[ 0 ];
                console.log(INTERSECTED.object)
                console.log(INTERSECTED.point)
                // INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
                // INTERSECTED.material.emissive.setHex( 0xff0000 );
            }
        } else {
            // if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
            INTERSECTED = null;
        }

        for( let i = 0; i < count; i ++ ){
            const itemPosition = new THREE.Vector3();

            itemPosition.x = Math.random() * 20+1;
            itemPosition.y = Math.random() * 20+1;
            itemPosition.z = Math.random() * 20+1;

            positions.push(itemPosition)
        }
        return positions;
    }

}
 