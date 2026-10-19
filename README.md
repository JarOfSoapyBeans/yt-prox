# viewer-reverse-proxy
 
Reverse proxy that forwards everything to the Cloudflare Worker
`https://youtube-viewer-worker.eomcconville.workers.dev`, intended to sit in
front of `https://viewer.cat-code.org`.
 
## Run in Codespaces
 
```bash
npm install
npm start
```
 
Codespaces will pop up a forwarded port 3000. Open it (set visibility to Public
if you want to test from another device) and append `/_health` to confirm the
proxy is up. Then load `/` to see the worker's response through the proxy.
 
Override the upstream with an env var:
 
```bash
TARGET=https://youtube-viewer-worker.eomcconville.workers.dev npm start
```
 
## Deploy
 
- **Vercel (no code):** `vercel.json` rewrites every path to the worker. If you
  use this, delete `server.js`/`package.json` or Vercel may treat the project as
  a Node app and ignore the rewrite.
- **Anywhere with Node:** run `npm start` behind your host of choice.
 