
import * as THREE from 'three'
import OrbitControls from './OrbitControls'
import Bird from './bird'
THREE.OrbitControls = OrbitControls

export default {
  ex($stage){
    this.run = true

    if(this.once) return
    if(!this.once) this.once = true


    let scene = new THREE.Scene()
    let camera = new THREE.PerspectiveCamera(45,$stage.offsetWidth/$stage.offsetHeight,.1,10000)
    let renderer = new THREE.WebGLRenderer()
    scene.fog = new THREE.FogExp2(0xcccccc, 0.0027);
    renderer.setClearColor(scene.fog.color)
    renderer.setSize($stage.offsetWidth, $stage.offsetHeight)
    $stage.appendChild(renderer.domElement);

    this.camera = camera
    this.renderer = renderer

    // renderer
    // debugger

    let hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6)
    hemiLight.color.setHSL(0.6, 1, 0.6)
    hemiLight.groundColor.setHSL(0.095, 1, 0.75)
    hemiLight.position.set(0, 50, 0)
    scene.add(hemiLight)

    let dirLight = new THREE.DirectionalLight(0xffffff, 1)
    dirLight.color.setHSL(0.1, 1, 0.95)
    dirLight.position.set(-1, 1.75, 1)
    dirLight.position.multiplyScalar(30)
    scene.add(dirLight)
    dirLight.castShadow = true
    dirLight.shadow.mapSize.width = 2048
    dirLight.shadow.mapSize.height = 2048
    let d = 50
    dirLight.shadow.camera.left = -d
    dirLight.shadow.camera.right = d
    dirLight.shadow.camera.top = d
    dirLight.shadow.camera.bottom = -d
    dirLight.shadow.camera.far = 3500
    dirLight.shadow.bias = -0.0001

    //clampLength
    // debugger
    camera.position.copy(new THREE.Vector3(0,0,.1))
    camera.lookAt(new THREE.Vector3(0,0,0))

    let controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.update()

    this.controls = controls

    let constrain_spe = new THREE.Mesh(
      new THREE.SphereGeometry(700,50,50)
      ,new THREE.MeshBasicMaterial({
        color:new THREE.Color().setRGB(0,0,0), wireframe:true 
        ,side : THREE.DoubleSide
      })
    ) 
    scene.add(constrain_spe)

    constrain_spe.position.set(0,0,0)

    let random = Math.random;


    var target = new THREE.Vector3(0,0,-300)



    let boids = [...Array(100)].map(()=>{
      let boid = new Bird()
      let l = 1
      boid.ac = new THREE.Vector3()
      boid.ve = new THREE.Vector3(l-random()*l*2,l-random()*l*2,l-random()*l*2)
      boid.position.copy(new THREE.Vector3(100-random()*200,0,-100))

      boid.target = target.clone()
      
      scene.add(boid)
      return boid
    })

    var p = 2,q = 5;

    var that = this;

    requestAnimationFrame(function animate(){

      requestAnimationFrame(animate)

      if(!that.run) return

      renderer.render(scene,that.camera)

      var t = Date.now()*.0001;

      var target = new THREE.Vector3(
        (2 + Math.cos(q * t)) * Math.cos(p * t)
        ,(2 + Math.cos(q * t)) * Math.sin(p * t)
        ,Math.sin(q * t)
      ).multiplyScalar(renderer.domElement.width*.1).add(new THREE.Vector3(0,0,-200))

      boids.forEach((boid)=>{

        boid.target = target.clone()

        boid.update(boids)
        
      })

      if(that.tracking_){
        camera.position.copy(new THREE.Vector3(0, -100,0).applyMatrix4(boids[10].matrixWorld))

        camera.lookAt(boids[10].position)
      }

    })
    
  }
  ,cancel(){
    this.run = false
  }
  ,set tracking(v){

    this.tracking_ = v
    if(!v){
      this.controls.reset()
      this.controls.update()
    }
  }
  ,get tracking(){
    return this.tracking_
  }
  ,tracking_: false
  ,run: false
  ,once: false
}
