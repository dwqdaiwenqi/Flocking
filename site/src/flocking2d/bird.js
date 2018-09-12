import cax from 'cax'
import Vector from './vector'
export default class Bird extends cax.Group{

  static MAX_SPEED = 5
  static MAX_FORCE = .1
  static sDist = 18
  static cDist = 80
  static aDist = 60

  constructor(mass=1){
    super()
    this.polygon = new cax.Graphics()
    this.polygon
    .fillStyle(`hsl(${0+Math.random()*30},75%,75%)`)
    .beginPath()
    .moveTo(10, 0)
    .lineTo(-10, 8)
    .lineTo(-10, -8)
    .lineTo(10, 0)
    .closePath()
    .fill()

    this.add(this.polygon)

    this.po = new Vector()
    this.ve = new Vector()
    this.ac = new Vector()

    this.mass = mass



  }
  update(stage, birds){

    birds = birds.filter(o=>this!=o)

    // console.log(this.alpha,this.visible,this.polygon.x,this.polygon.y)
    //console.log(this.po)
    // separation
    for(let bird of birds){
      if(this.po.distanceTo(bird.po) < Bird.sDist){

        this.ac.sub(
          bird.po.clone()
          .sub(this.po).normalize()
          .multiplyScalar(Bird.MAX_SPEED)
          .sub(this.ve)
        )
      } 
    }
      
    // cohesion
    let cohesion =  birds.reduce((param, b)=>{
      if(this.po.distanceTo(b.po) < Bird.cDist){
        param.sum.add(b.po)
        param.count++
      }
      return param
    },{sum:new Vector(),count:0,force:new Vector()})

    if(cohesion.count>0){

      this.ac.add(
        cohesion.sum.divideScalar(cohesion.count)
        .sub(this.po).normalize()
        .multiplyScalar(Bird.MAX_SPEED)
        .sub(this.ve)
      )
    }


    // alignment
    let alignment =  birds.reduce((param, b)=>{
      if(this.po.distanceTo(b.po) < Bird.aDist){
        param.sum.add(b.ve)
        param.count++
      }
      return param
    },{sum:new Vector(),count:0,force:new Vector()})

    if(alignment.count>0){
      this.ac.add(
        alignment.sum.divideScalar(alignment.count).normalize()
        .multiplyScalar(Bird.MAX_SPEED).sub(this.ve) 
      )
    }


    if(this.ac.length > Bird.MAX_FORCE) this.ac.normalize().multiplyScalar(Bird.MAX_FORCE)
    if(this.ve.length > Bird.MAX_SPEED) this.ve.normalize().multiplyScalar(Bird.MAX_SPEED)

    this.ve.add(this.ac.divideScalar(this.mass))
    this.po.add(this.ve)

    this.polygon.x = this.po.x
    this.polygon.y = this.po.y
    this.polygon.rotation = this.ve.angle/Math.PI*180
    
    if(this.po.x > stage.width){
      this.po.x = stage.width
      this.ve.x *= -1
    } else if(this.po.x < 0){
      this.po.x = 0
      this.ve.x *= -1
    }
    
    if(this.po.y > stage.height){
      this.po.y = stage.height
      this.ve.y *= -1

    } else if(this.po.y < 0){
      this.po.y = 0
      this.ve.y *= -1
    }

  }
}
