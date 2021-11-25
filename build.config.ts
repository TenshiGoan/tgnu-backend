import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  declaration: true,
  emitCJS: false,
  cjsBridge: true,
  entries: [
    // Entries
    "./src/module",
    "./src/compositions",
  ],
  externals: [
    // External libs
    "@nuxt/kit-edge",
    "@nuxt/schema",
    "@nuxt/types",
    "consola",
    "globby",
  ],
});
