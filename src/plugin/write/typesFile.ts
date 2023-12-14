import fs from "fs";
import { ResolvedConfig } from "vite";
import { PluginConfig } from "../types";

export const writeTypesFile = (config: PluginConfig, vite: ResolvedConfig) => {
  const { moduleId } = config;
  const typesFile = "types.d.ts";
  const code = `
    import { NextFunction, Request, Response, Express } from "express";

    declare module "${moduleId}/handler" {
      export const handler: Express;
    }
    
    declare module "${moduleId}/routers" {
      export type RequestCallback = (
        req: Request,
        res: Response,
        next: NextFunction
      ) => Promise<void> | void;
    
      export type RouteInfo = {
        source: string;
        method: string;
        route: string;
        path: string;
        url: string;
      };
    
      export type RouteCallback = RouteInfo & {
        cb: RequestCallback;
      };
    
      export type ApplyRouter = (cb: RequestCallback) => void;
    
      export const routeBase: string;
    
      export const routers: RouteInfo[];
    
      export const endpoints: string[];
    
      export type ApplyOpts = {
        pre: (t: RouteCallback[]) => RouteCallback[];
        hoc: (cb: RequestCallback, it: RouteCallback) => RequestCallback;
        post: (t: RouteCallback[]) => RouteCallback[];
      };
    
      export const applyRouters: (apply: ApplyRouter, opts?: ApplyOpts) => void;
    }
    
`;
  fs.writeFileSync(typesFile, code);
};
