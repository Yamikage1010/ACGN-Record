import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

export const constantRoutes = [
  {
      path: '/login',
      name: 'login',
      component: () =>
          import('../views/user/login.vue')
  },
  {
      path: '/register',
      name: 'register',
      component: () =>
          import('../views/user/register.vue')
  },
]
export const asyncRoutes = []

const router = new VueRouter({
  mode: 'hash',
  routes: asyncRoutes.concat(constantRoutes)
})
const routerPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch((error) => error);
};
export default router
