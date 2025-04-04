import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import legacy from '@vitejs/plugin-legacy';
import svgLoader from 'vite-svg-loader';

const svgoConfig = {
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          removeViewBox: false,
        },
      },
    },
  ],
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
    svgLoader({
      svgoConfig,
    }),
  ],
  optimizeDeps: {
    include: ['masonry-layout', 'save-svg-as-png', 'pluralize', 'd3-cloud'],
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler",
        silenceDeprecations: ['import'],
        additionalData: `@import "@politicalwatch/tipi-uikit/src/styles/main.scss";\n@import "@/styles/_variables.scss";`,
      },
    },
  },
});
