import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import netlify from '@astrojs/netlify/functions';
import path from 'node:path';

export default defineConfig({
  output: 'hybrid',            // ← habilita /api/* como Netlify Functions
  adapter: netlify(),          // ← usa Functions (no Edge)
  integrations: [tailwind()],
  vite: {
    resolve: {
      alias: {
        '@': path.resolve(new URL('./src', import.meta.url).pathname),
      },
    },
  },
});
