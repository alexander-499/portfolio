const getWords = (str: string): string[] => str.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g) ?? [];
export const capitalize = (str: string): string => str[0] ? str[0].toUpperCase() + str.slice(1) : "";
export const toStartCase = (str: string): string => getWords(str).map(word => capitalize(word.toLowerCase())).join(" ");
export const toPascalCase = (str: string): string => getWords(str).map(word => capitalize(word.toLowerCase())).join("");
export const toCamelCase = (str: string): string => getWords(str).map((word, i) => i === 0 ? word.toLowerCase() : capitalize(word.toLowerCase())).join("");
export const toKebabCase = (str: string): string => getWords(str).map(word => word.toLowerCase()).join("-");
export const toSnakeCase = (str: string): string => getWords(str).map(word => word.toLowerCase()).join("_");

export type KebabCase<S extends string> = S extends `${infer T}${infer U}` ? U extends Uncapitalize<U> ? `${Uncapitalize<T>}${KebabCase<U>}` : `${Uncapitalize<T>}-${KebabCase<U>}` : S;

export const truncate = (str: string, length: number): string => str.length <= length ? str : str.slice(0, length) + "\u{2026}";
export const segmentGraphemes = (str: string): string[] => Array.from(new Intl.Segmenter("en", { granularity: "grapheme" }).segment(str)).map(s => s.segment);

export const when = <T>(condition: any, value: T): T | undefined => condition ? value : undefined;

export function mapEntries<T, U>(obj: Record<string, T>, fn: (key: string, value: T) => [string, U], filter?: (key: string, value: T) => boolean): Record<string, U> {
  let entries = Object.entries(obj);
  if (filter) entries = entries.filter(([key, value]) => filter(key, value));
  return Object.fromEntries(entries.map(([key, value]) => fn(key, value)));
}

export function sampleOne<T extends readonly [any, ...any[]]>(arr: T, weights?: number[]): T[number];
export function sampleOne<T>(arr: T[], weights?: number[]): T | undefined;
export function sampleOne(arr: string, weights?: number[]): string | undefined;
export function sampleOne(arr: readonly unknown[] | string, weights?: number[]): unknown {
  const items = typeof arr === "string" ? segmentGraphemes(arr) : arr;
  if (!weights) weights = Array(items.length).fill(1);
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  const random = Math.random() * totalWeight;
  let cumulative = 0;
  for (let i = 0; i < items.length; i++) {
    cumulative += weights[i] ?? 0;
    if (random < cumulative) return items[i];
  }
}

export async function fetchData<T>(url: string, options?: RequestInit): Promise<T | undefined> {
  const response = await fetch(url, options);
  if (!response.ok) return;
  return await response.json() as T;
}

export const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString("en-GB", { year: "numeric", month: "short", day: "numeric" });
export const copyrightYear = Math.max(new Date().getFullYear(), 2026);

export const mod = (n: number, m: number): number => ((n % m) + m) % m;

export type Indices<T extends readonly unknown[]> = Extract<keyof T, `${number}`> extends `${infer N extends number}` ? N : never;