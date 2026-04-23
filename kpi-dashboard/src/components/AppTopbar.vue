<script setup>
import { computed } from 'vue'

const currentUser = computed(() => {
  try { return JSON.parse(localStorage.getItem('currentUser') || '{}') } catch { return {} }
})
const userRole = computed(() => localStorage.getItem('userRole') || 'employee')
const today = new Date()
const currentMonth = today.toLocaleDateString('en-MY', { month: 'long', year: 'numeric' })
</script>

<template>
  <header class="bg-surface-white border-b border-line px-6 py-3 flex items-center justify-between shrink-0">
    <div>
      <h2 class="text-base font-bold text-txt-heading">
        {{ userRole === 'hod' ? 'Team Overview' : 'My Dashboard' }}
      </h2>
      <p class="text-xs text-txt-subtitle mt-0.5">{{ currentMonth }}</p>
    </div>
    <div class="flex items-center gap-3">
      <span class="tag" :class="userRole === 'hod' ? 'tag-info' : 'tag-success'">
        {{ userRole === 'hod' ? 'Manager' : 'Employee' }}
      </span>
      <div class="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-white text-xs font-bold">
        {{ currentUser.initials || '?' }}
      </div>
    </div>
  </header>
</template>
