import Vue from 'vue'
import Router from 'vue-router'
import Leader from '../view/leader/Leader'
import Admin from '../view/admin/Admin.vue'
import Login from '../view/login/Login.vue'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/leader',
      name: 'Leader',
      component: Leader
    },
    {
      path: '/admin',
      name: 'Admin',
      component: Admin
    },
    {
      path:'/login',
      name:'Login',
      component:Login
    }
  ]
})
