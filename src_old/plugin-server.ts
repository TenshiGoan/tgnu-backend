import { defineNuxtPlugin } from "#app";

export default defineNuxtPlugin(async (nuxt) => {
  async function backend(name: string, ...args: any[]) {
    console.log(2);
    return name;
  }

  return {
    provide: { backend },
  };
});
