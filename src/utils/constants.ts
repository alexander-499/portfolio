import type { useSpring } from "@vueuse/motion";

export const motionTransitions = {
  spring: { type: "spring", stiffness: 500 },
  springy: { type: "spring", damping: 10, stiffness: 100 },
  springy2: { type: "spring", damping: 7.5, stiffness: 250 },
  springy3: { type: "spring", damping: 5, stiffness: 500 },
  springy4: { type: "spring", damping: 7.5, stiffness: 150 }
} satisfies Record<string, NonNullable<Parameters<typeof useSpring>[1]>>;

export const brandLogos = {
  html: "https://upload.wikimedia.org/wikipedia/commons/3/38/HTML5_Badge.svg",
  css: "https://upload.wikimedia.org/wikipedia/commons/6/62/CSS3_logo.svg",
  typeScript: "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/1280px-Typescript_logo_2020.svg.png",
  vue: "https://upload.wikimedia.org/wikipedia/commons/9/95/Vue.js_Logo_2.svg",
  capacitor: "https://www.svgrepo.com/show/353536/capacitorjs-icon.svg",
  electron: "https://upload.wikimedia.org/wikipedia/commons/9/91/Electron_Software_Framework_Logo.svg",
  colyseus: "https://colyseus.io/images/logos/emblem-color.png",
  scss: "https://upload.wikimedia.org/wikipedia/commons/9/96/Sass_Logo_Color.svg",
  scratch: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Scratch_S.svg",
  hugo: "https://gohugo.io/favicon-32x32.png",
  tauri: "https://iili.io/fMmTiTN.png",
  robloxTs: "https://roblox-ts.com/img/roblox-ts.svg",
  vscode: "https://upload.wikimedia.org/wikipedia/commons/9/9a/Visual_Studio_Code_1.35_icon.svg",
  intellijIdea: "https://upload.wikimedia.org/wikipedia/commons/9/9c/IntelliJ_IDEA_Icon.svg",
  androidStudio: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Android_Studio_icon_%282023%29.svg",
  github: "https://github.githubassets.com/favicons/favicon-dark.svg",
  chrome: "https://upload.wikimedia.org/wikipedia/commons/e/e1/Google_Chrome_icon_%28February_2022%29.svg",
  powertoys: "https://upload.wikimedia.org/wikipedia/commons/2/2b/2020_PowerToys_Icon.svg",
  zpeedometer: "https://zpeedometer.alexander499.de/assets/images/favicon.svg",
  googlePlay: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_Play_2022_icon.svg"
};