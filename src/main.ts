import { createApp } from "vue";
import { createPinia } from "pinia";
import persistedState from "pinia-plugin-persistedstate";

import "@/styles/reset.css";
import "@/styles/variables.css";
import "@/styles/general.css";
import "@/styles/markdown.css";

import "@fontsource-variable/inter";
import "@fontsource-variable/climate-crisis";

import App from "@/App.vue";
import router from "@/router";

import { vAnimate, vTransition } from "@/directives/animate";

const app = createApp(App);

const pinia = createPinia();
pinia.use(persistedState);

app.use(pinia);
app.use(router);

app.directive("animate", vAnimate);
app.directive("transition", vTransition);

app.mount("#app");