<template>
  <div class="screen math-exercise">

    <!-- Exercise screen -->
    <template v-if="!done">
      <div class="exercise-header">
        <button class="back-btn" @click="confirmQuit">←</button>
        <div class="progress-bar-wrap">
          <div class="progress-bar" :style="{ width: progressPct + '%' }"></div>
        </div>
        <div class="progress-label">{{ t.question }} {{ currentIndex + 1 }} {{ t.of }} {{ questions.length }}</div>
      </div>

      <div class="question-area" :class="feedbackClass" ref="questionAreaRef">
        <div class="question-text">{{ currentQuestion?.display }}</div>
        <div class="answer-box" :class="{ 'has-value': answerInput.length > 0 }">
          {{ answerInput || '?' }}
        </div>
      </div>

      <div class="keyboard-wrap">
        <CustomKeyboard
          @input="onDigit"
          @backspace="onBackspace"
          @ok="onOk"
        />
      </div>
    </template>

    <!-- Summary screen -->
    <template v-else>
      <div class="screen-header">
        <h1 class="screen-title">🎉 {{ t.exerciseDone }}</h1>
      </div>
      <div class="screen-body summary-body">
        <div class="summary-card">
          <div class="summary-row">
            <span class="summary-label">{{ t.correctAnswers }}</span>
            <span class="summary-value correct-count">{{ correctCount }} / {{ questions.length }}</span>
          </div>
          <div class="summary-row">
            <span class="summary-label">{{ t.totalTime }}</span>
            <span class="summary-value">{{ formatTime(totalTimeMs) }}</span>
          </div>
          <div class="summary-row">
            <span class="summary-label">{{ t.avgTimePerQuestion }}</span>
            <span class="summary-value">{{ formatTime(avgTimeMs) }}</span>
          </div>
        </div>

        <div class="answers-list">
          <div
            v-for="(ans, i) in sessionAnswers"
            :key="i"
            class="answer-row"
            :class="ans.givenAnswer === ans.correctAnswer ? 'row-correct' : 'row-wrong'"
          >
            <span class="ans-question">{{ ans.question }}</span>
            <span class="ans-sep">= {{ ans.correctAnswer }}</span>
            <span class="ans-given" :class="ans.givenAnswer === ans.correctAnswer ? 'given-ok' : 'given-bad'">
              {{ ans.givenAnswer === ans.correctAnswer ? '✓' : `✗ (${ans.givenAnswer})` }}
            </span>
            <span class="ans-time">{{ (ans.timeMs / 1000).toFixed(1) }}{{ t.seconds }}</span>
          </div>
        </div>

        <button class="btn-primary back-levels-btn" @click="goBack">{{ t.backToLevels }}</button>
      </div>
    </template>

    <!-- Quit confirm -->
    <div v-if="showQuitConfirm" class="modal-overlay" @click.self="showQuitConfirm = false">
      <div class="modal-box">
        <h2 class="modal-title">Stoppen?</h2>
        <p style="color: var(--color-text-muted)">Weet je zeker dat je wilt stoppen? Je voortgang gaat verloren.</p>
        <div class="modal-actions">
          <button class="btn-ghost" @click="showQuitConfirm = false">Nee</button>
          <button class="btn-danger" @click="goBack">Ja</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { t } from '../i18n/nl.js'
import { useLevels } from '../stores/useLevels.js'
import { useStats } from '../stores/useStats.js'
import { useProfiles } from '../stores/useProfiles.js'
import CustomKeyboard from '../components/CustomKeyboard.vue'

const router = useRouter()
const route = useRoute()
const { profileId, levelId } = route.params

const { getLevel } = useLevels()
const { saveSession } = useStats()
const { getProfile } = useProfiles()

const level = getLevel(levelId)
const profile = getProfile(profileId)

// --- Question generation ---
function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generateQuestion(level) {
  const op = pickRandom(level.operators)
  const digits = level.digits

  if (op === '/') {
    // pick b and c from digits, a = b * c
    let b, c, a
    let attempts = 0
    do {
      b = pickRandom(digits.filter(d => d > 0)) // avoid divide by zero
      c = pickRandom(digits)
      a = b * c
      attempts++
    } while (attempts < 50 && (digits.length === 0 || b === 0))
    return {
      a, b, c,
      op,
      // display: a ÷ b = ?
      display: `${a} ÷ ${b} = ?`,
      answer: c,
    }
  }

  let a = pickRandom(digits)
  let b = pickRandom(digits)

  if (op === '-') {
    if (a < b) [a, b] = [b, a]
    return { a, b, op, display: `${a} − ${b} = ?`, answer: a - b }
  }
  if (op === '+') {
    return { a, b, op, display: `${a} + ${b} = ?`, answer: a + b }
  }
  if (op === '*') {
    return { a, b, op, display: `${a} × ${b} = ?`, answer: a * b }
  }
}

function generateQuestions(level) {
  const qs = []
  for (let i = 0; i < level.questionCount; i++) {
    qs.push(generateQuestion(level))
  }
  return qs
}

const questions = ref(level ? generateQuestions(level) : [])
const currentIndex = ref(0)
const answerInput = ref('')
const feedbackClass = ref('')
const done = ref(false)
const showQuitConfirm = ref(false)
const questionAreaRef = ref(null)

const sessionAnswers = ref([])
let questionStartTime = Date.now()
let totalTimeMs = ref(0)

const currentQuestion = computed(() => questions.value[currentIndex.value])
const progressPct = computed(() => (currentIndex.value / questions.value.length) * 100)
const correctCount = computed(() => sessionAnswers.value.filter(a => a.givenAnswer === a.correctAnswer).length)
const avgTimeMs = computed(() =>
  sessionAnswers.value.length > 0
    ? Math.round(sessionAnswers.value.reduce((s, a) => s + a.timeMs, 0) / sessionAnswers.value.length)
    : 0
)

onMounted(() => {
  questionStartTime = Date.now()
})

function onDigit(d) {
  if (answerInput.value.length < 6) {
    answerInput.value += String(d)
  }
}

function onBackspace() {
  answerInput.value = answerInput.value.slice(0, -1)
}

function onOk() {
  if (answerInput.value === '') return
  const given = parseInt(answerInput.value, 10)
  const correct = currentQuestion.value.answer
  const timeMs = Date.now() - questionStartTime

  if (given === correct) {
    sessionAnswers.value.push({
      question: currentQuestion.value.display.replace(' = ?', ''),
      correctAnswer: correct,
      givenAnswer: given,
      timeMs,
    })
    feedbackClass.value = 'flash-correct'
    setTimeout(() => {
      feedbackClass.value = ''
      answerInput.value = ''
      if (currentIndex.value + 1 >= questions.value.length) {
        finishSession()
      } else {
        currentIndex.value++
        questionStartTime = Date.now()
      }
    }, 600)
  } else {
    // Wrong: record attempt with a "wrong" marker but keep the question
    // Only record the FIRST wrong attempt per question for stats
    const alreadyAnswered = sessionAnswers.value.some(
      a => a.question === currentQuestion.value.display.replace(' = ?', '') && a.givenAnswer !== a.correctAnswer
    )
    if (!alreadyAnswered) {
      sessionAnswers.value.push({
        question: currentQuestion.value.display.replace(' = ?', ''),
        correctAnswer: correct,
        givenAnswer: given,
        timeMs,
      })
    }
    feedbackClass.value = 'flash-wrong'
    setTimeout(() => {
      feedbackClass.value = ''
      answerInput.value = ''
      // Reset question timer so wrong attempts don't inflate time
      questionStartTime = Date.now()
    }, 500)
  }
}

function finishSession() {
  const endTime = Date.now()
  totalTimeMs.value = sessionAnswers.value.reduce((s, a) => s + a.timeMs, 0)
  done.value = true

  saveSession({
    profileId,
    levelId,
    levelName: level?.name ?? levelId,
    questionCount: questions.value.length,
    totalTimeMs: totalTimeMs.value,
    answers: sessionAnswers.value,
  })
}

function formatTime(ms) {
  const totalSec = Math.round(ms / 1000)
  if (totalSec < 60) return `${totalSec}${t.seconds}`
  const m = Math.floor(totalSec / 60)
  const s = totalSec % 60
  return `${m}${t.minutes} ${s}${t.seconds}`
}

function confirmQuit() {
  showQuitConfirm.value = true
}

function goBack() {
  router.push({ name: 'levels', params: { profileId } })
}
</script>

<style scoped>
.math-exercise {
  display: flex;
  flex-direction: column;
  background: var(--color-bg);
}

.exercise-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px 12px;
  flex-shrink: 0;
}

.progress-bar-wrap {
  flex: 1;
  height: 12px;
  background: rgba(255,255,255,0.1);
  border-radius: 6px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: var(--color-primary);
  border-radius: 6px;
  transition: width 0.4s ease;
}

.progress-label {
  font-size: 16px;
  color: var(--color-text-muted);
  white-space: nowrap;
  font-weight: 600;
}

.question-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  gap: 24px;
  transition: background 0.15s;
}

.question-text {
  font-size: var(--font-size-huge);
  font-weight: 900;
  text-align: center;
  letter-spacing: -2px;
  color: var(--color-text);
  line-height: 1.1;
}

.answer-box {
  min-width: 180px;
  min-height: 90px;
  background: var(--color-surface);
  border: 4px solid var(--color-border);
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-3xl);
  font-weight: 800;
  color: var(--color-text-muted);
  padding: 0 20px;
  transition: border-color 0.2s;
}

.answer-box.has-value {
  border-color: var(--color-primary);
  color: var(--color-text);
}

.keyboard-wrap {
  flex-shrink: 0;
  padding: 0 12px 12px;
}

/* Summary */
.summary-body {
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto;
}

.summary-card {
  background: var(--color-surface);
  border-radius: var(--radius);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--font-size-lg);
}

.summary-label {
  color: var(--color-text-muted);
  font-weight: 600;
}

.summary-value {
  font-weight: 800;
}

.correct-count {
  color: var(--color-success);
  font-size: var(--font-size-2xl);
}

.answers-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.answer-row {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--color-surface);
  padding: 12px 16px;
  border-radius: var(--radius-sm);
  font-size: var(--font-size-base);
  border-left: 4px solid transparent;
}

.row-correct { border-left-color: var(--color-success); }
.row-wrong { border-left-color: var(--color-error); }

.ans-question { flex: 1; font-weight: 600; }
.ans-sep { color: var(--color-text-muted); }
.ans-given { font-weight: 700; min-width: 60px; text-align: right; }
.given-ok { color: var(--color-success); }
.given-bad { color: var(--color-error); }
.ans-time { color: var(--color-text-muted); font-size: 14px; min-width: 50px; text-align: right; }

.back-levels-btn {
  font-size: var(--font-size-lg);
  padding: 16px;
  border-radius: var(--radius);
  width: 100%;
}
</style>
