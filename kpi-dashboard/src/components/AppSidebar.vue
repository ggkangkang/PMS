<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const currentUser = computed(() => {
  try {
    return JSON.parse(localStorage.getItem('currentUser') || '{}')
  } catch { return {} }
})

const userRole = computed(() => localStorage.getItem('userRole') || 'employee')
const isEmployee = computed(() => userRole.value === 'employee')

const navItems = computed(() => {
  if (isEmployee.value) {
    return [
      { label: 'My Dashboard', path: '/employee', icon: 'dashboard' },
    ]
  }
  return [
    { label: 'Team Overview', path: '/hod', icon: 'team' },
  ]
})

function isActive(path) {
  return route.path === path
}

function navigate(path) {
  router.push(path)
}

function logout() {
  localStorage.removeItem('currentUser')
  localStorage.removeItem('userRole')
  router.push('/login')
}
</script>

<template>
  <aside class="w-64 bg-white border-r border-sand-200/60 flex flex-col h-full shrink-0">
    <!-- Brand -->
    <div class="p-6 pb-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-ocean-500 text-white rounded-xl flex items-center justify-center shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 256 256" fill="currentColor">
            <path d="M224,128a96,96,0,1,1-96-96A96.11,96.11,0,0,1,224,128Zm-96-56a8,8,0,0,0-8,8v48a8,8,0,0,0,3.2,6.4l32,24a8,8,0,0,0,9.6-12.8L136,122V80A8,8,0,0,0,128,72Z"/>
          </svg>
        </div>
        <div>
          <h1 class="font-display text-lg text-sand-900 leading-tight">GrowthPulse</h1>
          <p class="text-[11px] text-sand-400 font-body">KPI & L&D</p>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-3 py-2 space-y-1">
      <div
        v-for="item in navItems"
        :key="item.path"
        :class="['sidebar-item', { active: isActive(item.path) }]"
        @click="navigate(item.path)"
      >
        <!-- Dashboard icon -->
        <svg v-if="item.icon === 'dashboard'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256" fill="currentColor">
          <path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,160H40V56H216V200ZM176,176a8,8,0,0,0,8-8V116a8,8,0,0,0-16,0v52A8,8,0,0,0,176,176Zm-48,0a8,8,0,0,0,8-8V88a8,8,0,0,0-16,0v80A8,8,0,0,0,128,176Zm-48,0a8,8,0,0,0,8-8V136a8,8,0,0,0-16,0v32A8,8,0,0,0,80,176Z"/>
        </svg>
        <!-- Team icon -->
        <svg v-if="item.icon === 'team'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256" fill="currentColor">
          <path d="M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Zm210.14,98.7a8,8,0,0,1-11.07-2.33A79.83,79.83,0,0,0,172,168a8,8,0,0,1,0-16,44,44,0,1,0-16.34-84.87,8,8,0,1,1-5.94-14.85,60,60,0,0,1,49.53,108.64,95.83,95.83,0,0,1,47.22,37.71A8,8,0,0,1,250.14,206.7Z"/>
        </svg>
        <span>{{ item.label }}</span>
      </div>
    </nav>

    <!-- User Profile -->
    <div class="p-4 border-t border-sand-100">
      <div class="flex items-center gap-3 mb-3">
        <div :class="[currentUser.avatarColor || 'bg-ocean-400', 'w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm']">
          {{ currentUser.initials || '?' }}
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-sand-800 truncate">{{ currentUser.name || 'User' }}</p>
          <p class="text-[11px] text-sand-400 truncate">{{ currentUser.role || '' }}</p>
        </div>
      </div>
      <button @click="logout" class="btn-ghost w-full text-xs justify-start text-sand-400 hover:text-danger-500">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256" fill="currentColor">
          <path d="M112,216a8,8,0,0,1-8,8H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32h56a8,8,0,0,1,0,16H48V208h56A8,8,0,0,1,112,216Zm109.66-93.66-40-40a8,8,0,0,0-11.32,11.32L196.69,120H104a8,8,0,0,0,0,16h92.69l-26.35,26.34a8,8,0,0,0,11.32,11.32l40-40A8,8,0,0,0,221.66,122.34Z"/>
        </svg>
        Sign Out
      </button>
    </div>
  </aside>
</template>
