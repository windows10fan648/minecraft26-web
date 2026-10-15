import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

const jar = resolve('versions/26.3.jar');
if (!existsSync(jar)) {
  console.error(`Missing ${jar}`);
  process.exit(1);
}

const result = spawnSync('jar', ['tf', jar], { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
if (result.status !== 0) {
  console.error(result.stderr || 'jar inspection failed');
  process.exit(result.status ?? 1);
}

const entries = result.stdout.split(/\r?\n/).filter(Boolean);
const classes = entries.filter(entry => entry.endsWith('.class'));
const nativeBindings = entries.filter(entry =>
  /(^|\/)(org\/lwjgl|com\/mojang\/blaze3d\/platform|com\/mojang\/blaze3d\/opengl)/.test(entry)
);

console.log(`26.3 jar: ${entries.length} entries, ${classes.length} class files`);
console.log(`launcher: ${entries.includes('net/minecraft/client/main/Main.class') ? 'net.minecraft.client.main.Main' : 'not found'}`);
console.log(`desktop/native binding classes detected: ${nativeBindings.length}`);
console.log('status: artifact is suitable as a reference/runtime asset, not as a direct TeaVM input');
