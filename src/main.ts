/**
 * DyeLog
 * Colorful Logger for DENO
 *
 * Copyright (c) 2020 Alessio Saltarin
 * MIT License
 */

import { DyeLog, LogLevel } from "https://deno.land/x/dyelog@v0.1.1/mod.ts";

const appName = "DenoLog";
const appVersion = "0.1.1";

const logger = new DyeLog({
    timestamp: true,
    level: LogLevel.TRACE
});
logger.info("");
logger.info(`🦕 Welcome to ${appName} v${appVersion} 🦕`);
logger.trace("This is trace");
logger.info("This is info");
logger.warn("This is warn");
logger.debug("This is debug");
logger.error("This is error");
