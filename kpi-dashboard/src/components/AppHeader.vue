<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getProjectById } from '../data/dummyData'

const router = useRouter()
const route = useRoute()

const currentUser = computed(() => { try { return JSON.parse(localStorage.getItem('currentUser') || '{}') } catch { return {} } })
const userRole = computed(() => currentUser.value.role || 'site-supervisor')
const projectName = computed(() => {
  const pid = currentUser.value.projectId
  if (pid) { const p = getProjectById(pid); return p ? p.name : '' }
  return ''
})

const roleLabel = computed(() => {
  const r = userRole.value
  if (r === 'admin') return 'System Admin'
  if (r === 'project-director') return 'Project Director'
  if (r === 'project-manager') return 'Project Manager'
  return 'Staff'
})

const navItems = computed(() => {
  const role = userRole.value
  if (role === 'admin') {
    return [
      { label: 'Admin Panel', path: '/admin', icon: 'admin' },
      { label: 'Leaderboard', path: '/leaderboard', icon: 'leaderboard' },
    ]
  }
  if (role === 'project-director') {
    return [
      { label: 'My Dashboard', path: '/my-dashboard', icon: 'dashboard' },
      { label: 'Team & Projects', path: '/team', icon: 'department' },
      { label: 'Leaderboard', path: '/leaderboard', icon: 'leaderboard' },
    ]
  }
  if (role === 'project-manager') {
    return [
      { label: 'My Dashboard', path: '/my-dashboard', icon: 'dashboard' },
      { label: 'My Team', path: '/pm-team', icon: 'department' },
      { label: 'Leaderboard', path: '/leaderboard', icon: 'leaderboard' },
      { label: 'My Evaluation', path: '/evaluation', icon: 'evaluation' },
    ]
  }
  // Staff
  return [
    { label: 'My Dashboard', path: '/my-dashboard', icon: 'dashboard' },
    { label: 'Monthly Evaluation', path: '/evaluation', icon: 'evaluation' },
  ]
})

const showUserMenu = ref(false)
const showChangelog = ref(false)

function isActive(path) { return route.path === path }
function navigate(path) { router.push(path) }
function logout() {
  localStorage.removeItem('currentUser')
  router.push('/login')
}
function toggleUserMenu() { showUserMenu.value = !showUserMenu.value }
function closeUserMenu() { showUserMenu.value = false }
function openChangelog() {
  showUserMenu.value = false
  showChangelog.value = true
}
function closeChangelog() { showChangelog.value = false }

// Close changelog on Escape
function handleKeydown(e) { if (e.key === 'Escape' && showChangelog.value) closeChangelog() }
onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))

// ─── Changelog Data ──────────────────────────────────────────────────
const versions = [
  {
    version: '2.2.0',
    date: '21 May 2026',
    tag: 'Latest',
    tagCls: 'tag-success',
    changes: [
      { type: 'feature', text: 'Project Director monitoring dashboard — no personal scoring, focused on team oversight and project health' },
      { type: 'feature', text: 'Pending Your Rating panel — shows PMs who submitted evaluations awaiting PD review' },
      { type: 'feature', text: 'Incomplete Evaluations panel — highlights staff with Draft or Not Started status for the month' },
      { type: 'feature', text: '6-month Project Performance Trend — interactive line chart (Chart.js) comparing average scores across all projects' },
      { type: 'feature', text: 'PM Team Leaderboard — Project Managers now see rankings of their own team members only' },
      { type: 'feature', text: 'Quick Actions on dashboard — fast access to Evaluation, Leaderboard, and Team views' },
      { type: 'feature', text: 'Changelog moved to profile menu — opens as a popup dialog instead of a separate page' },
      { type: 'improvement', text: 'Expanded color palette supporting 10+ projects in trend chart' },
      { type: 'improvement', text: 'Summary stats row for PD — Total Staff, Eval Completed, Pending Rating, Incomplete counts at a glance' },
      { type: 'improvement', text: 'PM navigation simplified — Team Overview & Rate Team merged into "My Team" tab' },
      { type: 'improvement', text: 'Removed Changelog tab from all role navigations — accessible via avatar menu' },
      { type: 'improvement', text: 'Removed My Evaluation tab for Project Director — monitoring-only role' },
    ],
  },
  {
    version: '2.1.0',
    date: '11 May 2026',
    tag: '',
    tagCls: '',
    changes: [
      { type: 'feature', text: 'My Dashboard — unified personal dashboard for all roles with score breakdown, grade, and department rank' },
      { type: 'feature', text: 'Top 5 Leaderboard widget on My Dashboard with your position highlighted' },
      { type: 'feature', text: 'Core Commitments tracker — shows all 5 KPIs with On Track / Needs Attention / Not Started status' },
      { type: 'feature', text: 'Character Pillar rubric — full 5-level descriptors per pillar shown when rating (from official reference)' },
      { type: 'feature', text: 'Contribution carry-forward — excess points above top tier (350) roll into next month automatically' },
      { type: 'feature', text: 'Leaderboard Rank By filter — sort by Overall, Commitments (50%), Contributions (30%), or Character (20%)' },
      { type: 'feature', text: 'PD Department Dashboard — role filter dropdown (PM, Supervisor, Engineer, QS, Admin)' },
      { type: 'feature', text: 'Contribution visibility in PM Rate Team and HOD drawers — view staff logged contributions and carry-forward' },
      { type: 'improvement', text: 'Leaderboard score chips now labelled: KPI 40/50 · Contrib 12/30 · Char 17/20' },
      { type: 'improvement', text: 'Character Pillar names updated: Accountability & Attendance, Sustainability & Communication, Adaptability & Problem Solving, Synergy & Leadership' },
      { type: 'improvement', text: 'Rating scale updated: Needs Improvement → Developing → Meets Expectations → Exceeds Expectations → Role Model' },
      { type: 'improvement', text: 'Contribution form stays open after KPI submission — contributions are always additive' },
      { type: 'improvement', text: 'Rate PMs renamed to Rate Team for consistency across PD and PM views' },
      { type: 'improvement', text: 'All roles now land on My Dashboard after login' },
    ],
  },
  {
    version: '2.0.0',
    date: '8 May 2026',
    tag: '',
    tagCls: '',
    changes: [
      { type: 'feature', text: 'HOD / Department Overview dashboard — view all staff by name, IC, position, score, and date of joining' },
      { type: 'feature', text: '4 Behaviour Pillars (20%): Accountability, Sustainability, Adaptability, Synergy — rated by supervisor' },
      { type: 'feature', text: 'Submit & Lock workflow — once supervisor submits, ratings become read-only' },
      { type: 'feature', text: 'Final Monthly Scoring engine: 50% Commitments + 30% Contributions + 20% Behaviour = 100%' },
      { type: 'feature', text: 'Staff Final Score view — shows full breakdown once supervisor rates behaviour' },
      { type: 'feature', text: 'User metadata: IC number and Date of Joining on all user profiles' },
      { type: 'improvement', text: 'PD/HOD login now routes to Department Overview as primary view' },
      { type: 'improvement', text: 'PM Rate Team drawer now includes behaviour 4-pillar rating section' },
      { type: 'improvement', text: 'Login page shows all 3 demo accounts: PD001, PM001, EMP001' },
    ],
  },
  {
    version: '1.2.0',
    date: '24 Apr 2026',
    tag: '',
    tagCls: '',
    changes: [
      { type: 'feature', text: 'Project-based structure with 3 construction projects (Forum 2, AR496, QS-2024-001)' },
      { type: 'feature', text: '3-tier role hierarchy: Project Director → Project Manager → Staff' },
      { type: 'feature', text: 'Monthly evaluation cycle with month selector' },
      { type: 'feature', text: 'Role-specific KPIs for 5 roles (Supervisor, Engineer, QS, Admin, PM)' },
      { type: 'feature', text: 'Dual-column rating drawer (Self vs Supervisor side-by-side)' },
      { type: 'feature', text: 'Quarterly character evaluation (Mar, Jun, Sep, Dec only)' },
      { type: 'feature', text: 'Rate Team view for PM/PD to rate subordinates' },
      { type: 'feature', text: 'All Projects overview for Project Director' },
      { type: 'feature', text: 'Firebase deployment to prosync-pms.web.app' },
    ],
  },
  {
    version: '1.1.0',
    date: '23 Apr 2026',
    tag: '',
    tagCls: '',
    changes: [
      { type: 'feature', text: 'Restyled to Prosync Design System (dark navy sidebar, brand blue #03439a, Open Sans)' },
      { type: 'feature', text: 'Annual Evaluation form with 50/30/20 weighted scoring' },
      { type: 'feature', text: '5 core KPI commitments rated 1–5' },
      { type: 'feature', text: '5 character/behavioral traits rated 1–5' },
      { type: 'feature', text: 'Contribution points with tier scoring system' },
      { type: 'feature', text: 'Summary tab with progress ring and grade (A–F)' },
      { type: 'improvement', text: 'Submit flow with confirmation modal and locked state' },
    ],
  },
  {
    version: '1.0.0',
    date: '22 Apr 2026',
    tag: '',
    tagCls: '',
    changes: [
      { type: 'feature', text: 'Initial MVP of KPI Evaluation & L&D Dashboard' },
      { type: 'feature', text: 'Employee self-evaluation with Core Commitments (On Track / Missed)' },
      { type: 'feature', text: 'Value-Add Contributions logging with points' },
      { type: 'feature', text: 'Monthly Progress ring with total score' },
      { type: 'feature', text: 'HOD team leaderboard with sortable columns' },
      { type: 'feature', text: 'Review drawer for HOD to inspect employee details' },
      { type: 'feature', text: 'Role-based login (Employee / HOD)' },
    ],
  },
]

function typeIcon(type) {
  if (type === 'feature') return '✦'
  if (type === 'improvement') return '⬆'
  if (type === 'fix') return '🔧'
  return '•'
}

function typeCls(type) {
  if (type === 'feature') return 'text-brand-primary'
  if (type === 'improvement') return 'text-brand-primary/70'
  if (type === 'fix') return 'text-txt-success'
  return 'text-txt-subtitle'
}
</script>

<template>
  <header class="bg-white border-b border-line shrink-0">
    <!-- Row 1: Main Bar -->
    <div class="flex items-center justify-between px-5 py-2.5">
      <!-- Left: Brand -->
      <div class="flex items-center gap-3 min-w-0">
        <div class="w-8 h-8 bg-brand-primary text-white rounded-lg flex items-center justify-center text-sm font-bold shrink-0">P</div>
        <div class="flex items-center gap-2 min-w-0">
          <span class="text-[15px] font-bold text-txt-heading whitespace-nowrap">PMS</span>
          <svg v-if="projectName" xmlns="http://www.w3.org/2000/svg" width="4" height="4" viewBox="0 0 4 4" fill="#9ca3af"><circle cx="2" cy="2" r="2"/></svg>
          <span v-if="projectName" class="text-sm text-txt-subtitle truncate">{{ projectName }}</span>
        </div>
      </div>

      <!-- Center: Search -->
      <div class="flex-1 max-w-md mx-6">
        <div class="relative">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 text-txt-muted" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256" fill="currentColor"><path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"/></svg>
          <input type="text" placeholder="Search" class="w-full pl-9 pr-4 py-2 bg-surface-gray rounded-lg text-sm text-txt-body placeholder-txt-muted border-0 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:bg-white transition-all" />
        </div>
      </div>

      <!-- Right: Icons + Avatar -->
      <div class="flex items-center gap-3">
        <!-- Role badge (subtle) -->
        <span class="text-xs text-txt-subtitle font-medium hidden sm:block">{{ roleLabel }}</span>

        <!-- Notification bell -->
        <button class="relative p-2 rounded-lg hover:bg-surface-gray transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256" fill="#6b7280"><path d="M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.24,16-43.92,16-80a64,64,0,1,1,128,0c0,36.05,8.28,66.73,16,80Z"/></svg>
        </button>

        <!-- User avatar dropdown -->
        <div class="relative">
          <button @click="toggleUserMenu" class="flex items-center gap-0 cursor-pointer">
            <div :class="[currentUser.avatarColor || 'bg-brand-primary', 'w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ring-2 ring-white shadow-xs']">{{ currentUser.initials || '?' }}</div>
          </button>

          <!-- Dropdown menu -->
          <transition name="page">
            <div v-if="showUserMenu" class="absolute right-0 top-full mt-2 w-56 bg-white rounded-card border border-line shadow-lg z-50 py-1 animate-scale-in">
              <div class="px-4 py-3 border-b border-line">
                <p class="text-sm font-semibold text-txt-heading truncate">{{ currentUser.name || 'User' }}</p>
                <p class="text-xs text-txt-muted truncate">{{ currentUser.label || '' }} · {{ currentUser.id || '' }}</p>
              </div>
              <button @click="openChangelog" class="w-full text-left px-4 py-2.5 text-sm text-txt-body hover:bg-surface-gray transition-colors flex items-center gap-2.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256" fill="currentColor"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48A8,8,0,0,1,192,128Z"/></svg>
                Changelog
              </button>
              <button @click="logout" class="w-full text-left px-4 py-2.5 text-sm text-txt-body hover:bg-surface-gray transition-colors flex items-center gap-2.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256" fill="currentColor"><path d="M112,216a8,8,0,0,1-8,8H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32h56a8,8,0,0,1,0,16H48V208h56A8,8,0,0,1,112,216Zm109.66-93.66-40-40a8,8,0,0,0-11.32,11.32L196.69,120H104a8,8,0,0,0,0,16h92.69l-26.35,26.34a8,8,0,0,0,11.32,11.32l40-40A8,8,0,0,0,221.66,122.34Z"/></svg>
                Sign Out
              </button>
            </div>
          </transition>

          <!-- Click outside to close -->
          <div v-if="showUserMenu" class="fixed inset-0 z-40" @click="closeUserMenu"></div>
        </div>
      </div>
    </div>

    <!-- Row 2: Tab Navigation -->
    <nav class="flex items-center gap-0 px-5 -mb-px">
      <div
        v-for="item in navItems"
        :key="item.path"
        :class="['nav-tab', { active: isActive(item.path) }]"
        @click="navigate(item.path)"
      >
        {{ item.label }}
      </div>
    </nav>
  </header>

  <!-- ═══ Changelog Dialog ═══ -->
  <teleport to="body">
    <div v-if="showChangelog" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/30 backdrop-blur-sm" @click="closeChangelog"></div>

      <!-- Dialog -->
      <div class="relative z-10 bg-white rounded-card shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col border border-line animate-scale-in">
        <!-- Dialog header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-line shrink-0">
          <div>
            <h2 class="text-base font-bold text-txt-heading">Changelog</h2>
            <p class="text-xs text-txt-muted mt-0.5">Version history and release notes</p>
          </div>
          <button @click="closeChangelog" class="p-1.5 rounded-lg hover:bg-surface-gray transition-colors text-txt-muted hover:text-txt-heading">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 256 256" fill="currentColor"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"/></svg>
          </button>
        </div>

        <!-- Dialog content (scrollable) -->
        <div class="flex-1 overflow-y-auto px-6 py-5">
          <div class="relative">
            <!-- Timeline line -->
            <div class="absolute left-[15px] top-6 bottom-6 w-px bg-line"></div>

            <div v-for="(v, i) in versions" :key="v.version" class="relative pl-10 pb-6 last:pb-0">
              <!-- Dot -->
              <div class="absolute left-[9px] top-1.5 w-3 h-3 rounded-full border-2" :class="i === 0 ? 'bg-brand-primary border-brand-primary' : 'bg-surface-white border-line'"></div>

              <!-- Version card -->
              <div class="p-4 rounded-container border border-line bg-surface-gray/20">
                <div class="flex items-center gap-3 mb-2.5">
                  <h3 class="text-sm font-bold text-txt-heading">v{{ v.version }}</h3>
                  <span v-if="v.tag" class="tag text-[10px]" :class="v.tagCls">{{ v.tag }}</span>
                  <span class="text-xs text-txt-muted ml-auto">{{ v.date }}</span>
                </div>

                <ul class="space-y-1">
                  <li v-for="(c, j) in v.changes" :key="j" class="flex items-start gap-2 text-[13px]">
                    <span class="text-[10px] mt-0.5 shrink-0" :class="typeCls(c.type)">{{ typeIcon(c.type) }}</span>
                    <span class="text-txt-body">{{ c.text }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>
