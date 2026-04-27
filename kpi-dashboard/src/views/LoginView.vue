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
  <div class="min-h-screen flex items-center justify-center bg-[#f5f5f5] px-4">
    <div class="w-full max-w-[400px] animate-fade-in">
      <!-- Card — no visible border, just white on light gray like Skool -->
      <div class="bg-white rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.08)] px-10 py-10">
        <!-- Brand -->
        <div class="text-center mb-8">
          <h1 class="text-2xl font-bold tracking-tight">
            <span class="text-[#4285f4]">P</span><span class="text-[#ea4335]">M</span><span class="text-[#fbbc05]">S</span>
          </h1>
          <p class="text-[15px] font-bold text-txt-heading mt-3">Log in to PMS</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-3">
          <!-- Staff ID input — no label, placeholder only like Skool -->
          <input
            v-model="staffId"
            type="text"
            placeholder="Staff ID"
            autocomplete="off"
            class="w-full px-4 py-3 bg-white text-[15px] text-txt-body border border-[#ddd] rounded-lg placeholder-[#aaa] focus:outline-none focus:border-[#4285f4] transition-colors"
          />

          <!-- Error -->
          <p v-if="error" class="text-xs text-txt-error flex items-center gap-1.5 px-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 256 256" fill="currentColor"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm-8,56a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm8,104a12,12,0,1,1,12-12A12,12,0,0,1,128,184Z"/></svg>
            {{ error }}
          </p>

          <!-- Link row -->
          <div class="text-left">
            <span class="text-[13px] text-[#4285f4] cursor-pointer hover:underline">Need a demo account?</span>
          </div>

          <!-- Submit — Skool-style uppercase, full width -->
          <button
            type="submit"
            :disabled="isLoading || !staffId.trim()"
            class="w-full py-3 rounded-lg text-[13px] font-bold uppercase tracking-wider transition-all"
            :class="staffId.trim() && !isLoading
              ? 'bg-[#4285f4] text-white hover:bg-[#3b78e7] shadow-sm'
              : 'bg-[#f0f0f0] text-[#bbb] cursor-not-allowed'"
          >
            <svg v-if="isLoading" class="animate-spin h-4 w-4 inline mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
            {{ isLoading ? 'Signing in…' : 'Log In' }}
          </button>
        </form>

        <!-- Footer -->
        <p class="text-center text-[13px] text-txt-subtitle mt-6">
          Demo? Try <span class="text-[#4285f4] font-semibold cursor-pointer hover:underline" @click="staffId = 'PM001'">PM001</span>
          or <span class="text-[#4285f4] font-semibold cursor-pointer hover:underline" @click="staffId = 'PD001'">PD001</span>
        </p>
      </div>
    </div>
  </div>
</template>
