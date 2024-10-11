/**
 * DyeLog
 * Colorful Logger for DENO
 *
 * Copyright (c) 2020-24 Alessio Saltarin
 * MIT License
 */

import { DyeLog, LogLevel } from "./mod.ts";

const appName = "DyeLog";
const appVersion = "0.1.9";

const logger = new DyeLog({
  timestamp: true,
  printlevel: true,
  level: LogLevel.TRACE,
});
logger.info("");
logger.info(`🦕 Welcome to ${appName} v${appVersion} 🦕`);
logger.info("");
logger.trace("This is trace");
logger.info("This is info");
logger.warn("This is warn");
logger.debug("This is debug");
try {
  throw new Error("This is an exception");
} catch (e: any) {
  logger.error(e);
}
