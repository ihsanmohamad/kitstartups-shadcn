import { eventTrigger } from "@trigger.dev/sdk";
import { client } from "$lib/trigger/client";

// your first job
client.defineJob({
  id: "example-job",
  name: "Example Job",
  version: "0.0.1",
  enabled: false,
  trigger: eventTrigger({
    name: "example.event",
  }),
  run: async (payload, io, ctx) => {
    await io.logger.info("Hello world!", { payload });

    return {
      message: "Hello world!",
    };
  },
});