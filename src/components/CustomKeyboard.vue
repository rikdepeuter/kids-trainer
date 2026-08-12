<template>
  <div class="keyboard">
    <div class="keyboard-main">
      <div class="digit-grid">
        <button class="key-btn digit" @click="$emit('input', 1)">1</button>
        <button class="key-btn digit" @click="$emit('input', 2)">2</button>
        <button class="key-btn digit" @click="$emit('input', 3)">3</button>
        <button class="key-btn digit" @click="$emit('input', 4)">4</button>
        <button class="key-btn digit" @click="$emit('input', 5)">5</button>
        <button class="key-btn digit" @click="$emit('input', 6)">6</button>
        <button class="key-btn digit" @click="$emit('input', 7)">7</button>
        <button class="key-btn digit" @click="$emit('input', 8)">8</button>
        <button class="key-btn digit" @click="$emit('input', 9)">9</button>
        <button class="key-btn digit" @click="$emit('input', 0)">0</button>
      </div>
      <div class="action-col">
        <button class="key-btn backspace" @click="$emit('backspace')">{{ t.backspace }}</button>
        <button class="key-btn ok" @click="$emit('ok')">{{ t.ok }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { t } from '../i18n/nl.js'

defineEmits(['input', 'backspace', 'ok'])
</script>

<style scoped>
.keyboard {
  padding: 12px;
  background: rgba(0,0,0,0.2);
  border-radius: var(--radius);
  width: 360px;
}

.keyboard-main {
  display: flex;
  gap: 10px;
}

.digit-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  flex: 1;
}

.action-col {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.key-btn {
  flex: 1;
  min-height: 80px;
  font-size: var(--font-size-2xl);
  font-weight: 700;
  border-radius: var(--radius-sm);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  transition: transform 0.08s ease, opacity 0.08s ease;
}

.key-btn:active {
  transform: scale(0.92);
  opacity: 0.85;
}

.key-btn.digit {
  background: var(--color-surface-2);
  color: var(--color-text);
}

.key-btn.backspace {
  background: var(--color-warning);
  color: #fff;
  font-size: var(--font-size-xl);
  flex: 1;
}

.key-btn.ok {
  background: var(--color-success);
  color: #fff;
  font-size: var(--font-size-xl);
  font-weight: 800;
  flex: 1;
}
</style>
