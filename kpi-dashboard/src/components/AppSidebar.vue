<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getProjectById } from '../data/dummyData'

const router = useRouter()
const route = useRoute()

const currentUser = computed(() => { try { return JSON.parse(localStorage.getItem('currentUser') || '{}') } catch { return {} } })
const userRole = computed(() => currentUser.value.role || 'site-supervisor')
const projectName = computed(() => {
  const pid = currentUser.value.projectId
  if (pid) { const p = getProjectById(pid); return p ? p.name : '' }
  return ''
})

const navItems = computed(() => {
  const role = userRole.value
  if (role === 'project-director') {
    return [
      { label: 'All Projects', path: '/projects', icon: 'projects' },
      { label: 'Rate PMs', path: '/rate-team', icon: 'rate' },
      { label: 'My Evaluation', path: '/evaluation', icon: 'evaluation' },
    ]
  }
  if (role === 'project-manager') {
    return [
      { label: 'Team Overview', path: '/dashboard', icon: 'dashboard' },
      { label: 'Rate Team', path: '/rate-team', icon: 'rate' },
      { label: 'My Evaluation', path: '/evaluation', icon: 'evaluation' },
    ]
  }
  // Staff
  return [
    { label: 'My Dashboard', path: '/dashboard', icon: 'dashboard' },
    { label: 'Monthly Evaluation', path: '/evaluation', icon: 'evaluation' },
  ]
})

function isActive(path) { return route.path === path }
function navigate(path) { router.push(path) }
function logout() {
  localStorage.removeItem('currentUser')
  router.push('/login')
}
</script>

<template>
  <aside class="w-60 bg-surface-dark flex flex-col h-full shrink-0">
    <!-- Brand -->
    <div class="px-5 py-5 flex items-center gap-3 border-b border-white/10">
      <div class="w-8 h-8 bg-brand-primary text-white rounded-lg flex items-center justify-center text-sm font-bold">P</div>
      <div class="flex-1 min-w-0">
        <span class="text-white font-semibold text-sm block">GrowthPulse</span>
        <span v-if="projectName" class="text-[10px] text-white/40 block truncate">{{ projectName }}</span>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
      <div v-for="item in navItems" :key="item.path" :class="['sidebar-item', { active: isActive(item.path) }]" @click="navigate(item.path)">
        <!-- Icons -->
        <svg v-if="item.icon === 'dashboard'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 256 256" fill="currentColor"><path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,160H40V56H216V200ZM176,176a8,8,0,0,0,8-8V116a8,8,0,0,0-16,0v52A8,8,0,0,0,176,176Zm-48,0a8,8,0,0,0,8-8V88a8,8,0,0,0-16,0v80A8,8,0,0,0,128,176Zm-48,0a8,8,0,0,0,8-8V136a8,8,0,0,0-16,0v32A8,8,0,0,0,80,176Z"/></svg>
        <svg v-if="item.icon === 'evaluation'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 256 256" fill="currentColor"><path d="M200,32H163.74a47.92,47.92,0,0,0-71.48,0H56A16,16,0,0,0,40,48V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V48A16,16,0,0,0,200,32Zm-72,0a32,32,0,0,1,32,32H96A32,32,0,0,1,128,32Zm72,184H56V48H82.75A47.93,47.93,0,0,0,80,64v8a8,8,0,0,0,8,8h80a8,8,0,0,0,8-8V64a47.93,47.93,0,0,0-2.75-16H200ZM96,136a8,8,0,0,1,8-8h48a8,8,0,0,1,0,16H104A8,8,0,0,1,96,136Zm0,32a8,8,0,0,1,8-8h48a8,8,0,0,1,0,16H104A8,8,0,0,1,96,168Z"/></svg>
        <svg v-if="item.icon === 'rate'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 256 256" fill="currentColor"><path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8C55.71,190.82,80,176,128,176s72.29,14.82,89.07,44a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"/></svg>
        <svg v-if="item.icon === 'projects'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 256 256" fill="currentColor"><path d="M216,72H131.31L104,44.69A15.86,15.86,0,0,0,92.69,40H40A16,16,0,0,0,24,56V200.62A15.4,15.4,0,0,0,39.38,216H216.89A15.13,15.13,0,0,0,232,200.89V88A16,16,0,0,0,216,72ZM40,56H92.69l16,16H40ZM216,200H40V88H216Z"/></svg>
        <span>{{ item.label }}</span>
      </div>

      <!-- Divider + Changelog -->
      <div class="border-t border-white/10 mt-3 pt-3">
        <div :class="['sidebar-item', { active: isActive('/changelog') }]" @click="navigate('/changelog')">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 256 256" fill="currentColor"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48A8,8,0,0,1,192,128Z"/></svg>
          <span>Changelog</span>
          <span class="ml-auto text-[9px] font-bold bg-brand-primary text-white px-1.5 py-0.5 rounded">v1.2</span>
        </div>
      </div>
    </nav>

    <!-- User -->
    <div class="px-4 py-4 border-t border-white/10">
      <div class="flex items-center gap-3 mb-3">
        <div :class="[currentUser.avatarColor || 'bg-brand-primary', 'w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold']">{{ currentUser.initials || '?' }}</div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-white truncate">{{ currentUser.name || 'User' }}</p>
          <p class="text-[10px] text-white/40 truncate">{{ currentUser.label || '' }}</p>
        </div>
      </div>
      <button @click="logout" class="flex items-center gap-2 text-xs text-white/40 hover:text-white/70 transition-colors w-full px-1">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 256 256" fill="currentColor"><path d="M112,216a8,8,0,0,1-8,8H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32h56a8,8,0,0,1,0,16H48V208h56A8,8,0,0,1,112,216Zm109.66-93.66-40-40a8,8,0,0,0-11.32,11.32L196.69,120H104a8,8,0,0,0,0,16h92.69l-26.35,26.34a8,8,0,0,0,11.32,11.32l40-40A8,8,0,0,0,221.66,122.34Z"/></svg>
        Sign Out
      </button>
    </div>
  </aside>
</template>
