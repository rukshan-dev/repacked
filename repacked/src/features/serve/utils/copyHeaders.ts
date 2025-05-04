import { IncomingMessage, ServerResponse } from "http";

export function copyHeaders(proxyRes: IncomingMessage, res: ServerResponse): void {
  if (proxyRes.statusCode) {
    res.statusCode = proxyRes.statusCode;
  }
  if (proxyRes.statusMessage) {
    res.statusMessage = proxyRes.statusMessage;
  }

  if (typeof res.setHeader === "function") {
    let keys = Object.keys(proxyRes.headers);
    keys = keys.filter(
      (key) => !["content-encoding", "transfer-encoding"].includes(key)
    );

    keys.forEach((key) => {
      let value = proxyRes.headers[key];
      if (value === undefined) {
        return;
      }
      if (key === "set-cookie") {
        value = Array.isArray(value) ? value : [value];
        value = value.map((x) => x.replace(/Domain=[^;]+?/i, ""));
      }

      res.setHeader(key, value);
    });
  } else {
    (res as any).headers = proxyRes.headers;
  }
}
