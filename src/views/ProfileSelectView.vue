<template>
  <div class="screen profile-select">
    <div class="screen-header">
      <h1 class="screen-title">{{ t.selectProfile }}</h1>
    </div>

    <div class="screen-body">
      <div class="profiles-grid">
        <ProfileCard
          v-for="profile in profiles"
          :key="profile.id"
          :profile="profile"
          :show-delete="editMode"
          @select="selectProfile(profile)"
          @delete="confirmDelete(profile)"
          @long-press="editMode = true"
        />

        <!-- Add new profile card -->
        <div class="profile-card add-card" @click="showAddModal = true">
          <div class="add-icon">+</div>
          <div class="profile-name">{{ t.addProfile }}</div>
        </div>
      </div>

      <!-- Edit mode toggle -->
      <div v-if="profiles.length > 0" class="edit-toggle">
        <button class="btn-ghost edit-mode-btn" @click="editMode = !editMode">
          {{ editMode ? t.confirm : t.editProfile }}
        </button>
      </div>
    </div>

    <!-- Add Profile Modal -->
    <AddProfileModal
      v-if="showAddModal"
      @save="onAddProfile"
      @cancel="showAddModal = false"
    />

    <!-- Delete Confirm -->
    <div v-if="deleteTarget" class="modal-overlay" @click.self="deleteTarget = null">
      <div class="modal-box">
        <h2 class="modal-title">{{ t.deleteProfile }}</h2>
        <p class="confirm-text">{{ t.deleteProfileConfirm }}</p>
        <div class="modal-actions">
          <button class="btn-ghost" @click="deleteTarget = null">{{ t.no }}</button>
          <button class="btn-danger" @click="doDelete">{{ t.yes }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { t } from '../i18n/nl.js'
import { useProfiles } from '../stores/useProfiles.js'
import ProfileCard from '../components/ProfileCard.vue'
import AddProfileModal from '../components/AddProfileModal.vue'

const router = useRouter()
const { profiles, addProfile, deleteProfile } = useProfiles()

const showAddModal = ref(false)
const editMode = ref(false)
const deleteTarget = ref(null)

function selectProfile(profile) {
  if (editMode.value) return
  router.push({ name: 'exercises', params: { profileId: profile.id } })
}

function onAddProfile({ name, role }) {
  addProfile(name, role)
  showAddModal.value = false
}

function confirmDelete(profile) {
  deleteTarget.value = profile
}

function doDelete() {
  if (deleteTarget.value) {
    deleteProfile(deleteTarget.value.id)
    deleteTarget.value = null
    if (profiles.value.length === 0) editMode.value = false
  }
}
</script>

<style scoped>
.profile-select {
  background: var(--color-bg);
}

.screen-title {
  font-size: var(--font-size-3xl);
  font-weight: 900;
  letter-spacing: -0.5px;
}

.profiles-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  padding: 12px 0;
}

.add-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 24px 16px 20px;
  background: rgba(255,255,255,0.05);
  border-radius: var(--radius);
  cursor: pointer;
  border: 3px dashed var(--color-border);
  min-width: 140px;
  transition: border-color 0.15s, background 0.15s;
  user-select: none;
}

.add-card:active {
  background: var(--color-card-hover);
  border-color: var(--color-primary);
}

.add-icon {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: rgba(255,255,255,0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  color: var(--color-text-muted);
  font-weight: 300;
}

.profile-name {
  font-size: var(--font-size-lg);
  font-weight: 700;
  text-align: center;
  color: var(--color-text-muted);
}

.edit-toggle {
  margin-top: 28px;
  text-align: center;
}

.edit-mode-btn {
  font-size: 16px;
  padding: 10px 24px;
}

.confirm-text {
  color: var(--color-text-muted);
  font-size: var(--font-size-base);
  line-height: 1.5;
}
</style>
