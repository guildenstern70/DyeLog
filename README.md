## DenoLog

A very simple (but colorful) log for Deno.

#### Example

    const logger = new DyeLog({
        timestamp: true,
        level: LogLevel.TRACE
    });
    logger.trace("This is trace");
    logger.info("This is info");
    logger.warn("This is warn");
    logger.debug("This is debug");
    logger.error("This is error");


