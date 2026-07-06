<template>
  <div class="screen exercise-select">
    <div class="screen-header">
      <button class="back-btn" @click="router.push({ name: 'profiles' })">←</button>
      <h1 class="screen-title">
        <span class="profile-name-label">{{ profile?.name }}</span>
      </h1>
    </div>
    <div class="screen-body">
      <p class="subtitle">{{ t.chooseExercise }}</p>
      <div class="exercises-grid">
        <div class="exercise-card" @click="goToLevels">
          <div class="exercise-icon">🔢</div>
          <div class="exercise-info">
            <div class="exercise-name">{{ t.exerciseRekenen }}</div>
            <div class="exercise-desc">{{ t.exerciseRekenenDesc }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { t } from '../i18n/nl.js'
import { useProfiles } from '../stores/useProfiles.js'

const router = useRouter()
const route = useRoute()
const { getProfile } = useProfiles()

const profile = computed(() => getProfile(route.params.profileId))

function goToLevels() {
  router.push({ name: 'levels', params: { profileId: route.params.profileId } })
}
</script>

<style scoped>
.subtitle {
  font-size: var(--font-size-xl);
  color: var(--color-text-muted);
  margin-bottom: 24px;
  font-weight: 600;
}

.profile-name-label {
  color: var(--color-primary);
}

.exercises-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.exercise-card {
  background: var(--color-surface);
  border-radius: var(--radius);
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  cursor: pointer;
  border: 3px solid transparent;
  transition: border-color 0.15s, transform 0.1s;
  user-select: none;
}

.exercise-card:active {
  border-color: var(--color-primary);
  transform: scale(0.98);
}

.exercise-icon {
  font-size: 52px;
  flex-shrink: 0;
}

.exercise-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.exercise-name {
  font-size: var(--font-size-2xl);
  font-weight: 800;
}

.exercise-desc {
  font-size: var(--font-size-base);
  color: var(--color-text-muted);
}
</style>
