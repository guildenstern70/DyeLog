# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.3] - 2026-10-05

### Added

- **Exported `LogOptions` interface**: The `LogOptions` configuration interface
  is now exported from the module entrypoint (`./src/mod.ts`).
- **Optional constructor options & defaults**: All fields in `LogOptions`
  (`timestamp`, `printlevel`, `level`) are now optional with defaults
  (`timestamp: true`, `printlevel: true`, `level: LogLevel.DEBUG`). `DyeLog` can
  be instantiated with no arguments (`new DyeLog()`) or with partial options
  (e.g., `new DyeLog({ level: LogLevel.TRACE })`).
- **`printlevel` getter**: Added `logger.printlevel` getter to complete the
  getter set alongside `logger.timestamp` and `logger.level`.
- **`publish.include` configuration**: Whitelisted distribution files in
  `deno.json` and `jsr.json` to keep published JSR packages lean.

### Changed

- **Multi-argument formatting**: Log methods (`trace`, `debug`, `info`, `warn`,
  `error`) now format and join all provided arguments with spaces, matching
  standard logger and `console.log` behavior (previously only the first argument
  was logged).
- **Error stack traces**: Logging an `Error` object now outputs its complete
  `stack` trace (falling back to `String(err)` if `stack` is unavailable),
  preventing loss of critical diagnostic information.
- **Precomputed level tags & separator**: Log level tags (`|TRACE|`, `|DEBUG|`,
  `|INFO |`, `|WARN |`, `|ERROR|`) and the separator (`>`) are now precomputed
  at module load time, eliminating dynamic string padding and formatting
  allocations on every log call.
- **Removed `sprintf` and `unshift`**: Replaced runtime `sprintf()` formatting
  and array `unshift()` mutations with direct template string assembly for
  improved logging throughput.
- **Documentation synchronization**: Synchronized `README.md`, `src/README.md`,
  and `AGENTS.md` with the updated public API and internal architecture.
