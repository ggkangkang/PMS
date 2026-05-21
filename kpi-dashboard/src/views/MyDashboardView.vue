<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend, Filler
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)
import {
  getUserById, getProjectById, getMonthlyEval, getKPIsForRole,
  getCommitmentScore, getContributionPoints, getContributionScore, getEvalStatusInfo,
  availableMonths, formatMonth, getCarryForwardPoints, contributionBaseline,
  getFinalMonthlyScore, getDepartmentStaff, getScoreGrade,
  projects, getDirectorSubordinates, getProjectAvgScore, getSubordinates,
} from '../data/dummyData'

const currentUser = computed(() => { try { return JSON.parse(localStorage.getItem('currentUser') || '{}') } catch { return {} } })
const router = useRouter()
const selectedMonth = ref(availableMonths[0].value)
const isDirector = computed(() => currentUser.value.role === 'project-director')
const isPM = computed(() => currentUser.value.role === 'project-manager')
const project = computed(() => getProjectById(currentUser.value.projectId))

// ─── Staff / PM / Manager shared logic ──────────────────────────────
const myEval = computed(() => getMonthlyEval(currentUser.value.id, selectedMonth.value))
const myScore = computed(() => getFinalMonthlyScore(currentUser.value.id, selectedMonth.value))
const myKpis = computed(() => getKPIsForRole(currentUser.value.role))

const myContribPts = computed(() => myEval.value ? getContributionPoints(myEval.value.self?.contributions || []) : 0)
const carryIn = computed(() => getCarryForwardPoints(currentUser.value.id, selectedMonth.value))
const effectivePts = computed(() => myContribPts.value + carryIn.value)
const topTierMin = contributionBaseline.tiers[contributionBaseline.tiers.length - 1].min
const carryOut = computed(() => Math.max(0, effectivePts.value - topTierMin))

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

// Leaderboard pool — PM sees their own team, others see department
const leaderboardPool = computed(() => {
  if (isPM.value) {
    return getSubordinates(currentUser.value.id)
  }
  return getDepartmentStaff()
})

const top5 = computed(() => {
  return leaderboardPool.value
    .map(s => ({
      ...s,
      score: getFinalMonthlyScore(s.id, selectedMonth.value),
      project: getProjectById(s.projectId),
    }))
    .sort((a, b) => b.score.total - a.score.total)
    .slice(0, 5)
})

const myRank = computed(() => {
  if (isPM.value) return null // PM is not ranked among their own subordinates
  const all = leaderboardPool.value
    .map(s => ({ id: s.id, total: getFinalMonthlyScore(s.id, selectedMonth.value).total }))
    .sort((a, b) => b.total - a.total)
  const idx = all.findIndex(s => s.id === currentUser.value.id)
  return idx >= 0 ? idx + 1 : null
})

const leaderboardTitle = computed(() => {
  if (isPM.value) return `My Team — ${formatMonth(selectedMonth.value)}`
  return `Top 5 — ${formatMonth(selectedMonth.value)}`
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

// Evaluation status
const evalStatus = computed(() => {
  const ev = myEval.value
  if (!ev) return { label: 'Not Started', cls: 'bg-gray-100 text-gray-500', icon: '📝' }
  if (ev.status === 'reviewed') return { label: 'Reviewed', cls: 'bg-green-100 text-green-700', icon: '✅' }
  if (ev.status === 'submitted') return { label: 'Submitted', cls: 'bg-blue-100 text-blue-700', icon: '📤' }
  return { label: 'Draft', cls: 'bg-amber-100 text-amber-700', icon: '✏️' }
})

function goToEvaluation() { router.push('/evaluation') }
function goToLeaderboard() { router.push('/leaderboard') }
function goToChangelog() { router.push('/changelog') }
function goToPMTeam() { router.push('/pm-team') }
function goToTeam() { router.push('/team') }

// ─── Project Director specific logic ─────────────────────────────────
const directorProjects = computed(() => {
  if (!isDirector.value) return []
  return (currentUser.value.projects || []).map(pid => getProjectById(pid)).filter(Boolean)
})

const allSubordinates = computed(() => {
  if (!isDirector.value) return []
  return getDirectorSubordinates(currentUser.value.id)
})

// People who submitted their eval but PD hasn't rated them yet (PMs who report to PD)
const pendingPDRating = computed(() => {
  if (!isDirector.value) return []
  const results = []
  allSubordinates.value.forEach(sub => {
    const ev = getMonthlyEval(sub.id, selectedMonth.value)
    if (ev && ev.status === 'submitted' && !ev.supervisor) {
      // Only PMs report directly to PD for rating
      if (sub.reportsTo === currentUser.value.id) {
        results.push({ ...sub, eval: ev, project: getProjectById(sub.projectId) })
      }
    }
  })
  return results
})

// People who haven't completed their self-evaluation (draft or not started)
const incompleteEvals = computed(() => {
  if (!isDirector.value) return []
  const results = []
  allSubordinates.value.forEach(sub => {
    const ev = getMonthlyEval(sub.id, selectedMonth.value)
    const status = ev ? ev.status : 'not-started'
    if (status === 'draft' || status === 'not-started') {
      results.push({ ...sub, evalStatus: status, project: getProjectById(sub.projectId) })
    }
  })
  return results
})

// 6-month trend data
const trendMonths = computed(() => availableMonths.map(m => m.value).reverse())
const trendData = computed(() => {
  if (!isDirector.value) return []
  return directorProjects.value.map(proj => {
    const scores = trendMonths.value.map(month => getProjectAvgScore(proj.id, month))
    return { project: proj, scores }
  })
})

const trendMax = computed(() => {
  let max = 0
  trendData.value.forEach(d => d.scores.forEach(s => { if (s > max) max = s }))
  return Math.ceil(Math.max(max, 60) / 10) * 10 // round up to nearest 10
})

const trendMin = computed(() => {
  let min = Infinity
  trendData.value.forEach(d => d.scores.forEach(s => { if (s > 0 && s < min) min = s }))
  return Math.floor(Math.max(0, (min === Infinity ? 0 : min) - 10) / 10) * 10
})

function shortMonth(monthStr) {
  const [y, m] = monthStr.split('-')
  const date = new Date(y, parseInt(m) - 1)
  return date.toLocaleDateString('en-MY', { month: 'short' })
}

// Expanded palette for 10+ projects
const projectHexColors = [
  '#4f46e5', // indigo
  '#ec4899', // pink
  '#059669', // emerald
  '#f59e0b', // amber
  '#8b5cf6', // violet
  '#ef4444', // red
  '#06b6d4', // cyan
  '#f97316', // orange
  '#14b8a6', // teal
  '#6366f1', // blue-indigo
  '#d946ef', // fuchsia
  '#84cc16', // lime
]

function getProjectColor(index) {
  return projectHexColors[index % projectHexColors.length]
}

// Chart.js data & options
const chartData = computed(() => {
  const labels = trendMonths.value.map(m => shortMonth(m))
  const datasets = trendData.value.map((td, pi) => ({
    label: td.project.name,
    data: td.scores,
    borderColor: getProjectColor(pi),
    backgroundColor: getProjectColor(pi) + '18',
    pointBackgroundColor: getProjectColor(pi),
    pointBorderColor: '#ffffff',
    pointBorderWidth: 2,
    pointRadius: 5,
    pointHoverRadius: 8,
    borderWidth: 3,
    tension: 0.4,       // smooth curve
    fill: false,
  }))
  return { labels, datasets }
})

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: 'index', intersect: false },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#1f2937',
      titleColor: '#f9fafb',
      bodyColor: '#e5e7eb',
      titleFont: { size: 12, weight: '600' },
      bodyFont: { size: 11 },
      padding: { x: 12, y: 8 },
      cornerRadius: 8,
      boxPadding: 4,
      usePointStyle: true,
      callbacks: {
        label: ctx => `${ctx.dataset.label}: ${ctx.parsed.y}`,
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: '#6b7280', font: { size: 11, weight: '500' } },
      border: { display: false },
    },
    y: {
      min: trendMin.value,
      max: trendMax.value,
      grid: { color: '#f3f4f6', drawBorder: false },
      ticks: { color: '#9ca3af', font: { size: 10 }, stepSize: 10 },
      border: { display: false, dash: [4, 3] },
    },
  },
}))

// Summary stats for PD
const totalStaff = computed(() => allSubordinates.value.length)
const pendingCount = computed(() => pendingPDRating.value.length)
const incompleteCount = computed(() => incompleteEvals.value.length)
const completedCount = computed(() => totalStaff.value - incompleteCount.value)

function evalStatusLabel(status) {
  if (status === 'draft') return { label: 'Draft', cls: 'bg-amber-100 text-amber-700' }
  return { label: 'Not Started', cls: 'bg-gray-100 text-gray-500' }
}

// ─── Project Manager specific logic ──────────────────────────────────
const pmSubordinates = computed(() => {
  if (!isPM.value) return []
  return getSubordinates(currentUser.value.id)
})

// Team members who submitted their eval but PM hasn't rated them yet
const pendingPMRating = computed(() => {
  if (!isPM.value) return []
  return pmSubordinates.value.filter(sub => {
    const ev = getMonthlyEval(sub.id, selectedMonth.value)
    return ev && ev.status === 'submitted' && !ev.supervisor
  }).map(sub => ({ ...sub, eval: getMonthlyEval(sub.id, selectedMonth.value), project: getProjectById(sub.projectId) }))
})

// Team members who haven't completed their self-evaluation
const incompletePMEvals = computed(() => {
  if (!isPM.value) return []
  return pmSubordinates.value.filter(sub => {
    const ev = getMonthlyEval(sub.id, selectedMonth.value)
    const status = ev ? ev.status : 'not-started'
    return status === 'draft' || status === 'not-started'
  }).map(sub => {
    const ev = getMonthlyEval(sub.id, selectedMonth.value)
    return { ...sub, evalStatus: ev ? ev.status : 'not-started', project: getProjectById(sub.projectId) }
  })
})

const pmTotalStaff = computed(() => pmSubordinates.value.length)
const pmPendingCount = computed(() => pendingPMRating.value.length)
const pmIncompleteCount = computed(() => incompletePMEvals.value.length)
const pmCompletedCount = computed(() => pmTotalStaff.value - pmIncompleteCount.value)
</script>

<template>
  <div class="max-w-5xl mx-auto animate-fade-in">

    <!-- ═══════════════════════════════════════════════════════════════════
         PROJECT DIRECTOR DASHBOARD
         ═══════════════════════════════════════════════════════════════════ -->
    <template v-if="isDirector">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-lg font-bold text-txt-heading">Director Dashboard</h1>
          <p class="text-sm text-txt-subtitle mt-0.5">{{ currentUser.name }} · {{ formatMonth(selectedMonth) }}</p>
        </div>
        <select v-model="selectedMonth" class="select-field w-40">
          <option v-for="m in availableMonths" :key="m.value" :value="m.value">{{ m.label }}</option>
        </select>
      </div>

      <!-- Summary Stats -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div class="card p-4 text-center">
          <p class="text-2xl font-bold text-brand-primary">{{ totalStaff }}</p>
          <p class="text-[11px] text-txt-muted font-medium mt-1">Total Staff</p>
        </div>
        <div class="card p-4 text-center">
          <p class="text-2xl font-bold text-emerald-600">{{ completedCount }}</p>
          <p class="text-[11px] text-txt-muted font-medium mt-1">Eval Completed</p>
        </div>
        <div class="card p-4 text-center border-2" :class="pendingCount > 0 ? 'border-orange-200 bg-orange-50/30' : 'border-transparent'">
          <p class="text-2xl font-bold" :class="pendingCount > 0 ? 'text-orange-600' : 'text-gray-400'">{{ pendingCount }}</p>
          <p class="text-[11px] font-medium mt-1" :class="pendingCount > 0 ? 'text-orange-500' : 'text-txt-muted'">Pending Your Rating</p>
        </div>
        <div class="card p-4 text-center border-2" :class="incompleteCount > 0 ? 'border-red-200 bg-red-50/30' : 'border-transparent'">
          <p class="text-2xl font-bold" :class="incompleteCount > 0 ? 'text-red-600' : 'text-gray-400'">{{ incompleteCount }}</p>
          <p class="text-[11px] font-medium mt-1" :class="incompleteCount > 0 ? 'text-red-500' : 'text-txt-muted'">Eval Incomplete</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <!-- Pending Your Rating -->
        <div class="card overflow-hidden">
          <div class="px-5 pt-5 pb-3 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <h3 class="text-sm font-bold text-txt-heading">Pending Your Rating</h3>
              <span v-if="pendingPDRating.length" class="tag bg-orange-100 text-orange-700 text-[10px]">{{ pendingPDRating.length }}</span>
            </div>
            <span class="text-[10px] text-txt-muted">{{ formatMonth(selectedMonth) }}</span>
          </div>
          <div v-if="pendingPDRating.length">
            <div v-for="person in pendingPDRating" :key="person.id"
              class="flex items-center gap-3 px-5 py-3 border-t border-line/50 hover:bg-surface-gray/30 transition-colors"
            >
              <div :class="[person.avatarColor || 'bg-brand-primary', 'w-9 h-9 rounded-full text-white text-[10px] font-bold flex items-center justify-center shrink-0']">{{ person.initials }}</div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-txt-body truncate">{{ person.name }}</p>
                <p class="text-[10px] text-txt-muted">{{ person.label }} · {{ person.project?.name || '' }}</p>
              </div>
              <div class="flex items-center gap-2 shrink-0">
                <span class="tag bg-orange-100 text-orange-700 text-[10px]">⏳ Awaiting</span>
              </div>
            </div>
          </div>
          <div v-else class="px-5 py-8 text-center">
            <p class="text-sm text-txt-muted">✅ All caught up!</p>
            <p class="text-[10px] text-txt-disabled mt-1">No evaluations pending your rating</p>
          </div>
        </div>

        <!-- Incomplete Evaluations -->
        <div class="card overflow-hidden">
          <div class="px-5 pt-5 pb-3 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <h3 class="text-sm font-bold text-txt-heading">Incomplete Evaluations</h3>
              <span v-if="incompleteEvals.length" class="tag bg-red-100 text-red-700 text-[10px]">{{ incompleteEvals.length }}</span>
            </div>
            <span class="text-[10px] text-txt-muted">{{ formatMonth(selectedMonth) }}</span>
          </div>
          <div v-if="incompleteEvals.length">
            <div v-for="person in incompleteEvals" :key="person.id"
              class="flex items-center gap-3 px-5 py-3 border-t border-line/50 hover:bg-surface-gray/30 transition-colors"
            >
              <div :class="[person.avatarColor || 'bg-brand-primary', 'w-9 h-9 rounded-full text-white text-[10px] font-bold flex items-center justify-center shrink-0']">{{ person.initials }}</div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-txt-body truncate">{{ person.name }}</p>
                <p class="text-[10px] text-txt-muted">{{ person.label }} · {{ person.project?.name || '' }}</p>
              </div>
              <div class="shrink-0">
                <span class="tag text-[10px]" :class="evalStatusLabel(person.evalStatus).cls">{{ evalStatusLabel(person.evalStatus).label }}</span>
              </div>
            </div>
          </div>
          <div v-else class="px-5 py-8 text-center">
            <p class="text-sm text-txt-muted">🎉 All evaluations completed!</p>
            <p class="text-[10px] text-txt-disabled mt-1">Everyone has submitted for this month</p>
          </div>
        </div>
      </div>

      <!-- 6-Month Project Performance Trend (Line Chart) -->
      <div class="card p-6">
        <div class="flex items-start justify-between mb-5 gap-4">
          <div>
            <h3 class="text-sm font-bold text-txt-heading">Project Performance Trend</h3>
            <p class="text-[11px] text-txt-muted mt-0.5">Average team score per project over 6 months</p>
          </div>
          <div class="flex flex-wrap items-center gap-x-4 gap-y-1.5 justify-end">
            <div v-for="(proj, pi) in directorProjects" :key="proj.id" class="flex items-center gap-1.5">
              <div class="w-2.5 h-2.5 rounded-full shrink-0" :style="{ backgroundColor: getProjectColor(pi) }"></div>
              <span class="text-[10px] text-txt-subtitle font-medium whitespace-nowrap">{{ proj.name }}</span>
            </div>
          </div>
        </div>

        <!-- Chart.js Line Chart -->
        <div class="w-full" style="height: 260px; min-width: 400px;">
          <Line :data="chartData" :options="chartOptions" />
        </div>

        <!-- Project summary row -->
        <div class="flex flex-wrap gap-3 mt-5 border-t border-line pt-4">
          <div v-for="(td, pi) in trendData" :key="td.project.id"
            class="flex-1 min-w-[100px] p-3 rounded-container border text-center"
            :style="{ borderColor: getProjectColor(pi) + '40', backgroundColor: getProjectColor(pi) + '08' }"
          >
            <p class="text-lg font-bold" :style="{ color: getProjectColor(pi) }">{{ td.scores[td.scores.length - 1] || '—' }}</p>
            <p class="text-[10px] font-medium mt-0.5" :style="{ color: getProjectColor(pi) }">{{ td.project.name }}</p>
            <p class="text-[9px] text-txt-muted mt-0.5">Current Avg</p>
          </div>
        </div>
      </div>
    </template>

    <!-- ═══════════════════════════════════════════════════════════════════
         STAFF / PM / MANAGER DASHBOARD (original)
         ═══════════════════════════════════════════════════════════════════ -->
    <template v-else>
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


      <!-- ═══ PM ONLY: Summary Stats + Pending/Incomplete ═══ -->
      <template v-if="isPM">
        <!-- Summary Stats -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div class="card p-4 text-center">
            <p class="text-2xl font-bold text-brand-primary">{{ pmTotalStaff }}</p>
            <p class="text-[11px] text-txt-muted font-medium mt-1">Team Members</p>
          </div>
          <div class="card p-4 text-center">
            <p class="text-2xl font-bold text-emerald-600">{{ pmCompletedCount }}</p>
            <p class="text-[11px] text-txt-muted font-medium mt-1">Eval Completed</p>
          </div>
          <div class="card p-4 text-center border-2" :class="pmPendingCount > 0 ? 'border-orange-200 bg-orange-50/30' : 'border-transparent'">
            <p class="text-2xl font-bold" :class="pmPendingCount > 0 ? 'text-orange-600' : 'text-gray-400'">{{ pmPendingCount }}</p>
            <p class="text-[11px] font-medium mt-1" :class="pmPendingCount > 0 ? 'text-orange-500' : 'text-txt-muted'">Pending Your Rating</p>
          </div>
          <div class="card p-4 text-center border-2" :class="pmIncompleteCount > 0 ? 'border-red-200 bg-red-50/30' : 'border-transparent'">
            <p class="text-2xl font-bold" :class="pmIncompleteCount > 0 ? 'text-red-600' : 'text-gray-400'">{{ pmIncompleteCount }}</p>
            <p class="text-[11px] font-medium mt-1" :class="pmIncompleteCount > 0 ? 'text-red-500' : 'text-txt-muted'">Eval Incomplete</p>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <!-- Pending Your Rating -->
          <div class="card overflow-hidden">
            <div class="px-5 pt-5 pb-3 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <h3 class="text-sm font-bold text-txt-heading">Pending Your Rating</h3>
                <span v-if="pendingPMRating.length" class="tag bg-orange-100 text-orange-700 text-[10px]">{{ pendingPMRating.length }}</span>
              </div>
              <span class="text-[10px] text-txt-muted">{{ formatMonth(selectedMonth) }}</span>
            </div>
            <div v-if="pendingPMRating.length">
              <div v-for="person in pendingPMRating" :key="person.id"
                class="flex items-center gap-3 px-5 py-3 border-t border-line/50 hover:bg-surface-gray/30 transition-colors cursor-pointer"
                @click="goToPMTeam"
              >
                <div :class="[person.avatarColor || 'bg-brand-primary', 'w-9 h-9 rounded-full text-white text-[10px] font-bold flex items-center justify-center shrink-0']">{{ person.initials }}</div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold text-txt-body truncate">{{ person.name }}</p>
                  <p class="text-[10px] text-txt-muted">{{ person.label }}</p>
                </div>
                <div class="flex items-center gap-2 shrink-0">
                  <span class="tag bg-orange-100 text-orange-700 text-[10px]">⏳ Awaiting</span>
                </div>
              </div>
            </div>
            <div v-else class="px-5 py-8 text-center">
              <p class="text-sm text-txt-muted">✅ All caught up!</p>
              <p class="text-[10px] text-txt-disabled mt-1">No evaluations pending your rating</p>
            </div>
          </div>

          <!-- Incomplete Evaluations -->
          <div class="card overflow-hidden">
            <div class="px-5 pt-5 pb-3 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <h3 class="text-sm font-bold text-txt-heading">Incomplete Evaluations</h3>
                <span v-if="incompletePMEvals.length" class="tag bg-red-100 text-red-700 text-[10px]">{{ incompletePMEvals.length }}</span>
              </div>
              <span class="text-[10px] text-txt-muted">{{ formatMonth(selectedMonth) }}</span>
            </div>
            <div v-if="incompletePMEvals.length">
              <div v-for="person in incompletePMEvals" :key="person.id"
                class="flex items-center gap-3 px-5 py-3 border-t border-line/50 hover:bg-surface-gray/30 transition-colors"
              >
                <div :class="[person.avatarColor || 'bg-brand-primary', 'w-9 h-9 rounded-full text-white text-[10px] font-bold flex items-center justify-center shrink-0']">{{ person.initials }}</div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold text-txt-body truncate">{{ person.name }}</p>
                  <p class="text-[10px] text-txt-muted">{{ person.label }}</p>
                </div>
                <div class="shrink-0">
                  <span class="tag text-[10px]" :class="evalStatusLabel(person.evalStatus).cls">{{ evalStatusLabel(person.evalStatus).label }}</span>
                </div>
              </div>
            </div>
            <div v-else class="px-5 py-8 text-center">
              <p class="text-sm text-txt-muted">🎉 All evaluations completed!</p>
              <p class="text-[10px] text-txt-disabled mt-1">Everyone has submitted for this month</p>
            </div>
          </div>
        </div>
      </template>

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

        <!-- Right: Team / Top 5 Leaderboard -->
        <div class="card overflow-hidden">
          <div class="px-5 pt-5 pb-3 flex items-center justify-between">
            <h3 class="text-sm font-bold text-txt-heading">{{ leaderboardTitle }}</h3>
            <router-link v-if="!isPM" to="/leaderboard" class="text-xs text-brand-primary font-medium hover:underline">View all →</router-link>
            <span v-else class="text-xs text-txt-muted">{{ leaderboardPool.length }} members</span>
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
    </template>
  </div>
</template>
