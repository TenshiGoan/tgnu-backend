import { defineNuxtModule } from "@nuxt/kit-edge";
import Globby from "globby";
import Consola from "consola";
import Path from "path";

const logger = Consola.withScope("backend");

export default defineNuxtModule({
  name: "@tgnu/backend",
  configKey: "backend",
  defaults: {
    dir: "backend",
  },
  async setup(options, nuxt) {
    const func_dir = Path.resolve(
      nuxt.options.srcDir,
      options.dir,
      "functions"
    );
    const files_promise = useDir(func_dir);

    nuxt.hook("modules:done", async () => {
      const files = await files_promise;
      logger.info(files);
    });
  },
});

async function useDir(dir: string) {
  const pattern = "**/*.{ts,mjs,js,cjs}";
  const files = await Globby(pattern, { cwd: dir });
  return files;
}
