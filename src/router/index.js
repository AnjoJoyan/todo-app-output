import { createRouter, createWebHashHistory } from 'vue-router'
import Dashboard from '../views/DashboardView.vue'
import Tasks     from '../views/TasksView.vue'
import Calendar  from '../views/CalendarView.vue'

const routes = [
  { path: '/',         name: 'Dashboard', component: Dashboard },
  { path: '/tasks',    name: 'Tasks',     component: Tasks     },
  { path: '/calendar', name: 'Calendar',  component: Calendar  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
