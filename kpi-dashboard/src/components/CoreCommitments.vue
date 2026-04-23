<script setup>
import ToggleSwitch from './ToggleSwitch.vue'

const props = defineProps({
  commitments: { type: Array, required: true },
})
const emit = defineEmits(['update:commitments'])

function updateStatus(index, newStatus) {
  const updated = [...props.commitments]
  updated[index] = { ...updated[index], status: newStatus }
  emit('update:commitments', updated)
}

const iconMap = {
  facility: `<path d="M240,208H224V96a16,16,0,0,0-16-16H160V32a16,16,0,0,0-24.88-13.32L39.12,80A16,16,0,0,0,32,93.32V208H16a8,8,0,0,0,0,16H240a8,8,0,0,0,0-16ZM48,93.32,144,32V208H48ZM160,96h48V208H160ZM88,120v16a8,8,0,0,1-16,0V120a8,8,0,0,1,16,0Zm32,0v16a8,8,0,0,1-16,0V120a8,8,0,0,1,16,0Zm-32,56v16a8,8,0,0,1-16,0V176a8,8,0,0,1,16,0Zm32,0v16a8,8,0,0,1-16,0V176a8,8,0,0,1,16,0Z"/>`,
  cleanliness: `<path d="M224,152v56a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V152a8,8,0,0,1,3.2-6.4l64-48a8,8,0,0,1,9.6,12.8L52,152v56H204V152l-56.8-41.6a8,8,0,0,1,9.6-12.8l64,48A8,8,0,0,1,224,152ZM128,24A48,48,0,1,0,176,72,48.05,48.05,0,0,0,128,24Zm0,80A32,32,0,1,1,160,72,32,32,0,0,1,128,104Z"/>`,
  asset: `<path d="M223.68,66.15,135.68,18a15.88,15.88,0,0,0-15.36,0l-88,48.17a16,16,0,0,0-8.32,14v95.64a16,16,0,0,0,8.32,14l88,48.17a15.88,15.88,0,0,0,15.36,0l88-48.17a16,16,0,0,0,8.32-14V80.18A16,16,0,0,0,223.68,66.15ZM128,32l80.34,44L128,120,47.66,76ZM40,90l80,43.78v85.79L40,175.82Zm96,129.57V133.82L216,90v85.78Z"/>`,
}
</script>

<template>
  <div class="card p-6">
    <div class="flex items-center gap-2 mb-5">
      <div class="w-8 h-8 bg-ocean-50 rounded-lg flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 256 256" fill="#1a8774">
          <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"/>
        </svg>
      </div>
      <h3 class="text-base font-semibold text-sand-800 font-body">Core Commitments</h3>
    </div>

    <div class="space-y-3">
      <div
        v-for="(commitment, index) in commitments"
        :key="commitment.id"
        class="group p-4 rounded-xl border transition-all duration-200"
        :class="commitment.status === 'on-track'
          ? 'bg-emerge-50/40 border-emerge-200/60 hover:border-emerge-300'
          : 'bg-danger-50/40 border-danger-200/60 hover:border-danger-300'"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="flex items-start gap-3 flex-1 min-w-0">
            <div
              class="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
              :class="commitment.status === 'on-track' ? 'bg-emerge-100' : 'bg-danger-100'"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 256 256"
                :fill="commitment.status === 'on-track' ? '#16a34a' : '#dc2626'"
                v-html="iconMap[commitment.id] || iconMap.facility"
              ></svg>
            </div>
            <div class="min-w-0">
              <p class="text-sm font-semibold text-sand-800">{{ commitment.label }}</p>
              <p class="text-xs text-sand-400 mt-0.5 leading-relaxed">{{ commitment.description }}</p>
            </div>
          </div>
          <ToggleSwitch
            :modelValue="commitment.status"
            @update:modelValue="updateStatus(index, $event)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
