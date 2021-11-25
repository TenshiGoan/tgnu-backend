import {
  defineNuxtModule,
  addServerMiddleware,
  addTemplate,
  addPluginTemplate,
  addPlugin,
} from "@nuxt/kit";
import Globby from "globby";
import Consola from "consola";
import Pathe from "pathe";
import { parse } from "url";

const logger = Consola.withScope("backend");

interface IBackendContext {
  dirs: {
    root: string;
    dirname: string;
    functions: string;
  };
  names: {};
  files: Array<{
    name: string;
    path: string;
  }>;
}

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
        dirname: Pathe.dirname(parse(import.meta.url).path),
        functions: Pathe.join(options.dir, "functions"),
      },
      names: {},
      files: [],
    };

    nuxt.hook("modules:done", async () => {
      await scanFunctionsDir(ctx);
    });

    nuxt.hook("builder:watch", async (event, path) => {
      const pathPattern = new RegExp(`^${options.dir}`);
      if (event !== "change" && Pathe.normalize(path).match(pathPattern)) {
        await scanFunctionsDir(ctx);
        await nuxt.callHook("builder:generateApp");
      }
    });

    /* addServerMiddleware({
      path: "/$backend",
      handler: "@tgnu/backend/dist/middleware.mjs",
    }); */

    addTemplate({
      filename: "backend.functions.ts",
      write: true,
      getContents: () => composition_text(ctx),
    });

    addPlugin({
      src: Pathe.resolve(ctx.dirs.dirname, "plugin.mjs"),
    });
  },
});

async function scanFunctionsDir(ctx: IBackendContext) {
  const pattern = "**/*.{ts,mjs,js,cjs}";
  const files = await Globby(pattern, {
    cwd: Pathe.resolve(ctx.dirs.root, ctx.dirs.functions),
  });
  ctx.files = files.map((file) => {
    const { name, dir } = Pathe.parse(file);
    return {
      name: Pathe.normalize(Pathe.join(dir, name)),
      path: Pathe.normalize(Pathe.join("..", ctx.dirs.functions, dir, name)),
    };
  });
}

function composition_text(ctx: IBackendContext) {
  const transformed_files = ctx.files
    .map((file) => {
      return `  ["${file.name}"]: typeof import('${file.path}').default;`;
    })
    .join("\n");
  return `
import { useNuxtApp } from "#app"

export interface ITest {
${transformed_files}
}

export function useBackend() {
    const {} = useNuxtApp();
    async function callBackend<T extends keyof ITest>(name:T, ...args:Parameters<ITest[T]>): Promise<void | ReturnType<ITest[T]>> {};
    return { callBackend }
}`;
}
