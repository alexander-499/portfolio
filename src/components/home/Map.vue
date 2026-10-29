<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { geoNaturalEarth1, geoPath, geoBounds, geoCentroid } from "d3-geo";
import { feature, mesh, neighbors } from "topojson-client";
import type { FeatureCollection } from "geojson";
import { interpolateHsl } from "d3-interpolate";
import worldUrl from "virtual:world-atlas";
import { fetchData } from "@/utils";

const height = 296;
const width = 444;
const padding = 16;
const homeCountryCode = "276";
const homeCountryColor = "#e74c3c";
const visitorCountryColor = "#2ecc71";

const visitorCountry = ref({
  code: null as string | null,
  name: null as string | null,
  isLoading: true,
  error: false
});

const world = await fetch(worldUrl).then(response => {
  if (!response.ok) throw new Error("Failed to load world atlas");
  return response.json() as Promise<Parameters<typeof feature>[0]>;
});

const topology = world;
const countries = feature(topology, "countries") as unknown as FeatureCollection;
type CountryFeature = (typeof countries.features)[number];
const countryById = new Map<string, CountryFeature>();
for (const country of countries.features) if (country.id != null) countryById.set(String(country.id), country);
const geometries = (world.objects.countries as { geometries: Parameters<typeof neighbors>[0] }).geometries;
const countryIds = geometries.map(g => g.id == null ? null : String(g.id));
const neighborIndices = neighbors(geometries);
const countryGraph = new Map<string, string[]>();

countryIds.forEach((id, index) => {
  if (id === null) return;
  const neighborIds = (neighborIndices[index] ?? [])
    .map(neighborIndex => countryIds[neighborIndex])
    .filter((neighborId): neighborId is string => neighborId != null);
  countryGraph.set(id, neighborIds);
});

function findShortestCountryPath(startId: string, endId: string): string[] | null {
  if (!countryGraph.has(startId) || !countryGraph.has(endId)) return null;
  const queue = [startId];
  const previous = new Map<string, string | null>([[startId, null]]);

  for (let index = 0; index < queue.length; index++) {
    const current = queue[index]!;
    if (current === endId) break;

    for (const neighbor of countryGraph.get(current) ?? []) {
      if (previous.has(neighbor)) continue;
      previous.set(neighbor, current);
      queue.push(neighbor);
    }
  }

  if (!previous.has(endId)) return null;
  const path: string[] = [];
  let current: string | null | undefined = endId;

  while (current != null) {
    path.push(current);
    current = previous.get(current);
  }

  return path.reverse();
}

const countryPath = computed(() => !visitorCountry.value.code || visitorCountry.value.isLoading || visitorCountry.value.error ? null : findShortestCountryPath(homeCountryCode, visitorCountry.value.code));
const countryPathNames = computed(() => countryPath.value ? countryPath.value.map(code => code === visitorCountry.value.code && visitorCountry.value.name ? visitorCountry.value.name : String(countryById.get(code)?.properties?.name ?? code)) : null);

function getFitFeature(country: CountryFeature) {
  const [[west], [east]] = geoBounds(country);
  const longitudeSpan = east >= west ? east - west : 360 - west + east;
  return longitudeSpan <= 100 ? country : {
    type: "Feature" as const,
    properties: country.properties,
    geometry: {
      type: "Point" as const,
      coordinates: geoCentroid(country)
    }
  };
}

const projection = computed(() => {
  const mapProjection = geoNaturalEarth1();
  const focusCountries = (visitorCountry.value.code ? countryPath.value ?? [homeCountryCode, visitorCountry.value.code] : [])
    .map(id => countryById.get(id))
    .filter((country): country is CountryFeature => country !== undefined);

  const featuresToFit = focusCountries.length ? {
    type: "FeatureCollection" as const,
    features: focusCountries.map(getFitFeature)
  } : countries;

  mapProjection.fitExtent([[padding, padding], [width - padding, height - padding]], featuresToFit);
  mapProjection.clipExtent([[0, 0], [width, height]]);
  return mapProjection;
});

const pathGenerator = computed(() => geoPath(projection.value));

const countryPaths = computed(() => countries.features.map(country => ({
  id: String(country.id ?? country.properties?.name ?? "unknown"),
  name: String(country.properties?.name ?? "Unknown"),
  path: pathGenerator.value(country) ?? ""
})));

const countryBorders = mesh(topology, topology.objects.countries as any, (a, b) => a !== b);

const interpolateRouteColor = interpolateHsl(homeCountryColor, visitorCountryColor);
const countryColorById = computed(() => {
  const colors = new Map<string, string>([[homeCountryCode, homeCountryColor]]);
  const visitorCode = visitorCountry.value.code;
  if (visitorCode && visitorCode !== homeCountryCode) colors.set(visitorCode, visitorCountryColor);
  if (countryPath.value && countryPath.value.length > 2) countryPath.value.slice(1, -1).forEach((code, index) => {
    const progress = (index + 1) / ((countryPath.value?.length || 0) - 1);
    colors.set(code, interpolateRouteColor(progress));
  });

  return colors;
});

interface CountriesDevIpResponse {
  country: {
    name: string;
    numericCode: string;
  };
}

onMounted(async () => {
  try {
    const data = await fetchData<CountriesDevIpResponse>("https://countries.dev/ip");
    if (!data) throw new Error("Country lookup failed");
    if (!/^\d{1,3}$/.test(data.country.numericCode)) throw new Error("Invalid country numeric code");
    visitorCountry.value.code = data.country.numericCode.padStart(3, "0");
    visitorCountry.value.name = data.country.name;
  } catch (err) {
    console.error("Failed to detect visitor's country:", err);
    visitorCountry.value.error = true;
  } finally {
    visitorCountry.value.isLoading = false;
  }
});
</script>

<template>
  <div class="map">
    <header><span><Icon name="map"/>Map</span><span><Icon name="info"/><div>
      <p>Made using <a href="https://countries.dev">countries.dev</a>, <a href="https://d3js.org/d3-geo">d3-geo</a>, <a href="https://github.com/topojson">TopoJSON</a> and <a href="https://cublya.github.io/world-atlas">World Atlas</a>.</p>
    </div></span></header>
    <div class="main">
      <svg class="world-map" :viewBox="`0 0 ${width} ${height}`">
        <rect class="ocean"/>
        <path v-for="country in countryPaths" :key="country.id" class="country" :style="{ fill: countryColorById.get(country.id) }" :d="country.path"/>
        <path class="country-borders" :d="pathGenerator(countryBorders) ?? ''"/>
      </svg>
      <p aria-live="polite" aria-atomic="true">
        <template v-if="visitorCountry.isLoading">Finding your location&hellip;</template>
        <template v-else-if="visitorCountry.error">Couldn't find your country.</template>
        <template v-else-if="!countryPath || !countryPathNames">There's no land border route between Germany and {{ visitorCountry.name }}.</template>
        <template v-else-if="countryPath.length === 1">We're in the same country: {{ countryPathNames[0] }}!</template>
        <template v-else-if="countryPath.length === 2">We share a single land border: {{ countryPathNames[0] }} and {{ countryPathNames[1] }}!</template>
        <template v-else>We're {{ countryPath.length - 2 }} {{ countryPath.length - 2 === 1 ? "country" : "countries" }} apart: {{ countryPathNames.join(" to ") }}!</template>
      </p>
    </div>
  </div>

</template>

<style scoped>
.map .main {
  .world-map {
    width: 100%;
    border: 1px solid var(--color-border-subtle);
    border-radius: 8px;

    .ocean {
      height: 100%;
      width: 100%;
      fill: var(--color-bg-secondary);
    }

    .country { fill: var(--color-bg-primary); }

    .country-borders {
      stroke: var(--color-bg-tertiary);
      fill: none;
    }
  }

  p { text-align: center; }
}
</style>