import { ref } from 'vue'

const STORAGE_KEY = 'kt_stats'

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveToStorage(stats) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats))
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

const stats = ref(loadFromStorage())

export function useStats() {
  function saveSession(sessionData) {
    const session = {
      id: generateId(),
      date: new Date().toISOString(),
      ...sessionData,
    }
    stats.value.push(session)
    saveToStorage(stats.value)
    return session
  }

  function getSessionsForProfileAndLevel(profileId, levelId) {
    return stats.value
      .filter(s => s.profileId === profileId && s.levelId === levelId)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  }

  return { stats, saveSession, getSessionsForProfileAndLevel }
}
