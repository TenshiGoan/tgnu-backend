import { addPlugin, addServerMiddleware, addTemplate, useNuxt } from "@nuxt/kit-edge";
import Pathe from "pathe";
import FS from "fs";

import { IBackendContext } from "./context";

export interface IUseTemplateParameters {
  ctx: IBackendContext;
  name: string;
  mode?: "client" | "server";
  plugin?: boolean;
  middleware?: string;
  write?: boolean;
}

export function useTemplate(
  opts: IUseTemplateParameters,
  params: { [name: string]: string | (() => Promise<string> | string) } = {}
) {
  const nuxt = useNuxt();
  const { ctx } = opts;
  const { dirs, names } = ctx;

  const src_dir = Pathe.resolve(dirs.dirname, "../templates", opts.name);
  const template_text = FS.readFileSync(src_dir).toString();

  const { dst } = addTemplate({
    filename: Pathe.resolve(ctx.dirs.build, opts.name),
    write: opts.write ?? true,
    async getContents() {
      let result = template_text;
      for (const [name, func] of Object.entries(params)) {
        if (typeof func === "string") {
          result = result.replaceAll(name, func);
        } else {
          result = result.replaceAll(name, await func());
        }
      }
      return result;
    },
  });

  nuxt.options.build.transpile.push(dst);

  if (opts.plugin) {
    addPlugin({
      src: dst,
      mode: opts.mode ?? "all",
    });
  }

  if (opts.middleware) {
    addServerMiddleware({
      path: opts.middleware,
      handler: dst,
    });
  }
}
