import pako from "pako";

export const deflateJSON = data =>
  JSON.parse(pako.inflate(atob(data), { to: "string" }));
