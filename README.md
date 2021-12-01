# tgnu-backend

```
import { defineNuxtConfig } from "nuxt3";

export default defineNuxtConfig({
  modules: ["@tgnu/backend/module"],
  hooks: {
    "autoImports:sources"(items) {
      items.push({
        from: "#build/backend.functions.ts",
        names: ["useBackend"],
      });
    }
  },
});
```
