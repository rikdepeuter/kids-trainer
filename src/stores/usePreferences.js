import { ref } from 'vue'

const STORAGE_KEY = 'kt_prefs'

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveToStorage(prefs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
}

const prefs = ref(loadFromStorage())

export function usePreferences() {
  function getLastUsedLevel(profileId, exerciseId) {
    return prefs.value[`${profileId}_${exerciseId}`] || null
  }

  function setLastUsedLevel(profileId, exerciseId, levelId) {
    prefs.value[`${profileId}_${exerciseId}`] = levelId
    saveToStorage(prefs.value)
  }

  return { getLastUsedLevel, setLastUsedLevel }
}
