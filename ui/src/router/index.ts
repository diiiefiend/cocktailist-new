import { createRouter, createWebHistory } from 'vue-router';
import Browse from '../views/Browse.vue';

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
    component: () => import('../views/LogIn.vue')
  },
  {
    path: '/data',
    name: 'Data',
    component: () => import('../views/LogIn.vue')
  },
  {
    path: '/feed',
    name: 'Feed',
    component: () => import('../views/LogIn.vue')
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
    component: () => import('../views/Cocktail.vue')
  },
  ]
});

export default router;
