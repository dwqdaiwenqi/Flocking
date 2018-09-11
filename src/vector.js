
// distanceTo
// add
// divideScalar
// sub
// normalize
// multiplyScalar
// length

const s = Math.sin, c = Math.cos, sqrt = Math.sqrt, pow = Math.pow, PI = Math.PI, atan2 = Math.atan2
export default class Vector{
  constructor(x=0,y=0,z=0){
    this.x = x
    this.y = y
    this.z = z
  }
  get length(){
    return sqrt(pow(this.x,2)+pow(this.y,2)+pow(this.z,2))
  }
  get angle(){
    return atan2(this.y, this.x)
  }
  distanceTo(v2){
    
    return sqrt(pow(this.x - v2.x,2) + pow(this.y-v2.y,2) + pow(this.z-v2.z,2) )
    
  }
  clone(){
    return new Vector(this.x,this.y,this.z)
  }
  add(v2){
    this.x += v2.x
    this.y += v2.y
    this.z += v2.z
    return this
  }
  sub(v2){
    this.x -= v2.x
    this.y -= v2.y
    this.z -= v2.z
    return this
  }
  divideScalar(v){
    if(v === 0) v = 1
    this.x /= v
    this.y /= v
    this.z /= v
    return this
  }
  multiplyScalar(v){
    this.x *= v
    this.y *= v
    this.z *= v
    return this
  }
  normalize(){
    // debugger
    return this.divideScalar(this.length)
  }


}