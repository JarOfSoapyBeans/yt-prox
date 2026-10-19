// Reverse proxy: viewer.cat-code.org  ->  Cloudflare Worker
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const TARGET = process.env.TARGET || "https://youtube-viewer-worker.eomcconville.workers.dev";
const PORT = process.env.PORT || 3000;

const app = express();

// Simple health check (answered by the proxy itself, not forwarded)
app.get("/_health", (req, res) => res.json({ ok: true, target: TARGET }));

app.use(
  "/",
  createProxyMiddleware({
    target: TARGET,
    changeOrigin: true, // sends Host: youtube-viewer-worker... so Cloudflare routes it correctly
    ws: true,           // pass WebSockets/streams through
    xfwd: true,         // adds X-Forwarded-For/Host/Proto headers
    followRedirects: false,
    // Rewrite redirects from the worker so the browser stays on your domain
    autoRewrite: true,
    protocolRewrite: "https",
    on: {
      proxyReq: (proxyReq, req) => {
        proxyReq.setHeader("X-Original-Host", req.headers.host || "");
      },
      error: (err, req, res) => {
        console.error("Proxy error:", err.message);
        if (res.writeHead && !res.headersSent) {
          res.writeHead(502, { "Content-Type": "text/plain" });
        }
        if (res.end) res.end("Bad gateway: could not reach the worker.");
      },
    },
  })
);

app.listen(PORT, () => {
  console.log(`Reverse proxy listening on :${PORT} -> ${TARGET}`);
});