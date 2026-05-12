<script setup>
import { ref, computed } from 'vue'
import {
  getUserById, getProjectById, getMonthlyEval, getKPIsForRole,
  getCommitmentScore, getContributionPoints, getContributionScore, getEvalStatusInfo,
  availableMonths, formatMonth, getCarryForwardPoints, contributionBaseline,
  getFinalMonthlyScore, getDepartmentStaff, getScoreGrade,
} from '../data/dummyData'

const currentUser = computed(() => { try { return JSON.parse(localStorage.getItem('currentUser') || '{}') } catch { return {} } })
const selectedMonth = ref(availableMonths[0].value)
const project = computed(() => getProjectById(currentUser.value.projectId))

// My scores
const myEval = computed(() => getMonthlyEval(currentUser.value.id, selectedMonth.value))
const myScore = computed(() => getFinalMonthlyScore(currentUser.value.id, selectedMonth.value))
const myKpis = computed(() => getKPIsForRole(currentUser.value.role))

// Carry-forward
const myContribPts = computed(() => myEval.value ? getContributionPoints(myEval.value.self?.contributions || []) : 0)
const carryIn = computed(() => getCarryForwardPoints(currentUser.value.id, selectedMonth.value))
const effectivePts = computed(() => myContribPts.value + carryIn.value)
const topTierMin = contributionBaseline.tiers[contributionBaseline.tiers.length - 1].min
const carryOut = computed(() => Math.max(0, effectivePts.value - topTierMin))

// KPI status
const kpiStatuses = computed(() => {
  if (!myEval.value) return []
  const selfRatings = myEval.value.self?.commitmentRatings || {}
  return myKpis.value.map(kpi => {
    const rating = selfRatings[kpi.id] || 0
    let status = 'not-started'
    let label = 'Not Started'
    let cls = 'bg-surface-gray text-txt-disabled'
    if (rating >= 3) { status = 'on-track'; label = 'On Track'; cls = 'tag-success' }
    else if (rating > 0) { status = 'needs-attention'; label = 'Needs Attention'; cls = 'tag-caution' }
    return { ...kpi, rating, status, statusLabel: label, statusCls: cls }
  })
})

// Top 5 leaderboard
const top5 = computed(() => {
  return getDepartmentStaff()
    .map(s => ({
      ...s,
      score: getFinalMonthlyScore(s.id, selectedMonth.value),
      project: getProjectById(s.projectId),
    }))
    .sort((a, b) => b.score.total - a.score.total)
    .slice(0, 5)
})

const myRank = computed(() => {
  const all = getDepartmentStaff()
    .map(s => ({ id: s.id, total: getFinalMonthlyScore(s.id, selectedMonth.value).total }))
    .sort((a, b) => b.total - a.total)
  const idx = all.findIndex(s => s.id === currentUser.value.id)
  return idx >= 0 ? idx + 1 : null
})

function medal(i) {
  if (i === 0) return '🥇'
  if (i === 1) return '🥈'
  if (i === 2) return '🥉'
  return ''
}

function gradeColor(g) {
  return g === 'emerge' ? '#008236' : g === 'ocean' ? '#2563eb' : g === 'caution' ? '#ca3500' : '#c10007'
}

function barWidth(score, max = 100) {
  return Math.round((score / max) * 100) + '%'
}

function ratingBg(v) {
  if (v >= 5) return 'bg-green-50 border-green-300 text-green-700'
  if (v >= 4) return 'bg-blue-50 border-blue-300 text-blue-700'
  if (v >= 3) return 'bg-yellow-50 border-yellow-300 text-yellow-700'
  if (v >= 2) return 'bg-orange-50 border-orange-300 text-orange-700'
  if (v >= 1) return 'bg-red-50 border-red-300 text-red-700'
  return 'bg-gray-50 border-gray-200 text-gray-400'
}
</script>

<template>
  <div class="max-w-5xl mx-auto animate-fade-in">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-lg font-bold text-txt-heading">My Dashboard</h1>
        <p class="text-sm text-txt-subtitle mt-0.5">{{ currentUser.name }} · {{ formatMonth(selectedMonth) }}</p>
      </div>
      <select v-model="selectedMonth" class="select-field w-40">
        <option v-for="m in availableMonths" :key="m.value" :value="m.value">{{ m.label }}</option>
      </select>
    </div>

    <!-- Profile + Score Card -->
    <div class="card p-6 mb-6">
      <div class="flex items-center gap-4 mb-5">
        <div :class="[currentUser.avatarColor || 'bg-brand-primary', 'w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold ring-4 ring-white shadow-md']">{{ currentUser.initials }}</div>
        <div class="flex-1">
          <h2 class="text-base font-bold text-txt-heading">{{ currentUser.name }}</h2>
          <p class="text-sm text-txt-subtitle">{{ currentUser.label }} · {{ project?.name || '' }}</p>
          <p class="text-xs text-txt-muted mt-0.5">{{ currentUser.id }} · {{ currentUser.department }}</p>
        </div>
        <div class="text-center">
          <p class="text-3xl font-bold" :style="{ color: gradeColor(myScore.grade.color) }">{{ myScore.total }}</p>
          <p class="text-xs font-semibold mt-0.5" :style="{ color: gradeColor(myScore.grade.color) }">{{ myScore.grade.grade }} · {{ myScore.grade.label }}</p>
          <div v-if="myRank" class="mt-1">
            <span class="tag bg-surface-gray text-txt-body text-[10px]">#{{ myRank }} of {{ getDepartmentStaff().length }}</span>
          </div>
        </div>
      </div>

      <!-- Score Breakdown -->
      <div class="grid grid-cols-3 gap-4">
        <div class="p-3 rounded-container bg-blue-50/50 border border-blue-100 text-center">
          <p class="text-xl font-bold text-blue-700">{{ myScore.commitScore }}<span class="text-sm text-blue-400 font-normal">/50</span></p>
          <p class="text-[10px] text-blue-500 font-medium mt-0.5">KPI Commitments</p>
          <div class="h-1.5 bg-blue-100 rounded-full mt-2 overflow-hidden">
            <div class="h-full bg-blue-500 rounded-full transition-all duration-700" :style="{ width: barWidth(myScore.commitScore, 50) }"></div>
          </div>
        </div>
        <div class="p-3 rounded-container bg-amber-50/50 border border-amber-100 text-center">
          <p class="text-xl font-bold text-amber-700">{{ myScore.contribScore }}<span class="text-sm text-amber-400 font-normal">/30</span></p>
          <p class="text-[10px] text-amber-500 font-medium mt-0.5">Contributions</p>
          <div class="h-1.5 bg-amber-100 rounded-full mt-2 overflow-hidden">
            <div class="h-full bg-amber-500 rounded-full transition-all duration-700" :style="{ width: barWidth(myScore.contribScore, 30) }"></div>
          </div>
        </div>
        <div class="p-3 rounded-container bg-emerald-50/50 border border-emerald-100 text-center">
          <p class="text-xl font-bold" :class="myScore.isComplete ? 'text-emerald-700' : 'text-gray-400'">{{ myScore.behaviourScore }}<span class="text-sm font-normal" :class="myScore.isComplete ? 'text-emerald-400' : 'text-gray-300'">/20</span></p>
          <p class="text-[10px] font-medium mt-0.5" :class="myScore.isComplete ? 'text-emerald-500' : 'text-gray-400'">Character Pillar</p>
          <div class="h-1.5 bg-emerald-100 rounded-full mt-2 overflow-hidden">
            <div class="h-full bg-emerald-500 rounded-full transition-all duration-700" :style="{ width: barWidth(myScore.behaviourScore, 20) }"></div>
          </div>
          <p v-if="!myScore.isComplete" class="text-[9px] text-txt-disabled mt-1">Pending supervisor rating</p>
        </div>
      </div>

      <!-- Carry-Forward Info -->
      <div v-if="carryIn > 0 || carryOut > 0" class="mt-4 p-3 rounded bg-indigo-50 border border-indigo-100 text-xs text-indigo-700 flex items-center gap-4">
        <span class="font-semibold shrink-0">📦 Carry-Forward</span>
        <span v-if="carryIn > 0">Received <strong>{{ carryIn }} pts</strong> from last month</span>
        <span v-if="carryIn > 0 && carryOut > 0">·</span>
        <span v-if="carryOut > 0"><strong>{{ carryOut }} pts</strong> excess → next month</span>
        <span class="ml-auto text-indigo-500 font-medium">Effective: {{ effectivePts }} pts</span>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Left: Core Commitments -->
      <div class="card overflow-hidden">
        <div class="px-5 pt-5 pb-3 flex items-center justify-between">
          <h3 class="text-sm font-bold text-txt-heading">Core Commitments</h3>
          <span class="text-xs text-txt-muted">{{ myKpis.length }} KPIs · 50%</span>
        </div>
        <div v-if="kpiStatuses.length">
          <div v-for="kpi in kpiStatuses" :key="kpi.id"
            class="flex items-center gap-3 px-5 py-3 border-t border-line/50 hover:bg-surface-gray/30 transition-colors"
          >
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-txt-body truncate">{{ kpi.label }}</p>
              <p class="text-[10px] text-txt-muted mt-0.5 line-clamp-1">{{ kpi.description }}</p>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              <span v-if="kpi.rating > 0" class="tag border text-[10px]" :class="ratingBg(kpi.rating)">{{ kpi.rating }}/5</span>
              <span class="tag text-[10px]" :class="kpi.statusCls">{{ kpi.statusLabel }}</span>
            </div>
          </div>
        </div>
        <div v-else class="px-5 py-8 text-center text-sm text-txt-muted">
          No evaluation submitted for this month yet.
        </div>
      </div>

      <!-- Right: Top 5 Leaderboard -->
      <div class="card overflow-hidden">
        <div class="px-5 pt-5 pb-3 flex items-center justify-between">
          <h3 class="text-sm font-bold text-txt-heading">Top 5 — {{ formatMonth(selectedMonth) }}</h3>
          <router-link to="/leaderboard" class="text-xs text-brand-primary font-medium hover:underline">View all →</router-link>
        </div>
        <div v-for="(s, i) in top5" :key="s.id"
          class="flex items-center gap-3 px-5 py-3 border-t border-line/50 transition-colors"
          :class="s.id === currentUser.id ? 'bg-brand-primary/5 border-l-2 border-l-brand-primary' : 'hover:bg-surface-gray/30'"
        >
          <div class="w-8 text-center shrink-0">
            <span v-if="medal(i)" class="text-lg">{{ medal(i) }}</span>
            <span v-else class="text-sm font-bold text-txt-disabled">{{ i + 1 }}</span>
          </div>
          <div :class="[s.avatarColor || 'bg-brand-primary', 'w-8 h-8 rounded-full text-white text-[10px] font-bold flex items-center justify-center shrink-0']">{{ s.initials }}</div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-txt-body truncate">
              {{ s.name }}
              <span v-if="s.id === currentUser.id" class="text-[10px] text-brand-primary font-normal ml-1">(You)</span>
            </p>
            <p class="text-[10px] text-txt-muted">{{ s.label }} · {{ s.project?.name || '' }}</p>
          </div>
          <div class="text-right shrink-0">
            <p class="text-base font-bold" :style="{ color: gradeColor(s.score.grade.color) }">{{ s.score.total }}</p>
            <div class="flex items-center gap-1 justify-end mt-0.5">
              <span class="text-[9px] text-txt-muted">{{ s.score.commitScore }}</span>
              <span class="text-[7px] text-txt-disabled">·</span>
              <span class="text-[9px] text-txt-muted">{{ s.score.contribScore }}</span>
              <span class="text-[7px] text-txt-disabled">·</span>
              <span class="text-[9px] text-txt-muted">{{ s.score.behaviourScore }}</span>
            </div>
          </div>
        </div>

        <!-- My position if not in top 5 -->
        <div v-if="myRank && myRank > 5" class="px-5 py-3 border-t border-line bg-surface-gray/30">
          <div class="flex items-center gap-3">
            <div class="w-8 text-center shrink-0">
              <span class="text-sm font-bold text-txt-disabled">{{ myRank }}</span>
            </div>
            <div :class="[currentUser.avatarColor || 'bg-brand-primary', 'w-8 h-8 rounded-full text-white text-[10px] font-bold flex items-center justify-center shrink-0']">{{ currentUser.initials }}</div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-txt-body">{{ currentUser.name }} <span class="text-[10px] text-brand-primary font-normal ml-1">(You)</span></p>
            </div>
            <p class="text-base font-bold" :style="{ color: gradeColor(myScore.grade.color) }">{{ myScore.total }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
