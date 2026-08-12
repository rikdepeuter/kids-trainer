import { ref, computed } from 'vue'

const STORAGE_KEY = 'kt_levels'

const BUILTIN_LEVEL = {
  id: 'builtin-alles',
  name: 'Alles',
  isBuiltin: true,
  operators: ['+', '-', '*', '/'],
  digits: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  questionCount: 20,
  onlyPositiveResults: true,
  onlyIntegerResults: true,
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function saveToStorage(levels) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(levels))
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

function initLevels() {
  const stored = loadFromStorage()
  if (stored) {
    // ensure builtin is always present and up-to-date
    const hasBuiltin = stored.some(l => l.id === BUILTIN_LEVEL.id)
    if (!hasBuiltin) {
      stored.unshift(BUILTIN_LEVEL)
      saveToStorage(stored)
    }
    return stored
  }
  const initial = [BUILTIN_LEVEL]
  saveToStorage(initial)
  return initial
}

const PLAYED_KEY = 'kt_played_levels'

const levels = ref(initLevels())
const playedLevelIds = ref(new Set(JSON.parse(localStorage.getItem(PLAYED_KEY) || '[]')))

const sortedLevels = computed(() =>
  [...levels.value].sort((a, b) => a.name.localeCompare(b.name, 'nl'))
)

export function useLevels() {
  function markPlayed(id) {
    playedLevelIds.value.add(id)
    localStorage.setItem(PLAYED_KEY, JSON.stringify([...playedLevelIds.value]))
  }

  function isPlayed(id) {
    return playedLevelIds.value.has(id)
  }

  function addLevel(levelData) {
    const level = {
      id: generateId(),
      isBuiltin: false,
      ...levelData,
    }
    levels.value.push(level)
    saveToStorage(levels.value)
    return level
  }

  function updateLevel(id, levelData) {
    const idx = levels.value.findIndex(l => l.id === id)
    if (idx !== -1) {
      levels.value[idx] = { ...levels.value[idx], ...levelData }
      saveToStorage(levels.value)
    }
  }

  function deleteLevel(id) {
    levels.value = levels.value.filter(l => l.id !== id)
    saveToStorage(levels.value)
  }

  function getLevel(id) {
    return levels.value.find(l => l.id === id) || null
  }

  return { levels, sortedLevels, addLevel, updateLevel, deleteLevel, getLevel, markPlayed, isPlayed }
}
