import type { AuthConfig } from "convex/server";

export default {
  providers: [
    {
      domain: "somethjing",
      applicationID: "convex",
    },
  ],
} satisfies AuthConfig;