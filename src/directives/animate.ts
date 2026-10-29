import { reactive, watch } from "vue";
import type { CSSProperties, Directive, ObjectDirective } from "vue";
import { useSpring } from "@vueuse/motion";
import { toKebabCase } from "@/utils";

type SpringOptions = NonNullable<Parameters<typeof useSpring>[1]>;
type TransitionOptions = SpringOptions & { delay?: number };
export type TransitionConfig = SpringOptions | ({ default?: TransitionOptions } & Record<string, TransitionOptions | undefined>);

type Controller = {
  target: number;
  options?: SpringOptions;
  current: () => number;
  set: (value: number) => void;
  stop: () => void;
};

const instances = new WeakMap<Element, Map<string, Controller>>();
const transitions = new WeakMap<HTMLElement | SVGElement | MathMLElement, TransitionConfig>();

const cssProperties: (keyof CSSProperties)[] = ["opacity", "scale", "rotate"];
const cssUnitMap: Partial<Record<keyof CSSProperties, "deg">> = {
  rotate: "deg"
};

function createRenderer(el: HTMLElement | SVGElement | MathMLElement, key: string) {
  if (key === "x" || key === "y") {
    el.style.translate = "var(--v-animate-x, 0px) var(--v-animate-y, 0px)";
    return (value: number) => el.style.setProperty(`--v-animate-${key}`, `${value}px`);
  }

  if (el instanceof SVGElement && el.hasAttribute(key)) return (value: number) => el.setAttribute(key, String(value));
  if (cssProperties.includes(key as keyof CSSProperties)) return (value: number) => el.style.setProperty(toKebabCase(key), `${value}${cssUnitMap[key as keyof CSSProperties] ?? ""}`);
  return (value: number) => el.setAttribute(key, String(value));
}

function createController(el: HTMLElement | SVGElement | MathMLElement, key: string, initial: number, options?: SpringOptions): Controller {
  const values = reactive<Record<string, number>>({ [key]: initial });
  const { delay = 0, ...springOptions } = options ?? {};
  const spring = useSpring(values, springOptions);
  const render = createRenderer(el, key);
  const stopWatch = watch(() => values[key], value => render(value ?? 0), { flush: "sync" });
  let timeout: ReturnType<typeof setTimeout> | undefined;
  render(initial);

  return {
    target: initial,
    options,
    current: () => values[key]!,
    set(value) {
      clearTimeout(timeout);
      if (delay > 0) {
        spring.stop();
        timeout = setTimeout(() => {
          timeout = undefined;
          spring.set({ [key]: value });
        }, delay);
      } else spring.set({ [key]: value });
    },
    stop: () => {
      clearTimeout(timeout);
      spring.stop();
      stopWatch();
    }
  };
}

function getTransition(el: HTMLElement | SVGElement | MathMLElement, key: string): SpringOptions | undefined {
  const config = transitions.get(el);
  if (!config) return;
  const isMap = "default" in config || Object.values(config).some(value => typeof value === "object" && value !== null);
  if (!isMap) return config as SpringOptions;
  const map = config as Record<string, SpringOptions | undefined>;
  return map[key] ?? map.default;
}

function sync(el: HTMLElement | SVGElement | MathMLElement, animations: Record<string, number>) {
  let controllers = instances.get(el);

  if (!controllers) {
    controllers = new Map();
    instances.set(el, controllers);
  }

  for (const [key, target] of Object.entries(animations)) {
    const options = getTransition(el, key);
    let controller = controllers.get(key);

    if (controller && JSON.stringify(controller.options) !== JSON.stringify(options)) {
      const current = controller.current();
      controller.stop();

      controller = createController(el, key, current, options);
      controllers.set(key, controller);
    }

    if (!controller) {
      controllers.set(key, createController(el, key, target, options));
      continue;
    }

    if (controller.target !== target) {
      controller.target = target;
      controller.set(target);
    }
  }

  for (const [key, controller] of controllers) if (!(key in animations)) {
    controller.stop();
    controllers.delete(key);
  }
}

export const vAnimate: Directive<HTMLElement | SVGElement | MathMLElement, Record<string, number>> = {
  mounted: (el, binding) => sync(el, binding.value),
  updated: (el, binding) => sync(el, binding.value),
  unmounted(el) {
    instances.get(el)?.forEach(controller => controller.stop());
    instances.delete(el);
  }
};

export const vTransition: ObjectDirective<HTMLElement | SVGElement | MathMLElement, TransitionConfig> = {
  beforeMount: (el, binding) => transitions.set(el, binding.value),
  beforeUpdate: (el, binding) => transitions.set(el, binding.value),
  unmounted: (el) => transitions.delete(el)
};