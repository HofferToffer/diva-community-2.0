import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "sk.divacommunity.app",
  appName: "DIVA Community",
  webDir: "dist",
  server: {
    url: "https://divacommunity.sk/community",
    cleartext: true,
  },
};

export default config;
