import { createRouter, createWebHistory } from 'vue-router';
import Browse from '../views/Browse.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
    path: '/cocktails',
    alias: '/', // make the default view 'browse'
    name: 'Browse',
    component: Browse
  },
  {
    path: '/bars/:id?',
    props: true,
    name: 'Bar',
    component: () => import('../views/Bar.vue')
  },
  {
    path: '/lists/:id?',
    props: true,
    name: 'List',
    component: () => import('../views/List.vue')
  },
    {
    path: '/data',
    name: 'Data',
    component: () => import('../views/Data.vue')
  },
  {
    path: '/login',
    name: 'Log In',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/cocktails/:id',
    props: true,
    name: 'Cocktail',
    component: () => import('../views/Cocktail.vue')
  },
  // {
  //   path: '/:pathMatch(.*)*',
  //   component: () => import('../views/Login.vue')
  // }
  ]
});

export default router;
