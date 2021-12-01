import { defineNuxtPlugin } from "#app";
import { $fetch as Fetch } from "ohmyfetch";

export default defineNuxtPlugin(async (nuxt) => {
  async function backend(name: string, ...args: any[]) {
    console.log(1);
    return Fetch("/$backend", {
      method: "POST",
      body: {
        name,
        args,
      },
    });
  }

  return {
    provide: { backend },
  };
});
