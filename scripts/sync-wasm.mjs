import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const source = resolve('target/wasm-gc');
const destination = resolve('public/wasm');
mkdirSync(destination, { recursive: true });

const wasmSource = resolve(source, 'minecraft26.wasm');
if (existsSync(wasmSource)) {
  copyFileSync(wasmSource, resolve(destination, 'minecraft26.wasm'));
}

const runtimeSource = ['minecraft26.wasm-runtime.js', 'classes.wasm-runtime.js']
  .map(name => resolve(source, name))
  .find(existsSync);
if (runtimeSource) {
  copyFileSync(runtimeSource, resolve(destination, 'minecraft26.wasm-runtime.js'));
}

console.log(existsSync(resolve(destination, 'minecraft26.wasm'))
  ? 'TeaVM Wasm copied to public/wasm'
  : 'TeaVM Wasm not found; Vite app will run in shell mode');
