import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const wasm = resolve(here, '../target/wasm-gc/minecraft26.wasm');
const runtime = resolve(here, '../target/wasm-gc/minecraft26.wasm-runtime.js');

if (!existsSync(wasm) || !existsSync(runtime)) {
  console.error('Wasm output is missing. Run Maven first: mvn package');
  process.exit(1);
}

await import(runtime);
const { load } = globalThis.TeaVM.wasmGC;
const module = await load(wasm, { nodejs: true });
console.log('TeaVM WebAssembly GC module loaded');
if (typeof module.main === 'function') {
  await module.main([]);
}
