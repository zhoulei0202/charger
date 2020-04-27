// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Config from './libs/config'

import VueAMap from 'vue-amap';
const amapKey = "3e76c35ec5bfcf88a96d81d468c87bb3";
Vue.use(VueAMap);
VueAMap.initAMapApiLoader({
  // 申请的高德key
  key: amapKey,
  // 插件集合
  plugin: ['Autocomplete', 'PlaceSearch', 'Scale', 'OverView', 'ToolBar', 'MapType', 'PolyEditor', 'Geocoder', 'Geolocation'],
  uiVersion: '1.0', // ui库版本，不配置不加载,
  v: '1.4.4'
});
Vue.prototype.config = Config;
require("./config/config.js");
Vue.config.productionTip = false
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)
import { Alert, Confirm, Toast, Loading } from 'wc-messagebox'
import 'wc-messagebox/style.css'
Vue.use(Alert)
Vue.use(Confirm)
Vue.use(Toast)
Vue.use(Loading)
//滑动插件
import VueScroller from "vue-scroller";
Vue.use(VueScroller);
import 'flexible-ty'//自适应插件
//路由拦u截
router.beforeEach((to, from, next) => {
  // debugger;
  if (to.matched.some(res => res.meta.requireAuth)) {// 判断是否需要登录权限
    if (Util.locals.get("token")) {// 判断是否登录
      let routerList = JSON.parse(Util.locals.get("menuData")).initMenuList;
      //判断是否有权限进入页面       
      if (to.matched.some(res => res.meta.Power)) {
        let power = false;
        let fromList = from.matched;
        // console.log(to,"to")
        //当前路由页面是否存在后台返回的路由列表中
        let routerList = JSON.parse(Util.locals.get("menuData"));
        (routerList.initMenuList).forEach((value, index) => {
          if (value.url == to.fullPath) {
            power = true;
          } else {
            value.oneLevelList.forEach((val, i) => {
              // if(val.url == to.fullPath){
              //     power = true;  
              // } 
              for (let i = 0; i < to.matched.length; i++) {
                if (val.url == to.matched[i].path) {
                  power = true;
                }
              }
            })
          }
        });
        if (power) {
          next()
        } else {
          next({ path: "/error/401", replace: true })
        }
      } else {
        console.log("**")
        next()
      }

      // next()
    } else {// 没登录则跳转到登录界面
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    }
  } else {
    next()
  }
});
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
