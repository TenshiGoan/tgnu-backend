import { useNuxt } from "@nuxt/kit-edge";
import { relative } from "pathe";

export function useAlias(name: string, path: string) {
  const nuxt = useNuxt();
  const res = "./" + relative(nuxt.options.rootDir, path);

  // nuxt.options.alias[name + "/*"] = path + "/*";
  nuxt.options.alias[name + "/*"] = res + "/*";

  /* nuxt.hook("prepare:types", (types) => {
    types.tsConfig.compilerOptions.paths[name] = [

    ];
  }); */

  nuxt.hook("nitro:context", (context: any) => {
    context.alias[name] = path;
  });
}
