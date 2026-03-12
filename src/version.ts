/**
 * DyeLog
 * Colorful Logger for DENO
 *
 * Copyright (c) 2020-26 Alessio Saltarin
 * MIT License
 */

import denoConfig from "../deno.json" with { type: "json" };

/** Shared demo/build version sourced from deno.json. */
export const appVersion = denoConfig.version;
