# AGENTS.md

## Project map

- This repo is a small Deno/TypeScript logging library. The package entrypoint
  is `./src/mod.ts` in both `deno.json` and `jsr.json`.
- `src/mod.ts` contains the entire public API: `LogLevel` plus the `DyeLog`
  class.
- `src/main.ts` is a runnable demo wired to `deno task start`; it is not the
  published entrypoint.
- `test/test.ts` is the only test file and acts mostly as a smoke test for
  constructor options and common log calls.

## Architecture and behavior to preserve

- `DyeLog` precomputes a printf-style format string once in the constructor
  (`this._format`) based on `timestamp` and `printlevel`. New output features
  should fit into that model instead of rebuilding the format on every call.
- Each log method follows the same pipeline: gate by `LogLevel` -> prepend
  metadata with `_addInfo()` -> colorize a `sprintf()` result -> print with
  `console.log()`.
- The five methods (`trace`, `debug`, `info`, `warn`, `error`) are intentionally
  parallel. If you change one, inspect and update all five for consistency.
- There is a repeated `try/catch` around `sprintf()` that falls back to
  `messages[2].toString()`. This is what currently allows calls like
  `logger.error(e)` in `src/main.ts` and `test/test.ts` to work even when the
  argument is not a plain string.
- `_addInfo()` mutates the `messages` array with `unshift()`. Any refactor must
  preserve the ordering: timestamp first, then printed level, then the user
  message body.

## Workflows

- Run the demo:
  - `deno task start`
- Run tests:
  - `deno task test`
- Validate publishability for JSR before release-affecting changes:
  - `deno publish --dry-run`
- There is no dedicated lint/format task in `deno.json`; use Deno defaults
  directly if needed (`deno fmt`, `deno lint`).

## Repo-specific conventions

- Imports for std libraries come from the `imports` map in `deno.json`
  (`@std/assert`, `@std/fmt`), not from raw URLs.
- The lint config explicitly excludes `no-explicit-any`; existing code uses
  `catch (e: any)` in `src/main.ts` and `test/test.ts`. Do not “clean this up”
  unless you make the same decision across the repo.
- `LogOptions` is internal to `src/mod.ts` and is not exported. Public API
  additions should be deliberate because the package surface is currently tiny.
- User-facing docs should prefer the JSR specifier `jsr:@littlelite/dyelog`. If
  you keep Deno/X references in `README.md` or `src/README.md`, present them as
  legacy/secondary.

## Publishing and JSR compliance

- Treat JSR as the primary publishing target. `jsr.json` is the release metadata
  source of truth for package `name`, `version`, and `exports`.
- `deno.json` currently mirrors the same `name`, `version`, and `exports`; keep
  those values aligned with `jsr.json`.
- Keep `./src/mod.ts` JSR-friendly: it is the published entrypoint, so public
  exports, module docs, and import paths should work cleanly from that file
  alone.
- Prefer JSR package examples in user-facing docs and module examples. If Deno/X
  references remain in `README.md` or `src/README.md`, treat them as
  legacy/secondary and avoid letting them contradict JSR usage.
- For release-related edits, verify the package remains publishable with
  `deno publish --dry-run` and update any duplicated version strings in
  docs/demo files at the same time.

## Editing guidance

- When changing log output shape, update examples in `README.md`, the demo in
  `src/main.ts`, and any assumptions in `test/test.ts` together.
- If you change the package version, update all duplicated version strings:
  `deno.json`, `jsr.json`, and `src/main.ts` (`appVersion`).
- Keep examples aligned with the real constructor shape:
  - `new DyeLog({ timestamp: true, printlevel: true, level: LogLevel.TRACE })`
- Prefer small changes inside `src/mod.ts`; there are no service boundaries or
  multi-module abstractions elsewhere in the repo.
