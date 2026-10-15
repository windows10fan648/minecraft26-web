# Local TeaVM compatibility fork

The project uses a locally published TeaVM build when `teavm.version` is
`0.16.0-SNAPSHOT`. The source checkout is kept under `.tools/teavm-0.16.0`.

Build and publish the fork with:

```powershell
.tools\teavm-0.16.0\gradlew.bat -p .tools\teavm-0.16.0 publishToMavenLocal
```

The first compatibility patch is intentionally conservative:

- `System.exit(int)` is a browser no-op because a web module cannot terminate
  its hosting page;
- `Runtime.version().feature()` reports 25 for the Minecraft 26.3 runtime.
- browser-safe shims for `Thread.threadId`, `Thread.dumpStack`, shutdown hooks,
  package specification versions, modules, `HexFormat`, `StackWalker`, and the
  synchronous `ScopedValue.where(...).run(...)` path.

The Minecraft probe now uses the patched compiler and gets past the previous
`System.exit` failures. The remaining errors require actual APIs, especially
`CompletableFuture`, executor/concurrency types, NIO channels, and
native-library loading. Those should be implemented in small tested slices
rather than as empty stubs. These new patches have not been compiled in this
workspace yet; run the TeaVM Gradle build first, then rerun the Minecraft
profile and use the resulting errors to implement the next slice.
