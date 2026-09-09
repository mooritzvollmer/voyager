<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import mvLogo from './assets/mv-logo.svg?raw'

const AU_IN_KM = 149_597_870.7
const LIGHT_SPEED_KM_S = 299_792.458
const LAUNCH_TIMESTAMP = Date.UTC(1977, 8, 5, 12, 56, 1)
const reference = {
  timestamp: Date.UTC(2026, 7, 29, 12, 0, 0),
  distanceEarthAu: 171.436555274638,
  rangeRateEarthKmS: 40.6173262,
  speedSunKmS: 16.9182899,
}

const now = ref(Date.now())
let clock

const elapsedSeconds = computed(() => (now.value - reference.timestamp) / 1000)
const distanceEarthKm = computed(() => reference.distanceEarthAu * AU_IN_KM + elapsedSeconds.value * reference.rangeRateEarthKmS)
const lightSeconds = computed(() => distanceEarthKm.value / LIGHT_SPEED_KM_S)
const lightDays = computed(() => lightSeconds.value / 86_400)
const nextLightDayMilestone = computed(() => Math.floor(lightDays.value * 4 + 1) / 4)
const missionDays = computed(() => Math.floor((now.value - LAUNCH_TIMESTAMP) / 86_400_000))

const number = (value, digits = 0) => new Intl.NumberFormat('de-DE', {
  minimumFractionDigits: digits,
  maximumFractionDigits: digits,
}).format(value)

function duration(totalSeconds) {
  const seconds = Math.max(0, Math.round(totalSeconds))
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainder = seconds % 60
  return `${hours} h ${String(minutes).padStart(2, '0')} min ${String(remainder).padStart(2, '0')} s`
}

onMounted(() => {
  clock = window.setInterval(() => { now.value = Date.now() }, 1000)
})

onBeforeUnmount(() => window.clearInterval(clock))
</script>

<template>
  <main class="space-page">
    <div class="stars stars--far" aria-hidden="true"></div>
    <div class="stars stars--near" aria-hidden="true"></div>

    <section class="telemetry" aria-labelledby="page-title">
      <header class="telemetry__header">
        <div>
          <p class="eyebrow">Mission VGR-1 / Deep Space Network</p>
          <h1 id="page-title">Voyager 1</h1>
        </div>
        <div class="signal"><i></i> Werte modelliert</div>
      </header>

      <div class="probe-stage" aria-hidden="true">
        <span class="orbit orbit--one"></span>
        <span class="orbit orbit--two"></span>
        <span class="scan-line"></span>
        <div class="voyager-visual">
          <svg viewBox="0 0 80 80">
            <g class="motion-lines" fill="none" stroke="currentColor" stroke-linecap="round">
              <path d="M18 46 14 66" />
              <path d="M26 55 24 73" />
              <path d="M58 49 62 67" />
            </g>
            <g class="radio-waves" fill="none" stroke="currentColor">
              <path d="M43 10c5 1 8 4 9 9" />
              <path d="M45 5c8 2 13 7 15 15" />
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
      </div>

      <div class="distance">
        <span class="distance__label">Entfernung zur Erde · in Kilometern</span>
        <strong>{{ number(distanceEarthKm) }}</strong>
        <span class="distance__au">{{ number(distanceEarthKm / AU_IN_KM, 6) }} AE</span>
      </div>

      <dl class="data-grid">
        <div>
          <dt>Signallaufzeit</dt>
          <dd>{{ duration(lightSeconds) }}</dd>
        </div>
        <div>
          <dt>Früheste Antwort</dt>
          <dd>{{ duration(lightSeconds * 2) }}</dd>
        </div>
        <div>
          <template v-if="lightDays < 1">
            <dt>Ein Lichttag</dt>
            <dd>{{ number(lightDays * 100, 2) }} % erreicht</dd>
          </template>
          <template v-else>
            <dt>Entfernung in Lichttagen</dt>
            <dd>{{ number(lightDays, 3) }} Lichttage</dd>
            <span>Nächster Meilenstein · {{ number(nextLightDayMilestone, 2) }} Lichttage</span>
          </template>
        </div>
        <div>
          <dt>Tempo relativ zur Sonne</dt>
          <dd>{{ number(reference.speedSunKmS, 2) }} km/s</dd>
        </div>
        <div>
          <dt>Missionszeit · seit Start am 05.09.1977</dt>
          <dd>{{ number(missionDays) }} Tage</dd>
        </div>
        <div>
          <dt>Position</dt>
          <dd>Interstellarer Raum</dd>
          <span>Sternbild Schlangenträger (Oph)</span>
        </div>
      </dl>

      <footer class="telemetry__footer">
        <span>Referenz · 29.08.2026, 12:00 UTC · linear fortgeschrieben</span>
        <a href="https://ssd.jpl.nasa.gov/horizons/" target="_blank" rel="noreferrer">NASA/JPL Horizons ↗</a>
      </footer>
    </section>

    <footer class="project-footer">
      <div class="project-footer__inner">
        <a class="project-footer__identity" href="https://moritzvollmer.de/" target="_blank" rel="noopener noreferrer author">
          <span class="project-footer__mark" aria-hidden="true" v-html="mvLogo"></span>
          <span>Moritz Vollmer <small>// Voyager 1</small></span>
        </a>
        <nav class="project-footer__links" aria-label="Footer-Navigation">
          <a href="https://moritzvollmer.de/" target="_blank" rel="noopener noreferrer">Portfolio</a>
          <a href="https://moritzvollmer.de/projekte/" target="_blank" rel="noopener noreferrer">Weitere Projekte</a>
          <a href="https://moritzvollmer.de/impressum/" target="_blank" rel="noopener noreferrer">Impressum</a>
          <a href="https://moritzvollmer.de/datenschutz/" target="_blank" rel="noopener noreferrer">Datenschutz</a>
        </nav>
      </div>
      <p>© 2026 Moritz Vollmer</p>
    </footer>
  </main>
</template>
