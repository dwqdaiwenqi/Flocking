import cax from 'cax'
import './main.less'
import Flocking from './flocking'

var {offsetWidth,offsetHeight} = document.body
var stage = new cax.Stage(offsetWidth,offsetHeight,'body')

var flocking = Flocking(stage)

cax.tick(()=>{
  stage.update()
  flocking.update(stage)
  // debugger
})