<template>
  <div class="modal-overlay" @click.self="$emit('cancel')">
    <div class="modal-box">
      <h2 class="modal-title">{{ t.addProfileTitle }}</h2>

      <div class="field">
        <label class="field-label">{{ t.profileName }}</label>
        <input
          ref="inputRef"
          v-model="name"
          type="text"
          :placeholder="t.profileNamePlaceholder"
          @keyup.enter="submit"
          maxlength="30"
        />
        <span v-if="error" class="error-msg">{{ error }}</span>
      </div>

      <div class="field">
        <label class="field-label">{{ t.profileRole }}</label>
        <div class="role-toggle">
          <button
            class="role-btn"
            :class="{ active: role === 'child' }"
            @click="role = 'child'"
          >👦 {{ t.roleChild }}</button>
          <button
            class="role-btn"
            :class="{ active: role === 'parent' }"
            @click="role = 'parent'"
          >👨 {{ t.roleParent }}</button>
        </div>
      </div>

      <div class="modal-actions">
        <button class="btn-ghost" @click="$emit('cancel')">{{ t.cancel }}</button>
        <button class="btn-primary" @click="submit">{{ t.save }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { t } from '../i18n/nl.js'

const emit = defineEmits(['save', 'cancel'])

const name = ref('')
const role = ref('child')
const error = ref('')
const inputRef = ref(null)

onMounted(() => inputRef.value?.focus())

function submit() {
  if (!name.value.trim()) {
    error.value = t.profileNameRequired
    return
  }
  emit('save', { name: name.value.trim(), role: role.value })
}
</script>

<style scoped>
.role-toggle {
  display: flex;
  gap: 10px;
}

.role-btn {
  flex: 1;
  padding: 12px;
  font-size: var(--font-size-base);
  font-weight: 700;
  border-radius: var(--radius-sm);
  border: 2px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text-muted);
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s, background 0.15s;
}

.role-btn.active {
  border-color: var(--color-primary);
  color: var(--color-text);
  background: rgba(99, 102, 241, 0.15);
}
</style>
