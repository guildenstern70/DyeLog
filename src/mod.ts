/**
 * DyeLog
 * Colorful Logger for DENO
 *
 * Copyright (c) 2020-26 Alessio Saltarin
 * MIT License
 */

/**
 * @module
 * DyeLog is a simple - but colorful - logger for Deno.
 *
 * @example
 * ```ts
 * import { DyeLog, LogLevel } from "jsr:@littlelite/dyelog";
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

import { blue, cyan, gray, red, yellow } from "@std/fmt/colors";

/** LogLevel indicates the level of the log (trace, debug, info, warning and error). */
export enum LogLevel {
  TRACE,
  DEBUG,
  INFO,
  WARN,
  ERROR,
}

/** Options for configuring a {@linkcode DyeLog} instance. */
export interface LogOptions {
  /** Whether to prepend timestamps to log messages. Defaults to `true`. */
  timestamp?: boolean;
  /** Whether to prepend the log level label to log messages. Defaults to `true`. */
  printlevel?: boolean;
  /** The minimum log level to output. Defaults to {@linkcode LogLevel.DEBUG}. */
  level?: LogLevel;
}

const DEFAULT_OPTIONS: Required<LogOptions> = {
  timestamp: true,
  printlevel: true,
  level: LogLevel.DEBUG,
};

const LEVEL_TAGS: Record<LogLevel, string> = {
  [LogLevel.TRACE]: gray("|TRACE|"),
  [LogLevel.DEBUG]: gray("|DEBUG|"),
  [LogLevel.INFO]: gray("|INFO |"),
  [LogLevel.WARN]: gray("|WARN |"),
  [LogLevel.ERROR]: gray("|ERROR|"),
};

const SEPARATOR = gray("> ");

/**
 * DyeLog class for logging purposes. Must be initialized in this way:
 *
 * ```ts
 * const logger = new DyeLog({
 *   timestamp: true, // if you need a time stamp in the logger
 *   printlevel: true, // if you need the log level (TRACE, DEBUG, INFO, WARN, ERROR) in the logger
 *   level: LogLevel.TRACE, // the level of the log
 * });
 * ```
 */
export class DyeLog {
  private readonly _hasPrefix: boolean;
  private readonly _options: Required<LogOptions>;

  constructor(options: LogOptions = {}) {
    // Keep an internal snapshot so external mutation of the input object
    // cannot alter logger behavior after construction.
    this._options = { ...DEFAULT_OPTIONS, ...options };
    this._hasPrefix = this._options.timestamp || this._options.printlevel;
  }

  get timestamp(): boolean {
    return this._options.timestamp;
  }

  get printlevel(): boolean {
    return this._options.printlevel;
  }

  get level(): LogLevel {
    return this._options.level;
  }

  isEnabled(level: LogLevel): boolean {
    return this._options.level <= level;
  }

  trace(...messages: unknown[]) {
    this._log(LogLevel.TRACE, gray, messages);
  }

  traceLazy(messageFactory: () => unknown) {
    this._logLazy(LogLevel.TRACE, gray, messageFactory);
  }

  debug(...messages: unknown[]) {
    this._log(LogLevel.DEBUG, blue, messages);
  }

  debugLazy(messageFactory: () => unknown) {
    this._logLazy(LogLevel.DEBUG, blue, messageFactory);
  }

  info(...messages: unknown[]) {
    this._log(LogLevel.INFO, cyan, messages);
  }

  infoLazy(messageFactory: () => unknown) {
    this._logLazy(LogLevel.INFO, cyan, messageFactory);
  }

  warn(...messages: unknown[]) {
    this._log(LogLevel.WARN, yellow, messages);
  }

  warnLazy(messageFactory: () => unknown) {
    this._logLazy(LogLevel.WARN, yellow, messageFactory);
  }

  error(...messages: unknown[]) {
    this._log(LogLevel.ERROR, red, messages);
  }

  errorLazy(messageFactory: () => unknown) {
    this._logLazy(LogLevel.ERROR, red, messageFactory);
  }

  private _log(
    level: LogLevel,
    colorize: (message: string) => string,
    messages: unknown[],
  ) {
    if (this.isEnabled(level)) {
      console.log(colorize(this._formatLine(level, messages)));
    }
  }

  private _logLazy(
    level: LogLevel,
    colorize: (message: string) => string,
    messageFactory: () => unknown,
  ) {
    if (this.isEnabled(level)) {
      this._log(level, colorize, [messageFactory()]);
    }
  }

  private _formatLine(level: LogLevel, messages: unknown[]): string {
    let prefix = "";
    if (this._options.timestamp) {
      prefix += DyeLog._getDateTime();
    }
    if (this._options.printlevel) {
      prefix += LEVEL_TAGS[level];
    }
    if (this._hasPrefix) {
      prefix += SEPARATOR;
    }
    const messageBody = messages.length === 0
      ? ""
      : messages.map((message) => DyeLog._safeString(message)).join(" ");
    return `${prefix}${messageBody}`;
  }

  private static _safeString(value: unknown): string {
    if (value instanceof Error) {
      return value.stack ?? String(value);
    }
    return String(value ?? "");
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
