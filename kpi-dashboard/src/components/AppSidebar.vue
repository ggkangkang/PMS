<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const currentUser = computed(() => {
  try { return JSON.parse(localStorage.getItem('currentUser') || '{}') } catch { return {} }
})
const userRole = computed(() => localStorage.getItem('userRole') || 'employee')
const isEmployee = computed(() => userRole.value === 'employee')

const navItems = computed(() => {
  if (isEmployee.value) {
    return [
      { label: 'My Dashboard', path: '/employee', icon: 'dashboard' },
      { label: 'Annual Evaluation', path: '/evaluation', icon: 'evaluation' },
    ]
  }
  return [
    { label: 'Team Overview', path: '/hod', icon: 'team' },
    { label: 'Evaluations', path: '/evaluation', icon: 'evaluation' },
  ]
})

function isActive(path) { return route.path === path }
function navigate(path) { router.push(path) }
function logout() {
  localStorage.removeItem('currentUser')
  localStorage.removeItem('userRole')
  router.push('/login')
}
</script>

<template>
  <aside class="w-60 bg-surface-dark flex flex-col h-full shrink-0">
    <!-- Brand -->
    <div class="px-5 py-5 flex items-center gap-3 border-b border-white/10">
      <div class="w-8 h-8 bg-brand-primary text-white rounded-lg flex items-center justify-center text-sm font-bold">P</div>
      <span class="text-white font-semibold text-base">Prosync</span>
      <button class="ml-auto text-white/40 hover:text-white/70">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256" fill="currentColor"><path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"/></svg>
      </button>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
      <div
        v-for="item in navItems" :key="item.path"
        :class="['sidebar-item', { active: isActive(item.path) }]"
        @click="navigate(item.path)"
      >
        <svg v-if="item.icon === 'dashboard'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 256 256" fill="currentColor">
          <path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,160H40V56H216V200ZM176,176a8,8,0,0,0,8-8V116a8,8,0,0,0-16,0v52A8,8,0,0,0,176,176Zm-48,0a8,8,0,0,0,8-8V88a8,8,0,0,0-16,0v80A8,8,0,0,0,128,176Zm-48,0a8,8,0,0,0,8-8V136a8,8,0,0,0-16,0v32A8,8,0,0,0,80,176Z"/>
        </svg>
        <svg v-if="item.icon === 'team'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 256 256" fill="currentColor">
          <path d="M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Zm210.14,98.7a8,8,0,0,1-11.07-2.33A79.83,79.83,0,0,0,172,168a8,8,0,0,1,0-16,44,44,0,1,0-16.34-84.87,8,8,0,1,1-5.94-14.85,60,60,0,0,1,49.53,108.64,95.83,95.83,0,0,1,47.22,37.71A8,8,0,0,1,250.14,206.7Z"/>
        </svg>
        <svg v-if="item.icon === 'evaluation'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 256 256" fill="currentColor">
          <path d="M200,32H163.74a47.92,47.92,0,0,0-71.48,0H56A16,16,0,0,0,40,48V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V48A16,16,0,0,0,200,32Zm-72,0a32,32,0,0,1,32,32H96A32,32,0,0,1,128,32Zm72,184H56V48H82.75A47.93,47.93,0,0,0,80,64v8a8,8,0,0,0,8,8h80a8,8,0,0,0,8-8V64a47.93,47.93,0,0,0-2.75-16H200ZM96,136a8,8,0,0,1,8-8h48a8,8,0,0,1,0,16H104A8,8,0,0,1,96,136Zm0,32a8,8,0,0,1,8-8h48a8,8,0,0,1,0,16H104A8,8,0,0,1,96,168Z"/>
        </svg>
        <span>{{ item.label }}</span>
      </div>
    </nav>

    <!-- User -->
    <div class="px-4 py-4 border-t border-white/10">
      <div class="flex items-center gap-3 mb-3">
        <div class="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-white text-xs font-bold">
          {{ currentUser.initials || '?' }}
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-white truncate">{{ currentUser.name || 'User' }}</p>
          <p class="text-[11px] text-white/40 truncate">{{ currentUser.role || '' }}</p>
        </div>
      </div>
      <button @click="logout" class="flex items-center gap-2 text-xs text-white/40 hover:text-white/70 transition-colors w-full px-1">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 256 256" fill="currentColor"><path d="M112,216a8,8,0,0,1-8,8H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32h56a8,8,0,0,1,0,16H48V208h56A8,8,0,0,1,112,216Zm109.66-93.66-40-40a8,8,0,0,0-11.32,11.32L196.69,120H104a8,8,0,0,0,0,16h92.69l-26.35,26.34a8,8,0,0,0,11.32,11.32l40-40A8,8,0,0,0,221.66,122.34Z"/></svg>
        Sign Out
      </button>
    </div>
  </aside>
</template>
