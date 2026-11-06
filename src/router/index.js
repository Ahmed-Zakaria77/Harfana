import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'home', component: () => import('../views/HomeView.vue') },
  { path: '/create', name: 'create', component: () => import('../views/CreateRoomView.vue') },
  { path: '/join/:code?', name: 'join', component: () => import('../views/JoinRoomView.vue') },
  { path: '/notebook', name: 'notebook', component: () => import('../views/NotebookDemoView.vue') },
  { path: '/review', name: 'review', component: () => import('../views/ReviewView.vue') },
  { path: '/room/:code', name: 'lobby', component: () => import('../views/LobbyView.vue') },
  { path: '/room/:code/round/:roundId', name: 'game', component: () => import('../views/GameView.vue') },
  { path: '/room/:code/round/:roundId/review', name: 'round-review', component: () => import('../views/ReviewView.vue') },
  { path: '/room/:code/results', name: 'results', component: () => import('../views/ResultsView.vue') },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

export default createRouter({ history: createWebHashHistory(import.meta.env.BASE_URL), routes, scrollBehavior: () => ({ top: 0 }) })
