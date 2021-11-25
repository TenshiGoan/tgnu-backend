export interface IFunctions {}

export function useBackend2<FunctionName extends keyof IFunctions>(
  name: FunctionName,
  ...args: Parameters<IFunctions[FunctionName]>
): ReturnType<IFunctions[FunctionName]> {
  return null as ReturnType<IFunctions[FunctionName]>;
}



export function useBackend() {
  function func(name: string, ...args: any[]) {}

  return { func };
}
