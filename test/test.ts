/*global Deno */
/**
 * DyeLog
 * Colorful Logger for DENO
 *
 * Copyright (c) 2020-23 Alessio Saltarin
 * MIT License
 */

import { assertEquals } from "@std/assert";
import { DyeLog, LogLevel } from "../src/mod.ts";

Deno.test("Log Level", () => {
  const logger = new DyeLog({
    timestamp: true,
    printlevel: true,
    level: LogLevel.TRACE,
  });
  assertEquals(logger.level, LogLevel.TRACE);
});

Deno.test("Timestamp", () => {
  const logger = new DyeLog({
    timestamp: true,
    printlevel: true,
    level: LogLevel.TRACE,
  });
  assertEquals(logger.timestamp, true);
});

Deno.test("Multiline", () => {
  const logger = new DyeLog({
    timestamp: true,
    printlevel: true,
    level: LogLevel.TRACE,
  });
  const myObject = {
    name: "Elena",
    surname: "Zambrelli",
    age: 16,
  };
  logger.info(JSON.stringify(myObject, null, 2));
});

Deno.test("Error", () => {
  const logger = new DyeLog({
    timestamp: true,
    printlevel: true,
    level: LogLevel.INFO,
  });
  try {
    throw new Error("This is an exception");
  } catch (e: any) {
    logger.error(e);
  }
});
