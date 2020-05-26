import Vue from 'vue'
import Router from 'vue-router'
import Admin from '../view/admin/Admin.vue'
import Login from '../view/login/Login.vue'

import Passage from '../view/leader/Passage'    //推送
import Member from '../view/leader/Member'    //成员

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/leader/member',
      name: 'Member',
      component: Member
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
    },
    {
      path:'/leader/passage',
      name:'Passage',
      component:Passage
    }
  ]
})
