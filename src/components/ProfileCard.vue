<template>
  <div
    class="profile-card"
    :style="{ '--card-color': color }"
    @click="$emit('select')"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
    @touchcancel="onTouchEnd"
  >
    <div class="profile-avatar">{{ initials }}</div>
    <div class="profile-name">{{ profile.name }}</div>
    <button
      v-if="showDelete"
      class="delete-btn"
      @click.stop="$emit('delete')"
    >✕</button>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  profile: { type: Object, required: true },
  showDelete: { type: Boolean, default: false },
})

const emit = defineEmits(['select', 'delete', 'long-press'])

const COLORS = [
  'var(--palette-0)', 'var(--palette-1)', 'var(--palette-2)',
  'var(--palette-3)', 'var(--palette-4)', 'var(--palette-5)',
  'var(--palette-6)', 'var(--palette-7)', 'var(--palette-8)', 'var(--palette-9)',
]

const color = computed(() => {
  let hash = 0
  for (const ch of props.profile.name) hash = (hash * 31 + ch.charCodeAt(0)) | 0
  return COLORS[Math.abs(hash) % COLORS.length]
})

const initials = computed(() => {
  return props.profile.name
    .trim()
    .split(/\s+/)
    .map(w => w[0]?.toUpperCase() || '')
    .slice(0, 2)
    .join('')
})

let longPressTimer = null

function onTouchStart() {
  longPressTimer = setTimeout(() => {
    emit('long-press')
  }, 600)
}

function onTouchEnd() {
  clearTimeout(longPressTimer)
}
</script>

<style scoped>
.profile-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 24px 16px 20px;
  background: var(--color-surface);
  border-radius: var(--radius);
  cursor: pointer;
  border: 3px solid transparent;
  transition: border-color 0.15s, transform 0.1s;
  user-select: none;
  min-width: 140px;
}

.profile-card:active {
  transform: scale(0.96);
  border-color: var(--card-color);
}

.profile-avatar {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: var(--card-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: 900;
  color: #fff;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
  box-shadow: 0 4px 16px rgba(0,0,0,0.3);
}

.profile-name {
  font-size: var(--font-size-lg);
  font-weight: 700;
  text-align: center;
  color: var(--color-text);
  word-break: break-word;
}

.delete-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  min-height: unset;
  padding: 0;
  border-radius: 50%;
  background: var(--color-error);
  color: #fff;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
