export const modules = {
  ["name"]: import("./endpoint"),
};

export interface IModules {
  ["name"]: Awaited<typeof import("./endpoint")>["default"];
}

type Modules = typeof modules;
type Awaited<T> = T extends PromiseLike<infer U> ? U : T;

export type FunctionName = keyof Modules;
export type FunctionType<T extends FunctionName> = IModules[T];
export type FunctionParameters<T extends FunctionName> = Parameters<
  FunctionType<T>
>;
export type FunctionReturnType<T extends FunctionName> = Awaited<
  ReturnType<FunctionType<T>>
>;

export async function getFunction<T extends FunctionName>(
  name: T
): Promise<FunctionType<T>> {
  const function_module = await modules[name];
  const func = function_module.default;
  return func as FunctionType<T>;
}

export async function callFunction<T extends FunctionName>(name: T, ...args) {
  const func = await getFunction(name);
  try {
    let result: FunctionReturnType<T> = await func.apply(null, args);
    return { result };
  } catch (error) {
    return error;
  }
}
