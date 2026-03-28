import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/cocktails',
      alias: '/', // make the default view 'browse'
      children: [
        {
          path: '/:spirit?',
          name: 'Browse',
          component: () => import('../views/Browse.vue'),
          props: (route) => ({
            spirit: route.params.spirit,
            page: route.query.page,
          }),
        },
        {
          path: '/detail/:id',
          props: true,
          name: 'Cocktail',
          component: () => import('../views/Cocktail.vue'),
        },
      ],
    },
    {
      path: '/bars',
      children: [
        {
          path: ':id?/:spirit?',
          name: 'Bar',
          component: () => import('../views/Bar.vue'),
          props: (route) => ({
            spirit: route.params.spirit,
            id: route.params.id,
          }),
        },
      ],
    },
    {
      path: '/lists',
      children: [
        {
          path: ':id?',
          props: true,
          name: 'List',
          component: () => import('../views/List.vue'),
        },
      ],
    },
    {
      path: '/data',
      name: 'Data',
      component: () => import('../views/Data.vue'),
    },
    {
      path: '/login',
      name: 'Log In',
      component: () => import('../views/Login.vue'),
    },
    {
      path: '/account',
      name: 'Account',
      component: () => import('../views/Account.vue'),
    },
    {
      path: '/search',
      name: 'Search Results',
      component: () => import('../views/SearchResults.vue'),
      props: (route) => ({
        searchTerm: route.query.searchTerm,
      }),
    },
    // {
    //   path: '/:pathMatch(.*)*',
    //   component: () => import('../views/Login.vue')
    // }
  ],
});

export default router;
