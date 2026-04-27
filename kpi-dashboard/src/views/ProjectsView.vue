<script setup>
import { ref, computed } from 'vue'
import {
  projects, users, getUsersByProject, getMonthlyEval, getCommitmentScore,
  getContributionPoints, getEvalStatusInfo, availableMonths, formatMonth,
} from '../data/dummyData'

const currentUser = computed(() => { try { return JSON.parse(localStorage.getItem('currentUser') || '{}') } catch { return {} } })
const selectedMonth = ref(availableMonths[0].value)

const projectSummaries = computed(() => {
  return projects.map(p => {
    const allUsers = getUsersByProject(p.id)
    const pm = allUsers.find(u => u.role === 'project-manager')
    const staff = allUsers.filter(u => u.role !== 'project-manager')

    const evaluatedCount = [...(pm ? [pm] : []), ...staff].filter(u => {
      const ev = getMonthlyEval(u.id, selectedMonth.value)
      return ev && ['submitted', 'reviewed'].includes(ev.status)
    }).length

    const totalUsers = (pm ? 1 : 0) + staff.length
    const pmEval = pm ? getMonthlyEval(pm.id, selectedMonth.value) : null
    const pmCommitScore = pmEval ? getCommitmentScore(pmEval.self?.commitmentRatings || {}) : 0

    return {
      ...p,
      pm,
      staff,
      totalUsers,
      evaluatedCount,
      completionPct: totalUsers ? Math.round((evaluatedCount / totalUsers) * 100) : 0,
      pmCommitScore,
      pmStatus: pmEval?.status || 'not-started',
      pmRated: !!pmEval?.supervisor,
    }
  })
})

const overallStats = computed(() => {
  const total = projectSummaries.value.reduce((s, p) => s + p.totalUsers, 0)
  const evaluated = projectSummaries.value.reduce((s, p) => s + p.evaluatedCount, 0)
  return { total, evaluated, pct: total ? Math.round((evaluated / total) * 100) : 0 }
})
</script>

<template>
  <div class="max-w-6xl mx-auto animate-fade-in flex gap-6">
    <!-- Main content -->
    <div class="flex-1 min-w-0">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-lg font-bold text-txt-heading">All Projects</h1>
          <p class="text-sm text-txt-subtitle mt-0.5">{{ formatMonth(selectedMonth) }} · {{ projects.length }} active projects</p>
        </div>
        <select v-model="selectedMonth" class="select-field w-40">
          <option v-for="m in availableMonths" :key="m.value" :value="m.value">{{ m.label }}</option>
        </select>
      </div>

      <!-- Project cards -->
      <div class="space-y-4">
        <div v-for="p in projectSummaries" :key="p.id" class="card overflow-hidden">
          <!-- Cover gradient -->
          <div class="h-16 bg-gradient-to-r from-brand-primary/10 to-blue-50 px-6 flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <h3 class="text-[15px] font-bold text-txt-heading">{{ p.name }}</h3>
              <span class="tag tag-success text-[10px]">Active</span>
            </div>
            <div class="text-right">
              <p class="text-base font-bold" :class="p.completionPct >= 75 ? 'text-txt-success' : p.completionPct >= 50 ? 'text-txt-warn' : 'text-txt-error'">{{ p.completionPct }}%</p>
            </div>
          </div>

          <div class="p-6">
            <!-- Metadata row with icons (Skool About style) -->
            <div class="flex items-center gap-5 text-sm text-txt-subtitle mb-4">
              <span class="flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 256 256" fill="currentColor" opacity="0.5"><path d="M128,64a40,40,0,1,0,40,40A40,40,0,0,0,128,64Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,128Zm0-112a88.1,88.1,0,0,0-88,88c0,31.4,14.51,64.68,42,96.25a254.19,254.19,0,0,0,41.45,38.3,8,8,0,0,0,9.18,0A254.19,254.19,0,0,0,174,200.25c27.45-31.57,42-64.85,42-96.25A88.1,88.1,0,0,0,128,16Z"/></svg>
                {{ p.location }}
              </span>
              <span class="flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 256 256" fill="currentColor" opacity="0.5"><path d="M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Zm210.14,98.7a8,8,0,0,1-11.07-2.33A79.83,79.83,0,0,0,172,168a8,8,0,0,1,0-16,44,44,0,1,0-16.34-84.87,8,8,0,1,1-5.94-14.85,60,60,0,0,1,55.53,105.64,95.83,95.83,0,0,1,47.22,37.71A8,8,0,0,1,250.14,206.7Z"/></svg>
                {{ p.totalUsers }} members
              </span>
              <span class="flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 256 256" fill="currentColor" opacity="0.5"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48A8,8,0,0,1,192,128Z"/></svg>
                {{ p.evaluatedCount }}/{{ p.totalUsers }} submitted
              </span>
              <span class="text-xs text-txt-muted">{{ p.id }}</span>
            </div>

            <!-- PM Row -->
            <div v-if="p.pm" class="flex items-center gap-4 p-4 rounded-container bg-surface-gray/50 border border-line/30 mb-3">
              <div class="relative shrink-0">
                <div :class="[p.pm.avatarColor || 'bg-brand-primary', 'w-10 h-10 rounded-full text-white text-[10px] font-bold flex items-center justify-center']">{{ p.pm.initials }}</div>
                <div v-if="p.pmRated" class="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 text-white rounded-full flex items-center justify-center text-[8px] font-bold ring-2 ring-white">✓</div>
              </div>
              <div class="flex-1">
                <p class="text-sm font-semibold text-txt-body">{{ p.pm.name }}</p>
                <p class="text-xs text-txt-muted">Project Manager · {{ p.pm.id }}</p>
              </div>
              <div class="flex items-center gap-2.5">
                <span class="text-sm font-bold text-brand-primary">{{ p.pmCommitScore }}/50</span>
                <span class="tag text-[10px]" :class="getEvalStatusInfo(p.pmStatus).cls">{{ getEvalStatusInfo(p.pmStatus).label }}</span>
              </div>
            </div>

            <!-- Staff list -->
            <div class="space-y-1">
              <div v-for="s in p.staff" :key="s.id" class="flex items-center gap-3 p-3 rounded-container hover:bg-surface-gray/40 transition-colors">
                <div :class="[s.avatarColor || 'bg-brand-primary', 'w-8 h-8 rounded-full text-white text-[9px] font-bold flex items-center justify-center shrink-0']">{{ s.initials }}</div>
                <div class="flex-1 min-w-0">
                  <span class="text-sm text-txt-body font-medium">{{ s.name }}</span>
                  <span class="text-xs text-txt-muted ml-1.5">{{ s.label }}</span>
                </div>
                <span class="tag text-[10px]" :class="getEvalStatusInfo(getMonthlyEval(s.id, selectedMonth)?.status || 'not-started').cls">{{ getEvalStatusInfo(getMonthlyEval(s.id, selectedMonth)?.status || 'not-started').label }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Right sidebar (Skool style) -->
    <aside class="w-72 shrink-0 hidden lg:block">
      <div class="card overflow-hidden sticky top-6">
        <div class="h-24 bg-gradient-to-br from-brand-primary to-blue-400"></div>
        <div class="p-5">
          <h3 class="text-[15px] font-bold text-txt-heading">Director Overview</h3>
          <p class="text-xs text-txt-muted mt-0.5">{{ formatMonth(selectedMonth) }}</p>
          <p class="text-sm text-txt-subtitle mt-2">Overview of all projects and their evaluation progress.</p>

          <div class="flex items-center justify-center mt-4 pt-4 border-t border-line">
            <div class="stat-block">
              <p class="stat-value text-base text-brand-primary">{{ projects.length }}</p>
              <p class="stat-label">Projects</p>
            </div>
            <div class="stat-block">
              <p class="stat-value text-base">{{ overallStats.total }}</p>
              <p class="stat-label">Members</p>
            </div>
            <div class="stat-block">
              <p class="stat-value text-base" :class="overallStats.pct >= 75 ? 'text-txt-success' : 'text-txt-warn'">{{ overallStats.pct }}%</p>
              <p class="stat-label">Complete</p>
            </div>
          </div>

          <button class="btn-outline w-full mt-4 text-xs">VIEW REPORTS</button>
        </div>
      </div>
    </aside>
  </div>
</template>
