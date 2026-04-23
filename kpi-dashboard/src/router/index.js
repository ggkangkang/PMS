import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import EmployeeView from '../views/EmployeeView.vue'
import HodView from '../views/HodView.vue'
import EvaluationView from '../views/EvaluationView.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: LoginView, meta: { layout: 'blank' } },
  { path: '/employee', name: 'Employee', component: EmployeeView, meta: { layout: 'app' } },
  { path: '/evaluation', name: 'Evaluation', component: EvaluationView, meta: { layout: 'app' } },
  { path: '/hod', name: 'HOD', component: HodView, meta: { layout: 'app' } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

