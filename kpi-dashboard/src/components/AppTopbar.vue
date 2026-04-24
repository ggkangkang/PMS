<script setup>
import { computed } from 'vue'

const currentUser = computed(() => { try { return JSON.parse(localStorage.getItem('currentUser') || '{}') } catch { return {} } })

const roleLabel = computed(() => {
  const r = currentUser.value.role
  if (r === 'project-director') return 'Project Director'
  if (r === 'project-manager') return 'Project Manager'
  return 'Staff'
})

const roleTag = computed(() => {
  const r = currentUser.value.role
  if (r === 'project-director') return 'tag-info'
  if (r === 'project-manager') return 'tag-caution'
  return 'tag-success'
})
</script>

<template>
  <header class="bg-surface-white border-b border-line px-6 py-3 flex items-center justify-between shrink-0">
    <div>
      <slot name="title">
        <h2 class="text-base font-bold text-txt-heading">PMS</h2>
      </slot>
    </div>
    <div class="flex items-center gap-3">
      <span class="tag" :class="roleTag">{{ roleLabel }}</span>
      <div :class="[currentUser.avatarColor || 'bg-brand-primary', 'w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold']">{{ currentUser.initials || '?' }}</div>
    </div>
  </header>
</template>
