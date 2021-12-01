import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  inlineDependencies: false,
  pkg: false,
  declaration: true,
  emitCJS: true,
  cjsBridge: true,
  entries: ["./src/module", "./src/index"],
  externals: [
    // External libs
    "@nuxt/kit-edge",
    "@nuxt/schema",
    "@nuxt/types",
    "ohmyfetch",
    "consola",
    "globby",
    "pathe",
    "#app",
    "h3",
  ],
});
