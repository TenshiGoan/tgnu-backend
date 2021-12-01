import { defineNuxtPlugin } from "#app";
import { $fetch as Fetch } from "ohmyfetch";
import type {
  FunctionName,
  FunctionReturnType,
  FunctionParameters,
} from "./functions";

export default defineNuxtPlugin(async (nuxt) => {
  async function backend<T extends FunctionName>(
    name: T,
    ...args: FunctionParameters<T>
  ) {
    return Fetch("/$backend", {
      method: "POST",
      body: {
        name,
        args,
      },
    }).then(({ result }) => {
      return result.result as FunctionReturnType<T>;
    });
  }

  return {
    provide: { backend },
  };
});
