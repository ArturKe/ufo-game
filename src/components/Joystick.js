export class Joystick {
    constructor(target, jPosition = {top: null, right: null, bottom: null, left:null}, jSize = 150, stickSize = 70){
        this.className = target;
        this.joystickPosition = jPosition
        this.state = {};
        this.x = 0;
        this.y = 0;
        this.joystikSize = jSize;
        this.stickSize = stickSize;

        this.joystickStyleColor = 'red'
        this.isActiveStyleColor = 'white'
        this.styleButton = `style="height: 20px; width: 100px "`
        this.styleStick = `style="position:absolute; height: ${this.stickSize}px; width: ${this.stickSize}px; background: ${this.joystickStyleColor}; left:${this.joystikSize/2-this.stickSize/2}px; top:${this.joystikSize/2-this.stickSize/2}px;  border: 2px red solid; border-radius: 21px; box-sizing: border-box;"`
        this.styleJoystick = `style="display:block; position:absolute; bottom:${this.joystickPosition.bottom}px; right:${this.joystickPosition.right}px; left:${this.joystickPosition.left}px;height: ${this.joystikSize}px; width: ${this.joystikSize}px;  display: flex; justify-content: center; align-items: center; background: #b3b3b34d; border: 2px red solid; border-radius: 24px"`
        

        this.classJoystick =  this.generateClassName('joystick')  //'joystick'
        this.classButton = this.generateClassName('joystick_button')//'joystick_button'
        this.classStick = this.generateClassName('joystick_stick')//'joystick_stick'
        this.isPressed = false;
        
        this.initDraw()
        this.bindEventsMouse()
        this.bindEventsTouch()
        
    }

    initDraw(){
        let template = `
        <div class="${this.classJoystick}" ${this.styleJoystick} >
        
        <div class="${this.classStick}"  ${this.styleStick}></div>
        </div>`
        document.querySelector(this.className).insertAdjacentHTML('afterend', template);
        
        // <button ${this.styleButton} class="${this.classButton}">Rright</button>

    }

    bindEventsMouse(){
        let mouseState = {
            startX: 0,
            startY: 0,
            startOffsetX: 0,
            startOffsetY: 0,
            curentPosX: 0,
            curentPosY: 0
        }
        
        console.log('binding Mouse')
        // console.log(`.${this.classStick}`)
        // console.log(document.querySelector(`.${this.classStick}`))

        document.querySelector(`.${this.classStick}`).addEventListener('mousedown',(e)=>{
            mouseState.startX = e.clientX
            mouseState.startOffsetX = e.layerX
            mouseState.curentPosX = +document.querySelector(`.${this.classStick}`).style.left.slice(0,2)
            mouseState.startY = e.clientY
            mouseState.startOffsetY = e.layerY
            mouseState.curentPosY = +document.querySelector(`.${this.classStick}`).style.top.slice(0,2)

            console.log("Pressed Mouse")
            console.log(mouseState.StartX)
            // console.log(e)
            // this.x++
            this.styleChange(e,true)
            this.isPressed = true
        })

        document.querySelector(`.${this.classStick}`).addEventListener('mouseup',(e)=>{
            console.log("Released Mouse")
            this.isPressed = false
            this.resetStickPosition()
            this.x = 0
            this.y = 0
            this.styleChange(e,false)
        })

        document.querySelector(`.${this.classStick}`).addEventListener('mousemove',(e)=>{
            if(this.isPressed){
                this.moveStick(e, mouseState, false)

            }
            
           
        })
    }

    bindEventsTouch(){
        let mouseState = {
            startX: 0,
            startY: 0,
            startOffsetX: 0,
            startOffsetY: 0,
            curentPosX: 0,
            curentPosY: 0,
            touchIndex: 0
        }
        let isTouched = false
        

        
        console.log('binding Touch')
        // console.log(`.${this.classStick}`)

        document.querySelector(`.${this.classStick}`).addEventListener('touchstart',(e)=>{

            // if(!isTouched){}
            
            if(e.target.classList.value === this.classStick){ //проверка на свое срабатывание

                if(e.touches.length > 1){
                    for(let i=0; i < e.touches.length; i++){
                            if(e.touches[i].target.classList.value === this.classStick){
                                //mouseState.touchIndex = item.identifier
                                mouseState.startX = Math.floor(e.touches[i].clientX)
                                mouseState.startY = Math.floor(e.touches[i].clientY)
                                
                            }
                        }

                } else {
                    mouseState.startX = Math.floor(e.touches[0].clientX)
                    mouseState.startY = Math.floor(e.touches[0].clientY)
                }

                mouseState.startOffsetX = 0
                mouseState.startOffsetY = 0
                mouseState.curentPosX = +document.querySelector(`.${this.classStick}`).style.left.slice(0,2)
                mouseState.curentPosY = +document.querySelector(`.${this.classStick}`).style.top.slice(0,2)

                this.styleChange(e,true)
                console.log("Pressed Touch")
    
                
                // console.log(e)
                // for(let i=0; i < 3; i++){
                //     console.log('/-------------------------/')
                //     console.log(e)
                // }
               
                // console.log(e.touches[0].target.classList.value)
                // console.log(e.touches[0].target.classList.value === this.classStick)
                // this.x++
                this.isPressed = true


            }
  
           
        })

        document.querySelector(`.${this.classStick}`).addEventListener('touchend',(e)=>{
            
            if(e.target.classList.value === this.classStick){
                console.log("Released Touch")
                this.isPressed = false
                this.resetStickPosition()
                this.x = 0
                this.y = 0

                this.styleChange(e,false)
                isTouched = false
            }

            // console.log(e.target.classList.value === this.classStick )
            // console.log('---------------------------')
        })



        document.querySelector(`.${this.classStick}`).addEventListener('touchmove',(e)=>{
            if(this.isPressed){
                e.preventDefault()
                this.moveStick(e, mouseState, true)

            }
        })
    }

    styleChange(event,state){
        if(state){
            event.target.style.background = this.isActiveStyleColor
            
        } else {
            event.target.style.background = this.joystickStyleColor
            
        }
        
    }

    moveStick(e, data, touch){
        // console.log("Moove")
        let curentX,
            curentY,
            touchCurentPosX,
            touchCurentPosY

        if(touch){
            if(e.touches.length > 1){
                for(let i=0; i < e.touches.length; i++){
                        if(e.touches[i].target.classList.value === this.classStick){
                            touchCurentPosX = Math.floor(e.touches[i].clientX)
                            touchCurentPosY = Math.floor(e.touches[i].clientY)  
                        }
                    }

            } else {
                touchCurentPosX  = Math.floor(e.touches[0].clientX)
                touchCurentPosY  = Math.floor(e.touches[0].clientY)
            }
           
        } 
        
        if(!touch){
            touchCurentPosX = e.clientX
            touchCurentPosY = e.clientY
        }
        curentX = data.curentPosX + touchCurentPosX - data.startX
        curentY = data.curentPosY + touchCurentPosY - data.startY
        // console.log('curentXx: ' + curentX)
        // console.log('curentY: ' + curentY)
        
        let remapX = this.remap(curentX,0,this.joystikSize-this.stickSize,-1,1)
        let remapY = this.remap(curentY,0,this.joystikSize-this.stickSize,-1,1)
        if(remapX >= 1){
            remapX = 1
        } else if(remapX <= -1) {
            remapX = -1}

        if(remapY >= 1){
            remapY = 1
        } else if(remapY <= -1) {
            remapY = -1}

        this.x = remapX
        this.y = remapY

        // console.log("Remap X: " + remapX.toFixed(2))
        // console.log("Remap Y: " + remapY.toFixed(2))
        // console.log("Sin X: " + Math.sin(remapX))

        if (curentX > 0 && curentX < this.joystikSize-this.stickSize){
            document.querySelector(`.${this.classStick}`).style.transition = ''
            document.querySelector(`.${this.classStick}`).style.left = `${curentX}px`
 
        }

        if(curentY > 0 && curentY < this.joystikSize-this.stickSize){
            document.querySelector(`.${this.classStick}`).style.transition = ''
            document.querySelector(`.${this.classStick}`).style.top = `${curentY}px`

        }
          

    }

    resetStickPosition(){
        let stick = document.querySelector(`.${this.classStick}`)
        stick.style.transition = 'all 0.2s'
        stick.style.left = `${this.joystikSize/2-this.stickSize/2}px`
        stick.style.top = `${this.joystikSize/2-this.stickSize/2}px`


    }

    remap(value, minIn, maxIn, minOut, maxOut){
        return (value - minIn)*(maxOut-minOut)/(maxIn-minIn)+minOut

    }


    generateClassName(className){
        let newName = className + Math.round(new Date().getTime() * (Math.random()*200+2))
        console.log("New Class Name: " + newName)
        return newName
    }


    get(){
        return {
            x : `${this.x}`,
            y : `${this.y}`
        }
    }


}

