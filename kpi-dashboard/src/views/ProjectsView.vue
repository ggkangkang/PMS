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
    <div class="flex items-center justify-between mb-5">
      <div>
        <h1 class="text-lg font-bold text-txt-heading">All Projects</h1>
        <p class="text-xs text-txt-subtitle">{{ formatMonth(selectedMonth) }} · {{ projects.length }} active projects</p>
      </div>
      <select v-model="selectedMonth" class="select-field w-40">
        <option v-for="m in availableMonths" :key="m.value" :value="m.value">{{ m.label }}</option>
      </select>
    </div>

    <!-- Overall stats -->
    <div class="grid grid-cols-3 gap-4 mb-5">
      <div class="card p-4 text-center"><p class="text-xs text-txt-subtitle mb-1">Active Projects</p><p class="text-2xl font-bold text-brand-primary">{{ projects.length }}</p></div>
      <div class="card p-4 text-center"><p class="text-xs text-txt-subtitle mb-1">Total Team</p><p class="text-2xl font-bold text-txt-heading">{{ overallStats.total }}</p></div>
      <div class="card p-4 text-center"><p class="text-xs text-txt-subtitle mb-1">Eval Completion</p><p class="text-2xl font-bold" :class="overallStats.pct >= 75 ? 'text-txt-success' : 'text-txt-warn'">{{ overallStats.pct }}%</p></div>
    </div>

    <!-- Project cards -->
    <div class="space-y-4">
      <div v-for="p in projectSummaries" :key="p.id" class="card p-5">
        <div class="flex items-start justify-between mb-4">
          <div>
            <div class="flex items-center gap-2">
              <h3 class="text-sm font-bold text-txt-heading">{{ p.name }}</h3>
              <span class="tag tag-success text-[10px]">Active</span>
            </div>
            <p class="text-xs text-txt-subtitle mt-0.5">{{ p.location }} · {{ p.id }}</p>
          </div>
          <!-- Completion -->
          <div class="text-right">
            <p class="text-sm font-bold" :class="p.completionPct >= 75 ? 'text-txt-success' : p.completionPct >= 50 ? 'text-txt-warn' : 'text-txt-error'">{{ p.completionPct }}%</p>
            <p class="text-[10px] text-txt-disabled">{{ p.evaluatedCount }}/{{ p.totalUsers }} submitted</p>
          </div>
        </div>

        <!-- PM Row -->
        <div v-if="p.pm" class="p-3 rounded-container bg-surface-info/30 border border-blue-200/40 mb-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div :class="[p.pm.avatarColor || 'bg-brand-primary', 'w-8 h-8 rounded-full text-white text-[10px] font-bold flex items-center justify-center']">{{ p.pm.initials }}</div>
              <div>
                <p class="text-sm font-semibold text-txt-body">{{ p.pm.name }}</p>
                <p class="text-[10px] text-txt-disabled">Project Manager · {{ p.pm.id }}</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-sm font-bold text-brand-primary">{{ p.pmCommitScore }}/50</span>
              <span class="tag text-[10px]" :class="getEvalStatusInfo(p.pmStatus).cls">{{ getEvalStatusInfo(p.pmStatus).label }}</span>
              <span v-if="p.pmRated" class="tag tag-success text-[10px]">PD Rated</span>
              <span v-else class="tag bg-surface-gray text-txt-disabled text-[10px]">Not Rated</span>
            </div>
          </div>
        </div>

        <!-- Staff list -->
        <div class="space-y-1.5">
          <div v-for="s in p.staff" :key="s.id" class="flex items-center justify-between p-2.5 rounded-container bg-surface-gray/50 border border-line/30">
            <div class="flex items-center gap-2">
              <div :class="[s.avatarColor || 'bg-brand-primary', 'w-6 h-6 rounded-full text-white text-[9px] font-bold flex items-center justify-center']">{{ s.initials }}</div>
              <div>
                <span class="text-sm text-txt-body">{{ s.name }}</span>
                <span class="text-[11px] text-txt-disabled ml-1">{{ s.label }}</span>
              </div>
            </div>
            <span class="tag text-[10px]" :class="getEvalStatusInfo(getMonthlyEval(s.id, selectedMonth)?.status || 'not-started').cls">{{ getEvalStatusInfo(getMonthlyEval(s.id, selectedMonth)?.status || 'not-started').label }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
