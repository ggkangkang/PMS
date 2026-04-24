import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import EmployeeView from '../views/EmployeeView.vue'
import EvaluationView from '../views/EvaluationView.vue'
import RateTeamView from '../views/RateTeamView.vue'
import ProjectsView from '../views/ProjectsView.vue'
import ChangelogView from '../views/ChangelogView.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: LoginView, meta: { layout: 'blank' } },
  { path: '/dashboard', name: 'Dashboard', component: EmployeeView, meta: { layout: 'app' } },
  { path: '/evaluation', name: 'Evaluation', component: EvaluationView, meta: { layout: 'app' } },
  { path: '/rate-team', name: 'RateTeam', component: RateTeamView, meta: { layout: 'app' } },
  { path: '/projects', name: 'Projects', component: ProjectsView, meta: { layout: 'app' } },
  { path: '/changelog', name: 'Changelog', component: ChangelogView, meta: { layout: 'app' } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
