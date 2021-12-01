import { defineNuxtPlugin } from "#app";
import { callFunction } from "./functions";
import type {
  FunctionName,
  FunctionParameters,
  FunctionReturnType,
} from "./functions";

export default defineNuxtPlugin(async (nuxt) => {
  async function backend<T extends FunctionName>(
    name: T,
    ...args: FunctionParameters<T>
  ): Promise<FunctionReturnType<T>> {
    return callFunction(name, ...args).then(({ result }) => result);
  }

  return {
    provide: { backend },
  };
});
