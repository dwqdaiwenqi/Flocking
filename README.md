# javascript模拟鸟群使用cax和threejs渲染引擎

本文会使用前端技术来模拟2d和3d鸟群，我选用canvas元素绘制，当然也可以使用css3或者svg。

整个实现 [这儿](https://dwqdaiwenqi.github.io/flocking-tutorial/site)

2d的渲染引擎我选择cax，cax是一款我非常喜欢的渲染引擎，支持小程序、小游戏以及 Web 浏览器渲染。用它既能开发小游戏也能开发图表（见wechart），强力推荐！

3d的渲染我选用threejs ~

### 2d鸟群  ↓
[2d demo](https://dwqdaiwenqi.github.io/flocking-tutorial/site#/2d)

这些鸟并不是在漫无目的的乱飞，它们看上去都拥有了智商，形成了群体，产生了复杂的群组运动效果

这看上去复杂的行为是一种复合行为，通常会拆分为下面几种

#### 分离（separation）
首先对象们要尽量不能与周围的对象相互碰撞，它们彼此不能离的太近，需要给自己留出一个小空间


#### 内聚（cohesion）
也不能和周围对象们离的太远了，太远会被拉回来

#### 排队（alignment）
它们飞行的方向也不能太乱，大体上都会往一个方向上飞，每个对象都会归到一队伍中

这三个特性分离、内聚、排队组合起来，就会得到飞车逼真的鸟群（群体）

考虑到鸟群的复杂行为，我们不必知道鸟群的整体智慧。每只鸟只需要对它范围内的其他鸟运用那三个特性，自然而然的形成群落。来看下面的代码，代码没做太多优化，将就着看：

创建鸟们，添加到场景中
```js
var birds = Array.from({length:60},(v,i)=>{
  var bird = new Bird()
  stage.add(bird)

  Object.assign(bird,{
    po: new Vector(stage.width*rd(),stage.height*rd())
    ,ve: new Vector(rd() * 20 - 10, rd() * 20 - 10)
    ,ac: new Vector()
  }) 
  return bird
})

this.tick = cax.tick(()=>{
  stage.update()
  birds.forEach(b=>b.update(stage,birds))
})
```
关键update方法
```js
update(birds){
 // 忽略自己
 birds = birds.filter(o=>this!=o)
 
 // separation
 for(let bird of birds){
   // 过于接近
   if(this.po.distanceTo(bird.po) < Bird.sDist){
     // 减去这个转向力，实现分离
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
   // 先求得平均位置，用平均位置求得期望的目标速度，把算出的转向力累积到加速度上
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
  // 先求得平均速度，用平均速度求得期望的目标速度，把算出的转向力累积到加速度上
   this.ac.add(
     alignment.sum.divideScalar(alignment.count).normalize()
     .multiplyScalar(Bird.MAX_SPEED)
     .sub(this.ve) 
   )
 }
 // 不超过最大转向力和速度
 if(this.ac.length > Bird.MAX_FORCE) this.ac.normalize().multiplyScalar(Bird.MAX_FORCE)
 if(this.ve.length > Bird.MAX_SPEED) this.ve.normalize().multiplyScalar(Bird.MAX_SPEED)
 
 // 让质量大的鸟慢下来
 this.ve.add(this.ac.divideScalar(this.mass))
 this.po.add(this.ve) 
 
 // ...
  
}
 
```
就是先忽略到自己，如果搜寻了那些过于接近的鸟，则把计算出的转向力累加到加速度上。注意的是，对于过于接近的判断其实还有个附加条件，就是在视场内。上面的代码并没有加上这个条件，不过也能模拟的较好，我就没写=w=，鸟的视场通常是180度的，是否在180度内，满足的是 ` this.ve.dot(this.po.sub(bird.po)) < 0 `

我们还可以叠加多层的信息生成更复杂的模拟。这里的鸟都是一类鸟，可以添加一个老鹰对象，如果小鸟和老鹰的距离超过了一定阈值小鸟就会立马逃跑。要模拟这种情况，只要再添加一种逃离的行为到整个系统中，这种行为还会导致小鸟的总转向力，速度全部上升。

### 3d鸟群 ↓
3d的实现和2d其实原理类似，唯一要注意的地方就是对象需要往目标方向的转向问题，这通常会使用四元数来进行处理，代码关键就是：
` this.rot.setFromQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(this.ve.x, this.ve.y, this.ve.z).normalize()))`

[3d demo](https://dwqdaiwenqi.github.io/flocking-tutorial/site#/3d)


## 参考
* http://www.red3d.com/cwr/boids/





