import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import EmployeeView from '../views/EmployeeView.vue'
import EvaluationView from '../views/EvaluationView.vue'
import RateTeamView from '../views/RateTeamView.vue'
import ProjectsView from '../views/ProjectsView.vue'
import ChangelogView from '../views/ChangelogView.vue'
import HodDashboardView from '../views/HodDashboardView.vue'
import AdminView from '../views/AdminView.vue'
import LeaderboardView from '../views/LeaderboardView.vue'
import MyDashboardView from '../views/MyDashboardView.vue'
import PMTeamView from '../views/PMTeamView.vue'
import TeamProjectsView from '../views/TeamProjectsView.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: LoginView, meta: { layout: 'blank' } },
  { path: '/my-dashboard', name: 'MyDashboard', component: MyDashboardView, meta: { layout: 'app' } },
  { path: '/dashboard', name: 'Dashboard', component: EmployeeView, meta: { layout: 'app' } },
  { path: '/evaluation', name: 'Evaluation', component: EvaluationView, meta: { layout: 'app' } },
  { path: '/rate-team', name: 'RateTeam', component: RateTeamView, meta: { layout: 'app' } },
  { path: '/projects', name: 'Projects', component: ProjectsView, meta: { layout: 'app' } },
  { path: '/hod-dashboard', name: 'HodDashboard', component: HodDashboardView, meta: { layout: 'app' } },
  { path: '/team', name: 'TeamProjects', component: TeamProjectsView, meta: { layout: 'app' } },
  { path: '/pm-team', name: 'PMTeam', component: PMTeamView, meta: { layout: 'app' } },
  { path: '/leaderboard', name: 'Leaderboard', component: LeaderboardView, meta: { layout: 'app' } },
  { path: '/admin', name: 'Admin', component: AdminView, meta: { layout: 'app' } },
  { path: '/changelog', name: 'Changelog', component: ChangelogView, meta: { layout: 'app' } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
