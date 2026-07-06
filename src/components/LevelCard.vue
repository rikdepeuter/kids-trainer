<template>
  <div class="level-card" :class="{ 'is-last-used': isLastUsed }">
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
    <div class="level-actions">
      <button class="btn-success action-btn" @click="$emit('play')">▶ {{ t.play }}</button>
      <button class="btn-ghost action-btn" @click="$emit('stats')">📊 {{ t.stats }}</button>
      <template v-if="!level.isBuiltin">
        <button class="btn-ghost action-btn" @click="$emit('edit')">✏️ {{ t.edit }}</button>
        <button class="btn-danger action-btn" @click="$emit('delete')">🗑️</button>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { t } from '../i18n/nl.js'

const props = defineProps({
  level: { type: Object, required: true },
  isLastUsed: { type: Boolean, default: false },
})

defineEmits(['play', 'stats', 'edit', 'delete'])

const OP_LABELS = { '+': '+', '-': '−', '*': '×', '/': '÷' }

const operatorsDisplay = computed(() =>
  props.level.operators.map(op => OP_LABELS[op] || op).join(' ')
)
</script>

<style scoped>
.level-card {
  background: var(--color-surface);
  border-radius: var(--radius);
  padding: 18px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  border: 3px solid transparent;
  transition: border-color 0.2s;
}

.level-card.is-last-used {
  border-color: var(--color-primary);
}

.level-info {
  flex: 1;
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

.level-actions {
  display: flex;
  gap: 10px;
  flex-shrink: 0;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.action-btn {
  padding: 10px 16px;
  font-size: 15px;
  min-height: 48px;
  border-radius: var(--radius-sm);
}
</style>
