#!/usr/bin/env node
// Regenerates design-system/project/tokens.json from src/index.css and tailwind.config.ts.
// Hand-written parts (README, component docs and previews) live beside it in design-system/project.
//   node scripts/build-design-system.mjs          write tokens.json
//   node scripts/build-design-system.mjs --check  exit 1 if tokens.json is out of date
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "design-system/project/tokens.json");
const css = readFileSync(join(root, "src/index.css"), "utf8");

// Reads `--name: value;` declarations from the indented rule that starts with `header`.
const block = (header) => {
  const start = css.indexOf(`  ${header} {`);
  const end = start < 0 ? -1 : css.indexOf("\n  }", start);
  if (end < 0) throw new Error(`index.css: block ${header} not found`);
  const decls = css.slice(start, end).split(";");
  return Object.fromEntries(
    decls.flatMap((d) => {
      const i = d.indexOf("--");
      const colon = d.indexOf(":", i);
      return i < 0 || colon < 0 ? [] : [[d.slice(i + 2, colon).trim(), d.slice(colon + 1).trim()]];
    }),
  );
};
const light = block(":root");
const dark = block(".dark");

// "12 76% 61%" -> "hsl(12, 76%, 61%)"
const hsl = (v) => `hsl(${v.trim().split(" ").filter(Boolean).join(", ")})`;
// "hsl(20, 20%, 15%, 0.08)" -> "hsla(...)"
const shadow = (v) => v.replace(/hsl\(([^)]+)\)/g, (m, args) => (args.split(",").length === 4 ? `hsla(${args})` : m));

const usage = {
  background: "Page background. Warm cream in light, deep warm brown in dark.",
  foreground: "Default text on background and card.",
  card: "Card and popover surface, one step off the page background.",
  "card-foreground": "Text on card.",
  popover: "Popover, dropdown and dialog surface.",
  "popover-foreground": "Text on popover.",
  primary: "Brand coral. Default button, links, focus ring, key accents.",
  "primary-foreground": "Text on primary. Light theme is about 2.9:1 (below 4.5:1, kept from source); use at 16px+ semibold only.",
  secondary: "Warm amber. Secondary buttons, badges and the gradient end stop.",
  "secondary-foreground": "Text on secondary.",
  muted: "Quiet fills: ghost-button hover, skeletons, subtle panels.",
  "muted-foreground": "Secondary text and placeholders on background or card.",
  accent: "Teal. Terminal prompt glyph and sparing highlights; the cool counterpoint to coral.",
  "accent-foreground": "Text on accent. Light theme is about 3.6:1: large text only (kept from source).",
  destructive: "Errors and destructive actions.",
  "destructive-foreground": "Text on destructive.",
  border: "Hairlines, card borders, dividers.",
  input: "Form control borders.",
  ring: "Focus ring (2px, 2px offset).",
};
const colorNames = Object.keys(usage);
for (const n of colorNames) if (!(n in light)) throw new Error(`index.css is missing --${n}`);

const shadowUsage = {
  soft: "Resting buttons and light lift.",
  card: "Cards and panels.",
  hover: "Hover lift: coral-tinted glow.",
};
const px = (v) => (v.endsWith("rem") ? Number.parseFloat(v) * 16 : Number.parseFloat(v));
const base = px(light.radius);

const tw = readFileSync(join(root, "tailwind.config.ts"), "utf8");
const font = (key) => {
  const start = tw.indexOf(`${key}: [`);
  const end = start < 0 ? -1 : tw.indexOf("]", start);
  if (end < 0) throw new Error(`tailwind.config.ts: font ${key} not found`);
  return tw
    .slice(start + key.length + 3, end)
    .split(",")
    .map((x) => x.trim().replace(/^"|"$/g, ""))
    .map((x) => (x.includes(" ") ? `"${x}"` : x))
    .join(", ");
};


const tokens = {
  name: "Portfolio",
  version: 1,
  color: {
    themes: [{ id: "light", name: "Light" }, { id: "dark", name: "Dark" }],
    tokens: colorNames.map((n) => ({
      name: n,
      value: { light: hsl(light[n]), dark: hsl(dark[n] ?? light[n]) },
      usage: usage[n],
    })),
  },
  type: {
    fonts: [],
    families: { sans: font("sans"), display: font("display") },
    groups: [
      { name: "Display", family: "display", styles: [
        { name: "card-title", fontSize: "24px", lineHeight: "24px", fontWeight: 600, letterSpacing: "-0.025em", usage: "Card titles and headings (Poppins, tight tracking)." }] },
      { name: "Text", family: "sans", styles: [
        { name: "body", fontSize: "16px", lineHeight: "24px", fontWeight: 400, usage: "Default body and input text on mobile." },
        { name: "body-sm", fontSize: "14px", lineHeight: "20px", fontWeight: 400, usage: "Descriptions, desktop input text." },
        { name: "button", fontSize: "14px", lineHeight: "20px", fontWeight: 500, usage: "Button labels." },
        { name: "caption", fontSize: "12px", lineHeight: "16px", fontWeight: 600, usage: "Badges, small buttons." }] },
    ],
  },
  spacing: { tokens: [
    ["1", 4, "Icon-to-label nudges."], ["2", 8, "Tight gaps; button icon gap."], ["3", 12, "Input horizontal padding."],
    ["4", 16, "Default stack gap."], ["6", 24, "Card padding, page gutter (container padding 1.5rem)."],
    ["8", 32, "Large button horizontal padding."], ["12", 48, "Section gaps."], ["16", 64, "Section padding."],
  ].map(([k, v, u]) => ({ name: `space-${k}`, value: `${v}px`, usage: u })) },
  // Mirrors tailwind.config.ts borderRadius: sm/md/lg/xl/2xl derive from --radius.
  radius: { tokens: [
    ["radius-sm", base - 4, "Small chips."], ["radius-md", base - 2, "Inputs, small buttons."],
    ["radius-lg", base, "Buttons, cards (base --radius)."], ["radius-xl", base + 4, "Large buttons."],
    ["radius-2xl", base + 8, "Feature panels."],
  ].map(([name, v, u]) => ({ name, value: `${v}px`, usage: u })).concat([{ name: "radius-full", value: "9999px", usage: "Badges and pills." }]) },
  shadow: { tokens: Object.keys(shadowUsage).map((k) => ({
    name: `shadow-${k}`,
    value: { light: shadow(light[`shadow-${k}`]), dark: shadow(dark[`shadow-${k}`] ?? light[`shadow-${k}`]) },
    usage: shadowUsage[k],
  })) },
  meta: { source: "github", package: "src/index.css, tailwind.config.ts" },
};

const next = JSON.stringify(tokens, null, 1) + "\n";
if (process.argv.includes("--check")) {
  const cur = existsSync(out) ? readFileSync(out, "utf8") : "";
  if (cur !== next) {
    console.error("design-system/project/tokens.json is out of date. Run: npm run design-system");
    process.exit(1);
  }
  console.log("design-system tokens are up to date");
} else {
  writeFileSync(out, next);
  console.log(`wrote ${out}`);
}
