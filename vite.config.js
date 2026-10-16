import { defineConfig } from 'vite';
import { ViteEjsPlugin } from 'vite-plugin-ejs';

export default defineConfig(({ mode }) => ({
  // GitHub Pages serves this project below a repository path, not at /. Keep
  // generated asset URLs relative to index.html so the site works there and
  // when previewed from another base path.
  base: './',
  plugins: [
    ViteEjsPlugin({
      title: 'Minecraft 26.3 — WebAssembly',
      version: '26.3',
      mode,
      wasmPath: '/wasm/minecraft26.wasm'
    })
  ],
  server: {
    port: 5173,
    strictPort: true
  },
  build: {
    target: 'es2022'
  }
}));
