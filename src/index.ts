export function useAutoImports(items: any[]) {
  items.push({
    from: ".tgnu/composition.ts",
    names: ["useBackendState"],
  });
}

export function getBackendHooks() {
  return {
    "autoImports:sources": (items: any) => useAutoImports(items),
  };
}
