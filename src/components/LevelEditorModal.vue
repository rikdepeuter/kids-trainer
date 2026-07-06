<template>
  <div class="modal-overlay" @click.self="$emit('cancel')">
    <div class="modal-box">
      <h2 class="modal-title">{{ isEdit ? t.editLevelTitle : t.addLevelTitle }}</h2>

      <!-- Name -->
      <div class="field">
        <label class="field-label">{{ t.levelName }}</label>
        <input
          ref="inputRef"
          v-model="form.name"
          type="text"
          :placeholder="t.levelNamePlaceholder"
          maxlength="40"
        />
        <span v-if="errors.name" class="error-msg">{{ errors.name }}</span>
      </div>

      <!-- Operators -->
      <div class="field">
        <label class="field-label">{{ t.operators }}</label>
        <div class="toggle-group">
          <button
            v-for="op in OPERATORS"
            :key="op.value"
            class="toggle-btn"
            :class="{ active: form.operators.includes(op.value) }"
            @click="toggleOperator(op.value)"
          >{{ op.label }}</button>
        </div>
        <span v-if="errors.operators" class="error-msg">{{ errors.operators }}</span>
      </div>

      <!-- Digits -->
      <div class="field">
        <label class="field-label">{{ t.digits }}</label>
        <div class="toggle-group">
          <button
            v-for="d in 10"
            :key="d - 1"
            class="toggle-btn"
            :class="{ active: form.digits.includes(d - 1) }"
            @click="toggleDigit(d - 1)"
          >{{ d - 1 }}</button>
        </div>
        <span v-if="errors.digits" class="error-msg">{{ errors.digits }}</span>
      </div>

      <!-- Question count -->
      <div class="field">
        <label class="field-label">{{ t.questionCount }}</label>
        <input
          v-model.number="form.questionCount"
          type="number"
          min="1"
          max="100"
          style="max-width: 120px"
        />
      </div>

      <div class="modal-actions">
        <button class="btn-ghost" @click="$emit('cancel')">{{ t.cancel }}</button>
        <button class="btn-primary" @click="submit">{{ t.save }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { t } from '../i18n/nl.js'

const props = defineProps({
  level: { type: Object, default: null },
})

const emit = defineEmits(['save', 'cancel'])

const isEdit = !!props.level

const OPERATORS = [
  { value: '+', label: t.operatorPlus },
  { value: '-', label: t.operatorMinus },
  { value: '*', label: t.operatorTimes },
  { value: '/', label: t.operatorDivide },
]

const form = reactive({
  name: props.level?.name ?? '',
  operators: props.level?.operators ? [...props.level.operators] : ['+', '-', '*', '/'],
  digits: props.level?.digits ? [...props.level.digits] : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  questionCount: props.level?.questionCount ?? 20,
})

const errors = reactive({ name: '', operators: '', digits: '' })
const inputRef = ref(null)

onMounted(() => inputRef.value?.focus())

function toggleOperator(op) {
  const idx = form.operators.indexOf(op)
  if (idx === -1) form.operators.push(op)
  else form.operators.splice(idx, 1)
}

function toggleDigit(d) {
  const idx = form.digits.indexOf(d)
  if (idx === -1) form.digits.push(d)
  else form.digits.splice(idx, 1)
}

function submit() {
  errors.name = ''
  errors.operators = ''
  errors.digits = ''

  let valid = true
  if (!form.name.trim()) {
    errors.name = t.levelNameRequired
    valid = false
  }
  if (form.operators.length === 0) {
    errors.operators = t.atLeastOneOperator
    valid = false
  }
  if (form.digits.length === 0) {
    errors.digits = t.atLeastOneDigit
    valid = false
  }
  if (!valid) return

  emit('save', {
    name: form.name.trim(),
    operators: [...form.operators],
    digits: [...form.digits].sort((a, b) => a - b),
    questionCount: Math.max(1, Math.min(100, form.questionCount || 20)),
  })
}
</script>
