<script setup lang="ts">
import { useRoute } from "vue-router";
import { useSettingsStore } from "@/stores/settings";
import { useUiStore } from "@/stores/ui";
import { capitalize } from "@/utils";

const route = useRoute();
const uiStore = useUiStore();

const settingsStore = useSettingsStore();
</script>

<template>
  <header>
    <div v-show="uiStore.isSuperheader" class="superheader">
      <p>Zpeedometer &ndash; the app that shows speed, altitude, compass, speed warning and a lot more &ndash; has released! <a href="https://play.google.com/store/apps/details?id=com.alexander499.zpeedometer" target="_blank">Check it out!</a></p>
      <Button appearance="text" size="small" title="Hide" @click="uiStore.isSuperheader = false"><Icon name="x"/></Button>
      <div class="zigzag"/>
    </div>
    <div class="main">
      <div>
        <div class="left">
          <div class="logo">
            <span><span>❤️‍🔥</span></span>
            <RouterLink :to="{ name: 'home' }">Alexander</RouterLink>
          </div>
          <nav :class="{ 'is-mobile-menu': uiStore.isMobileMenu }">
            <RouterLink
              v-for="page in ['blog', 'certificates']"
              :key="page"
              :class="{ active: route.path.startsWith(`/${page}`) }"
              :to="{ name: page }"
            >{{ capitalize(page) }}</RouterLink>
          </nav>
        </div>
        <div>
          <!-- <Button appearance="text" @click="settingsStore.soundEnabled = !settingsStore.soundEnabled"><Icon name="sound" target=".button"/></Button> -->
          <Button appearance="text" @click="settingsStore.colorScheme = settingsStore.colorScheme === 'dark' ? 'light' : 'dark'"><Icon name="color-scheme" target=".button"/></Button>
          <Button class="mobile-menu-button" appearance="text" @click="uiStore.isMobileMenu = !uiStore.isMobileMenu"><Icon name="mobile-menu" target=".button"/></Button>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
:global(::view-transition-group(header)) { z-index: var(--z-index-top); }

header {
  position: sticky;
  top: 0;
  background-color: alpha(from var(--color-bg-primary) / 0.5);
  border-bottom: 1px solid var(--color-border-subtle);
  backdrop-filter: blur(4px);
  view-transition-name: header;
  z-index: var(--z-index-top);

  .superheader {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    color: black;
    background-color: var(--color-accent-yellow);
    font-weight: 700;
    padding: 0.25rem 2.5rem 0.25rem 0.5rem;

    p {
      text-wrap: balance;
      text-align: center;
    }

    a { color: inherit; }

    .button {
      position: absolute;
      right: 0;
      color: inherit;
    }

    .zigzag {
      height: 1rem;
      width: 100%;
      position: absolute;
      inset: auto 0 -0.75rem;
      background-image: url("/assets/images/superheader-zigzag.svg");
    }
  }

  .main {
    height: 4rem;

    > div {
      height: 100%;
      max-width: 60rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 0.5rem;
      margin: 0 auto;

      > div {
        display: flex;
        align-items: center;

        &.left {
          gap: 1.5rem;

          a { text-decoration: none; }
          a:not(.router-link-active, .active) { color: var(--color-text-primary) }

          .logo {
            display: flex;
            align-items: center;
            font-size: 2rem;

            span {
              display: block;
              user-select: none;

              &:hover span { scale: -1 1; }
              span { transition: scale 500ms; }
            }

            a {
              font-family: var(--font-family-display);
              margin-bottom: -0.25rem;
            }
          }

          nav {
            display: flex;
            gap: 1rem;

            @media (width <= 45rem) {
              height: 100vh;
              position: absolute;
              inset: 100% 0 auto 100%;
              flex-direction: column;
              background-color: var(--color-bg-secondary);
              padding: 1.5rem 0;
              overflow: hidden;
              transition: left 200ms;
              z-index: 10000;

              a {
                font-size: 1.25rem;
                padding: 0 1.5rem;
              }
            }

            &.is-mobile-menu { left: 0; }

            a {
              font-weight: 700;
              text-transform: uppercase;
            }
          }
        }

        @media (width > 45rem) {
          .mobile-menu-button { display: none; }
        }
      }
    }
  }
}
</style>