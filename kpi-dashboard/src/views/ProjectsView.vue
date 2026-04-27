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
  <div class="max-w-6xl mx-auto animate-fade-in">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-lg font-bold text-txt-heading">All Projects</h1>
        <p class="text-sm text-txt-subtitle mt-0.5">{{ formatMonth(selectedMonth) }} · {{ projects.length }} active projects</p>
      </div>
      <select v-model="selectedMonth" class="select-field w-40">
        <option v-for="m in availableMonths" :key="m.value" :value="m.value">{{ m.label }}</option>
      </select>
    </div>

    <!-- Overall stats — Skool stat-block style -->
    <div class="card mb-6">
      <div class="flex items-center justify-center py-4">
        <div class="stat-block">
          <p class="stat-value text-brand-primary">{{ projects.length }}</p>
          <p class="stat-label">Active Projects</p>
        </div>
        <div class="stat-block">
          <p class="stat-value">{{ overallStats.total }}</p>
          <p class="stat-label">Total Team</p>
        </div>
        <div class="stat-block">
          <p class="stat-value" :class="overallStats.pct >= 75 ? 'text-txt-success' : 'text-txt-warn'">{{ overallStats.pct }}%</p>
          <p class="stat-label">Eval Completion</p>
        </div>
      </div>
    </div>

    <!-- Project cards -->
    <div class="space-y-4">
      <div v-for="p in projectSummaries" :key="p.id" class="card p-6">
        <div class="flex items-start justify-between mb-4">
          <div>
            <div class="flex items-center gap-2.5">
              <h3 class="text-[15px] font-bold text-txt-heading">{{ p.name }}</h3>
              <span class="tag tag-success text-[10px]">Active</span>
            </div>
            <p class="text-sm text-txt-subtitle mt-0.5">{{ p.location }} · {{ p.id }}</p>
          </div>
          <!-- Completion -->
          <div class="text-right">
            <p class="text-base font-bold" :class="p.completionPct >= 75 ? 'text-txt-success' : p.completionPct >= 50 ? 'text-txt-warn' : 'text-txt-error'">{{ p.completionPct }}%</p>
            <p class="text-xs text-txt-muted">{{ p.evaluatedCount }}/{{ p.totalUsers }} submitted</p>
          </div>
        </div>

        <!-- PM Row -->
        <div v-if="p.pm" class="p-4 rounded-container bg-surface-info/30 border border-blue-200/40 mb-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div :class="[p.pm.avatarColor || 'bg-brand-primary', 'w-9 h-9 rounded-full text-white text-[10px] font-bold flex items-center justify-center']">{{ p.pm.initials }}</div>
              <div>
                <p class="text-sm font-semibold text-txt-body">{{ p.pm.name }}</p>
                <p class="text-xs text-txt-muted">Project Manager · {{ p.pm.id }}</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-sm font-bold text-brand-primary">{{ p.pmCommitScore }}/50</span>
              <span class="tag text-[10px]" :class="getEvalStatusInfo(p.pmStatus).cls">{{ getEvalStatusInfo(p.pmStatus).label }}</span>
              <span v-if="p.pmRated" class="tag tag-success text-[10px]">PD Rated</span>
              <span v-else class="tag bg-surface-gray text-txt-muted text-[10px]">Not Rated</span>
            </div>
          </div>
        </div>

        <!-- Staff list -->
        <div class="space-y-1.5">
          <div v-for="s in p.staff" :key="s.id" class="flex items-center justify-between p-3 rounded-container bg-surface-gray/50 border border-line/30 hover:bg-surface-gray transition-colors">
            <div class="flex items-center gap-2.5">
              <div :class="[s.avatarColor || 'bg-brand-primary', 'w-7 h-7 rounded-full text-white text-[9px] font-bold flex items-center justify-center']">{{ s.initials }}</div>
              <div>
                <span class="text-sm text-txt-body font-medium">{{ s.name }}</span>
                <span class="text-xs text-txt-muted ml-1.5">{{ s.label }}</span>
              </div>
            </div>
            <span class="tag text-[10px]" :class="getEvalStatusInfo(getMonthlyEval(s.id, selectedMonth)?.status || 'not-started').cls">{{ getEvalStatusInfo(getMonthlyEval(s.id, selectedMonth)?.status || 'not-started').label }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
