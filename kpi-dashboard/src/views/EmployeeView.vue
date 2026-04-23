<script setup>
import { ref, computed } from 'vue'
import { getEmployeeById } from '../data/dummyData'
import CoreCommitments from '../components/CoreCommitments.vue'
import ValueAddContributions from '../components/ValueAddContributions.vue'
import MonthlyProgress from '../components/MonthlyProgress.vue'

const currentUser = computed(() => {
  try {
    return JSON.parse(localStorage.getItem('currentUser') || '{}')
  } catch { return {} }
})

// Create a reactive copy of the employee data
const employee = ref(JSON.parse(JSON.stringify(currentUser.value)))

function updateCommitments(newCommitments) {
  employee.value.coreCommitments = newCommitments
}

function addContribution(contribution) {
  employee.value.contributions = [...employee.value.contributions, contribution]
}
</script>

<template>
  <div class="max-w-6xl mx-auto space-y-6 animate-fade-in">
    <!-- Welcome Section -->
    <div class="card p-6 bg-gradient-to-br from-ocean-500 via-ocean-600 to-ocean-700 border-none relative overflow-hidden">
      <div class="absolute top-0 right-0 w-64 h-64 bg-ocean-400/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
      <div class="absolute bottom-0 left-0 w-48 h-48 bg-ocean-300/15 rounded-full translate-y-1/2 -translate-x-1/4 blur-xl"></div>
      <div class="relative z-10 flex items-center gap-5">
        <div :class="[employee.avatarColor || 'bg-ocean-300', 'w-14 h-14 rounded-2xl flex items-center justify-center text-white text-lg font-bold shadow-lg border-2 border-white/20']">
          {{ employee.initials || '?' }}
        </div>
        <div>
          <h2 class="text-xl font-bold text-white font-body">{{ employee.name }}</h2>
          <p class="text-ocean-100 text-sm mt-0.5">{{ employee.role }} · {{ employee.department }}</p>
          <p class="text-ocean-200/80 text-xs mt-1">Staff ID: {{ employee.id }}</p>
        </div>
      </div>
    </div>

    <!-- Main Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column: Core Commitments + Value Add -->
      <div class="lg:col-span-2 space-y-6">
        <CoreCommitments
          :commitments="employee.coreCommitments || []"
          @update:commitments="updateCommitments"
        />
        <ValueAddContributions
          :contributions="employee.contributions || []"
          @add-contribution="addContribution"
        />
      </div>

      <!-- Right Column: Monthly Progress -->
      <div>
        <div class="lg:sticky lg:top-6">
          <MonthlyProgress
            :coreCommitments="employee.coreCommitments || []"
            :contributions="employee.contributions || []"
            :carryForward="employee.carryForward || 0"
          />
        </div>
      </div>
    </div>
  </div>
</template>
