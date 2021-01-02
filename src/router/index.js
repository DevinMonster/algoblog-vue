import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Index',
    component: () => import('../views/Blogs.vue')
  },
  {
    path: '/blogs',
    name: 'Blogs',
    component: () => import('../views/Blogs.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue')
  },
  {
    path: '/blog/add',
    name: 'Add',
    component: () => import('../views/Edit.vue'),
    meta: {
      requireAuth: true
    },
  },
  {
    path: '/blog/:blogId',
    name: 'BlogDetail',
    component: () => import('../views/BlogDetail.vue'),
    meta: {
      requireAuth: true
    },
  },
  {
    path: '/blog/:blogId/edit',
    name: 'Edit',
    component: () => import('../views/Edit.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
