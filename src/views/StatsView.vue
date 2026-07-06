<template>
  <div class="screen stats-view">
    <div class="screen-header">
      <button class="back-btn" @click="router.push({ name: 'levels', params: { profileId } })">←</button>
      <h1 class="screen-title">{{ t.statsTitle }}</h1>
    </div>

    <div class="screen-body">
      <div class="level-label">{{ level?.name }}</div>

      <!-- Empty state -->
      <div v-if="sessions.length === 0" class="empty-state">
        <div class="empty-icon">📊</div>
        <p class="empty-title">{{ t.noStats }}</p>
        <p class="empty-desc">{{ t.noStatsDesc }}</p>
      </div>

      <!-- Sessions list -->
      <div v-else class="sessions-list">
        <div v-for="session in sessions" :key="session.id" class="session-card">
          <div class="session-header">
            <span class="session-date">{{ formatDate(session.date) }}</span>
            <span class="session-score" :class="scoreClass(session)">
              {{ correctCount(session) }} / {{ session.questionCount }}
            </span>
          </div>
          <div class="session-meta">
            <span>⏱ {{ formatTime(session.totalTimeMs) }}</span>
            <span>avg {{ formatTime(avgTime(session)) }} / vraag</span>
          </div>

          <!-- Answer breakdown -->
          <div class="session-answers">
            <div
              v-for="(ans, i) in session.answers"
              :key="i"
              class="mini-answer"
              :class="ans.givenAnswer === ans.correctAnswer ? 'mini-ok' : 'mini-bad'"
              :title="`${ans.question} = ${ans.correctAnswer} (jij: ${ans.givenAnswer})`"
            >
              {{ ans.givenAnswer === ans.correctAnswer ? '✓' : '✗' }}
            </div>
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
import { useLevels } from '../stores/useLevels.js'
import { useStats } from '../stores/useStats.js'

const router = useRouter()
const route = useRoute()
const { profileId, levelId } = route.params

const { getLevel } = useLevels()
const { getSessionsForProfileAndLevel } = useStats()

const level = computed(() => getLevel(levelId))
const sessions = computed(() => getSessionsForProfileAndLevel(profileId, levelId))

function correctCount(session) {
  return session.answers.filter(a => a.givenAnswer === a.correctAnswer).length
}

function avgTime(session) {
  if (!session.answers.length) return 0
  return Math.round(session.totalTimeMs / session.questionCount)
}

function formatTime(ms) {
  const totalSec = Math.round(ms / 1000)
  if (totalSec < 60) return `${totalSec}${t.seconds}`
  const m = Math.floor(totalSec / 60)
  const s = totalSec % 60
  return `${m}${t.minutes} ${s}${t.seconds}`
}

function formatDate(iso) {
  const d = new Date(iso)
  return d.toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function scoreClass(session) {
  const pct = correctCount(session) / session.questionCount
  if (pct >= 0.9) return 'score-great'
  if (pct >= 0.6) return 'score-ok'
  return 'score-low'
}
</script>

<style scoped>
.level-label {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 20px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 60px 20px;
  text-align: center;
}

.empty-icon {
  font-size: 64px;
}

.empty-title {
  font-size: var(--font-size-xl);
  font-weight: 700;
}

.empty-desc {
  color: var(--color-text-muted);
  font-size: var(--font-size-base);
  max-width: 320px;
}

.sessions-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.session-card {
  background: var(--color-surface);
  border-radius: var(--radius);
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.session-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.session-date {
  font-size: 15px;
  color: var(--color-text-muted);
  font-weight: 500;
}

.session-score {
  font-size: var(--font-size-xl);
  font-weight: 800;
}

.score-great { color: var(--color-success); }
.score-ok { color: var(--color-warning); }
.score-low { color: var(--color-error); }

.session-meta {
  display: flex;
  gap: 20px;
  font-size: 15px;
  color: var(--color-text-muted);
  font-weight: 500;
}

.session-answers {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
}

.mini-answer {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
}

.mini-ok {
  background: rgba(76, 175, 80, 0.2);
  color: var(--color-success);
}

.mini-bad {
  background: rgba(244, 67, 54, 0.2);
  color: var(--color-error);
}
</style>
