import type { Directive, DirectiveBinding } from "vue";

interface HTMLElementWithObserver extends HTMLElement {
  _noFocusObserver?: MutationObserver;
}

export const vNoFocus: Directive = {
  mounted(el: HTMLElementWithObserver, binding: DirectiveBinding) {
    if (!(binding.value ?? true)) return;

    const applyFocus = (node: Node) => {
      if (node.nodeType === Node.ELEMENT_NODE) (node as HTMLElement).setAttribute("tabindex", "-1");
    };

    applyFocus(el);

    if (binding.arg === "all") {
      el.querySelectorAll("*").forEach(applyFocus);

      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach(applyFocus);
          if (mutation.attributeName === "tabindex" && mutation.target.nodeType === Node.ELEMENT_NODE && (mutation.target as HTMLElement).getAttribute("tabindex") !== "-1")
            applyFocus(mutation.target);
        });
      });

      observer.observe(el, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["tabindex"]
      });

      el._noFocusObserver = observer;
    }
  },

  unmounted(el: HTMLElementWithObserver) {
    if (el._noFocusObserver) {
      el._noFocusObserver.disconnect();
      delete el._noFocusObserver;
    }
  }
};