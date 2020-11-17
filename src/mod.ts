/**
 * DyeLog
 * Colorful Logger for DENO
 *
 * Copyright (c) 2020 Alessio Saltarin
 * MIT License
 */

import { cyan, gray, red, yellow, blue } from "https://deno.land/std@0.78.0/fmt/colors.ts";
import { sprintf } from "https://deno.land/std@0.78.0/fmt/printf.ts";

export enum LogLevel {
    TRACE,
    DEBUG,
    INFO,
    WARN,
    ERROR
}

interface LogOptions {
    timestamp: boolean,
    level: LogLevel,
}

export class DyeLog {

    private readonly _format: string;
    private _timestamp: boolean = true;
    private _logLevel: LogLevel;

    constructor(options: LogOptions = {timestamp: true, level: LogLevel.DEBUG}) {
        if (options.timestamp) {
            this._format = DyeLog._getDateTime() + "%s";
        } else {
            this._format = "%s";
        }
        this._logLevel = options.level;
    }

    get timestamp(): boolean {
        return this._timestamp;
    }

    set timestamp(_ts: boolean) {
        this._timestamp = _ts;
    }

    get level(): LogLevel {
        return this._logLevel;
    }

    set level(_l: LogLevel) {
        this._logLevel = _l;
    }

    trace(...messages: unknown[]) {
        if (this._logLevel <= LogLevel.TRACE) {
            console.log(gray(sprintf(this._format, ...messages)));
        }
    }

    debug(...messages: unknown[]) {
        if (this._logLevel <= LogLevel.DEBUG) {
            console.log(blue(sprintf(this._format, ...messages)));
        }
    }

    info(...messages: unknown[]) {
        if (this._logLevel <= LogLevel.INFO) {
            console.log(cyan(sprintf(this._format, ...messages)));
        }
    }

    warn(...messages: unknown[]) {
        if (this._logLevel <= LogLevel.WARN) {
            console.log(yellow(sprintf(this._format, ...messages)));
        }
    }

    error(...messages: unknown[]) {
        if (this._logLevel <= LogLevel.ERROR) {
            console.log(red(sprintf(this._format, ...messages)));
        }
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
        const dtString = (year + "-" + month + "-" + date + " " + hours + ":" + minutes
            + ":" + seconds + "." + msecs + "> ");
        return gray(dtString);
    }

}
