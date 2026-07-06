import { ref } from 'vue'

const STORAGE_KEY = 'kt_profiles'

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveToStorage(profiles) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles))
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

const profiles = ref(loadFromStorage())

export function useProfiles() {
  function addProfile(name) {
    const profile = { id: generateId(), name: name.trim() }
    profiles.value.push(profile)
    saveToStorage(profiles.value)
    return profile
  }

  function deleteProfile(id) {
    profiles.value = profiles.value.filter(p => p.id !== id)
    saveToStorage(profiles.value)
  }

  function getProfile(id) {
    return profiles.value.find(p => p.id === id) || null
  }

  return { profiles, addProfile, deleteProfile, getProfile }
}
