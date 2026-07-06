import { createRouter, createWebHashHistory } from 'vue-router'
import ProfileSelectView from '../views/ProfileSelectView.vue'
import ExerciseSelectView from '../views/ExerciseSelectView.vue'
import LevelSelectView from '../views/LevelSelectView.vue'
import MathExerciseView from '../views/MathExerciseView.vue'
import StatsView from '../views/StatsView.vue'

const routes = [
  {
    path: '/',
    name: 'profiles',
    component: ProfileSelectView,
  },
  {
    path: '/profile/:profileId',
    name: 'exercises',
    component: ExerciseSelectView,
  },
  {
    path: '/profile/:profileId/rekenen/levels',
    name: 'levels',
    component: LevelSelectView,
  },
  {
    path: '/profile/:profileId/rekenen/play/:levelId',
    name: 'play',
    component: MathExerciseView,
  },
  {
    path: '/profile/:profileId/rekenen/stats/:levelId',
    name: 'stats',
    component: StatsView,
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
