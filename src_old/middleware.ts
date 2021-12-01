// import { functions } from "#build/functions";

import { IncomingMessage, ServerResponse } from "http";
import { useBody, send } from "h3";

let functions: any = {};

interface IBody {
  name: string;
  args: any[];
}

export default async function (req: IncomingMessage, res: ServerResponse) {
  const { name, args } = await useBody<IBody>(req);
  return {
    name,
    args,
    functions: JSON.stringify(functions),
    result: await functions[name],
  };
}
