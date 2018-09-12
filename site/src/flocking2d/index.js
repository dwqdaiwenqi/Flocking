// import React,{Component} from 'react'
// import {render} from 'react-dom'

// import cax from 'cax'

// import Bird from './bird'
// import Vector from './vector'

// export default class Flocking2d extends Component{
//   constructor(props){
//     super(props)
//   }
//   render(){
//     return(
//       <section ref="container" className="flocking-2d">

//       </section>
//     )
//   }
//   componentWillUnmount(){
//     cax.untick(this.tick)
//   }
//   componentDidMount(){

//     var stage = new cax.Stage(document.body.offsetWidth,document.body.offsetHeight,'.flocking-2d')
//     var rd = Math.random

//     var birds = Array.from({length:100},(v,i)=>{
//       var bird = new Bird()
//       stage.add(bird)
      
//       Object.assign(bird,{
//         po: new Vector(stage.width*rd(),stage.height*rd())
//         ,ve: new Vector(rd() * 20 - 10, rd() * 20 - 10)
//         ,ac: new Vector()
//         ,mass: 1
//       }) 
//       return bird
//     })


//     this.tick = cax.tick(()=>{
//       stage.update()
//       birds.forEach(b=>b.update(stage,birds))
//     })
  
   
//   }
// }


import cax from 'cax'

import Bird from './bird'
import Vector from './vector'

export default {
  ex($stage){
    this.run = true

    if(this.once) return
    if(!this.once) this.once = true
    
    // debugger
    var stage = new cax.Stage($stage.offsetWidth,$stage.offsetHeight,$stage)
    var rd = Math.random

    var birds = Array.from({length:70},(v,i)=>{
      var bird = new Bird()
      stage.add(bird)
      
      Object.assign(bird,{
        po: new Vector(stage.width*rd(),stage.height*rd())
        ,ve: new Vector(rd() * 20 - 10, rd() * 20 - 10)
        ,ac: new Vector()
        ,mass: 1
      }) 
      return bird
    })

    this.tick = cax.tick(()=>{
      if(!this.run) return

      stage.update()
      birds.forEach(b=>b.update(stage,birds))
    })
  }
  ,cancel(){
    this.run = false
  }
  ,run: false
  ,once: false
}
