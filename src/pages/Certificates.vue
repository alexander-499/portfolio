<script setup lang="ts">
import { toKebabCase, formatDate } from "@/utils";
</script>

<template>
  <section class="certificates">
    <h1>Certificates</h1>
    <p>Look at my certificates here. I also have a few legacy certificates, mostly included in other ones, so I don’t see the need to display them. Currently I'm working on getting the JavaScript certification.</p>
    <ul>
      <li>
        <article v-for="certificate in [
          {
            title: 'Responsive Web Design',
            version: 9,
            url: 'https://www.freecodecamp.org/certification/alexander499/responsive-web-design-v9',
            completedOn: '2026-05-03',
            presentedBy: 'freeCodeCamp',
            description: /*html*/`This course teaches the fundamentals of <strong>HTML</strong> and <strong>CSS</strong>, including modern layout, design, accessibility, and responsive web development. You\'ll build practical projects and gain the skills to create professional, user-friendly webpages.`
          }
        ]" :key="certificate.title">
          <img :src="`/assets/images/certificates/${toKebabCase(certificate.title)}-v${certificate.version}.png`" :alt="`${certificate.title} v${certificate.version} Certificate`">
          <a :href="certificate.url" target="_blank">
            <h2>
              <span class="text">{{ certificate.title }}</span>
              <span class="version">v{{ certificate.version }}</span>
              <Icon name="external-link" target="a"/>
            </h2>
          </a>
          <dl>
            <dt><Icon name="calendar-days"/>Completed on</dt>
            <dd><time :datetime="certificate.completedOn">{{ formatDate(certificate.completedOn) }}</time></dd>
            <dt><Icon name="users-round"/>Presented by</dt>
            <dd><a href="https://www.freecodecamp.org">{{ certificate.presentedBy }}</a></dd>
          </dl>
          <p v-html="certificate.description"/>
        </article>
      </li>
    </ul>
  </section>
</template>

<style scoped>
section.certificates {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  ul {
    list-style: none;

    li {
      container-type: inline-size;

      article {
        display: grid;
        align-items: start;
        grid-template-columns: max-content 1fr;
        grid-template-rows: auto auto 1fr;
        grid-template-areas: "image title" "image info" "image description";
        gap: 0.5rem 1rem;
        container-type: inline-size;

        img {
          max-height: 14rem;
          width: 100%;
          object-fit: contain;
          object-position: left;
          grid-area: image;
        }

        > a {
          height: fit-content;
          grid-area: title;
          text-decoration: none;

          &:hover h2 span.text { text-decoration: underline; }

          h2 {
            color: var(--color-accent-red);

            span.version {
              color: var(--color-text-secondary);
              background-color: var(--color-bg-secondary);
              font-size: 1.5rem;
              text-decoration: none;
              vertical-align: 10%;
              border: 1px var(--color-bg-secondary2) solid;
              border-radius: var(--border-radius-round);
              padding: 0 0.5rem;
              margin: 0 0.5rem;
            }

            .lucide { color: var(--color-text-secondary); }
          }
        }

        dl {
          display: grid;
          grid-template-columns: max-content auto;
          grid-area: info;
          gap: 0.25rem 0.75rem;

          dt, dd {
            display: flex;
            align-items: center;
            gap: 0.25rem;
          }
        }

        p {
          grid-area: description;
          color: var(--color-text-secondary);
          text-wrap: pretty;
          hyphens: auto;
        }
      
        @container (width <= 840px) {
          grid-template-areas: "title title" "image info" "image description";
          row-gap: 0.5rem;
        }

        @container (520px <= width <= 640px) {
          grid-template-areas: "title title" "image info" "description description";

          dl {
            grid-template-columns: auto;
            dd { margin-bottom: 0.5rem; }
          }
        }

        @container (width <= 520px) {
          grid-template-areas: "title title" "image image" "info info" "description description";

          img { max-height: 18rem; }
        }

        @container (width <= 320px) {
          dl { grid-template-columns: auto; }
        }
      }
    }
  }
}
</style>