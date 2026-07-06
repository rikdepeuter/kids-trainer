<template>
  <div id="kt-app">
    <RouterView />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
</script>

<style>
:root {
  --color-bg: #1a1a2e;
  --color-surface: #16213e;
  --color-surface-2: #0f3460;
  --color-primary: #e94560;
  --color-primary-dark: #c73652;
  --color-success: #4caf50;
  --color-success-dark: #388e3c;
  --color-warning: #ff9800;
  --color-warning-dark: #e65100;
  --color-error: #f44336;
  --color-text: #ffffff;
  --color-text-muted: #aaaacc;
  --color-border: rgba(255, 255, 255, 0.15);
  --color-card-hover: rgba(255, 255, 255, 0.08);

  --palette-0: #e94560;
  --palette-1: #f7b731;
  --palette-2: #20bf6b;
  --palette-3: #4fc3f7;
  --palette-4: #ab47bc;
  --palette-5: #ff7043;
  --palette-6: #26c6da;
  --palette-7: #66bb6a;
  --palette-8: #ffa726;
  --palette-9: #ec407a;

  --radius: 16px;
  --radius-sm: 8px;
  --shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  --shadow-sm: 0 2px 12px rgba(0, 0, 0, 0.3);

  --font-size-base: 18px;
  --font-size-lg: 22px;
  --font-size-xl: 28px;
  --font-size-2xl: 36px;
  --font-size-3xl: 48px;
  --font-size-huge: 72px;
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

html, body {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

body {
  font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  font-size: var(--font-size-base);
  background: var(--color-bg);
  color: var(--color-text);
  line-height: 1.4;
}

#kt-app {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

button {
  font-family: inherit;
  font-size: var(--font-size-base);
  cursor: pointer;
  border: none;
  outline: none;
  border-radius: var(--radius-sm);
  min-height: 48px;
  padding: 12px 24px;
  font-weight: 600;
  transition: transform 0.1s ease, opacity 0.1s ease;
  user-select: none;
}

button:active {
  transform: scale(0.96);
  opacity: 0.9;
}

button.btn-primary {
  background: var(--color-primary);
  color: #fff;
}

button.btn-primary:active {
  background: var(--color-primary-dark);
}

button.btn-success {
  background: var(--color-success);
  color: #fff;
}

button.btn-success:active {
  background: var(--color-success-dark);
}

button.btn-ghost {
  background: transparent;
  color: var(--color-text-muted);
  border: 2px solid var(--color-border);
}

button.btn-ghost:active {
  background: var(--color-card-hover);
}

button.btn-danger {
  background: var(--color-error);
  color: #fff;
}

input[type="text"],
input[type="number"] {
  font-family: inherit;
  font-size: var(--font-size-lg);
  background: rgba(255, 255, 255, 0.08);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-sm);
  color: var(--color-text);
  padding: 14px 18px;
  width: 100%;
  min-height: 56px;
  outline: none;
  transition: border-color 0.2s;
}

input[type="text"]:focus,
input[type="number"]:focus {
  border-color: var(--color-primary);
}

input[type="text"]::placeholder,
input[type="number"]::placeholder {
  color: var(--color-text-muted);
}

.screen {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.screen-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 24px 16px;
  flex-shrink: 0;
}

.screen-title {
  font-size: var(--font-size-2xl);
  font-weight: 800;
  color: var(--color-text);
  flex: 1;
}

.screen-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px 24px 24px;
}

.back-btn {
  background: rgba(255,255,255,0.1);
  color: var(--color-text);
  border-radius: 50%;
  width: 52px;
  height: 52px;
  min-height: unset;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 24px;
}

.modal-box {
  background: var(--color-surface);
  border-radius: var(--radius);
  padding: 28px;
  width: 100%;
  max-width: 480px;
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-title {
  font-size: var(--font-size-xl);
  font-weight: 800;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-label {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--color-text-muted);
}

.error-msg {
  color: var(--color-error);
  font-size: 15px;
  margin-top: 4px;
}

.toggle-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.toggle-btn {
  padding: 10px 18px;
  min-height: 48px;
  border: 2px solid var(--color-border);
  background: transparent;
  color: var(--color-text-muted);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-base);
  font-weight: 700;
  transition: all 0.15s;
}

.toggle-btn.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #fff;
}

@keyframes flash-green {
  0% { background: transparent; }
  30% { background: rgba(76, 175, 80, 0.4); }
  100% { background: transparent; }
}

@keyframes shake-red {
  0%, 100% { transform: translateX(0); }
  15% { transform: translateX(-12px); }
  30% { transform: translateX(12px); }
  45% { transform: translateX(-10px); }
  60% { transform: translateX(10px); }
  75% { transform: translateX(-6px); }
  90% { transform: translateX(6px); }
}

.flash-correct {
  animation: flash-green 0.6s ease;
}

.flash-wrong {
  animation: shake-red 0.5s ease;
}
</style>
