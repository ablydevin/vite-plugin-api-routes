import fs from "fs";
import { ResolvedConfig } from "vite";
import { PluginConfig } from "../types";
import { writeConfigFile } from "./configureFile";
import { writeHandlerFile } from "./handlerFile";
import { writeRoutersFile } from "./routersFile";
import { writeServerFile } from "./serverFile";

export const generateStart = (config: PluginConfig, vite: ResolvedConfig) => {
  fs.mkdirSync(config.cacheDir, { recursive: true });
  writeConfigFile(config, vite);
  writeHandlerFile(config, vite);
  writeServerFile(config, vite);
  generateReload(config, vite);
};

export const generateReload = (config: PluginConfig, vite: ResolvedConfig) => {
  writeRoutersFile(config, vite);
};
