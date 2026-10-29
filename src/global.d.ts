import type { Directive, ObjectDirective } from "vue";
import type { TransitionConfig } from "@/directives/animate";

declare module "vue" {
  interface GlobalDirectives {
    vAnimate: Directive<HTMLElement | SVGElement | MathMLElement, Record<string, number>>
    vTransition: ObjectDirective<HTMLElement | SVGElement | MathMLElement, TransitionConfig>
  }
}

export {};