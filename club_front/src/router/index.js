import Vue from 'vue'
import Router from 'vue-router'
import Leader from '../view/leader/Leader'
import Admin from '../view/admin/Admin.vue'
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
    }
  ]
})
