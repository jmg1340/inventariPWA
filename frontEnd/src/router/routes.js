
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') }
    ]
  },
  {
    path: '/switchs',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Switchs.vue') }
    ]
  },
  {
    path: '/dadesElasticSearch',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/DadesElasticSearch.vue') }
    ]
  },
  {
    path: '/inventariAsepeyo',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/indexAsepeyo.vue') }
    ]
  },
  {
    path: '/telefons',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Telefons.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
