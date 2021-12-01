import { IncomingMessage, ServerResponse } from "http";
import { useBody, send } from "h3";

import type { FunctionName } from "./functions";
import { callFunction } from "./functions";

interface IBody {
  name: FunctionName;
  args: any[];
}

export default async function (req: IncomingMessage, res: ServerResponse) {
  const { name, args } = await useBody<IBody>(req);
  try {
    return callFunction(name, ...(args as any));
  } catch {
    return {
      ok: "Error",
    };
  }
}

/*

function middleware_text(ctx: IBackendContext) {
  const transformed_files = ctx.files
    .map((file) => {
      return `  ["${file.name}"]: import('${file.path}'),`;
    })
    .join("\n");
  return `
import { IncomingMessage, ServerResponse } from "http";
import { useBody, sendError } from "h3";

export const functions = {
${transformed_files}
}

interface IBody {
  name: string;
  args: any[];
}

export async function call_method(){
  return {
    asdasd: 2
  }
}

export default async function (req: IncomingMessage, res: ServerResponse) {
  const { name, args } = await useBody<IBody>(req);
  const func = await functions[name];
  let result;
  if(func){
    result = await func.default.apply({}, args);
    return {
      name,
      args,
      functions: JSON.stringify(functions),
      result,
    };
  } else {
    sendError(res, {
      name: '',
      message: '',
      statusCode: 404,
      statusMessage: 'Not found',
      data: {}
    });
  }
}

`;
}
*/
