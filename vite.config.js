import { defineConfig } from 'vite';
import { ViteEjsPlugin } from 'vite-plugin-ejs';

export default defineConfig(({ mode }) => ({
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
