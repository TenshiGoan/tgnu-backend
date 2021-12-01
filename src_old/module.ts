import {
  defineNuxtModule,
  addServerMiddleware,
  addTemplate,
  addPlugin,
} from "@nuxt/kit";
import Globby from "globby";
import Consola from "consola";
import Pathe from "pathe";
import URL from "url";

const logger = Consola.withScope("backend");

interface IBackendContext {
  dirs: {
    build: string;
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
        dirname: Pathe.dirname(URL.parse(import.meta.url).path),
        functions: Pathe.join(options.dir, "functions"),
        build: Pathe.join(nuxt.options.srcDir, ".tgnu"),
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

    nuxt.options.build.transpile.push(
      Pathe.resolve(nuxt.options.buildDir, "functions.ts")
    );
    addTemplate({
      filename: Pathe.resolve(ctx.dirs.build, "functions.ts"),
      write: true,
      getContents: () => middleware_text(ctx),
    });

    addServerMiddleware({
      path: "/$backend",
      handler: Pathe.resolve(ctx.dirs.build, "functions.ts"),
    });

    addTemplate({
      filename: "backend.functions.ts",
      write: true,
      getContents: () => composition_text(ctx),
    });

    nuxt.options.build.transpile.push(
      Pathe.resolve(ctx.dirs.dirname, "plugin-client.mjs")
    );
    addPlugin({
      src: Pathe.resolve(ctx.dirs.dirname, "plugin-client.mjs"),
      mode: "client",
    });

    nuxt.options.build.transpile.push(
      Pathe.resolve(ctx.dirs.dirname, "plugin-server.mjs")
    );
    addPlugin({
      src: Pathe.resolve(ctx.dirs.dirname, "plugin-server.mjs"),
      mode: "server",
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
    const { $backend } = useNuxtApp();    
    async function callBackend<T extends keyof ITest>(name:T, ...args:Parameters<ITest[T]>): Promise<void | ReturnType<ITest[T]>> {
      return $backend(name, ...args) as (Promise<void | ReturnType<ITest[T]>>)
    };
    return { callBackend }
}`;
}

function middleware_text(ctx: IBackendContext) {
  const transformed_files = ctx.files
    .map((file) => {
      return `  ["${file.name}"]: import('${file.path}'),`;
    })
    .join("\n");
  return `
import { IncomingMessage, ServerResponse } from "http";
import { useBody, sendError } from "h3";

export const functions = {
${transformed_files}
}

interface IBody {
  name: string;
  args: any[];
}

export async function call_method(){
  return {
    asdasd: 2
  }
}

export default async function (req: IncomingMessage, res: ServerResponse) {
  const { name, args } = await useBody<IBody>(req);
  const func = await functions[name];
  let result;
  if(func){
    result = await func.default.apply({}, args);
    return {
      name,
      args,
      functions: JSON.stringify(functions),
      result,
    };
  } else {
    sendError(res, {
      name: '',
      message: '',
      statusCode: 404,
      statusMessage: 'Not found',
      data: {}
    });
  }
}

`;
}
