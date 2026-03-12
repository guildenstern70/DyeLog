/*global Deno */
/**
 * DyeLog
 * Colorful Logger for DENO
 *
 * Copyright (c) 2020-26 Alessio Saltarin
 * MIT License
 */

import { assertEquals, assertMatch, assertStringIncludes } from "@std/assert";
import { stripAnsiCode } from "@std/fmt/colors";
import { DyeLog, LogLevel } from "../src/mod.ts";

const TIMESTAMP_PREFIX = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}/;

function captureLogs(run: () => void): string[] {
  const output: string[] = [];
  const originalLog = console.log;

  console.log = (...messages: unknown[]) => {
    output.push(
      stripAnsiCode(messages.map((message) => String(message)).join(" ")),
    );
  };

  try {
    run();
  } finally {
    console.log = originalLog;
  }

  return output;
}

Deno.test("Log level getter reflects constructor options", () => {
  const logger = new DyeLog({
    timestamp: true,
    printlevel: true,
    level: LogLevel.TRACE,
  });
  assertEquals(logger.level, LogLevel.TRACE);
});

Deno.test("isEnabled follows log level threshold semantics", () => {
  const logger = new DyeLog({
    timestamp: false,
    printlevel: false,
    level: LogLevel.INFO,
  });

  assertEquals(logger.isEnabled(LogLevel.TRACE), false);
  assertEquals(logger.isEnabled(LogLevel.DEBUG), false);
  assertEquals(logger.isEnabled(LogLevel.INFO), true);
  assertEquals(logger.isEnabled(LogLevel.WARN), true);
  assertEquals(logger.isEnabled(LogLevel.ERROR), true);
});

Deno.test("Lazy logging computes messages only when level is enabled", () => {
  const logger = new DyeLog({
    timestamp: false,
    printlevel: false,
    level: LogLevel.WARN,
  });
  let calls = 0;

  const output = captureLogs(() => {
    logger.debugLazy(() => {
      calls++;
      return "debug-lazy";
    });
    logger.errorLazy(() => {
      calls++;
      return "error-lazy";
    });
  });

  assertEquals(calls, 1);
  assertEquals(output, ["error-lazy"]);
});

Deno.test("Constructor options are snapshotted at creation time", () => {
  const options = {
    timestamp: true,
    printlevel: true,
    level: LogLevel.INFO,
  };
  const logger = new DyeLog(options);

  // Mutating the original object must not affect logger runtime behavior.
  options.timestamp = false;
  options.printlevel = false;
  options.level = LogLevel.TRACE;

  const output = captureLogs(() => {
    logger.debug("debug message");
    logger.info("info message");
  });

  assertEquals(output.length, 1);
  assertMatch(output[0], TIMESTAMP_PREFIX);
  assertStringIncludes(output[0], "INFO");
  assertStringIncludes(output[0], "info message");
});

Deno.test("Configured log level filters emitted methods", () => {
  const cases = [
    {
      level: LogLevel.TRACE,
      expected: [
        "trace message",
        "debug message",
        "info message",
        "warn message",
        "error message",
      ],
    },
    {
      level: LogLevel.DEBUG,
      expected: [
        "debug message",
        "info message",
        "warn message",
        "error message",
      ],
    },
    {
      level: LogLevel.INFO,
      expected: ["info message", "warn message", "error message"],
    },
    {
      level: LogLevel.WARN,
      expected: ["warn message", "error message"],
    },
    {
      level: LogLevel.ERROR,
      expected: ["error message"],
    },
  ];

  for (const testCase of cases) {
    const logger = new DyeLog({
      timestamp: false,
      printlevel: false,
      level: testCase.level,
    });

    const output = captureLogs(() => {
      logger.trace("trace message");
      logger.debug("debug message");
      logger.info("info message");
      logger.warn("warn message");
      logger.error("error message");
    });

    assertEquals(output, testCase.expected);
  }
});

Deno.test("Logger output changes with timestamp and printlevel options", () => {
  const cases = [
    {
      options: { timestamp: false, printlevel: false, level: LogLevel.TRACE },
      assertOutput: (line: string) => {
        assertEquals(line, "hello");
      },
    },
    {
      options: { timestamp: true, printlevel: false, level: LogLevel.TRACE },
      assertOutput: (line: string) => {
        assertMatch(line, TIMESTAMP_PREFIX);
        assertEquals(line.endsWith("> hello"), true);
        assertEquals(line.includes("INFO"), false);
      },
    },
    {
      options: { timestamp: false, printlevel: true, level: LogLevel.TRACE },
      assertOutput: (line: string) => {
        assertEquals(TIMESTAMP_PREFIX.test(line), false);
        assertStringIncludes(line, "INFO");
        assertEquals(line.endsWith("> hello"), true);
      },
    },
    {
      options: { timestamp: true, printlevel: true, level: LogLevel.TRACE },
      assertOutput: (line: string) => {
        assertMatch(line, TIMESTAMP_PREFIX);
        assertStringIncludes(line, "INFO");
        assertEquals(line.endsWith("> hello"), true);
      },
    },
  ];

  for (const testCase of cases) {
    const logger = new DyeLog(testCase.options);
    const output = captureLogs(() => logger.info("hello"));

    assertEquals(output.length, 1);
    testCase.assertOutput(output[0]);
  }
});

Deno.test("JavaScript objects can be logged directly and as formatted JSON", () => {
  const logger = new DyeLog({
    timestamp: false,
    printlevel: false,
    level: LogLevel.TRACE,
  });
  const myObject = {
    name: "Elena",
    surname: "Zambrelli",
    age: 16,
  };

  const output = captureLogs(() => {
    logger.info(myObject as unknown as string);
    logger.info(JSON.stringify(myObject, null, 2));
  });

  assertEquals(output[0], "[object Object]");
  assertStringIncludes(output[1], '"name": "Elena"');
  assertStringIncludes(output[1], '"surname": "Zambrelli"');
  assertStringIncludes(output[1], '"age": 16');
});

Deno.test("Error objects are logged with their string representation", () => {
  const logger = new DyeLog({
    timestamp: false,
    printlevel: false,
    level: LogLevel.INFO,
  });

  const output = captureLogs(() => {
    try {
      throw new Error("This is an exception");
    } catch (e: any) {
      logger.error(e);
    }
  });

  assertEquals(output, ["Error: This is an exception"]);
});
