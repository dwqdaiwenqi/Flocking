import cax from 'cax'
import './main.less'
import Flocking from './flocking'


var stage = new cax.Stage(document.body.offsetWidth,document.body.offsetHeight,'body')

var flocking = Flocking(stage)

cax.tick(()=>{
  stage.update()
  flocking.update(stage)
  // debugger
})