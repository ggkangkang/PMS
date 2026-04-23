<script setup>
import { ref, computed, reactive } from 'vue'
import {
  evaluationCommitments, commitmentRatingScale, characterTraits, characterRatingScale,
  contributionBaseline, employeeEvaluations,
  getCommitmentScore, getContributionScore, getCharacterScore, getScoreGrade, getTotalPoints,
} from '../data/dummyData'
import ProgressRing from '../components/ProgressRing.vue'

const currentUser = computed(() => { try { return JSON.parse(localStorage.getItem('currentUser') || '{}') } catch { return {} } })
const evalData = computed(() => employeeEvaluations[currentUser.value.id] || employeeEvaluations.ADM001)

const form = reactive({
  commitmentRatings: { ...evalData.value.commitmentRatings },
  characterRatings: { ...evalData.value.characterRatings },
  selfComments: { ...evalData.value.selfComments },
})

const activeSection = ref('commitments')
const showSubmitModal = ref(false)
const isSubmitted = ref(evalData.value.status === 'submitted')

const totalContribPts = computed(() => getTotalPoints(currentUser.value))
const commitScore = computed(() => getCommitmentScore(form.commitmentRatings))
const contribScore = computed(() => getContributionScore(totalContribPts.value))
const charScore = computed(() => getCharacterScore(form.characterRatings))
const overallScore = computed(() => commitScore.value + contribScore.value + charScore.value)
const grade = computed(() => getScoreGrade(overallScore.value))
const contribTier = computed(() => contributionBaseline.tiers.find(t => totalContribPts.value >= t.min && totalContribPts.value <= t.max) || contributionBaseline.tiers[0])

function setRating(type, id, value) {
  if (type === 'commitment') form.commitmentRatings[id] = value
  else form.characterRatings[id] = value
}

function ratingBg(v) {
  if (v >= 5) return 'bg-green-50 border-green-300 text-green-700 ring-green-300'
  if (v >= 4) return 'bg-blue-50 border-blue-300 text-blue-700 ring-blue-300'
  if (v >= 3) return 'bg-yellow-50 border-yellow-300 text-yellow-700 ring-yellow-300'
  if (v >= 2) return 'bg-orange-50 border-orange-300 text-orange-700 ring-orange-300'
  if (v >= 1) return 'bg-red-50 border-red-300 text-red-700 ring-red-300'
  return 'bg-gray-50 border-gray-200 text-gray-400'
}

function handleSubmit() { isSubmitted.value = true; showSubmitModal.value = false }

const sections = [
  { id: 'commitments', label: 'Commitments', weight: '50%' },
  { id: 'contributions', label: 'Contributions', weight: '30%' },
  { id: 'character', label: 'Character', weight: '20%' },
  { id: 'summary', label: 'Summary', weight: '' },
]

function gradeColor(g) {
  if (g === 'emerge') return '#008236'
  if (g === 'ocean') return '#03439a'
  if (g === 'caution') return '#ca3500'
  if (g === 'coral') return '#ca3500'
  return '#c10007'
}
</script>

<template>
  <div class="max-w-5xl mx-auto animate-fade-in">
    <!-- Header card -->
    <div class="card p-5 mb-5 flex items-center gap-4">
      <div class="w-10 h-10 rounded-full bg-brand-primary text-white text-sm font-bold flex items-center justify-center">{{ currentUser.initials || '?' }}</div>
      <div class="flex-1">
        <h2 class="text-base font-bold text-txt-heading">Annual Performance Evaluation</h2>
        <p class="text-xs text-txt-subtitle">{{ currentUser.name }} · {{ evalData.period }}</p>
      </div>
      <span v-if="isSubmitted" class="tag tag-success">Submitted</span>
      <span v-else class="tag bg-surface-gray text-txt-subtitle border border-line">Draft</span>
    </div>

    <!-- Weight legend -->
    <div class="flex gap-4 mb-4 text-xs text-txt-subtitle">
      <span>📋 Commitments <strong class="text-txt-heading">50%</strong></span>
      <span>⭐ Contributions <strong class="text-txt-heading">30%</strong></span>
      <span>🤝 Character <strong class="text-txt-heading">20%</strong></span>
    </div>

    <!-- Tabs -->
    <div class="flex gap-1.5 mb-5 border-b border-line pb-px">
      <button v-for="s in sections" :key="s.id" @click="activeSection = s.id"
        class="px-4 py-2 text-sm font-medium transition-colors rounded-t-button border-b-2 -mb-px"
        :class="activeSection === s.id ? 'border-brand-primary text-brand-primary bg-white' : 'border-transparent text-txt-subtitle hover:text-txt-body'"
      >{{ s.label }} <span v-if="s.weight" class="text-[10px] opacity-60">({{ s.weight }})</span></button>
    </div>

    <!-- ═══ COMMITMENTS (50%) ═══ -->
    <div v-if="activeSection === 'commitments'" class="animate-fade-in">
      <fieldset class="card p-5">
        <legend class="text-sm font-bold text-txt-heading px-1">Core KPI Commitments <span class="tag tag-info text-[10px] ml-2">50%</span></legend>
        <p class="text-xs text-txt-subtitle mb-5 mt-1">Rate your performance on each KPI (1–5). Each accounts for 10%.</p>

        <div class="space-y-4">
          <div v-for="kpi in evaluationCommitments" :key="kpi.id" class="p-4 rounded-container border border-line bg-surface-gray/30">
            <div class="flex items-start justify-between gap-3 mb-3">
              <div>
                <div class="flex items-center gap-2 mb-0.5">
                  <span class="text-[10px] font-bold text-brand-primary uppercase">{{ kpi.id.toUpperCase() }}</span>
                  <span class="text-[10px] text-txt-disabled">Weight: {{ kpi.weight }}%</span>
                </div>
                <p class="text-sm font-semibold text-txt-body">{{ kpi.label }}</p>
                <p class="text-xs text-txt-subtitle mt-1">{{ kpi.description }}</p>
              </div>
              <span v-if="form.commitmentRatings[kpi.id]" class="tag border text-[10px] shrink-0" :class="ratingBg(form.commitmentRatings[kpi.id])">{{ form.commitmentRatings[kpi.id] }}/5</span>
            </div>
            <div class="flex gap-1.5">
              <button v-for="r in commitmentRatingScale" :key="r.value" @click="setRating('commitment', kpi.id, r.value)" :disabled="isSubmitted"
                class="flex-1 py-2 px-1 rounded-button text-[11px] font-medium border transition-all"
                :class="form.commitmentRatings[kpi.id] === r.value ? ratingBg(r.value) + ' ring-1 ring-offset-1 shadow-xs' : 'bg-white border-line text-txt-subtitle hover:bg-surface-gray'"
                :title="r.description"
              ><span class="block font-bold text-sm">{{ r.value }}</span><span class="hidden sm:block mt-0.5 leading-tight">{{ r.label }}</span></button>
            </div>
          </div>
        </div>

        <div class="mt-5">
          <label class="text-sm font-medium text-txt-body mb-1.5 block">Self-Assessment Comments</label>
          <textarea v-model="form.selfComments.commitments" :disabled="isSubmitted" rows="3" class="input-field text-sm resize-none" placeholder="Describe your performance highlights…"></textarea>
        </div>
      </fieldset>
    </div>

    <!-- ═══ CONTRIBUTIONS (30%) ═══ -->
    <div v-if="activeSection === 'contributions'" class="animate-fade-in">
      <fieldset class="card p-5">
        <legend class="text-sm font-bold text-txt-heading px-1">Value-Add Contributions <span class="tag tag-info text-[10px] ml-2">30%</span></legend>
        <p class="text-xs text-txt-subtitle mb-5 mt-1">Points from extra initiatives. Baseline: {{ contributionBaseline.minimumPoints }} pts.</p>

        <div class="grid grid-cols-3 gap-3 mb-5">
          <div class="p-3 rounded-container bg-surface-info border border-blue-200/50 text-center">
            <p class="text-xl font-bold text-brand-primary">{{ totalContribPts }}</p>
            <p class="text-[10px] text-txt-info mt-0.5">Total Points</p>
          </div>
          <div class="p-3 rounded-container bg-surface-gray border border-line text-center">
            <p class="text-xl font-bold text-txt-heading">{{ contributionBaseline.minimumPoints }}</p>
            <p class="text-[10px] text-txt-disabled mt-0.5">Baseline</p>
          </div>
          <div class="p-3 rounded-container border text-center" :class="contribTier.score >= 3 ? 'bg-surface-success border-green-200/60' : 'bg-surface-warn border-yellow-200/60'">
            <p class="text-xl font-bold" :class="contribTier.score >= 3 ? 'text-txt-success' : 'text-txt-warn'">{{ contribTier.score }}/5</p>
            <p class="text-[10px] mt-0.5" :class="contribTier.score >= 3 ? 'text-txt-success' : 'text-txt-warn'">{{ contribTier.label }}</p>
          </div>
        </div>

        <h4 class="text-[11px] font-semibold text-txt-disabled uppercase tracking-wider mb-2">Contribution Log</h4>
        <div v-if="currentUser.contributions?.length" class="space-y-1.5 mb-5">
          <div v-for="c in currentUser.contributions" :key="c.id" class="flex items-center justify-between p-2.5 rounded-container bg-surface-gray border border-line/50">
            <div class="flex items-center gap-2"><div class="w-1.5 h-1.5 rounded-full" :class="c.points >= 100 ? 'bg-red-400' : c.points >= 50 ? 'bg-blue-400' : 'bg-yellow-400'"></div><span class="text-sm text-txt-body">{{ c.type }}</span></div>
            <span class="tag tag-info text-[10px]">+{{ c.points }}</span>
          </div>
        </div>

        <h4 class="text-[11px] font-semibold text-txt-disabled uppercase tracking-wider mb-2">Scoring Tiers</h4>
        <div class="space-y-1">
          <div v-for="tier in contributionBaseline.tiers" :key="tier.score" class="flex items-center gap-2 p-2 rounded-button text-xs" :class="contribTier.score === tier.score ? 'bg-surface-info border border-blue-200/50 font-semibold' : 'text-txt-subtitle'">
            <span class="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold" :class="contribTier.score === tier.score ? 'bg-brand-primary text-white' : 'bg-surface-gray text-txt-disabled'">{{ tier.score }}</span>
            <span class="flex-1">{{ tier.label }}</span>
            <span class="text-txt-disabled">{{ tier.max === Infinity ? tier.min + '+' : tier.min + '–' + tier.max }} pts</span>
          </div>
        </div>

        <div class="mt-5">
          <label class="text-sm font-medium text-txt-body mb-1.5 block">Contribution Highlights</label>
          <textarea v-model="form.selfComments.contributions" :disabled="isSubmitted" rows="3" class="input-field text-sm resize-none" placeholder="Highlight your key contributions…"></textarea>
        </div>
      </fieldset>
    </div>

    <!-- ═══ CHARACTER (20%) ═══ -->
    <div v-if="activeSection === 'character'" class="animate-fade-in">
      <fieldset class="card p-5">
        <legend class="text-sm font-bold text-txt-heading px-1">Character & Behavioral Traits <span class="tag tag-info text-[10px] ml-2">20%</span></legend>
        <p class="text-xs text-txt-subtitle mb-5 mt-1">Rate how consistently you demonstrate each trait.</p>

        <div class="space-y-4">
          <div v-for="trait in characterTraits" :key="trait.id" class="p-4 rounded-container border border-line bg-surface-gray/30">
            <div class="flex items-start justify-between gap-3 mb-3">
              <div><p class="text-sm font-semibold text-txt-body">{{ trait.label }}</p><p class="text-xs text-txt-subtitle mt-1">{{ trait.description }}</p></div>
              <span v-if="form.characterRatings[trait.id]" class="tag border text-[10px] shrink-0" :class="ratingBg(form.characterRatings[trait.id])">{{ form.characterRatings[trait.id] }}/5</span>
            </div>
            <div class="flex gap-1.5">
              <button v-for="r in characterRatingScale" :key="r.value" @click="setRating('character', trait.id, r.value)" :disabled="isSubmitted"
                class="flex-1 py-2 px-1 rounded-button text-[11px] font-medium border transition-all"
                :class="form.characterRatings[trait.id] === r.value ? ratingBg(r.value) + ' ring-1 ring-offset-1 shadow-xs' : 'bg-white border-line text-txt-subtitle hover:bg-surface-gray'"
              ><span class="block font-bold text-sm">{{ r.value }}</span><span class="hidden sm:block mt-0.5 leading-tight">{{ r.label }}</span></button>
            </div>
          </div>
        </div>

        <div class="mt-5">
          <label class="text-sm font-medium text-txt-body mb-1.5 block">Character Reflection</label>
          <textarea v-model="form.selfComments.character" :disabled="isSubmitted" rows="3" class="input-field text-sm resize-none" placeholder="Reflect on your strengths and growth areas…"></textarea>
        </div>
      </fieldset>
    </div>

    <!-- ═══ SUMMARY ═══ -->
    <div v-if="activeSection === 'summary'" class="space-y-4 animate-fade-in">
      <div class="card p-5">
        <h3 class="text-sm font-bold text-txt-heading mb-4">Evaluation Summary</h3>
        <div class="flex flex-col sm:flex-row items-center gap-6">
          <ProgressRing :percentage="overallScore" :size="140" :strokeWidth="10" :color="gradeColor(grade.color)" bgColor="#e5e7eb" />
          <div class="text-center sm:text-left">
            <p class="text-3xl font-bold text-txt-heading">{{ overallScore }}<span class="text-sm text-txt-disabled">/100</span></p>
            <p class="text-sm font-semibold mt-1" :style="{ color: gradeColor(grade.color) }">Grade {{ grade.grade }} — {{ grade.label }}</p>
            <p class="text-xs text-txt-disabled mt-1">{{ evalData.period }}</p>
          </div>
        </div>
      </div>

      <div class="card p-5">
        <h4 class="text-[11px] font-semibold text-txt-disabled uppercase tracking-wider mb-4">Score Breakdown</h4>
        <div class="space-y-3">
          <div><div class="flex justify-between text-sm mb-1"><span class="text-txt-body font-medium">Commitments (50%)</span><span class="font-bold text-txt-heading">{{ commitScore }}/50</span></div><div class="h-2.5 bg-surface-gray rounded-full overflow-hidden"><div class="h-full rounded-full bg-brand-primary transition-all duration-500" :style="{ width: (commitScore/50*100)+'%' }"></div></div></div>
          <div><div class="flex justify-between text-sm mb-1"><span class="text-txt-body font-medium">Contributions (30%)</span><span class="font-bold text-txt-heading">{{ contribScore }}/30</span></div><div class="h-2.5 bg-surface-gray rounded-full overflow-hidden"><div class="h-full rounded-full bg-yellow-500 transition-all duration-500" :style="{ width: (contribScore/30*100)+'%' }"></div></div></div>
          <div><div class="flex justify-between text-sm mb-1"><span class="text-txt-body font-medium">Character (20%)</span><span class="font-bold text-txt-heading">{{ charScore }}/20</span></div><div class="h-2.5 bg-surface-gray rounded-full overflow-hidden"><div class="h-full rounded-full bg-green-500 transition-all duration-500" :style="{ width: (charScore/20*100)+'%' }"></div></div></div>
        </div>
      </div>

      <div v-if="!isSubmitted" class="card p-5 flex items-center justify-between">
        <div><h4 class="text-sm font-semibold text-txt-heading">Ready to submit?</h4><p class="text-xs text-txt-subtitle mt-0.5">Your evaluation will be sent to your HOD.</p></div>
        <button @click="showSubmitModal = true" class="btn-primary">Submit Evaluation</button>
      </div>
      <div v-else class="card p-4 bg-surface-success border-green-200/60 flex items-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 256 256" fill="#008236"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm45.66,85.66-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z"/></svg>
        <div><p class="text-sm font-bold text-txt-success">Evaluation Submitted</p><p class="text-xs text-txt-success/70">Sent to your HOD for review.</p></div>
      </div>
    </div>

    <!-- Submit Modal -->
    <teleport to="body">
      <div v-if="showSubmitModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-surface-dark/50 backdrop-blur-sm" @click="showSubmitModal = false"></div>
        <div class="relative z-10 bg-white rounded-card shadow-xl max-w-sm w-full p-5 border border-line animate-scale-in">
          <h3 class="text-base font-bold text-txt-heading mb-2">Submit Evaluation?</h3>
          <p class="text-sm text-txt-subtitle mb-5">You won't be able to edit after submission.</p>
          <div class="flex gap-2"><button @click="showSubmitModal = false" class="btn-secondary flex-1">Cancel</button><button @click="handleSubmit" class="btn-primary flex-1">Confirm</button></div>
        </div>
      </div>
    </teleport>
  </div>
</template>
