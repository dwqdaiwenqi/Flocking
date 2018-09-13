import * as THREE from 'three'

export default class Bird extends THREE.Group{

  static MAX_SPEED = 5/1.2
  static MAX_FORCE = .1
  static sepDist = 50
  static cohDist = 100
  static aliDist = 70
  constructor(geo=new THREE.ConeGeometry( 3, 10, 3 )){
    super()

    //18,80,60


    this.ac = new THREE.Vector3()
    this.ve = new THREE.Vector3()
    this.rot = new THREE.Euler()

    // var geometry = new THREE.ConeGeometry( 5, 20, 32 );
    // ConeGeometry(radius, height, radiusSegments, heightSegments, openEnded, thetaStart, thetaLength)
    this.el = new THREE.Mesh(
      geo
      ,new THREE.MeshLambertMaterial({
        color:new THREE.Color().setHSL(Math.random() * 0.7, 0.75, 0.75)
      })
    )
    this.add(this.el)
    
    this.sharkFlag = false

  }
  update(boids){

    // separation
    // alignment
    // cohesion

    {

      for(let i = 0; i < boids.length; i++){

        let dist = this.position.distanceTo(boids[i].position)
        // debugger
        if(dist > .0001 && dist < Bird.sepDist*.5 && boids[i]!=this) {
  
          this.ac.sub(
            boids[i].position.clone().sub(this.position).normalize()
            .multiplyScalar(Bird.MAX_SPEED)
            .sub(this.ve).multiplyScalar(1)
          )

        }

      }
    }


    {

      let count = 0;
      let sum = new THREE.Vector3()
      
      for(let i = 0; i < boids.length; i++){
        let dist = this.position.distanceTo(  boids[i].position)
        if(dist > .0001 && dist < Bird.aliDist && boids[i]!=this) {
          sum.add(boids[i].ve)
          ++count
        }
      }

      if(count > 0) {
        sum.divideScalar(count).normalize()
        sum.multiplyScalar(Bird.MAX_SPEED)
        this.ac.add(sum.sub(this.ve))
      } 

    }
    
    {

      let count = 0;
      let sum = new THREE.Vector3(0);
      
      for(let i = 0; i < boids.length; i++){
        let dist = this.position.distanceTo(boids[i].position)
        
        let d = this.sharkFlag?Bird.coDist*1:Bird.coDist*2
        if(dist > .0001 && dist < d && boids[i]!=this) {
        
          sum.add(boids[i].position);
          ++count
        }
          
      }
     
      if(count > 0) {
        
        sum.divideScalar(count);

        this.ac.add(
          sum.clone().sub(this.position).normalize()
          .multiplyScalar(Bird.MAX_SPEED)
          .sub(this.ve).multiplyScalar(1)
        )
      }
      
    }

    this.ac.clampLength(.01,Bird.MAX_FORCE)
    this.ve.clampLength(.01,Bird.MAX_SPEED)
   
    this.ve.add(this.ac)
    this.position.add(this.ve)


    this.ac.add(
      this.target.clone().sub(this.position).normalize()
      .multiplyScalar(Bird.MAX_SPEED)
      .sub(this.ve).multiplyScalar(1)
    )

    this.rot.setFromQuaternion(
      new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(this.ve.x, this.ve.y, this.ve.z).normalize())
    )

    this.rotation.x = this.rot.x
    this.rotation.y = this.rot.y
    this.rotation.z = this.rot.z
  }
}