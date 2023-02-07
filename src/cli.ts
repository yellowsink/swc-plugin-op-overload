// @ts-expect-error
import { readFile } from "fs/promises";
import plugin from "./index.js";
import { transform } from "@swc/core";

console.log(
  (
    await transform((await readFile("/dev/stdin")).toString(), {
      plugin,
      jsc: { target: "es2022" },
    })
  ).code
);
