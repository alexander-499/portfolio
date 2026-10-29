import { ref } from "vue";
import { invoke } from "@vueuse/core";
import { defineStore } from "pinia";
import { fetchData, mapEntries } from "@/utils";

const languageNameMap: Record<string, string> = {
  "Vue.js": "Vue"
};

interface HackatimeData {
  data: {
    human_readable_total: string;
    languages: {
      name: string;
      total_seconds: number;
      text: string;
      percent: number;
    }[];
  };
}

interface AbacusData {
  value: number;
}

interface GithubRepoData {
  name: string;
  html_url: string;
  description: string;
  updated_at: string;
  stargazers_count: number;
  language: string | null;
};

interface HackatimeLanguage {
  name: string;
  time: number;
  timeFormatted: string;
  percentage: number;
  color: string | null;
}

interface GithubRepo {
  name: string;
  description: string;
  url: string;
  language: string | null;
  stars: number;
}

let counterInterval: ReturnType<typeof setInterval> | null = null;

export const useHomeStore = defineStore("home", () => {
  const hackatimeTotalTime = ref("");
  const hackatimeLanguages = ref<HackatimeLanguage[]>([]);
  const visits = ref<number | null>(null);
  const counter = ref<number | null>(null);
  let internalCounter = 0;
  const repos = ref<GithubRepo[]>([]);

  async function fetchHomeData() {
    const hackatimeData = (await fetchData<HackatimeData>("https://hackatime.hackclub.com/api/v1/users/Alexander499/stats"))?.data;
    const githubColors = mapEntries(
      (await fetchData<Record<string, { color: string; url: string; }>>("https://raw.githubusercontent.com/ozh/github-colors/refs/heads/master/colors.json"))!,
      ((key, value) => [key.toLowerCase(), value.color.toLowerCase()]),
      ((key, value) => typeof value.color === "string")
    );

    if (hackatimeData) hackatimeTotalTime.value = hackatimeData.human_readable_total;
    if (hackatimeData) hackatimeLanguages.value = hackatimeData.languages.map(language => ({
      name: languageNameMap[language.name] || language.name,
      time: language.total_seconds * 1000,
      timeFormatted: language.text,
      percentage: language.percent,
      color: githubColors[(languageNameMap[language.name] || language.name).toLowerCase()] || null
    })).filter(l => l.time > 300000 && l.percentage >= 0.1);


    visits.value = (await fetchData<AbacusData>(`https://abacus.jasoncameron.dev/hit/alexander499.de/visits`))?.value || null;
    const initialCounterData = await fetchData<AbacusData>(`https://abacus.jasoncameron.dev/get/alexander499.de/counter`);
    counter.value = initialCounterData?.value || null;

    if (!counterInterval) {
      counterInterval = setInterval(() => void invoke(async () => {
        if (internalCounter === 0) return;
        const countToSend = internalCounter;
        internalCounter = 0;

        try {
          const data = await fetchData<AbacusData>("/api/counter", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ value: countToSend })
          });
          if (data) counter.value = data.value;
        } catch (error) {
          internalCounter += countToSend;
          console.error("Failed to sync click batch to Abacus:", error);
        }
      }), 3000);
    }

    const githubRepos = await fetchData<GithubRepoData[]>("https://api.github.com/users/alexander-499/repos");
    if (githubRepos) repos.value = githubRepos.map(r => ({ ...r, updated_at_ts: Date.parse(r.updated_at) })).sort((a, b) => b.updated_at_ts - a.updated_at_ts).slice(0, 5).map(r => ({
      name: r.name,
      description: r.description,
      url: r.html_url,
      language: r.language,
      stars: r.stargazers_count
    }));
  };

  function handleCounterButtonClick() {
    if (counter.value !== null) counter.value++;
    internalCounter++;
  }

  return { hackatimeTotalTime, hackatimeLanguages, visits, counter, repos, fetchHomeData, handleCounterButtonClick };
}, {
  persist: {
    pick: ["hackatimeTotalTime", "hackatimeLanguages", "visits", "counter", "repos"]
  }
});