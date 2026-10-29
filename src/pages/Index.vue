<script setup lang="ts">
import { ref } from "vue";
import { useTimeoutFn } from "@vueuse/core";
import Clock from "@/components/home/Clock.vue";
import Map from "@/components/home/Map.vue";
import FunctionSynth from "@/components/home/FunctionSynth.vue";
import Games from "@/components/home/Games.vue";
import { useHomeStore } from "@/stores/home";
import { truncate, sampleOne } from "@/utils";
import { brandLogos } from "@/utils/constants";

const homeStore = useHomeStore();

const topEmoji = sampleOne("🌆🌃");
const greeting = sampleOne(["Hello", "Yo", "Hey", "Heyy"], [7, 1, 1, 1]);
const tools = ref({ name: "vscode", hoverIndex: -6 });
const catGif = ref("https://cataas.com/cat");
const catGifTimeoutFn = useTimeoutFn(() => {
  const url = `https://cataas.com/cat${sampleOne(["/gif", ""])}?t=${Date.now()}`;
  const img = new Image();

  img.onload = () => {
    catGif.value = url;
    catGifTimeoutFn.start();
  };
  img.onerror = catGifTimeoutFn.start;
  img.src = url;
}, 2000);

void homeStore.fetchHomeData();
</script>

<template>
  <section class="hero">
    <span class="emoji">{{ topEmoji }}</span>
    <h1>
      <code>&lt;h1&gt;</code>
      <span>{{ greeting }}, I'm Alexander</span>
      <code>&lt;/h1&gt;</code>
    </h1>
    <hr>
    <p>I'm a <em>teenage</em> developer and have been coding websites, apps and programs since <time datetime="2023">2023</time>. <b>My goal</b> is to design <em>beautiful</em> and <em>aesthetically pleasing</em> user interfaces, with a focus on <em>front-end</em> development and a <em>design-driven</em> approach. I created a mobile application called <a href="https://play.google.com/store/apps/details?id=com.alexander499.zpeedometer" target="_blank">Zpeedometer</a>. ✌🏼💕</p>
    <div class="links">
      <Button href="https://github.com/alexander-499" target="_blank"><Icon name="github"/></Button>
      <Button href="https://discord.gg/XGxBGrJjkA" target="_blank"><Icon name="discord"/></Button>
      <Button href="mailto:alexander499gg@gmail.com" target="_blank"><Icon name="gmail"/></Button>
      <Button href="https://www.youtube.com/@Alexander499_" target="_blank"><Icon name="youtube"/></Button>
    </div>
    <h2>What I've worked with</h2>
    <div class="stack">
      <Button v-for="tool in [
        { name: 'HTML', url: brandLogos.html },
        { name: 'CSS', url: brandLogos.css },
        { name: 'TypeScript', url: brandLogos.typeScript },
        { name: 'Vue', url: brandLogos.vue },
        { name: 'Capacitor', url: brandLogos.capacitor },
        { name: 'Electron', url: brandLogos.electron },
        { name: 'Colyseus', url: brandLogos.colyseus },
        { name: 'SCSS', url: brandLogos.scss },
        { name: 'Scratch', url: brandLogos.scratch },
        { name: 'Hugo', url: brandLogos.hugo },
        { name: 'Tauri', url: brandLogos.tauri },
        { name: 'roblox-ts', url: brandLogos.robloxTs }
      ]" :key="tool.name" tabindex="-1"><img :src="tool.url">{{ tool.name }}</Button>
    </div>
  </section>
  <section class="highlights">
    <div class="hackatime-languages">
      <div
        v-for="language in homeStore.hackatimeLanguages"
        :key="language.name"
        :style="{ width: `${language.percentage}%`, backgroundColor: language.color ?? 'black' }"
        :title="`${language.name} - ${language.timeFormatted} - ${language.percentage}%`"
      >{{ language.percentage > 5 ? language.name : "" }}</div>
    </div>
    <div class="counter">
      <header><span><Icon name="calculator"/>Counter</span><span><Icon name="info"/><div>
        <p>Made using <a href="https://v2.jasoncameron.dev/abacus/">Abacus</a>. Idea by <a href="https://jasoncameron.dev">Jason Cameron</a>.</p>
      </div></span></header>
      <div class="main">
        <span class="button-clicks">{{ homeStore.counter ?? "Loading&hellip" }}</span>
        <Button appearance="filled" @click="homeStore.handleCounterButtonClick">Click me</Button>
        <span>Page Visits: {{ homeStore.visits ?? "Loading&hellip;" }}</span>
      </div>
    </div>
    <Clock/>
    <div class="tools">
      <header><span><Icon name="app-window-mac"/>Tools</span></header>
      <div class="main">
        <div class="dock">
          <div v-for="(tool, i) in [
            { name: 'vscode', url: brandLogos.vscode },
            { name: 'intellij-idea', url: brandLogos.intellijIdea },
            { name: 'android-studio', url: brandLogos.androidStudio },
            { name: 'github', url: brandLogos.github },
            { name: 'chrome', url: brandLogos.chrome },
            { name: 'powertoys', url: brandLogos.powertoys }
          ]" :key="tool.name" :style="{
            translate: `0 ${Math.round((-10 * 0.6 ** Math.abs(tools.hoverIndex - i) ** 2) * 100) / 100}px`,
            scale: Math.round((1 + 0.5 * 0.4 ** Math.abs(tools.hoverIndex - i)) * 100) / 100
          }" @pointerenter="tools = { name: tool.name, hoverIndex: i }" @pointerleave="tools.hoverIndex = -6">
            <img :src="tool.url" draggable="false">
          </div>
        </div>
        <p v-show="tools.name === 'vscode'">My primary IDE is <a href="https://code.visualstudio.com" target="_blank">Visual Studio Code</a>, because I like it being lightweight and so customizable.</p>
        <p v-show="tools.name === 'intellij-idea'">For Minecraft modding (<a href="https://www.java.com" target="_blank">Java</a>) I use <a href="https://www.jetbrains.com/idea" target="_blank">IntelliJ Idea</a>. You can check out my mods on <a href="https://modrinth.com/user/Alexander499/mods" target="_blank">Modrinth</a>.</p>
        <p v-show="tools.name === 'android-studio'">For building and testing Android applications I rely on <a href="https://developer.android.com/studio" target="_blank">Android Studio</a>. Check out <a href="https://zpeedometer.alexander499.de" target="_blank">Zpeedometer</a>!</p>
        <p v-show="tools.name === 'github'">I use <a href="https://github.com" target="_blank">GitHub</a> for sharing and hosting my code with <a href="https://www.netlify.com" target="_blank">Netlify</a>. <a href="https://github.com/alexander-499/portfolio" target="_blank">This portfolio</a> is also on there.</p>
        <p v-show="tools.name === 'chrome'"><a href="https://www.google.com/chrome" target="_blank">Google Chrome</a> is my primary browser, used daily for both <a href="https://developer.chrome.com" target="_blank">development</a> and general browsing.</p>
        <p v-show="tools.name === 'powertoys'">I use <a href="https://learn.microsoft.com/en-us/windows/powertoys" target="_blank">PowerToys</a> mainly for: <a href="https://learn.microsoft.com/en-us/windows/powertoys/always-on-top" target="_blank">always on top</a>, <a href="https://learn.microsoft.com/en-us/windows/powertoys/color-picker" target="_blank">color picker</a>, <a href="https://learn.microsoft.com/en-us/windows/powertoys/screen-ruler" target="_blank">screen ruler</a> and <a href="https://learn.microsoft.com/en-us/windows/powertoys/powerrename" target="_blank">PowerRename</a>.</p>
      </div>
    </div>
    <div class="zpeedometer">
      <header><span><img :src="brandLogos.zpeedometer">Zpeedometer</span></header>
      <div class="main">
        <img src="/assets/images/zpeedometer-iphone.png">
        <p>
          This is my elegant-looking GPS speedometer app showing speed, altitude, heading, distance & more. I build it using
          <strong class="tool"><img :src="brandLogos.capacitor">Capacitor</strong> and
          <strong class="tool"><img :src="brandLogos.vue">Vue</strong>.
        </p>
        <div class="links">
          <Button href="https://zpeedometer.alexander499.de" target="_blank">Website<Icon name="external-link" target=".button"/></Button>
          <Button href="https://play.google.com/store/apps/details?id=com.alexander499.zpeedometer" target="_blank"><img :src="brandLogos.googlePlay">Download</Button>
          <Button href="https://discord.gg/rJJSueZauD" target="_blank"><Icon name="discord"/>Community</Button>
        </div>
      </div>
    </div>
    <div class="repos">
      <header><span><Icon name="activity"/>Recent Repositories</span><span><Icon name="info"/><div>
        <p>Made using <a href="https://docs.github.com/rest">GitHub REST API</a>. Idea by <a href="https://jasoncameron.dev">Jason Cameron</a>.</p>
      </div></span></header>
      <div class="main">
        <div>
          <a v-for="repo in homeStore.repos" :key="repo.name" :href="repo.url" target="_blank" :title="`${repo.description} ${repo.language ? `(${repo.language})` : ''}`">
            <span class="main"><span class="name">{{ truncate(repo.name, 28) }}</span>: {{ repo.description }}</span>
            <span v-if="repo.stars > 0" class="stars">{{ repo.stars }}&starf;</span>
          </a>
        </div>
        <span><a href="https://github.com/alexander-499" target="_blank">View on GitHub</a> &centerdot; <strong>Total Coding Time*:</strong> {{ homeStore.hackatimeTotalTime }}</span>
      </div>
    </div>
    <Suspense>
      <Map/>
      <template #fallback>
        <div class="map">Loading map&hellip;</div>
      </template>
    </Suspense>
    <div class="city-country-river">
      <div class="main">
        <span class="title">City Country River</span>
        <p>
          A collection of online multiplayer party games (currently 2) to play in your browser. You can join public games or play privately with your friends.
          <abbr title="City Country River">CCR</abbr> is still in active development. It is made with
          <strong class="tool"><img :src="brandLogos.vue">Vue</strong> and
          <strong class="tool"><img :src="brandLogos.colyseus">Colyseus</strong>.
        </p>
        <span class="emoji">🏞️🏙️🏞️🏙️</span>
      </div>
    </div>
    <div class="cats">
      <header><span><Icon name="info"/><div>
        <p>Made using <a href="https://cataas.com">CATAAS</a> &ldquo;cat as a service&rdquo;.</p>
      </div></span></header>
      <img :src="catGif">
    </div>
    <FunctionSynth/>
    <Games/>
  </section>
</template>

<style scoped>
section.hero {
  max-width: 33rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  .emoji {
    font-size: 3rem;
    text-align: center;
    margin-bottom: -0.75rem;
    user-select: none;
  }

  h1 {
    text-align: center;
    user-select: none;

    code {
      color: var(--color-text-tertiary);
      font-size: 1.125rem;
    }

    span {
      text-transform: lowercase;
      margin: 0 0.375rem;
      font-feature-settings: "ss07" 1;
      cursor: none;
      transition: color 200ms, background-color 200ms;

      &:hover {
        color: var(--color-bg-primary);
        background-color: var(--color-text-primary);
      }
    }
  }

  p {
    color: var(--color-text-secondary);
    text-align: justify;

    a { color: inherit; }
  }

  .links {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    margin: -1rem 0 -2rem;
  }

  h2 {
    width: fit-content;
    color: var(--color-text-secondary);
  }

  .stack {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
}

section.highlights {
  max-width: 62rem;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  grid-template-areas:
    "hackatime          hackatime      hackatime      hackatime"
    "counter            clock          tools          tools"
    "zpeedometer        zpeedometer    repos          repos"
    "zpeedometer        zpeedometer    map            map"
    "city-country-river cats           map            map"
    "city-country-river function-synth function-synth games"
    ".                  function-synth function-synth games"
    ".                  function-synth function-synth .";
  gap: 0.75rem;

  .hackatime-languages {
    display: flex;
    grid-area: hackatime;
    border-radius: var(--border-radius-round);
    overflow: hidden;
  
    div {
      display: flex;
      justify-content: center;
      color: black;
      font-weight: 700;
      overflow: hidden;
    }
  }

  > div:has(> .main), .cats {
    width: auto;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    color: var(--color-text-secondary);
    background-color: var(--color-bg-secondary);
    font-size: 0.875rem;
    font-family: var(--font-family-monospace);
    border: 1px solid var(--color-border-subtle);
    border-radius: 8px;
    padding: 0.75rem;

    > header, &:deep(> header) {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      z-index: 1;

      .icon, img {
        height: 20px;
        width: 20px;
        color: var(--color-accent-blue);
      }

      > span {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: bold;

        &:not(:hover, :focus-within):last-child > div {
          opacity: 0;
          pointer-events: none;
        }

        &:last-child > div {
          max-width: 10.5rem;
          position: absolute;
          top: 1.75rem;
          right: 0;
          text-align: center;
          background-color: alpha(from var(--color-bg-tertiary) / 0.67);
          border: 1px solid var(--color-accent-blue);
          border-radius: 8px;
          padding: 0.75rem;
          backdrop-filter: blur(4px) brightness(0.5);
          transition: opacity 200ms;

          &::before {
            height: 1rem;
            width: 1.25rem;
            content: "";
            position: absolute;
            top: -0.5rem;
            right: 0;
            z-index: -1;
          }
        }
      }
    }

    > .main, &:deep(> .main) {
      display: flex;
      align-items: center;
      flex: 1;
      flex-direction: column;
      gap: 0.75rem;
      text-wrap: balance;

      p strong.tool {
        white-space: nowrap;
        transition: font-weight 200ms;

        &:hover { font-weight: 900; }
        &:hover img { scale: 1.1; }

        img {
          height: 1.5rem;
          width: 1.5rem;
          vertical-align: middle;
          padding: 0 0.125rem 0.25rem;
          transition: scale 200ms;
        }
      }
    }

    &.counter {
      grid-area: counter;

      header { margin-bottom: -2rem; }

      .main {
        justify-content: center;

        .button-clicks {
          color: var(--color-accent-blue);
          font-size: 2.25rem;
          font-weight: 700;
        }

        .button {
          color: #222;
          font-size: 1.125rem;
          font-weight: 700;
          font-family: var(--font-family-monospace);
          text-transform: uppercase;
          padding: 1.25rem;
        }
      }
    }

    &.clock { grid-area: clock; }

    &.tools {
      grid-area: tools;
      background-image:
        linear-gradient(to right, #ffffff0d 1px, transparent 1px),
        linear-gradient(to bottom, #ffffff0d 1px, transparent 1px),
        radial-gradient(120% 100% at 10% 0%, #1b1b22, #0f0f14);
      background-size: 24px 24px, 24px 24px, 100% 100%;
      background-position: -1px -1px, -1px -1px, center;

      .main {
        .dock {
          display: flex;
          gap: 0.75rem;
          border: 1px solid var(--color-border-subtle);
          border-radius: 36px;
          corner-shape: var(--superellipse-ios);
          padding: 0.875rem;
          box-shadow: #0003 0 4px 9px, #fff1 0 -2px 12px inset;
          backdrop-filter: blur(2px);

          div {
            display: flex;
            padding: 0.4375rem;
            background-color: #24262c;
            border: 1px solid var(--color-border-subtle);
            border-radius: 1.25rem;
            corner-shape: var(--superellipse-ios);
            cursor: pointer;
            transition: margin 200ms, translate 200ms, scale 200ms;

            &:hover { margin: 0 12px; }

            img {
              height: 2.5rem;
              width: 2.5rem;
            }
          }
        }

        p { text-align: center; }
      }
    }

    &.zpeedometer {
      grid-area: zpeedometer;

      header img {
        scale: 1.5;
        padding: 0 0.125rem;
      }

      .main {
        p { text-align: center; }

        .links {
          width: 100%;
          display: flex;
          gap: 0.5rem;

          .button { flex: 1; }
        }
      }
    }

    &.repos {
      grid-area: repos;

      .main {
        display: block;

        div {
          display: flex;
          gap: 0.25rem;
          flex-direction: column;
          margin-bottom: 0.25rem;

          a {
            display: flex;
            gap: 0.5rem;
            white-space: nowrap;

            &:not(:hover) { text-decoration: none; }

            .main {
              color: var(--color-text-tertiary);
              text-overflow: ellipsis;
              overflow: hidden;

              .name { color: var(--color-text-secondary); }
            }

            .stars { color: var(--color-accent-yellow); }
          }
        }
      }
    }

    &.map { grid-area: map; }

    &.city-country-river {
      grid-area: city-country-river;

      .main {
        .title {
          font-size: 2rem;
          font-weight: 500;
          font-family: "Climate Crisis Variable";
          text-align: center;
          letter-spacing: 0.0625rem;
          line-height: 1;
          text-shadow: 4px 4px black;
        }

        p { text-align: justify; }
        .emoji { font-size: 2.25rem; }
      }
    }

    &.cats {
      display: flex;
      grid-area: cats;
      padding: 0;
      overflow: hidden;

      header {
        justify-content: flex-end;
        margin: 0.75rem 0.75rem -3.5rem;
      }

      img {
        height: 12rem;
        width: 100%;
        object-fit: cover;
      }
    }

    &.function-synth { grid-area: function-synth; }
    &.games { grid-area: games; }
  }
}
</style>