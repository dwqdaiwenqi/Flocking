import Bird from './bird'
import Vector from './vector'

// debugger
export default function Flocking(stage){
  Flocking = {
    update(){
      for(let bird of this.birds) bird.update(stage, this.birds)
      
    }
    ,birds: []
    ,initial(){
      var rd = Math.random
      this.birds = Array.from({length:70},(v,i)=>{
        var bird = new Bird()
        stage.add(bird)
        //bird.po =
        Object.assign(bird,{
          po: new Vector(stage.width*rd(),stage.height*rd())
          ,ve: new Vector(Math.random() * 20 - 10, Math.random() * 20 - 10)
          ,ac: new Vector()
          ,mass: 1
        }) 

        return bird
      })
    }
  }
  Flocking.initial()
  return Flocking
}