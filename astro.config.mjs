import react from "@astrojs/react";
import tailwind from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import { FontaineTransform } from "fontaine";

const site = process.env.VERCEL
  ? process.env.VERCEL_ENV === "production"
    ? "https://aimages.balmanrawat.com.np"
    : `https://${process.env.VERCEL_URL}`
  : (process.env.SITE ?? "https://aimages.balmanrawat.com.np");
const base = process.env.BASE || "/";

// https://astro.build/config
export default defineConfig({
  site,
  base,

  vite: {
    plugins: [
      tailwind(),
      FontaineTransform.vite({
        fallbacks: ["Arial"],
        resolvePath: (id) => new URL(`./public${id}`, import.meta.url),
      }),
    ],
  },

  integrations: [react()],
});
