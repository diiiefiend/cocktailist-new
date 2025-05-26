import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
  {
    path: '/cocktails',
    alias: '/', // make the default view 'browse'
    children: [
      {
        path: '',
        name: 'Browse',
        component: () => import('../views/Browse.vue')
      },
      {
        path: ':id',
        props: true,
        name: 'Cocktail',
        component: () => import('../views/Cocktail.vue')
      },
    ],
  },
  {
    path: '/bars',
    children: [
      // TODO: figure out how organize this better
      {
        path: '',
        name: 'BarDefault',
        component: () => import('../views/Bar.vue')
      },
      {
        path: ':id',
        props: true,
        name: 'Bar',
        component: () => import('../views/Bar.vue')
      }
    ], 
  },
  {
    path: '/lists',
    children: [
      // TODO: figure out how organize this better
      {
        path: '',
        name: 'ListDefault',
        component: () => import('../views/List.vue')
      },
      {
        path: ':id',
        props: true,
        name: 'List',
        component: () => import('../views/List.vue')
      }
    ],
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
    path: '/account',
    name: 'Account',
    component: () => import('../views/Account.vue')
  },
  // {
  //   path: '/:pathMatch(.*)*',
  //   component: () => import('../views/Login.vue')
  // }
  ]
});

export default router;
