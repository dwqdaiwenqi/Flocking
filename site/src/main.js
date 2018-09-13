
import React,{Component} from 'react'
import {render} from 'react-dom'
import{Router,Route,Link,withRouter,hashHistory,IndexRoute } from 'react-router'
import cax from 'cax'
import Flocking2d from './flocking2d/'
import Flocking3d from './flocking3d/'


import './main.less'

var APP = class App extends Component{
  constructor(props){
    super(props)

    var that = this
    this.Mod = {
      '2d':{
        $stage: null
        ,ex(s){
          this.$stage = that.refs['stage-2d']
          this.$stage.style.display = 'block'
          //console.log('3d ex!')
          Flocking2d.ex(this.$stage)
        }
        ,cancel(){
          this.$stage.style.display = 'none'
          Flocking2d.cancel()
        }
      }
  
      ,'3d':{
        $stage: null
        ,ex(){
          
          this.$stage = that.refs['stage-3d']
          this.$stage.style.display = 'block'
          //console.log('3d ex!')
          Flocking3d.ex(this.$stage)
          
          //debugger
        }
        ,cancel(){
          
          this.$stage.style.display = 'none'
          Flocking3d.cancel()
        }
      }
     
    }
  }
  render(){

    return(
      <section>
        <div className="link-list">
          <Link activeClassName="active-link" to="/2d"><button>2d</button></Link>
          <Link activeClassName="active-link" to="/3d"><button>3d</button></Link>  
        </div>
        <div ref="container" className="container">
          <div ref="stage-2d" className="stage-2d"></div>
          <div ref="stage-3d" className="stage-3d">
            <div>
              <p>
                <input onClick={this.followBird.bind(this)} type="checkbox" value="tranking"/><span>follow</span>
              </p>
            </div>
          </div>
        </div>
      </section>
    )
  }
  followBird(e){
    // e.target
    // debugger
    Flocking3d.tracking = e.target.checked
  }
  routerWillLeave(nextLocation){
    // console.log(nextLocation)
    //debugger
    var mod,res

    if(res = nextLocation.pathname.match(/\/(.+)/)) mod = res[1]

    if(this.mod!=mod){
      this.Mod[this.mod].cancel()
      this.mod = mod
    }

    if(this.Mod[mod]){
      this.Mod[mod].ex('willLeave')
    }

  }
  componentWillUpdate(){
    
  }
  componentDidUpdate(){
    //console.log('di update!',this.props.params)
  }
  componentDidMount(){

    this.props.router.setRouteLeaveHook(this.props.route, this.routerWillLeave.bind(this))

    var {mod} = this.props.params
    // console.log(this.props)
    if(!mod){
      mod = '2d'
      location.hash = mod
    }

    //debugger
    this.mod = mod
    // debugger
    this.Mod[this.mod].ex()
    
  }
}

APP = withRouter(APP)
render(
  <Router history={hashHistory}>
    <Route path="/(:mod)" component={APP}>
      <IndexRoute component={APP}/>
    </Route>
  </Router>
  ,document.querySelector('#app')
)