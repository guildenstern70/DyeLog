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
 */
export class DyeLog {
  private readonly _format: string;
  private readonly _options: LogOptions;

  constructor(options: LogOptions = {
    timestamp: true,
    printlevel: true,
    level: LogLevel.DEBUG,
  }) {
    // Keep an internal snapshot so external mutation of the input object
    // cannot alter logger behavior after construction.
    this._options = { ...options };
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
    return this._options.timestamp;
  }

  get level(): LogLevel {
    return this._options.level;
  }

  isEnabled(level: LogLevel): boolean {
    return this._options.level <= level;
  }

  trace(...messages: unknown[]) {
    this._log(LogLevel.TRACE, "trace", gray, messages);
  }

  traceLazy(messageFactory: () => unknown) {
    this._logLazy(LogLevel.TRACE, "trace", gray, messageFactory);
  }

  debug(...messages: unknown[]) {
    this._log(LogLevel.DEBUG, "debug", blue, messages);
  }

  debugLazy(messageFactory: () => unknown) {
    this._logLazy(LogLevel.DEBUG, "debug", blue, messageFactory);
  }

  info(...messages: unknown[]) {
    this._log(LogLevel.INFO, "info", cyan, messages);
  }

  infoLazy(messageFactory: () => unknown) {
    this._logLazy(LogLevel.INFO, "info", cyan, messageFactory);
  }

  warn(...messages: unknown[]) {
    this._log(LogLevel.WARN, "warn", yellow, messages);
  }

  warnLazy(messageFactory: () => unknown) {
    this._logLazy(LogLevel.WARN, "warn", yellow, messageFactory);
  }

  error(...messages: unknown[]) {
    this._log(LogLevel.ERROR, "error", red, messages);
  }

  errorLazy(messageFactory: () => unknown) {
    this._logLazy(LogLevel.ERROR, "error", red, messageFactory);
  }

  private _log(
    level: LogLevel,
    levelLabel: string,
    colorize: (message: string) => string,
    messages: unknown[],
  ) {
    if (this.isEnabled(level)) {
      const normalizedMessages = this._normalizeMessages(messages, levelLabel);
      console.log(colorize(sprintf(this._format, ...normalizedMessages)));
    }
  }

  private _logLazy(
    level: LogLevel,
    levelLabel: string,
    colorize: (message: string) => string,
    messageFactory: () => unknown,
  ) {
    if (this.isEnabled(level)) {
      this._log(level, levelLabel, colorize, [messageFactory()]);
    }
  }

  private _normalizeMessages(messages: unknown[], level: string): string[] {
    const normalizedMessages = [DyeLog._safeString(messages[0])];
    this._addInfo(normalizedMessages, level);
    return normalizedMessages;
  }

  private static _safeString(value: unknown): string {
    return String(value ?? "");
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
