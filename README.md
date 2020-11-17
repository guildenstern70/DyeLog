## DenoLog

A very simple (but colorful) log for Deno.

#### Deno X URL

Find me at Deno.X https://deno.land/x/dyelog

#### Example

    const logger = new Mod({
        timestamp: true,
        level: LogLevel.TRACE
    });
    logger.trace("This is trace");
    logger.info("This is info");
    logger.warn("This is warn");
    logger.debug("This is debug");
    logger.error("This is error");


