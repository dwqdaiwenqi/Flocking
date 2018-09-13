
import React,{Component} from 'react'
import {render} from 'react-dom'
import{Router,Route,Link,withRouter,hashHistory,IndexRoute } from 'react-router'
import cax from 'cax'
import Flocking2d from './flocking2d/'
import Flocking3d from './flocking3d/'

// import Bird from './flocking2d/bird'
// import Vector from './flocking2d/vector'

import './main.less'
// Flocking2d
// debugger
// Route;
// Router;
// hashHistory;

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
          {/* {this.props.children} */}
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
    //console.log('will update!')
  }
  componentDidUpdate(){
    //console.log('di update!',this.props.params)
  }
  componentDidMount(){
    // this.props
    // debugger
    //console.log('did mount!')
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
//少拥抱document.write
///---基本吐槽
//document.write的名声好像一直不是很好，也许是它经常出现在初学者教程中，也可能是劫持文件中经常会上用这东西，确实我也很排斥用document.write。
//不过呢，无论它的长相多难看，它确实能解决同步加载问题，比如下面创建一个script，然后appendChild到dom中
///---简单用法
//```js
//```js
//发现并不会因为appendChild而使程序陷入等待
//接下来使用document.write在页面中塞入一个script
//```js
//```js
//发现程序按理想的顺序执行了，document.write会使程序陷入等待，先输出a，再输出b，
///---具体解决哪些问题
//利用它这特性就能解决一些场景下的问题
////比如需要按照平台相关的代码来同步加载代码
//```js
//```js
////还有为了按需加载那些不支持某些特性浏览器的polyfill，需要做兼容检测
//```js
//```js
////总之它能够解决带条件的同步资源加载问题
///----它的代替方案和不足处
//但，如果插入的script的src是跨域的，如下警告
//[img]
//在网络很差的情况下，这种document.write塞入的跨域script会被chrome无视掉的，所以document.write的淘汰是个趋势
//不过是有一些代替的解决方案的：
//chrome是对document.write的跨域script做处理，所以可以不使用cdn
//插入代码的检测逻辑服务器来判断
// 平台相关的代码由服务器端检测ua来输入script到html中
// polyfill的代码同样也是由服务器获取到ua，再用ua根据一个浏览器特性支持列表，来决定加载哪些polyfill。如果需要加载，那么往页面中输入script
//构建多个页面
//针对需要在多个环境下存在的页面可以构建出多个，可根据不同环境给到页面。也可构建出一个通用的页面，根据当前的环境跳到具体的页面

//document.write的代替方案是有的，而且它的退出是个趋势，我们应该积极使用其他方案代替，少拥抱document.write




// APP
// debugger

render(
  <Router history={hashHistory}>
    <Route path="/(:mod)" component={APP}>
      <IndexRoute component={APP}/>
    </Route>
  </Router>
  ,document.querySelector('#app')
)