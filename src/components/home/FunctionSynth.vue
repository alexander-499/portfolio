<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from "vue";
import { useClipboard } from "@vueuse/core";
import { sampleOne } from "@/utils";
import { compileFunction } from "@/utils/math-expression";

const clipboard = useClipboard();

const functionPresets = [
  "5cos(x) - cos(5x)",
  "1 / abs(sin(2x + 5)) + 3x",
  "x + sqrt(6 - x) * sin(x) * tan(4x)",
  "sin(x) * sin(20x)",
  "cos(x^2) * sin(2x) * 4",
  "sin(x) * tan(x)",
  "x - 5sin(x)",
  "x / sin(3x)",
  "sin(tan(x)) * 2",
  "sin(10x)",
  "10sin(x) + tan(x)",
  "sin(2x) % 0.2",
  "x * sin(100/x)",
  "sqrt((2pi)^2 - x^2)"
] as const;

const expression = ref(sampleOne(functionPresets));

const height = 360;
const width = 600;
const area = { left: 42, right: 14, top: 14, bottom: 28 };
const xMin = -2 * Math.PI;
const xMax = 2 * Math.PI;

// Graph
const mapX = (x: number): number => area.left + ((x - xMin) / (xMax - xMin)) * (width - area.left - area.right);
const formatTick = (value: number): string => Math.abs(value) < 1e-9 ? "0" : Number(value.toPrecision(2)).toString();

const xTicks = [
  { value: -2 * Math.PI, label: "−2π" },
  { value: -Math.PI, label: "−π" },
  { value: 0, label: "0" },
  { value: Math.PI, label: "π" },
  { value: 2 * Math.PI, label: "2π" }
].map((tick) => ({ ...tick, x: mapX(tick.value) }));

const compiledExpression = computed(() => {
  try {
    return {
      fn: compileFunction(expression.value),
      error: ""
    };
  } catch (err) {
    return {
      fn: null,
      error: err instanceof Error ? err.message : "Invalid expression."
    };
  }
});

interface GraphTick {
  value: number;
  y: number;
  label: string;
};

const graph = computed(() => {
  const emptyGraph = {
    path: "",
    error: compiledExpression.value.error,
    xTicks,
    yTicks: [] as GraphTick[],
    yMin: -1,
    yMax: 1,
    axisX: mapX(0),
    axisY: height / 2
  };

  const evaluate = compiledExpression.value.fn;
  if (!evaluate) return emptyGraph;

  const sampleCount = 600;

  const samples: {
    x: number;
    y: number | null;
  }[] = [];

  for (let i = 0; i <= sampleCount; i++) {
    const x = xMin + (i / sampleCount) * (xMax - xMin);
    samples.push({ x, y: evaluate(x) });
  }

  const validValues = samples.flatMap((sample) => sample.y === null ? [] : [sample.y]);
  if (validValues.length === 0) return { ...emptyGraph, error: "No finite real values in this range." };
  let yMin = Math.min(0, ...validValues);
  let yMax = Math.max(0, ...validValues);

  if (yMin < -20 && yMax > 20) {
    yMin = -10;
    yMax = 10;
  }

  const ySpan = Math.max(yMax - yMin, 1);
  const padding = ySpan * 0.08;
  yMin -= padding;
  yMax += padding;
  const plotHeight = height - area.top - area.bottom;
  const mapY = (y: number): number => (area.top + ((yMax - y) / (yMax - yMin)) * plotHeight);
  let path = "";
  let drawing = false;

  for (const sample of samples) {
    const y = sample.y;

    if (y === null || y < yMin || y > yMax) {
      drawing = false;
      continue;
    }

    const command = drawing ? "L" : "M";
    path += `${command}${mapX(sample.x).toFixed(2)},${mapY(y).toFixed(2)} `;
    drawing = true;
  }

  const yTicks: GraphTick[] = Array.from({ length: 5 }, (_, index) => {
    const value = yMin + ((yMax - yMin) * index) / 4;
    return { value, y: mapY(value), label: formatTick(value) };
  });

  return { path, error: "", xTicks, yTicks, yMin, yMax, axisX: mapX(0), axisY: mapY(0) };
});

// Playback Progress
const playbackProgress = ref<number | null>(null);

const playbackCursor = computed(() => {
  const progress = playbackProgress.value;
  const evaluate = compiledExpression.value.fn;
  if (progress === null || !evaluate || graph.value.error) return null;
  const x = xMin + progress * (xMax - xMin);
  const y = evaluate(x);
  const cursorX = mapX(x);
  if (y === null || y < graph.value.yMin || y > graph.value.yMax) return { x: cursorX, y: null };
  const { yMin, yMax } = graph.value;
  const plotHeight = height - area.top - area.bottom;
  const cursorY = area.top + ((yMax - y) / (yMax - yMin)) * plotHeight;
  return { x: cursorX, y: cursorY };
});

let animationFrameId: number | null = null;

function clearPlaybackCursor() {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }

  playbackProgress.value = null;
}

function animateCursor(context: AudioContext, startTime: number, duration: number) {
  clearPlaybackCursor();
  playbackProgress.value = 0;

  function updateCursor() {
    if (context !== audioContext || context.state === "closed" || playbackProgress.value === null) return clearPlaybackCursor();
    playbackProgress.value = Math.min(1, Math.max(0, (context.currentTime - startTime) / duration));
    if (playbackProgress.value < 1) animationFrameId = requestAnimationFrame(updateCursor);
    else animationFrameId = null;
  }

  animationFrameId = requestAnimationFrame(updateCursor);
}

// Audio
const isPlaying = ref(false);
const audioError = ref("");

let audioContext: AudioContext | null = null;
let activeOscillator: OscillatorNode | null = null;
let activeGain: GainNode | null = null;

function getFrequency(x: number, evaluate: (x: number) => number | null, yMin: number, yMax: number): number | null {
  const y = evaluate(x);
  if (y === null) return null;
  if (!Number.isFinite(yMax - yMin) || yMax - yMin <= 0) return null;
  return 220 * 4 ** Math.max(0, Math.min(1, (y - yMin) / (yMax - yMin)));
}

function playSound() {
  if (isPlaying.value) return stopSound();
  const evaluate = compiledExpression.value.fn;
  const ticks = graph.value.yTicks;
  if (!evaluate || graph.value.error || ticks.length < 2) return audioError.value = "Enter a valid function first.";

  let context: AudioContext;

  try {
    context = new AudioContext();
  } catch {
    return audioError.value = "Audio is not supported in this browser.";
  }

  const oscillator = context.createOscillator();
  const gain = context.createGain();

  const duration = 3;
  const sampleCount = 300;
  const startTime = context.currentTime;

  const { yMin, yMax } = graph.value;

  oscillator.type = "sine";

  oscillator.connect(gain);
  gain.connect(context.destination);

  const initialFrequency = getFrequency(xMin, evaluate, yMin, yMax) ?? 440;
  oscillator.frequency.setValueAtTime(initialFrequency, startTime);

  let lastFrequency = initialFrequency;

  for (let i = 1; i <= sampleCount; i++) {
    const progress = i / sampleCount;
    const x = xMin + progress * (xMax - xMin);
    const frequency = getFrequency(x, evaluate, yMin, yMax);
    if (frequency !== null) lastFrequency = frequency;
    oscillator.frequency.linearRampToValueAtTime(lastFrequency, startTime + progress * duration);
  }

  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(0.12, startTime + 0.025);
  gain.gain.setValueAtTime(0.12, startTime + duration - 0.05);
  gain.gain.linearRampToValueAtTime(0, startTime + duration);

  audioContext = context;
  activeOscillator = oscillator;
  activeGain = gain;
  isPlaying.value = true;
  audioError.value = "";
  animateCursor(context, startTime, duration);

  oscillator.onended = () => {
    oscillator.disconnect();
    gain.disconnect();
    clearPlaybackCursor();

    if (activeOscillator === oscillator) {
      activeOscillator = null;
      activeGain = null;
      isPlaying.value = false;
    }

    if (audioContext === context) {
      audioContext = null;
      if (context.state !== "closed") void context.close().catch(() => {});
    }
  };

  oscillator.start(startTime);
  oscillator.stop(startTime + duration);

  if (context.state === "suspended") {
    void context.resume().catch(() => {
      audioError.value = "Could not start audio playback.";
      stopSound();
    });
  }
}

function stopSound() {
  const context = audioContext;
  const oscillator = activeOscillator;
  const gain = activeGain;
  if (!context || !oscillator || !gain) return;
  const now = context.currentTime;
  const fadeDuration = 0.2;

  try {
    gain.gain.cancelAndHoldAtTime(now);
  } catch {
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(gain.gain.value, now);
  }

  try {
    gain.gain.linearRampToValueAtTime(0, now + fadeDuration);
  } catch {}

  try {
    oscillator.stop(now + fadeDuration + 0.01);
  } catch {}
}

onBeforeUnmount(() => {
  const context = audioContext;
  clearPlaybackCursor();

  try {
    activeOscillator?.stop();
  } catch {}

  activeOscillator?.disconnect();
  activeGain?.disconnect();

  activeOscillator = null;
  activeGain = null;
  audioContext = null;
  isPlaying.value = false;

  if (context && context.state !== "closed") void context.close().catch(() => {});
});
</script>

<template>
  <div class="function-synth">
    <header><span><Icon name="chart-spline"/>Function Synth</span><span><Icon name="info"/><div>
      <p>Expressions parsed using <a href="https://mathjs.org">math.js</a>.</p>
    </div></span></header>
    <div class="main">
      <svg class="graph" viewBox="0 0 600 360">
        <rect class="background" width="600" height="360"/>
        <g class="grid-lines">
          <line v-for="tick in graph.xTicks" :key="tick.label" :x1="tick.x" :x2="tick.x" :y1="area.top" :y2="height - area.bottom"/>
          <line v-for="tick in graph.yTicks" :key="tick.value" :x1="area.left" :x2="width - area.right" :y1="tick.y" :y2="tick.y"/>
        </g>
        <g class="axes">
          <line :x1="graph.axisX" :x2="graph.axisX" :y1="area.top" :y2="height - area.bottom"/>
          <line :x1="area.left" :x2="width - area.right" :y1="graph.axisY" :y2="graph.axisY"/>
        </g>
        <path v-if="graph.path" :d="graph.path" class="function-curve"/>
        <g v-if="playbackCursor" class="playback-cursor">
          <line class="cursor-line" :x1="playbackCursor.x" :x2="playbackCursor.x" :y1="area.top" :y2="height - area.bottom"/>
          <circle v-if="playbackCursor.y !== null" class="cursor-dot" :cx="playbackCursor.x" :cy="playbackCursor.y" r="8"/>
        </g>
        <g class="tick-labels">
          <text v-for="tick in graph.xTicks" :key="tick.label" :x="tick.x" :y="height - 7" text-anchor="middle">{{ tick.label }}</text>
          <text v-for="tick in graph.yTicks" :key="tick.value" :x="area.left - 8" :y="tick.y + 4" text-anchor="end">{{ tick.label }}</text>
        </g>
      </svg>
      <div class="actions">
        <div class="expression-input">
          <TextInput v-model="expression" maxlength="120" placeholder="sin(x)"/>
          <Button appearance="text" size="small" @click="clipboard.copy(expression)">
            <Icon v-if="!clipboard.copied.value" name="copy"/>
            <Icon v-else name="check"/>
          </Button>
        </div>
        <div class="buttons">
          <Button @click="expression = sampleOne(functionPresets.filter(f => f !== expression))!"><Icon name="dices"/>Randomize</Button>
          <Button :disabled="Boolean(graph.error)" @click="playSound"><Icon :name="isPlaying ? 'pause' : 'play'"/>{{ isPlaying ? "Stop" : "Play" }} Sound</Button>
        </div>
      </div>
      <p v-if="graph.error">{{ graph.error }}</p>
      <p v-else-if="audioError">{{ audioError }}</p>
      <p v-else>Type a function and listen to it!</p>
    </div>
  </div>
</template>

<style scoped>
.function-synth {
  .main {
    .graph {
      width: 100%;
      border: 1px solid var(--color-border-subtle);
      border-radius: 8px;

      .background { fill: var(--color-bg-primary); }
      .grid-lines line { stroke: var(--color-border-subtle); }
      .axes line { stroke: var(--color-border-strong); }

      .function-curve {
        fill: none;
        stroke: var(--color-accent-blue);
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
      }

      .playback-cursor {
        .cursor-line {
          stroke: var(--color-accent-blue);
          stroke-width: 2;
          stroke-dasharray: 4;
        }

        .cursor-dot {
          fill: var(--color-accent-blue);
          stroke: var(--color-bg-primary);
          stroke-width: 4;
        }
      }

      .tick-labels {
        fill: var(--color-text-tertiary);
        font-size: 0.75rem;
      }
    }

    .actions {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      .expression-input, .buttons, .buttons .button { flex: 1; }

      .expression-input {
        position: relative;

        .text-field {
          width: 100%;
          padding-right: 2.5rem;
        }

        .button {
          position: absolute;
          top: 0.25rem;
          right: 0.25rem;
        }
      }

      .buttons {
        display: flex;
        gap: 0.5rem;
      }
    }
  }
}
</style>