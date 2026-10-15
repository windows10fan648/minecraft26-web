# Minecraft 26.3 → WebAssembly

This repository currently contains the compiled `versions/26.3.jar`, not Minecraft source code. The project now provides a TeaVM WebAssembly GC bootstrap and a Node.js loader so the port can be developed incrementally.

## Prerequisites

- JDK 17+
- Maven 3.9+
- Node.js 20+

## Clone with the patched TeaVM submodule

Clone this repository recursively so the pinned Java 25/browser-compatible
TeaVM fork is checked out at `.tools/teavm-0.16.0`:

```powershell
git clone --recurse-submodules https://github.com/windows10fan648/minecraft26-web.git
cd minecraft26-web
```

If the project was cloned without submodules, initialize it with:

```powershell
git submodule update --init --recursive
```

## Run the Vite app

```powershell
npm run audit
npm install
npm run dev
```

Open `http://localhost:5173`. Vite renders the EJS-powered shell, including the voxel viewport, HUD, hotbar, and runtime state. `npm run build` creates the production bundle in `dist/`.

When Maven has produced `target/wasm-gc/minecraft26.wasm`, `npm run sync:wasm` copies the Wasm binary and TeaVM runtime into `public/wasm/`. The browser then loads the Java entry point automatically. Without that output, the app stays in shell mode so the frontend can still be developed.

## Attempt the real jar → JavaScript compilation

The `minecraft-js` Maven profile points TeaVM at the supplied client jar and its real launcher:

```powershell
mvn -Pminecraft-js package
```

The intended output is `target/minecraft-js/minecraft26.js`. This is an explicit compatibility probe, not yet a runnable browser client: the jar references external libraries and desktop-native LWJGL/GLFW/OpenAL APIs that must be replaced with browser adapters. TeaVM will report the first unresolved class or unsupported API during this profile build; those failures define the next porting slice.

The 26.3 manifest and its 53 non-native dependency jars are now wired into the profile from `versions/26.3.json` and `libraries/`. The probe reaches the client bootstrap, then reports unsupported Java 25 APIs (`ScopedValue`, `StackWalker`, newer `java.net`/`java.nio`/concurrency APIs) and native loading through LWJGL/Vulkan/JFR. The next implementation step is therefore a browser-facing entry point with those desktop bootstrap paths disabled or replaced, followed by TeaVM class-library adapters for the APIs reached by the game loop.

## Port boundary

The supplied jar cannot be passed straight into TeaVM as a working Minecraft client. The client launcher and renderer depend on desktop-native LWJGL/GLFW/OpenAL behavior, and the jar does not include the corresponding Java sources or a TeaVM-compatible adapter layer. The next implementation stages are:

1. extract/obtain the matching source and dependency metadata;
2. replace the window/input/audio/GPU surface with JavaScript imports;
3. compile a headless game loop before bringing up rendering;
4. add browser-hosted assets and filesystem shims.

`src/main/java/dev/minecraft26/wasm/WasmSmokeTest.java` is intentionally the first isolated entry point; it proves the toolchain before Minecraft classes are introduced.
