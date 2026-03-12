## DyeLog

[![JSR](https://jsr.io/badges/@littlelite/dyelog)](https://jsr.io/@littlelite/dyelog)\
[![deno version](https://img.shields.io/badge/deno-2.x-lightgrey?logo=deno)](https://github.com/denoland/deno)
[![continuous_integration](https://github.com/guildenstern70/dyelog/workflows/Deno/badge.svg)](https://github.com/guildenstern70/DyeLog/actions?query=workflow%3ADeno)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A simple (but colorful) logger for Deno.

#### Package URLs

JSR package: <https://jsr.io/@littlelite/dyelog>

Legacy Deno/X documentation: <https://deno.land/x/dyelog>

#### Constructor options

`DyeLog` accepts three options:

- `timestamp: boolean`
  - `true`: prepend a timestamp like `2026-03-12 11:08:17.278`
  - `false`: print only level/message information
- `printlevel: boolean`
  - `true`: prepend the level label (`TRACE`, `DEBUG`, `INFO`, `WARN`, `ERROR`)
  - `false`: omit the level label from output
- `level: LogLevel`
  - minimum level to print
  - order is `TRACE < DEBUG < INFO < WARN < ERROR`
  - example: with `LogLevel.INFO`, `trace`/`debug` are ignored, while
    `info`/`warn`/`error` are printed

Default behavior (when no options object is passed):

```ts
const logger = new DyeLog({
  timestamp: true,
  printlevel: true,
  level: LogLevel.DEBUG,
});
```

#### Usage

```ts
import { DyeLog, LogLevel } from "jsr:@littlelite/dyelog";

const logger = new DyeLog({
  timestamp: true,
  printlevel: true,
  level: LogLevel.TRACE,
});

logger.trace("This is trace");
logger.info("This is info");
logger.warn("This is warn");
logger.debug("This is debug");
logger.error("This is error");
```

#### Runtime helpers

- `logger.isEnabled(level)` lets you check whether a level is active before
  doing expensive work.
- `logger.traceLazy(() => value)` (and `debugLazy`, `infoLazy`, `warnLazy`,
  `errorLazy`) evaluate the callback only when that level is enabled.

```ts
if (logger.isEnabled(LogLevel.DEBUG)) {
  logger.debug(`Heavy payload: ${JSON.stringify(hugeObject)}`);
}

logger.debugLazy(() => `Heavy payload: ${JSON.stringify(hugeObject)}`);
```

Lazy methods are useful in hot paths because disabled levels skip callback
execution entirely.

#### Recommended usage patterns

- During development, use `level: LogLevel.TRACE` for maximum detail.
- In production-like scenarios, use `level: LogLevel.INFO` to reduce noise.
- For objects, prefer `JSON.stringify(obj, null, 2)` for readable output.
- Logging `Error` objects is supported (for example `logger.error(err)`).
- Use lazy methods (`*Lazy`) when creating log messages is computationally
  expensive.
