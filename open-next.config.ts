import { defineCloudflareConfig } from "@opennextjs/cloudflare";

const config = defineCloudflareConfig();

// The "build" script runs the Cloudflare build, so tell OpenNext to run plain Next.js via "build:next"
// (otherwise it would call "npm run build" and loop).
export default { ...config, buildCommand: "npm run build:next" };
