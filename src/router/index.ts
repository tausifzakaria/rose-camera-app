import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import CameraApp from '@/views/CameraApp.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: CameraApp,
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
