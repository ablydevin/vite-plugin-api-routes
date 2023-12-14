import fs from "fs";
import { ResolvedConfig } from "vite";
import { PluginConfig } from "../types";

export const writeServerFile = (config: PluginConfig, vite: ResolvedConfig) => {
  const { cacheDir, serverFile, moduleId } = config;
  if (!serverFile.startsWith(cacheDir)) {
    return false;
  }
  const code = `
import { handler } from "${moduleId}/handler";
import { endpoints } from "${moduleId}/routers";
import * as configure from "${moduleId}/configure";
import express from "express";

const { PORT = 3000, PUBLIC_DIR = "import.meta.env.PUBLIC_DIR" } = process.env;

const server = express();
configure.configureServerBefore?.(server);
server.use("import.meta.env.BASE", express.static(PUBLIC_DIR));
server.use("import.meta.env.BASE_API", handler);
configure.configureServerAfter?.(server);
server.on("error", (error) => {
  console.error(\`Error at http://localhost:\${PORT}\`, error);
  configure.handleServerError?.(error, server);
});
server.on("listening", () => {
  console.log(\`Ready at http://localhost:\${PORT}\`);
  configure.handleServerListening?.(server, endpoints);
});
server.listen(PORT);
`;
  fs.writeFileSync(serverFile, code);
};
