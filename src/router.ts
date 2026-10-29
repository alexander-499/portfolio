import { nextTick } from "vue";
import { createRouter, createWebHistory } from "vue-router";

const history = createWebHistory(import.meta.env.BASE_URL);
let finishPopTransition: (() => void) | undefined;
const originalListen = history.listen.bind(history);

history.listen = callback => originalListen((to, from, info) => {
  if (typeof document.startViewTransition !== "function") return callback(to, from, info);

  finishPopTransition?.();
  let finish!: () => void;
  const navigationFinished = new Promise<void>(resolve => finish = resolve);
  finishPopTransition = finish;

  document.startViewTransition(async () => {
    try {
      callback(to, from, info);
      await navigationFinished;
      await nextTick();
    } finally {
      if (finishPopTransition === finish) finishPopTransition = undefined;
    }
  });
});

const pages = import.meta.glob("./pages/**/*.vue");
const load = (path: string) => {
  const importer = pages[`./pages/${path}`];
  if (!importer) throw new Error(`Page not found: "./pages/${path}"`);
  return importer;
};

const router = createRouter({
  history,
  routes: [
    { path: "/", name: "home", component: load("Index.vue") },
    { path: "/blog", name: "blog", component: load("blog/Index.vue") },
    { path: "/blog/:slug", name: "blog-article", component: load("blog/Article.vue"), props: true },
    { path: "/certificates", name: "certificates", component: load("Certificates.vue") },
    { path: "/404", name: "not-found", component: load("NotFound.vue") },
    { path: "/:pathMatch(.*)*", redirect: to => ({
      name: "not-found",
      query: { ...to.query, from: to.path.replace(/^\//, "") },
      params: {}
    })}
  ]
});

function finishPendingPopTransition() {
  const finish = finishPopTransition;
  finishPopTransition = undefined;
  finish?.();
}

router.afterEach(finishPendingPopTransition);
router.onError(finishPendingPopTransition);

function withViewTransition<T>(navigate: () => Promise<T>): Promise<T> {
  if (typeof document === "undefined") return navigate();
  const doc = document;
  if (typeof doc.startViewTransition !== "function") return navigate();

  let resolveNavigation: (value: T | PromiseLike<T>) => void;
  let rejectNavigation: (reason?: unknown) => void;

  const navigation = new Promise<T>((resolve, reject) => {
    resolveNavigation = resolve;
    rejectNavigation = reject;
  });

  doc.startViewTransition(async () => {
    try {
      const result = await navigate();
      await nextTick();
      resolveNavigation(result);
    } catch (error) {
      rejectNavigation(error);
    }
  });

  return navigation;
}

const originalPush = router.push.bind(router);
const originalReplace = router.replace.bind(router);
router.push = (to: Parameters<typeof router.push>[0]) => withViewTransition(() => originalPush(to));
router.replace = (to: Parameters<typeof router.replace>[0]) => withViewTransition(() => originalReplace(to));

export default router;