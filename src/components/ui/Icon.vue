<script setup lang="ts">
import { computed, useTemplateRef, type Component, type ComponentPublicInstance, onMounted, onBeforeUnmount } from "vue";
import * as lucideIcons from "@/utils/icons";
import { pointerEventNames, useCustomIcon, type PointerEventName } from "@/composables/useCustomIcon";
import { vNoFocus } from "@/directives/noFocus";
import { mapEntries, toPascalCase, when, type KebabCase } from "@/utils";

const props = defineProps<{
  name: KebabCase<keyof typeof lucideIcons> | typeof customIcons[number] | typeof simpleIcons[number];
  target?: string;
}>();

const customIcons = ["color-scheme", "sound", "rss", "external-link", "hash", "mobile-menu"] as const;
const simpleIcons = ["github", "youtube", "tiktok", "instagram", "discord", "gmail", "brand-x"] as const;

const iconType = computed<"lucide" | "custom" | "simple-icons">(() => customIcons.includes(props.name as any) ? "custom" : simpleIcons.includes(props.name as any) ? "simple-icons" : "lucide");

const simpleIconsNameMap = {
  "brand-x": "x"
};

const customIconComponent = computed(() => mapEntries(import.meta.glob<{ default: Component }>("@/components/ui/icons/*.vue", { eager: true }), (path, mod) => [path.split("/").pop()?.replace(".vue", "") || "", mod.default])[toPascalCase(props.name)]);
const iconComponent = computed(() => {
  const component = customIconComponent.value || lucideIcons[toPascalCase(props.name)];
  if (!component) console.error(`Icon ${props.name} does not exist.`);
  return component;
});

const customIcon = useCustomIcon();
const iconRef = useTemplateRef<Element | ComponentPublicInstance>("icon");

const attachedListeners: {
  type: PointerEventName;
  listener: EventListener;
}[] = [];

let targetElement: Element | null = null;

onMounted(() => {
  const rootElement = iconRef.value instanceof Element ? iconRef.value : iconRef.value?.$el;
  if (!(rootElement instanceof Element)) return;

  targetElement = props.target ? rootElement.closest(props.target) : rootElement;

  for (const type of pointerEventNames) {
    const listener = customIcon.listeners[type] as EventListener;
    targetElement?.addEventListener(type, listener);
    attachedListeners.push({ type, listener });
  }
});

onBeforeUnmount(() => {
  if (!targetElement) return;
  for (const { type, listener } of attachedListeners)
    targetElement.removeEventListener(type, listener);
  attachedListeners.length = 0;
  targetElement = null;
});
</script>

<template>
  <component
    :is="iconType === 'simple-icons' ? 'span' : iconComponent"
    ref="icon"
    class="icon"
    v-no-focus:all="iconType === 'custom'"
    :="when(iconType === 'custom', {
      state: customIcon.state,
      xmlns: 'http://www.w3.org/2000/svg',
      width: '24',
      height: '24',
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    })"
    @="customIcon.listeners"
  />
</template>

<style scoped>
.icon {
  height: 1.5rem;
  width: 1.5rem;
  overflow: visible;

  &, &:deep(*) {
    outline: none;
    transform-origin: center;
    transform-box: fill-box;
  }

  span& {
    background-color: currentColor;
    mask-image: v-bind("`url('https://cdn.simpleicons.org/${simpleIconsNameMap[name] || name}')`");
    mask-position: center;
    mask-repeat: no-repeat;
    mask-size: contain;
  }
}
</style>