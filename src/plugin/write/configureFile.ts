import fs from "fs";
import { ResolvedConfig } from "vite";
import { PluginConfig } from "../types";

export const writeConfigFile = (config: PluginConfig, vite: ResolvedConfig) => {
  const { configureFile, cacheDir } = config;
  if (!configureFile.startsWith(cacheDir)) {
    return false;
  }
  const code = `
import express from "express";

export const configureServerBefore = (server) => {
  console.log("configureServerBefore");
};

export const configureServerAfter = (server) => {
  console.log("configureServerAfter");
}

export const configureHandlerBefore = (handler) => {
  handler.use(express.json());
  handler.use(express.urlencoded({ extended: true }));
}; 

export const configureHandlerAfter = (server) => {
  console.log("configureHandlerAfter");
}

export const wrapRouteCallbackBefore = (callback, route) => {
  return callback;
};   

`;
  fs.writeFileSync(configureFile, code);
};
