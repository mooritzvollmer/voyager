<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const AU_IN_KM = 149_597_870.7
const LIGHT_SPEED_KM_S = 299_792.458
const reference = {
  timestamp: Date.UTC(2026, 7, 29, 12, 0, 0),
  distanceAu: 171.436555274638,
  rangeRateKmS: 40.6173262,
}

const now = ref(Date.now())
let clock

const distanceKm = computed(() => {
  const elapsedSeconds = (now.value - reference.timestamp) / 1000
  return reference.distanceAu * AU_IN_KM + elapsedSeconds * reference.rangeRateKmS
})

const distanceAu = computed(() => distanceKm.value / AU_IN_KM)
const lightSeconds = computed(() => distanceKm.value / LIGHT_SPEED_KM_S)

const formattedDistance = computed(() => new Intl.NumberFormat('de-DE', {
  maximumFractionDigits: 0,
}).format(distanceKm.value))

const formattedAu = computed(() => new Intl.NumberFormat('de-DE', {
  minimumFractionDigits: 3,
  maximumFractionDigits: 3,
}).format(distanceAu.value))

const formattedLightTime = computed(() => {
  const totalSeconds = Math.max(0, Math.round(lightSeconds.value))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return `${hours} h ${String(minutes).padStart(2, '0')} min ${String(seconds).padStart(2, '0')} s`
})

onMounted(() => {
  clock = window.setInterval(() => { now.value = Date.now() }, 1000)
})

onBeforeUnmount(() => window.clearInterval(clock))
</script>

<template>
  <main class="voyager-page">
    <section class="voyager-card" aria-labelledby="page-title">
      <p class="eyebrow">Voyager 1 · Live-Schätzung</p>
      <h1 id="page-title">Unterwegs seit 1977.</h1>

      <div class="voyager-visual" aria-hidden="true">
        <svg viewBox="0 0 80 80">
          <g class="motion-lines" fill="none" stroke="currentColor" stroke-linecap="round">
            <path d="M18 46 14 66" />
            <path d="M26 55 24 73" />
            <path d="M58 49 62 67" />
          </g>
          <g class="probe" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
            <ellipse cx="40" cy="28" rx="15" ry="6" />
            <path d="M25 28c3 8 9 12 15 12s12-4 15-12M40 28v15" />
            <circle cx="40" cy="27" r="2.2" fill="currentColor" />
            <path d="M40 25V12m0 0 3-4" />
            <rect x="34" y="43" width="12" height="10" rx="2" />
            <path d="m34 46-13 5m25-5 13 5M21 51l-5-2m43 2 5-2M38 53v8m4-8v8" />
          </g>
        </svg>
      </div>

      <div class="distance">
        <span class="distance__value">{{ formattedDistance }}</span>
        <span class="distance__unit">Kilometer von der Erde</span>
        <span class="distance__secondary">{{ formattedAu }} AE</span>
      </div>

      <dl class="facts">
        <div>
          <dt>Lichtlaufzeit</dt>
          <dd>{{ formattedLightTime }}</dd>
        </div>
        <div>
          <dt>Position</dt>
          <dd>Interstellarer Raum</dd>
          <span>Richtung Schlangenträger</span>
        </div>
      </dl>

      <p class="source-note">
        Fortschreibung ab 29.08.2026, 12:00 UTC ·
        <a href="https://ssd.jpl.nasa.gov/horizons/" target="_blank" rel="noreferrer">NASA/JPL Horizons ↗</a>
      </p>
    </section>
  </main>
</template>
