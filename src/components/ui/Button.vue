<script lang="ts">
import { defineComponent, h, mergeProps, Text, type AnchorHTMLAttributes, type Component } from "vue";
import { RouterLink, type RouteLocationRaw } from "vue-router";

export default defineComponent<{
  to?: RouteLocationRaw;
  href?: string;
  target?: AnchorHTMLAttributes["target"];
  appearance?: "text" | "bordered" | "filled";
  size?: "small" | "medium";
}>({
  props: {
    to: [String, Object],
    href: String,
    appearance: { type: String, default: "bordered" },
    size: { type: String, default: "medium" }
  },
  setup: (props, { slots, attrs }) => () => {
    const children = (slots.default?.() ?? []).map(node => node.type === Text && typeof node.children === "string" && node.children.trim() ? h("span", null, node.children) : node);
    return h(props.to ? RouterLink : props.href ? "a" : "button" as string | Component, mergeProps({
      class: "button",
      to: props.to,
      href: props.href,
      target: props.href && props.target ? props.target : undefined,
      "data-appearance": props.appearance ?? "bordered",
      "data-size": props.size ?? "medium"
    }, attrs), props.to ? () => children : children);
  }
});
</script>

<style scoped>
.button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  color: var(--color-text-secondary);
  font-size: 1rem;
  font-family: var(--font-family-base);
  text-decoration: none;
  border: 1px solid var(--color-border-subtle);
  border-radius: 8px;
  cursor: pointer;
  user-select: none;
  transition: color 200ms, background-color 200ms, scale 200ms;
  --button-border: 0px;

  &:active { scale: 0.9; }
  &:disabled { cursor: not-allowed; }
  &:not([data-appearance="bordered"]) { border: none; }
  &:not([data-appearance="filled"]) { color: var(--button-color, var(--color-text-secondary)); }

  &[data-appearance="text"] { background-color: transparent; }

  &[data-appearance="bordered"] {
    background-color: var(--color-control);
    --button-border: 1px;

    &:hover { background-color: var(--color-control-hover); }
  }

  &[data-appearance="filled"] { background-color: var(--button-color, var(--color-accent-blue)); }

  &[data-size="small"] {
    padding: 0.25rem 0.625rem;
    height: 2rem;

    &:deep(.icon:first-child), &:deep(img:first-child) { margin-left: calc(-0.375rem - var(--button-border)); }
    &:deep(.icon:last-child), &:deep(img:last-child) { margin-right: calc(-0.375rem - var(--button-border)); }
  }

  &[data-size="medium"] {
    padding: 0.375rem 0.75rem;
    height: 2.5rem;

    &:deep(.icon:first-child), &:deep(img:first-child) { margin-left: calc(-0.25rem - var(--button-border)); }
    &:deep(.icon:last-child), &:deep(img:last-child) { margin-right: calc(-0.25rem - var(--button-border)); }
  }

  &:deep(img) { height: 1.5rem; }
}
</style>