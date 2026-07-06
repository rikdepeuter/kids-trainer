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
const error = ref('')
const inputRef = ref(null)

onMounted(() => {
  inputRef.value?.focus()
})

function submit() {
  if (!name.value.trim()) {
    error.value = t.profileNameRequired
    return
  }
  emit('save', name.value.trim())
}
</script>
