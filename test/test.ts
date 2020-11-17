/**
 * DyeLog
 * Colorful Logger for DENO
 *
 * Copyright (c) 2020 Alessio Saltarin
 * MIT License
 */

import {
    assertEquals,
} from "https://deno.land/std@0.78.0/testing/asserts.ts";
import { DyeLog, LogLevel } from '../src/dyelog.ts';

Deno.test("Log Level", () => {
    const logger = new DyeLog({
        timestamp: true,
        level: LogLevel.TRACE
    });
    assertEquals(logger.level, LogLevel.TRACE)
});

Deno.test("Timestamp", () => {
    const logger = new DyeLog({
        timestamp: true,
        level: LogLevel.TRACE
    });
    assertEquals(logger.timestamp, true)
});
