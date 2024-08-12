import { createRouter, createWebHistory } from 'vue-router'
import Browse from '../views/Browse.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
    path: '/',
    name: 'Browse', // make the default view 'browse'
    component: Browse
  },
  {
    path: '/login',
    name: 'Log In',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import('../views/LogIn.vue')
  },
  {
    path: '/lists/:id?',
    props: true,
    name: 'List',
    component: () => import('../views/List.vue')
  },
  {
    path: '/cocktail/:id',
    props: true,
    name: 'Cocktail',
    component: () =>
      import('../views/Cocktail.vue')
  },
  ]
})

export default router
