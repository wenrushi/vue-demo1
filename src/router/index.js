import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Welcome from '../components/Welcome'
import Users from '../components/user/Users'
import Rights from '../components/power/rights'
import Roles from '../components/power/Roles'
import Cate from '../components/goods/Cate'
import Params from '../components/goods/Params'
import GoodsList from '../components/goods/List'
import Add from '../components/goods/Add'
import Order from '../components/order/Order'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home', 
    component: Home, 
    redirect:'/welcome',
    children: [
      {path: '/welcome', component: Welcome },
      {path: '/users',component:Users},
      {path:'/rights',component:Rights},
      {path:'/roles',component:Roles},
      {path:'/categories',component:Cate},
      {path:'/params',component:Params},
      {path:'/goods',component:GoodsList},
      {path:'/goods/add',component:Add},
      {path:'/orders',component:Order}
    ]
  },
]

const router = new VueRouter({
  routes
})

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  //to是目的地页面
  //from是出发地页面
  //next表示放行
  //  next() 放行   next('/login')强制跳转
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})



export default router
