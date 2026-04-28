#!/usr/bin/env node
// Compares the key trees of messages/fr.json and messages/en.json. Exits 1 on
// any drift so CI / pre-commit fails when a translation is added to one locale
// but not the other.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const messagesDir = resolve(here, "..", "messages");

function load(locale) {
  const path = resolve(messagesDir, `${locale}.json`);
  return JSON.parse(readFileSync(path, "utf8"));
}

function flatten(obj, prefix = "") {
  const out = new Set();
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) {
      for (const sub of flatten(v, key)) out.add(sub);
    } else {
      out.add(key);
    }
  }
  return out;
}

const fr = flatten(load("fr"));
const en = flatten(load("en"));

const onlyInFr = [...fr].filter((k) => !en.has(k)).sort();
const onlyInEn = [...en].filter((k) => !fr.has(k)).sort();

if (onlyInFr.length === 0 && onlyInEn.length === 0) {
  console.log(`✓ i18n parity OK (${fr.size} keys)`);
  process.exit(0);
}

if (onlyInFr.length) {
  console.error(`\n✗ Missing in en.json (${onlyInFr.length}):`);
  for (const k of onlyInFr) console.error(`  - ${k}`);
}
if (onlyInEn.length) {
  console.error(`\n✗ Missing in fr.json (${onlyInEn.length}):`);
  for (const k of onlyInEn) console.error(`  - ${k}`);
}
process.exit(1);
