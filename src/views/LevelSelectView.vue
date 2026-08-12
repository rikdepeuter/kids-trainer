<template>
  <div class="screen level-select">
    <div class="screen-header">
      <button class="back-btn" @click="router.push({ name: 'exercises', params: { profileId } })">←</button>
      <h1 class="screen-title">{{ t.chooselevel }}</h1>
      <button v-if="isParent" class="btn-primary add-btn" @click="showAddModal = true">+ {{ t.addLevel }}</button>
    </div>

    <div class="screen-body">
      <div class="levels-list">
        <LevelCard
          v-for="level in sortedLevels"
          :key="level.id"
          :level="level"
          :is-last-used="lastUsedLevelId === level.id"
          :played="isPlayed(level.id)"
          :is-parent="isParent"
          @play="playLevel(level)"
          @stats="goStats(level)"
          @edit="openEdit(level)"
          @delete="confirmDelete(level)"
        />
      </div>
    </div>

    <LevelEditorModal
      v-if="showAddModal"
      @save="onAddLevel"
      @cancel="showAddModal = false"
    />

    <LevelEditorModal
      v-if="editTarget"
      :level="editTarget"
      @save="onEditLevel"
      @cancel="editTarget = null"
    />

    <div v-if="deleteTarget" class="modal-overlay" @click.self="deleteTarget = null">
      <div class="modal-box">
        <h2 class="modal-title">{{ t.deleteLevel }}</h2>
        <p class="confirm-text">{{ t.deleteLevelConfirm }}</p>
        <div class="modal-actions">
          <button class="btn-ghost" @click="deleteTarget = null">{{ t.no }}</button>
          <button class="btn-danger" @click="doDelete">{{ t.yes }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { t } from '../i18n/nl.js'
import { useLevels } from '../stores/useLevels.js'
import { usePreferences } from '../stores/usePreferences.js'
import { useProfiles } from '../stores/useProfiles.js'
import LevelCard from '../components/LevelCard.vue'
import LevelEditorModal from '../components/LevelEditorModal.vue'

const router = useRouter()
const route = useRoute()
const profileId = route.params.profileId
const EXERCISE_ID = 'rekenen'

const { sortedLevels, addLevel, updateLevel, deleteLevel, isPlayed } = useLevels()
const { getLastUsedLevel, setLastUsedLevel } = usePreferences()
const { getProfile } = useProfiles()

const isParent = computed(() => getProfile(profileId)?.role === 'parent')

const lastUsedLevelId = computed(() => getLastUsedLevel(profileId, EXERCISE_ID))

const showAddModal = ref(false)
const editTarget = ref(null)
const deleteTarget = ref(null)

function playLevel(level) {
  setLastUsedLevel(profileId, EXERCISE_ID, level.id)
  router.push({ name: 'play', params: { profileId, levelId: level.id } })
}

function goStats(level) {
  router.push({ name: 'stats', params: { profileId, levelId: level.id } })
}

function openEdit(level) {
  editTarget.value = level
}

function confirmDelete(level) {
  deleteTarget.value = level
}

function doDelete() {
  if (deleteTarget.value) {
    deleteLevel(deleteTarget.value.id)
    deleteTarget.value = null
  }
}

function onAddLevel(data) {
  addLevel(data)
  showAddModal.value = false
}

function onEditLevel(data) {
  if (editTarget.value) {
    updateLevel(editTarget.value.id, data)
    editTarget.value = null
  }
}
</script>

<style scoped>
.add-btn {
  font-size: 16px;
  padding: 10px 18px;
  min-height: 48px;
}

.levels-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.confirm-text {
  color: var(--color-text-muted);
  font-size: var(--font-size-base);
  line-height: 1.5;
}
</style>
