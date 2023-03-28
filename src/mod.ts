/**
 * DyeLog
 * Colorful Logger for DENO
 *
 * Copyright (c) 2020-23 Alessio Saltarin
 * MIT License
 */

import { blue, cyan, gray, red, sprintf, yellow } from "./deps.ts";

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
      } catch (err) {
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
      } catch (err) {
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
      } catch (err) {
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
      } catch (err) {
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
      } catch (err) {
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
    const hours = dateOb.getHours();
    const minutes = dateOb.getMinutes();
    const seconds = dateOb.getSeconds();
    const msecs = ("00" + dateOb.getMilliseconds()).slice(-3);
    const dtString = year + "-" + month + "-" + date + " " + hours + ":" +
      minutes +
      ":" + seconds + "." + msecs;
    return gray(dtString);
  }
}
