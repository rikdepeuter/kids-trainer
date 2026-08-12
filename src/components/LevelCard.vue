<template>
  <div class="level-card" :class="{ 'is-last-used': isLastUsed }">
    <button class="level-play-btn" @click="$emit('play')">
      <span class="play-icon">▶</span>
      <div class="level-info">
        <div class="level-name">
          {{ level.name }}
          <span v-if="level.isBuiltin" class="builtin-badge">{{ t.builtinLevel }}</span>
          <span v-if="isLastUsed" class="last-used-badge">{{ t.lastUsed }}</span>
        </div>
        <div class="level-meta">
          {{ level.questionCount }} {{ t.questions }} &middot;
          {{ operatorsDisplay }}
        </div>
      </div>
    </button>

    <div class="menu-wrap" ref="menuWrap">
      <button class="hamburger-btn" @click.stop="menuOpen = !menuOpen">⋮</button>
      <div v-if="menuOpen" class="dropdown">
        <button class="dropdown-item" @click="emit('stats'); menuOpen = false">
          📊 {{ t.stats }}
        </button>
        <template v-if="isParent && !level.isBuiltin && !played">
          <button class="dropdown-item" @click="emit('edit'); menuOpen = false">
            ✏️ {{ t.edit }}
          </button>
        </template>
        <template v-if="isParent && !level.isBuiltin">
          <button class="dropdown-item danger" @click="emit('delete'); menuOpen = false">
            🗑️ {{ t.delete }}
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { t } from '../i18n/nl.js'

const props = defineProps({
  level: { type: Object, required: true },
  isLastUsed: { type: Boolean, default: false },
  played: { type: Boolean, default: false },
  isParent: { type: Boolean, default: false },
})

const emit = defineEmits(['play', 'stats', 'edit', 'delete'])

const menuOpen = ref(false)
const menuWrap = ref(null)

const OP_LABELS = { '+': '+', '-': '−', '*': '×', '/': '÷' }

const operatorsDisplay = computed(() =>
  props.level.operators.map(op => OP_LABELS[op] || op).join(' ')
)

function onClickOutside(e) {
  if (menuWrap.value && !menuWrap.value.contains(e.target)) {
    menuOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', onClickOutside))
onUnmounted(() => document.removeEventListener('click', onClickOutside))
</script>

<style scoped>
.level-card {
  background: var(--color-surface);
  border-radius: var(--radius);
  border: 3px solid transparent;
  transition: border-color 0.2s;
  display: flex;
  align-items: stretch;
  overflow: visible;
}

.level-card.is-last-used {
  border-color: var(--color-primary);
}

.level-play-btn {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 16px 18px 20px;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  color: var(--color-text);
  border-radius: var(--radius) 0 0 var(--radius);
  transition: background 0.12s;
  min-width: 0;
}

.level-play-btn:active {
  background: rgba(255,255,255,0.06);
}

.play-icon {
  font-size: 22px;
  color: var(--color-success);
  flex-shrink: 0;
}

.level-info {
  min-width: 0;
}

.level-name {
  font-size: var(--font-size-lg);
  font-weight: 700;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.builtin-badge {
  font-size: 13px;
  font-weight: 600;
  background: var(--color-surface-2);
  color: var(--color-text-muted);
  padding: 3px 10px;
  border-radius: 20px;
}

.last-used-badge {
  font-size: 13px;
  font-weight: 600;
  background: var(--color-primary);
  color: #fff;
  padding: 3px 10px;
  border-radius: 20px;
}

.level-meta {
  font-size: 15px;
  color: var(--color-text-muted);
  margin-top: 4px;
}

/* Hamburger */
.menu-wrap {
  position: relative;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  padding-right: 8px;
}

.hamburger-btn {
  width: 44px;
  height: 44px;
  background: none;
  border: none;
  font-size: 24px;
  color: var(--color-text-muted);
  cursor: pointer;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.12s;
}

.hamburger-btn:active {
  background: rgba(255,255,255,0.08);
}

.dropdown {
  position: absolute;
  right: 0;
  top: calc(100% + 4px);
  background: var(--color-surface-2);
  border-radius: var(--radius-sm);
  box-shadow: 0 8px 24px rgba(0,0,0,0.4);
  min-width: 160px;
  z-index: 100;
  overflow: hidden;
}

.dropdown-item {
  width: 100%;
  padding: 14px 18px;
  background: none;
  border: none;
  text-align: left;
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--color-text);
  cursor: pointer;
  display: block;
  transition: background 0.1s;
}

.dropdown-item:active {
  background: rgba(255,255,255,0.08);
}

.dropdown-item.danger {
  color: var(--color-error);
}
</style>
