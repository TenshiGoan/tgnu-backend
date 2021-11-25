import { defineNuxtPlugin } from "#app";

export default defineNuxtPlugin(async (nuxt) => {
  return {
    provide: {
      testing(): number | string {
        console.log(2);
        return 1;
      },
    },
  };
});
