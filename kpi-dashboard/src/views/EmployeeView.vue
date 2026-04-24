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

function getEvalSummary(userId) {
  const ev = getMonthlyEval(userId, selectedMonth.value)
  if (!ev) return { status: 'not-started', commitScore: 0, contribPts: 0, rated: false }
  const commitScore = getCommitmentScore(ev.self?.commitmentRatings || {})
  const contribPts = getContributionPoints(ev.self?.contributions || [])
  return {
    status: ev.status,
    commitScore,
    contribPts,
    rated: !!ev.supervisor,
  }
}

// Staff: own stats
const myEval = computed(() => getMonthlyEval(currentUser.value.id, selectedMonth.value))
const myCommitScore = computed(() => myEval.value ? getCommitmentScore(myEval.value.self?.commitmentRatings || {}) : 0)
const myContribPts = computed(() => myEval.value ? getContributionPoints(myEval.value.self?.contributions || []) : 0)
const myContribScore = computed(() => getContributionScore(myContribPts.value))
</script>

<template>
  <div class="max-w-6xl mx-auto animate-fade-in">
    <!-- Header -->
    <div class="flex items-center justify-between mb-5">
      <div>
        <h1 class="text-lg font-bold text-txt-heading">{{ isPM ? 'Team Overview' : 'My Dashboard' }}</h1>
        <p class="text-xs text-txt-subtitle">{{ project?.name || 'All Projects' }} · {{ formatMonth(selectedMonth) }}</p>
      </div>
      <select v-model="selectedMonth" class="select-field w-40">
        <option v-for="m in availableMonths" :key="m.value" :value="m.value">{{ m.label }}</option>
      </select>
    </div>

    <!-- Staff own card -->
    <div class="card p-5 flex items-center gap-4 mb-5">
      <div :class="[currentUser.avatarColor || 'bg-brand-primary', 'w-11 h-11 rounded-full flex items-center justify-center text-white text-sm font-bold']">{{ currentUser.initials }}</div>
      <div class="flex-1">
        <h2 class="text-base font-bold text-txt-heading">{{ currentUser.name }}</h2>
        <p class="text-xs text-txt-subtitle">{{ currentUser.label }} · {{ project?.name || '' }} · {{ currentUser.id }}</p>
      </div>
      <span v-if="myEval" class="tag" :class="getEvalStatusInfo(myEval.status).cls">{{ getEvalStatusInfo(myEval.status).label }}</span>
    </div>

    <!-- Staff: own monthly stats -->
    <div v-if="!isPM" class="grid grid-cols-3 gap-4 mb-5">
      <div class="card p-4 text-center">
        <p class="text-xs text-txt-subtitle mb-1">Commitments</p>
        <p class="text-2xl font-bold text-brand-primary">{{ myCommitScore }}<span class="text-xs text-txt-disabled font-normal">/50</span></p>
      </div>
      <div class="card p-4 text-center">
        <p class="text-xs text-txt-subtitle mb-1">Contributions</p>
        <p class="text-2xl font-bold text-txt-heading">{{ myContribPts }} <span class="text-xs text-txt-disabled font-normal">pts</span></p>
      </div>
      <div class="card p-4 text-center">
        <p class="text-xs text-txt-subtitle mb-1">Contribution Score</p>
        <p class="text-2xl font-bold text-txt-heading">{{ myContribScore }}<span class="text-xs text-txt-disabled font-normal">/30</span></p>
      </div>
    </div>

    <!-- PM: team table -->
    <div v-if="isPM && subordinates.length" class="card overflow-hidden">
      <div class="px-5 pt-5 pb-3 flex items-center justify-between">
        <h3 class="text-sm font-bold text-txt-heading">Team Members</h3>
        <span class="text-xs text-txt-disabled">{{ subordinates.length }} staff</span>
      </div>
      <table class="w-full">
        <thead>
          <tr class="border-b border-line text-left">
            <th class="px-5 py-2.5 text-[11px] font-semibold text-txt-disabled uppercase tracking-wider">Employee</th>
            <th class="px-5 py-2.5 text-[11px] font-semibold text-txt-disabled uppercase tracking-wider">Role</th>
            <th class="px-5 py-2.5 text-[11px] font-semibold text-txt-disabled uppercase tracking-wider text-center">Commit Score</th>
            <th class="px-5 py-2.5 text-[11px] font-semibold text-txt-disabled uppercase tracking-wider text-center">Contrib Pts</th>
            <th class="px-5 py-2.5 text-[11px] font-semibold text-txt-disabled uppercase tracking-wider text-center">Status</th>
            <th class="px-5 py-2.5 text-[11px] font-semibold text-txt-disabled uppercase tracking-wider text-center">PM Rated</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="sub in subordinates" :key="sub.id" class="border-b border-line/50 last:border-b-0 hover:bg-surface-gray/50 transition-colors">
            <td class="px-5 py-3">
              <div class="flex items-center gap-3">
                <div :class="[sub.avatarColor || 'bg-brand-primary', 'w-8 h-8 rounded-full text-white text-[10px] font-bold flex items-center justify-center shrink-0']">{{ sub.initials }}</div>
                <div><p class="text-sm font-semibold text-txt-body">{{ sub.name }}</p><p class="text-[11px] text-txt-disabled">{{ sub.id }}</p></div>
              </div>
            </td>
            <td class="px-5 py-3 text-sm text-txt-subtitle">{{ sub.label }}</td>
            <td class="px-5 py-3 text-center text-sm font-bold text-brand-primary">{{ getEvalSummary(sub.id).commitScore }}/50</td>
            <td class="px-5 py-3 text-center text-sm font-bold text-txt-body">{{ getEvalSummary(sub.id).contribPts }}</td>
            <td class="px-5 py-3 text-center"><span class="tag text-[10px]" :class="getEvalStatusInfo(getEvalSummary(sub.id).status).cls">{{ getEvalStatusInfo(getEvalSummary(sub.id).status).label }}</span></td>
            <td class="px-5 py-3 text-center">
              <span v-if="getEvalSummary(sub.id).rated" class="text-txt-success text-sm">✓</span>
              <span v-else class="text-txt-disabled text-sm">—</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Staff: recent contributions -->
    <div v-if="!isPM" class="card p-5 mt-5">
      <h3 class="text-sm font-bold text-txt-heading mb-3">Contributions This Month</h3>
      <div v-if="myEval?.self?.contributions?.length" class="space-y-1.5">
        <div v-for="c in myEval.self.contributions" :key="c.id" class="flex items-center justify-between p-2.5 rounded-container bg-surface-gray border border-line/50">
          <span class="text-sm text-txt-body">{{ c.type }}</span>
          <span class="tag tag-info text-[10px]">+{{ c.points }}</span>
        </div>
      </div>
      <p v-else class="text-sm text-txt-disabled text-center py-4">No contributions logged for this month</p>
    </div>
  </div>
</template>
