import { defineNuxtModule } from "@nuxt/kit";
import Consola from "consola";
import Pathe from "pathe";
import URL from "url";
import { mkdirSync } from "fs";

import { IBackendContext } from "./context";
import { scanFunctionsDir } from "./scan";
import { useTemplate } from "./template";
import { root_dir } from "./dirs";
import { useAlias } from "./alias";

const logger = Consola.withScope("backend");

export default defineNuxtModule({
  name: "@tgnu/backend",
  configKey: "backend",
  defaults: {
    dir: "backend",
  },
  async setup(options, nuxt) {
    const { srcDir } = nuxt.options;
    const ctx: IBackendContext = {
      dirs: {
        root: srcDir,
        dirname: root_dir(),
        functions: Pathe.join(options.dir, "functions"),
        build: Pathe.resolve(nuxt.options.srcDir, ".tgnu"),
      },
      names: {
        build: ".tgnu",
      },
      files: [],
    };

    try {
      mkdirSync(ctx.dirs.build);
    } catch {}

    nuxt.options.alias["#backend/composition.ts"] =
      ctx.dirs.build + "/composition.ts";

    nuxt.hook("modules:done", async () => {
      await scanFunctionsDir(ctx);
    });

    /*
    nuxt.hook("builder:watch", async (event, path) => {
      const pathPattern = new RegExp(`^${options.dir}`);
      if (event !== "change" && Pathe.normalize(path).match(pathPattern)) {
        await scanFunctionsDir(ctx);
        await nuxt.callHook("builder:generateApp");
      }
    });
    */

    nuxt.hook("prepare:types", (types) => {
      types.tsConfig.include.push("../.tgnu/**/*");
    });

    const x = {
      [`  ["name"]: import("./endpoint"),`]() {
        return ctx.files
          .map(({ name, path }) => `  ["${name}"]: import('${path}'),`)
          .join("\n");
      },
      [`  ["name"]: Awaited<typeof import("./endpoint")>["default"];`]() {
        return ctx.files
          .map(
            ({ name, path }) =>
              `  ["${name}"]: Awaited<typeof import("${path}")>["default"];`
          )
          .join("\n");
      },
    };

    useTemplate({ ctx, name: "functions.ts" }, x);

    useTemplate({
      ctx,
      name: "plugin.client.ts",
      mode: "client",
      plugin: true,
      write: false,
    });
    useTemplate({
      ctx,
      name: "plugin.server.ts",
      mode: "server",
      plugin: true,
    });
    useTemplate({
      ctx,
      name: "endpoint.ts",
      middleware: "/$backend",
    });
    useTemplate({
      ctx,
      name: "composition.ts",
    });
  },
});
