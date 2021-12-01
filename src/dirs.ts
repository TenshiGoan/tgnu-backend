import { parse, URL } from "url";
import Pathe from "pathe";

export function root_dir() {
  const { pathname } = new URL(import.meta.url);
  return Pathe.normalize(Pathe.dirname(pathname));
}
