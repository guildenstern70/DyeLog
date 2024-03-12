/**
 * DyeLog
 * Colorful Logger for DENO
 *
 * Copyright (c) 2020-23 Alessio Saltarin
 * MIT License
 */

/**
 * @module
 * DyeLog is simple - but colorful - logger for Deno.
 *
 * ```ts
 * import { DyeLog, LogLevel } from "@littlelite/dyelog";
 *
 *
 * const logger = new DyeLog({
 *   timestamp: true,
 *   printlevel: true,
 *   level: LogLevel.TRACE,
 * });
 *
 * logger.trace("This is trace");
 * logger.info("This is info");
 * logger.warn("This is warn");
 * logger.debug("This is debug");
 * ```
 */

import {
  blue,
  cyan,
  gray,
  red,
  yellow,
} from "@std/fmt/colors";
import { sprintf } from "@std/fmt/printf";


/** LogLevel indicates the level of the log (trace, debug, info, warning and error). */
export enum LogLevel {
  TRACE,
  DEBUG,
  INFO,
  WARN,
  ERROR,
}

interface LogOptions {
  timestamp: boolean;
  printlevel: boolean;
  level: LogLevel;
}

/**
 * DyeLog class for logging purposes. Must be initialized in this way:
 *
 * ```ts
 * const logger = new DyeLog({
 *   timestamp: true, // if you need a time stamp in the logger
 *   printlevel: true, // if you the log level (TRACE, DEBUG, INFO, WARN, ERROR) in the logger
 *   level: LogLevel.TRACE, // the level of the log
 * });
 * ```
 *
 * */
export class DyeLog {
  private readonly _format: string;
  private _timestamp = true;
  private _options: LogOptions;

  constructor(options: LogOptions = {
    timestamp: true,
    printlevel: true,
    level: LogLevel.DEBUG,
  }) {
    this._options = options;
    this._format = "";
    let printSeparator = false;

    if (options.printlevel) {
      this._format = "%s" + this._format;
      printSeparator = true;
    }

    if (options.timestamp) {
      this._format = "%s" + this._format;
      printSeparator = true;
    }

    if (printSeparator) {
      this._format = this._format + gray("> ") + "%s";
    } else {
      this._format = "%s";
    }
  }

  get timestamp(): boolean {
    return this._timestamp;
  }

  set timestamp(_ts: boolean) {
    this._timestamp = _ts;
  }

  get level(): LogLevel {
    return this._options.level;
  }

  set level(_l: LogLevel) {
    this._options.level = _l;
  }

  trace(...messages: string[]) {
    if (this._options.level <= LogLevel.TRACE) {
      this._addInfo(messages, "trace");
      try {
        console.log(gray(sprintf(this._format, ...messages)));
      } catch (_err) {
        console.log(
          gray(
            sprintf(
              this._format,
              messages[0],
              messages[1],
              messages[2].toString(),
            ),
          ),
        );
      }
    }
  }

  debug(...messages: string[]) {
    if (this._options.level <= LogLevel.DEBUG) {
      this._addInfo(messages, "debug");
      try {
        console.log(blue(sprintf(this._format, ...messages)));
      } catch (_err) {
        console.log(
          blue(
            sprintf(
              this._format,
              messages[0],
              messages[1],
              messages[2].toString(),
            ),
          ),
        );
      }
    }
  }

  info(...messages: string[]) {
    if (this._options.level <= LogLevel.INFO) {
      this._addInfo(messages, "info");
      try {
        console.log(cyan(sprintf(this._format, ...messages)));
      } catch (_err) {
        console.log(
          cyan(
            sprintf(
              this._format,
              messages[0],
              messages[1],
              messages[2].toString(),
            ),
          ),
        );
      }
    }
  }

  warn(...messages: string[]) {
    if (this._options.level <= LogLevel.WARN) {
      this._addInfo(messages, "warn");
      try {
        console.log(yellow(sprintf(this._format, ...messages)));
      } catch (_err) {
        console.log(
          yellow(
            sprintf(
              this._format,
              messages[0],
              messages[1],
              messages[2].toString(),
            ),
          ),
        );
      }
    }
  }

  error(...messages: string[]) {
    if (this._options.level <= LogLevel.ERROR) {
      this._addInfo(messages, "error");
      try {
        console.log(red(sprintf(this._format, ...messages)));
      } catch (_err) {
        console.log(
          red(
            sprintf(
              this._format,
              messages[0],
              messages[1],
              messages[2].toString(),
            ),
          ),
        );
      }
    }
  }

  private _addInfo(messages: string[], level: string) {
    if (this._options.printlevel) {
      messages.unshift(DyeLog._getPrintLevel(level.toUpperCase()));
    }
    if (this._options.timestamp) {
      messages.unshift(DyeLog._getDateTime());
    }
  }

  private static _getPrintLevel(loglevel: string): string {
    return gray("|" + loglevel.padEnd(5, " ") + "|");
  }

  private static _getDateTime(): string {
    const dateOb = new Date();
    const date = ("0" + dateOb.getDate()).slice(-2);
    const month = ("0" + (dateOb.getMonth() + 1)).slice(-2);
    const year = dateOb.getFullYear();
    const hours = ("0" + dateOb.getHours()).slice(-2);
    const minutes = ("0" + dateOb.getMinutes()).slice(-2);
    const seconds = ("0" + dateOb.getSeconds()).slice(-2);
    const msecs = ("00" + dateOb.getMilliseconds()).slice(-3);
    const dtString = year + "-" + month + "-" + date + " " + hours + ":" +
      minutes +
      ":" + seconds + "." + msecs;
    return gray(dtString);
  }
}
