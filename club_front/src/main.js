// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router/index.js'


import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)

import VueBus from './vue-bus'
Vue.use(VueBus)

Vue.config.productionTip = false

import moment from 'moment'
Vue.use(moment)


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

//检查是否有用户登录，若无登录用户则跳转登录页面
router.beforeEach((to,from,next)=>{
  if(to.path != '/login')
  {
    if(checkToken()){
      next()
    }
    else {
      next('login');
    }
  }
})
function checkToken(){
  if(localStorage.getItem('token') !== null){
    console.log(localStorage.getItem('token')+"is not null")
    return true
  }else{
    return false
  }
}

