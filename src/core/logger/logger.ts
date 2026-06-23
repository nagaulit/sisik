import { PinoTransport } from "@loglayer/transport-pino";
import { getSimplePrettyTerminal, moonlight } from "@loglayer/transport-simple-pretty-terminal";
import { LogLayer } from "loglayer";
import { pino } from "pino";
import { serializeError } from "serialize-error";

import { infraConfig } from "#config/infra.config.js";
import { env } from "#env";

const p = pino({
    level: env.LOG_LEVEL,
});

export const logger = new LogLayer({
    errorSerializer: serializeError,
    transport: infraConfig.isProduction
        ? new PinoTransport({
              logger: p,
          })
        : getSimplePrettyTerminal({
              runtime: "node",
              viewMode: "expanded",
              theme: moonlight,
          }),
    contextFieldName: "context",
    metadataFieldName: "metadata",
});
