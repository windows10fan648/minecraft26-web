import './style.css';

const canvas = document.querySelector('#game-canvas');
const context = canvas.getContext('2d');
const runtimeStatus = document.querySelector('#runtime-status');
const statusDot = document.querySelector('#status-dot');
const stageMessage = document.querySelector('#stage-message');
const buildState = document.querySelector('#build-state');
const fps = document.querySelector('#fps');

const blocks = ['grass', 'dirt', 'stone', 'planks', 'bricks', 'glass', 'sand', 'ore', 'leaves'];
const colors = { grass: '#6b9a43', dirt: '#765039', stone: '#6d7379', planks: '#aa7544', bricks: '#95574b', glass: '#75b0b5', sand: '#c6aa62', ore: '#4f7380', leaves: '#426b43' };

function setRuntime(state, message) {
  runtimeStatus.textContent = message;
  statusDot.dataset.state = state;
}

function drawVoxelScene() {
  const { width, height } = canvas;
  const sky = context.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, '#7eafc9');
  sky.addColorStop(0.58, '#c9d1bc');
  sky.addColorStop(0.581, '#4e4b3b');
  sky.addColorStop(1, '#171a18');
  context.fillStyle = sky;
  context.fillRect(0, 0, width, height);

  context.fillStyle = 'rgba(255, 241, 190, .78)';
  context.beginPath();
  context.arc(width * .78, height * .19, 40, 0, Math.PI * 2);
  context.fill();

  const horizon = height * .58;
  for (let x = -80; x < width + 100; x += 70) {
    const base = horizon + 30 + Math.sin(x * .04) * 20;
    const h = 90 + Math.abs(Math.sin(x * .013)) * 150;
    drawBlock(x, base - h, 70, h, 'stone');
    drawBlock(x, base - h - 18, 70, 18, 'grass');
  }
  for (let x = -50; x < width + 80; x += 48) {
    const base = height * .8 + Math.sin(x * .08) * 18;
    drawBlock(x, base - 120, 48, 120, x % 3 ? 'dirt' : 'stone');
    drawBlock(x, base - 136, 48, 16, 'grass');
  }
}

function drawBlock(x, y, width, height, type) {
  context.fillStyle = colors[type];
  context.fillRect(x, y, width, height);
  context.fillStyle = 'rgba(0, 0, 0, .11)';
  context.fillRect(x, y + height - 5, width, 5);
  context.strokeStyle = 'rgba(22, 29, 26, .18)';
  context.strokeRect(x + .5, y + .5, width - 1, height - 1);
}

function buildHotbar() {
  const hotbar = document.querySelector('#hotbar');
  blocks.slice(0, 9).forEach((block, index) => {
    const slot = document.createElement('div');
    slot.className = `slot${index === 0 ? ' selected' : ''}`;
    slot.title = block;
    slot.innerHTML = `<span style="background:${colors[block]}"></span><small>${index + 1}</small>`;
    hotbar.append(slot);
  });
}

async function loadTeaVM() {
  try {
    const wasmBase = `${import.meta.env.BASE_URL}wasm/`;
    await loadRuntimeScript(`${wasmBase}minecraft26.wasm-runtime.js`);
    const loader = globalThis.TeaVM?.wasmGC?.load;
    if (!loader) throw new Error('TeaVM loader API unavailable');
    const loaded = await loader(`${wasmBase}minecraft26.wasm`);
    const entryPoint = loaded?.exports?.main;
    if (typeof entryPoint !== 'function') throw new Error('TeaVM module does not export main');
    setRuntime('ready', 'TeaVM runtime ready');
    stageMessage.querySelector('span').textContent = 'Java entry point loaded — renderer adapters next';
    buildState.textContent = 'TEAVM WASM GC · READY';
    // TeaVM preserves the Java main(String[] args) signature in the Wasm
    // export, so invoke it with an empty JavaScript array when no CLI args
    // are available in the browser.
    await entryPoint([]);
  } catch (error) {
    setRuntime('waiting', 'Renderer shell');
    stageMessage.querySelector('span').textContent = 'Build the TeaVM target to activate Java code';
    buildState.textContent = 'TEAVM WASM GC · AWAITING BUILD';
    console.info('TeaVM output is not available yet:', error.message);
  }
}

function loadRuntimeScript(source) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = source;
    script.onload = resolve;
    script.onerror = () => reject(new Error('TeaVM runtime file is not available'));
    document.head.append(script);
  });
}

drawVoxelScene();
buildHotbar();
loadTeaVM();
let last = performance.now();
let frames = 0;
function tick(now) {
  frames += 1;
  if (now - last > 1000) {
    fps.textContent = `${frames} FPS`;
    frames = 0;
    last = now;
  }
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);
