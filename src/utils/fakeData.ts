import { sampleOne, when } from "@/utils";

const firstNames = ["Max"];
const lastNames = ["Mustermann"];
const emailDomains = ["gmail.com", "yahoo.com"];
const locations = [["Berlin", "DE"], ["London", "GB"]];
const jobs = ["Developer", "Teacher"];

export const generateFirstName = () => sampleOne(firstNames)!;
export const generateLastName = () => sampleOne(lastNames)!;

export const generateFullName = () => {
  const firstName = generateFirstName();
  const lastName = generateLastName();
  const prefix = when(Math.random() <= 0.05, "Dr.");
  const initial = when(Math.random() <= 0.25, `${sampleOne("abcdefghijklmnopqrstuvwxyz".toUpperCase())}.`);
  return [prefix, firstName, initial, lastName].filter(Boolean).join(' ');
};

export const generateEmailDomain = additional => sampleOne([...emailDomains, ...additional]);

export const generateEmail = () => {
  const firstName = generateFirstName().toLowerCase();
  const domain = generateEmailDomain([generateLastName().toLowerCase() + ".dev"]);
  return `${firstName}@${domain}`;
};

export const generateLocation = () => sampleOne(locations);
export const generateJob = () => sampleOne(jobs);