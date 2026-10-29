import { computed, ref, reactive, type Reactive } from "vue";

export interface CustomIconState {
  hover: boolean;
  active: boolean;
  isBooped: boolean;
}

export const pointerEventNames = ["pointerenter", "pointerleave", "pointerdown", "pointerup", "pointercancel"];
export type PointerEventName = typeof pointerEventNames[number];

export type UseCustomIconReturn = Reactive<{
  state: CustomIconState;
  listeners: Record<PointerEventName, (e: PointerEvent) => void>;
}>;

export function useCustomIcon(): UseCustomIconReturn {
  const internalState = ref<CustomIconState>({ hover: false, active: false, isBooped: false });
  const state = computed(() => internalState.value);

  let boopTimeout: ReturnType<typeof setTimeout> | undefined;

  function triggerBoop() {
    internalState.value = { ...internalState.value, isBooped: true };
    clearTimeout(boopTimeout);
    boopTimeout = setTimeout(() => internalState.value = { ...internalState.value, isBooped: false }, 150);
  }

  function handlePointerEvent(e: PointerEvent) {
    const target = e.currentTarget as Element | null;
    if (!target) return;

    const nextHover = e.type === "pointerenter" ? true : e.type === "pointerleave" ? false : internalState.value.hover;
    const nextActive = e.type === "pointerdown" ? true : (e.type === "pointerup" || e.type === "pointercancel") ? false : internalState.value.active;
    internalState.value = { ...internalState.value, hover: nextHover, active: nextActive };
    if (e.type === "pointerenter") triggerBoop();

    if (e.type === "pointerdown") target.setPointerCapture(e.pointerId);
    if (e.type === "pointerup" || e.type === "pointercancel") target.releasePointerCapture(e.pointerId);
  }

  const listeners = Object.fromEntries(pointerEventNames.map(e => [e, handlePointerEvent])) ;

  return reactive({ state, listeners });
}