import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class Scatter {
    constructor (assetPath,link,scale,count=1,material=''){
        this.link = link;
        this.scale = scale;
        this.count = count;
        this.material = material;
        this.scene ='';

        this.assetPath = assetPath;
        this.positions = [];
        this.init();

    }

    init(){  // Generate positions

        for (let i = 0; i < this.count; i++) {
            this.positions.push({
                x: Math.random() * 100 - 50,
                y: 0,
                z: Math.random() * 100 - 50
            })
        }

    }

    registerScene(scene){
        this.scene = scene

    }

    generate(){  // Load and generate objects
        let obj;
        let poses = this.positions;
        let scale = this.scale
        let scene = this.scene

        const loader = new GLTFLoader();
        
        loader.setPath(this.assetPath);
        loader.load(this.link, function(object){
            object.scene.traverse(function(child){
                if (child.isMesh){  
                    child.castShadow = true;
                    //child.receiveShadow = true;
                    // if(material){
                    //     child.material = this.material
                    // }
                    
                }
              })
            
            obj = object.scene;
    
            poses.forEach((item)=>{

                const mesh = obj.clone();
                mesh.position.copy(item)
                mesh.scale.set(scale, scale, scale)
                mesh.rotation.y = Math.random() * 3
                
                scene.add(mesh);
                
            })
    
        });

    }

        
        
    
       
    

}
 