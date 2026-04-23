<script setup>
import { ref, computed } from 'vue'
import CoreCommitments from '../components/CoreCommitments.vue'
import ValueAddContributions from '../components/ValueAddContributions.vue'
import MonthlyProgress from '../components/MonthlyProgress.vue'

const currentUser = computed(() => { try { return JSON.parse(localStorage.getItem('currentUser') || '{}') } catch { return {} } })
const employee = ref(JSON.parse(JSON.stringify(currentUser.value)))
function updateCommitments(v) { employee.value.coreCommitments = v }
function addContribution(c) { employee.value.contributions = [...employee.value.contributions, c] }
</script>

<template>
  <div class="max-w-6xl mx-auto space-y-5 animate-fade-in">
    <!-- Header -->
    <div class="card p-5 flex items-center gap-4">
      <div class="w-11 h-11 rounded-full bg-brand-primary flex items-center justify-center text-white text-sm font-bold">{{ employee.initials }}</div>
      <div>
        <h2 class="text-base font-bold text-txt-heading">{{ employee.name }}</h2>
        <p class="text-xs text-txt-subtitle">{{ employee.role }} · {{ employee.department }} · {{ employee.id }}</p>
      </div>
    </div>
    <!-- Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div class="lg:col-span-2 space-y-5">
        <CoreCommitments :commitments="employee.coreCommitments || []" @update:commitments="updateCommitments" />
        <ValueAddContributions :contributions="employee.contributions || []" @add-contribution="addContribution" />
      </div>
      <div>
        <div class="lg:sticky lg:top-4">
          <MonthlyProgress :coreCommitments="employee.coreCommitments || []" :contributions="employee.contributions || []" :carryForward="employee.carryForward || 0" />
        </div>
      </div>
    </div>
  </div>
</template>
