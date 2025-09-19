import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import netlify from '@astrojs/netlify/functions';
import path from 'node:path';

export default defineConfig({
  output: 'hybrid',
  adapter: netlify(),
  integrations: [tailwind()],
  vite: {
    resolve: {
      alias: {
        '@': path.resolve(new URL('./src', import.meta.url).pathname),
      },
    },
  },
});
