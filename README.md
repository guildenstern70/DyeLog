## DyeLog

[![deno land](http://img.shields.io/badge/available%20on-deno.land/x-lightgrey.svg?logo=deno&labelColor=darkgreen)](https://deno.land/x/dyelog)  
[![deno version](https://img.shields.io/badge/deno-^1.3.2-lightgrey?logo=deno)](https://github.com/denoland/deno) 
[![continuous_integration](https://github.com/guildenstern70/dyelog/workflows/Deno/badge.svg)](https://github.com/guildenstern70/DyeLog/actions?query=workflow%3ADeno)

A very simple (but colorful) logger for Deno.

#### DyeLog X URL

Find me at Deno.X 
<https://deno.land/x/dyelog>

#### Usage

    import { DyeLog, LogLevel } from "https://deno.land/x/dyelog@v0.1.2/mod.ts";

    const logger = new DyeLog({
        timestamp: true,
        printlevel: true,
        level: LogLevel.TRACE
    });
    
    logger.trace("This is trace");
    logger.info("This is info");
    logger.warn("This is warn");
    logger.debug("This is debug");
    logger.error("This is error");


