<script setup>
import { ref, computed } from 'vue'
import {
  getUserById, getProjectById, getSubordinates, getMonthlyEval, getKPIsForRole,
  getCommitmentScore, getContributionPoints, getContributionScore, getEvalStatusInfo,
  availableMonths, formatMonth,
} from '../data/dummyData'

const currentUser = computed(() => { try { return JSON.parse(localStorage.getItem('currentUser') || '{}') } catch { return {} } })
const selectedMonth = ref(availableMonths[0].value)
const isPM = computed(() => currentUser.value.role === 'project-manager')
const project = computed(() => getProjectById(currentUser.value.projectId))
const subordinates = computed(() => isPM.value ? getSubordinates(currentUser.value.id) : [])

// Filter pills
const activeFilter = ref('all')
const filters = computed(() => {
  if (!isPM.value) return []
  const all = subordinates.value.length
  const submitted = subordinates.value.filter(s => {
    const ev = getMonthlyEval(s.id, selectedMonth.value)
    return ev && ['submitted', 'reviewed'].includes(ev.status)
  }).length
  const pending = all - submitted
  return [
    { id: 'all', label: 'All', count: all },
    { id: 'submitted', label: 'Submitted', count: submitted },
    { id: 'pending', label: 'Pending', count: pending },
  ]
})

const filteredSubs = computed(() => {
  if (activeFilter.value === 'all') return subordinates.value
  return subordinates.value.filter(s => {
    const ev = getMonthlyEval(s.id, selectedMonth.value)
    const isSubmitted = ev && ['submitted', 'reviewed'].includes(ev.status)
    return activeFilter.value === 'submitted' ? isSubmitted : !isSubmitted
  })
})

function getEvalSummary(userId) {
  const ev = getMonthlyEval(userId, selectedMonth.value)
  if (!ev) return { status: 'not-started', commitScore: 0, contribPts: 0, rated: false }
  const commitScore = getCommitmentScore(ev.self?.commitmentRatings || {})
  const contribPts = getContributionPoints(ev.self?.contributions || [])
  return { status: ev.status, commitScore, contribPts, rated: !!ev.supervisor }
}

// Staff: own stats
const myEval = computed(() => getMonthlyEval(currentUser.value.id, selectedMonth.value))
const myCommitScore = computed(() => myEval.value ? getCommitmentScore(myEval.value.self?.commitmentRatings || {}) : 0)
const myContribPts = computed(() => myEval.value ? getContributionPoints(myEval.value.self?.contributions || []) : 0)
const myContribScore = computed(() => getContributionScore(myContribPts.value))
</script>

<template>
  <div class="animate-fade-in" :class="isPM ? 'max-w-6xl mx-auto flex gap-6' : 'max-w-5xl mx-auto'">
    <!-- Main Content -->
    <div class="flex-1 min-w-0">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-lg font-bold text-txt-heading">{{ isPM ? 'Team Overview' : 'My Dashboard' }}</h1>
          <p class="text-sm text-txt-subtitle mt-0.5">{{ project?.name || 'All Projects' }} · {{ formatMonth(selectedMonth) }}</p>
        </div>
        <select v-model="selectedMonth" class="select-field w-40">
          <option v-for="m in availableMonths" :key="m.value" :value="m.value">{{ m.label }}</option>
        </select>
      </div>

      <!-- ═══ STAFF VIEW: Profile Card (Skool leaderboard style) ═══ -->
      <div v-if="!isPM" class="card p-8 mb-6 text-center">
        <div :class="[currentUser.avatarColor || 'bg-brand-primary', 'w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 ring-4 ring-white shadow-md']">{{ currentUser.initials }}</div>
        <h2 class="text-lg font-bold text-txt-heading">{{ currentUser.name }}</h2>
        <p class="text-sm text-txt-subtitle mt-0.5">{{ currentUser.label }}</p>
        <p class="text-xs text-txt-muted mt-1">{{ project?.name || '' }} · {{ currentUser.id }}</p>
        <div v-if="myEval" class="mt-3">
          <span class="tag" :class="getEvalStatusInfo(myEval.status).cls">{{ getEvalStatusInfo(myEval.status).label }}</span>
        </div>
      </div>

      <!-- Staff: stats -->
      <div v-if="!isPM" class="card mb-6">
        <div class="flex items-center justify-center py-5">
          <div class="stat-block">
            <p class="stat-value text-brand-primary">{{ myCommitScore }}<span class="text-sm text-txt-muted font-normal">/50</span></p>
            <p class="stat-label">Commitments</p>
          </div>
          <div class="stat-block">
            <p class="stat-value">{{ myContribPts }} <span class="text-sm text-txt-muted font-normal">pts</span></p>
            <p class="stat-label">Contributions</p>
          </div>
          <div class="stat-block">
            <p class="stat-value">{{ myContribScore }}<span class="text-sm text-txt-muted font-normal">/30</span></p>
            <p class="stat-label">Contribution Score</p>
          </div>
        </div>
      </div>

      <!-- Staff: contributions -->
      <div v-if="!isPM" class="card p-6">
        <h3 class="text-[15px] font-bold text-txt-heading mb-4">Contributions This Month</h3>
        <div v-if="myEval?.self?.contributions?.length" class="space-y-2">
          <div v-for="c in myEval.self.contributions" :key="c.id" class="flex items-center justify-between p-3 rounded-container bg-surface-gray border border-line/50 hover:bg-surface-gray-strong/30 transition-colors">
            <span class="text-sm text-txt-body">{{ c.type }}</span>
            <span class="tag tag-info text-[10px]">+{{ c.points }}</span>
          </div>
        </div>
        <p v-else class="text-sm text-txt-muted text-center py-6">No contributions logged for this month</p>
      </div>

      <!-- ═══ PM VIEW: Filter Pills + Member List ═══ -->
      <template v-if="isPM">
        <!-- Filter pills (Skool Members style) -->
        <div class="flex items-center justify-between mb-5">
          <div class="flex items-center gap-2">
            <button
              v-for="f in filters" :key="f.id"
              @click="activeFilter = f.id"
              :class="['filter-pill', { active: activeFilter === f.id }]"
            >{{ f.label }} <span class="font-bold ml-0.5">{{ f.count }}</span></button>
          </div>
        </div>

        <!-- Member list cards (Skool Members style) -->
        <div class="card overflow-hidden">
          <div v-for="(sub, i) in filteredSubs" :key="sub.id"
            class="flex items-start gap-4 p-5 hover:bg-surface-gray/40 transition-colors"
            :class="i < filteredSubs.length - 1 ? 'border-b border-line/50' : ''"
          >
            <!-- Avatar with level badge -->
            <div class="relative shrink-0">
              <div :class="[sub.avatarColor || 'bg-brand-primary', 'w-12 h-12 rounded-full text-white text-sm font-bold flex items-center justify-center']">{{ sub.initials }}</div>
              <div v-if="getEvalSummary(sub.id).rated" class="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-[9px] font-bold ring-2 ring-white">✓</div>
            </div>

            <!-- Info -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <h4 class="text-[15px] font-bold text-txt-heading">{{ sub.name }}</h4>
                <span class="tag text-[10px]" :class="getEvalStatusInfo(getEvalSummary(sub.id).status).cls">{{ getEvalStatusInfo(getEvalSummary(sub.id).status).label }}</span>
              </div>
              <p class="text-sm text-txt-muted mt-0.5">{{ sub.label }} · {{ sub.id }}</p>
              <!-- Stats row like Skool member metadata -->
              <div class="flex items-center gap-4 mt-2 text-xs text-txt-subtitle">
                <span class="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 256 256" fill="currentColor"><path d="M200,32H163.74a47.92,47.92,0,0,0-71.48,0H56A16,16,0,0,0,40,48V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V48A16,16,0,0,0,200,32Zm-72,0a32,32,0,0,1,32,32H96A32,32,0,0,1,128,32Zm72,184H56V48H82.75A47.93,47.93,0,0,0,80,64v8a8,8,0,0,0,8,8h80a8,8,0,0,0,8-8V64a47.93,47.93,0,0,0-2.75-16H200Z"/></svg>
                  Commit: <strong class="text-brand-primary">{{ getEvalSummary(sub.id).commitScore }}/50</strong>
                </span>
                <span class="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 256 256" fill="currentColor"><path d="M234.29,114.85l-45,38.83L203,211.75a16.4,16.4,0,0,1-24.5,17.82L128,198.49,77.47,229.57A16.4,16.4,0,0,1,53,211.75l13.76-58.07-45-38.83A16.46,16.46,0,0,1,31.08,91l59.46-5.15,23.21-55.36a16.4,16.4,0,0,1,30.5,0l23.21,55.36L226.92,91a16.46,16.46,0,0,1,7.37,23.85Z"/></svg>
                  Contrib: <strong class="text-txt-heading">{{ getEvalSummary(sub.id).contribPts }} pts</strong>
                </span>
              </div>
            </div>

            <!-- Action -->
            <div class="shrink-0 flex items-center gap-2 pt-1">
              <span v-if="getEvalSummary(sub.id).rated" class="text-xs text-txt-success font-semibold">PM Rated</span>
              <span v-else class="text-xs text-txt-muted">Not Rated</span>
            </div>
          </div>

          <!-- Empty state -->
          <div v-if="filteredSubs.length === 0" class="py-12 text-center text-sm text-txt-muted">
            No team members match this filter
          </div>
        </div>
      </template>
    </div>

    <!-- ═══ RIGHT SIDEBAR (Skool community info style) — PM only ═══ -->
    <aside v-if="isPM" class="w-72 shrink-0 hidden lg:block">
      <div class="card overflow-hidden sticky top-6">
        <!-- Cover -->
        <div class="h-24 bg-gradient-to-br from-brand-primary to-blue-400"></div>

        <div class="p-5">
          <h3 class="text-[15px] font-bold text-txt-heading">{{ project?.name || 'Project' }}</h3>
          <p class="text-xs text-txt-muted mt-0.5">{{ project?.location }} · {{ project?.id }}</p>
          <p class="text-sm text-txt-subtitle mt-2">{{ formatMonth(selectedMonth) }} evaluation cycle</p>

          <!-- Stats (Skool style) -->
          <div class="flex items-center justify-center mt-4 pt-4 border-t border-line">
            <div class="stat-block">
              <p class="stat-value text-base">{{ subordinates.length }}</p>
              <p class="stat-label">Members</p>
            </div>
            <div class="stat-block">
              <p class="stat-value text-base">{{ subordinates.filter(s => { const ev = getMonthlyEval(s.id, selectedMonth); return ev && ['submitted','reviewed'].includes(ev.status) }).length }}</p>
              <p class="stat-label">Submitted</p>
            </div>
            <div class="stat-block">
              <p class="stat-value text-base">{{ subordinates.filter(s => { const ev = getMonthlyEval(s.id, selectedMonth); return ev?.supervisor }).length }}</p>
              <p class="stat-label">Rated</p>
            </div>
          </div>

          <!-- Team avatars -->
          <div class="flex items-center gap-1 mt-4">
            <div v-for="sub in subordinates.slice(0, 5)" :key="sub.id"
              :class="[sub.avatarColor || 'bg-brand-primary', 'w-7 h-7 rounded-full text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white -ml-1 first:ml-0']"
              :title="sub.name"
            >{{ sub.initials }}</div>
            <span v-if="subordinates.length > 5" class="text-xs text-txt-muted ml-1">+{{ subordinates.length - 5 }}</span>
          </div>

          <!-- Action -->
          <button class="btn-outline w-full mt-4 text-xs">VIEW ALL EVALUATIONS</button>
        </div>
      </div>
    </aside>
  </div>
</template>
