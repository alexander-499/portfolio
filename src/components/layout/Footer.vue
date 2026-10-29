<script setup lang="ts">
import { useSettingsStore } from "@/stores/settings";
import { copyrightYear } from "@/utils";

const settingsStore = useSettingsStore();
</script>

<template>
  <footer>
    <div>
      <div class="top">
        <div class="main">
          <RouterLink :to="{ name: 'home' }">Alexander</RouterLink>
          <span><a href="https://ko-fi.com/alexander499" target="_blank"><strong>Support me!</strong></a> &lt;3</span>
        </div>
        <div class="links">
          <ul>
            <li><strong>This Page</strong></li>
            <li><RouterLink :to="{ name: 'blog' }">Blog</RouterLink></li>
            <li><RouterLink :to="{ name: 'certificates' }">Certificates</RouterLink></li>
            <li><Icon name="github"/><a href="https://github.com/alexander-499/portfolio" target="_blank">GitHub</a></li>
          </ul>
          <ul>
            <li><strong>Socials</strong></li>
            <li><Icon name="github"/><a href="https://github.com/alexander-499" target="_blank">GitHub</a></li>
            <li><Icon name="youtube"/><a href="https://www.youtube.com/@alexander499_" target="_blank">YouTube</a></li>
            <li><Icon name="tiktok"/><a href="https://www.tiktok.com/@wav.alexander" target="_blank">TikTok</a></li>
            <li><Icon name="instagram"/><a href="https://www.instagram.com/wav.alexander" target="_blank">Instagram</a></li>
          </ul>
        </div>
      </div>
      <div class="bottom">
        <div>
          <p>&copy; 2023-{{ copyrightYear }} Alexander. All Rights Reserved.</p>
          <p>Site made using <a href="https://vuejs.org">Vue</a> and a few APIs running on TBA.</p>
        </div>
        <div class="buttons">
          <!-- <Button appearance="text" @click="settingsStore.soundEnabled = !settingsStore.soundEnabled"><Icon name="sound" target=".button"/></Button> -->
          <Button appearance="text" @click="settingsStore.colorScheme = settingsStore.colorScheme === 'dark' ? 'light' : 'dark'"><Icon name="color-scheme" target=".button"/></Button>
          <Button href="/rss.xml" target="_blank" appearance="text"><Icon name="rss" target=".button"/></Button>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
footer {
  margin: 0 1rem;

  > div {
    max-width: 45rem;
    display: flex;
    gap: 0.5rem;
    flex-direction: column;
    background-color: var(--color-bg-secondary);
    border: 1px var(--color-border-subtle);
    border-style: solid solid none;
    border-radius: 12px 12px 0 0;
    padding: 0.75rem;
    margin: 0 auto;

    > div {
      display: flex;
      gap: 0.5rem;
      justify-content: space-between;

      a { color: inherit; }

      &.top {
        flex: 1;
  
        .main {
          display: flex;
          flex-direction: column;
    
          > a {
            font-size: 2.5rem;
            font-family: var(--font-family-display);
            text-decoration: none;
          }
        }
    
        .links {
          display: flex;
          gap: 1rem;

          ul {
            min-width: 6.5rem;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 0.5rem;
            list-style: none;

            li {
              display: flex;
              align-items: center;
              gap: 0.25rem;

              &:not(:has(strong)) { color: var(--color-text-secondary); }

              .icon {
                height: 1rem;
                width: 1rem;
              }

              a { transition: font-weight 200ms; }
              a:not(:hover) { text-decoration: none; }
              a:hover { font-weight: 700; }
            }
          }
        }
      }
  
      &.bottom .buttons { display: flex; }
    }
  }
}
</style>