package dev.minecraft26.wasm;

/**
 * Minimal TeaVM entry point. This deliberately does not load Minecraft yet:
 * the supplied 26.3 artifact is a desktop client with native LWJGL bindings.
 * Native APIs are introduced behind adapters as the port progresses.
 */
public final class WasmSmokeTest {
    private WasmSmokeTest() {
    }

    public static void main(String[] args) {
        System.out.println("Minecraft 26.3 WebAssembly bootstrap is alive");
        System.out.println("TeaVM target: WebAssembly GC");
        System.out.println("Next port boundary: window, input, audio, and GPU adapters");
    }
}
