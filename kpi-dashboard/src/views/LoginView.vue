<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { users } from '../data/dummyData'

const router = useRouter()
const staffId = ref('')
const error = ref('')
const isLoading = ref(false)

async function handleLogin() {
  error.value = ''
  if (!staffId.value.trim()) { error.value = 'Please enter your Staff ID'; return }
  isLoading.value = true
  await new Promise(r => setTimeout(r, 600))
  const id = staffId.value.trim().toUpperCase()
  const user = users.find(u => u.id === id)
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user))
    const role = user.role
    if (role === 'project-director') router.push('/projects')
    else if (role === 'project-manager') router.push('/dashboard')
    else router.push('/dashboard')
  } else {
    error.value = 'Staff ID not found. Try PD001, PM001–PM002, or EMP001–EMP006'
  }
  isLoading.value = false
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-surface-bg px-4">
    <div class="w-full max-w-sm animate-fade-in">
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-12 h-12 bg-brand-primary text-white rounded-xl mb-4 text-xl font-bold">P</div>
        <h1 class="text-xl font-bold text-txt-heading">GrowthPulse</h1>
        <p class="text-xs text-txt-subtitle mt-1">KPI Evaluation & L&D Dashboard</p>
      </div>

      <div class="card p-6">
        <h2 class="text-base font-bold text-txt-heading mb-1">Sign In</h2>
        <p class="text-xs text-txt-subtitle mb-5">Enter your Staff ID to continue</p>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label for="staffId" class="block text-sm font-medium text-txt-body mb-1.5">Staff ID</label>
            <input id="staffId" v-model="staffId" type="text" placeholder="e.g. PM001" class="input-field" autocomplete="off" />
            <p v-if="error" class="mt-1.5 text-xs text-txt-error flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 256 256" fill="currentColor"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm-8,56a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm8,104a12,12,0,1,1,12-12A12,12,0,0,1,128,184Z"/></svg>
              {{ error }}
            </p>
          </div>
          <button type="submit" class="btn-primary w-full" :disabled="isLoading" :class="{ 'opacity-60': isLoading }">
            <svg v-if="isLoading" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
            {{ isLoading ? 'Signing in…' : 'Sign In' }}
          </button>
        </form>

        <div class="mt-5 space-y-2">
          <div class="p-2.5 bg-surface-info rounded-container border border-blue-200/50">
            <p class="text-[11px] font-semibold text-txt-info mb-0.5">Project Director</p>
            <p class="text-[11px] text-txt-info"><code class="font-mono bg-white/60 px-1 rounded">PD001</code></p>
          </div>
          <div class="p-2.5 bg-surface-warn rounded-container border border-orange-200/50">
            <p class="text-[11px] font-semibold text-txt-warn mb-0.5">Project Managers</p>
            <p class="text-[11px] text-txt-warn"><code class="font-mono bg-white/60 px-1 rounded">PM001</code> (Forum 2) · <code class="font-mono bg-white/60 px-1 rounded">PM002</code> (AR496)</p>
          </div>
          <div class="p-2.5 bg-surface-success rounded-container border border-green-200/50">
            <p class="text-[11px] font-semibold text-txt-success mb-0.5">Staff</p>
            <p class="text-[11px] text-txt-success"><code class="font-mono bg-white/60 px-1 rounded">EMP001</code> – <code class="font-mono bg-white/60 px-1 rounded">EMP006</code></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
