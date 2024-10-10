import { createRouter, createWebHistory } from 'vue-router'
import Index from '../views/Index.vue'
import Genre from '../views/genre.vue'
import Play from '../views/playVideo.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Index
  },
  {
    path: '/genre',
    name: 'Genre',
    component: Genre
  },
  {
    path: '/play/:id/:name/:episode',
    name: 'Play',
    component: Play
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
