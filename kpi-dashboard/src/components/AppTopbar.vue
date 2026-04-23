<script setup>
import { computed } from 'vue'

const currentUser = computed(() => {
  try {
    return JSON.parse(localStorage.getItem('currentUser') || '{}')
  } catch { return {} }
})

const userRole = computed(() => localStorage.getItem('userRole') || 'employee')

const today = new Date()
const greeting = computed(() => {
  const hour = today.getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
})

const currentMonth = today.toLocaleDateString('en-MY', { month: 'long', year: 'numeric' })
</script>

<template>
  <header class="bg-white/80 backdrop-blur-sm border-b border-sand-200/60 px-6 lg:px-8 py-4 flex items-center justify-between shrink-0">
    <div>
      <h2 class="text-lg font-semibold text-sand-900 font-body">
        {{ greeting }}, <span class="text-ocean-600">{{ currentUser.name?.split(' ')[0] || 'User' }}</span>
      </h2>
      <p class="text-sm text-sand-400 mt-0.5">{{ currentMonth }} · Your growth matters 🌱</p>
    </div>

    <div class="flex items-center gap-3">
      <span class="tag" :class="userRole === 'hod' ? 'tag-info' : 'tag-success'">
        {{ userRole === 'hod' ? '👔 Manager' : '🙋 Employee' }}
      </span>
    </div>
  </header>
</template>
