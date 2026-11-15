// Custom Next.js server for cPanel / Phusion Passenger (Setup Node.js App).
// Passenger runs this file and provides PORT via the environment.
const { createServer } = require("http");
const next = require("next");

const port = process.env.PORT || 3000;
const app = next({ dev: false });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => handle(req, res)).listen(port, () => {
    console.log(`> Lumina Studio ready on port ${port}`);
  });
});
