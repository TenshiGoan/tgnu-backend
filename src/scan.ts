import Pathe from "pathe";
import Globby from "globby";

import { IBackendContext } from "./context";

export async function scanFunctionsDir(ctx: IBackendContext) {
  const pattern = "**/*.{ts,mjs,js,cjs}";
  const files = await Globby(pattern, {
    cwd: Pathe.resolve(ctx.dirs.root, ctx.dirs.functions),
  });
  ctx.files = files.map((file) => {
    const { name, dir } = Pathe.parse(file);
    return {
      name: Pathe.normalize(Pathe.join(dir, name)),
      path: Pathe.normalize(Pathe.join("..", ctx.dirs.functions, dir, name)),
    };
  });
}
