import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { Signal } from "signal-polyfill";
import { effect } from "./effect.js";
import { createNodeWebSocket } from "@hono/node-ws";

const app = new Hono();

const state = new Signal.State("Hello Hono!");

const { injectWebSocket, upgradeWebSocket } = createNodeWebSocket({ app });

effect(() => {
  console.log("State:", state.get());
});

app.get("/", (c) => {
  return c.html(
    <html>
      <head>
        <meta charset="UTF-8" />
      </head>
      <body>
        <div id="state"></div>
        <script
          dangerouslySetInnerHTML={{
            __html: `
        const ws = new WebSocket('ws://localhost:3000/ws')
        const $nowTime = document.getElementById('state')
        ws.onmessage = (event) => {
          $nowTime.textContent = event.data
        }
        `,
          }}
        ></script>
      </body>
    </html>
  );
});

app.get(
  "/ws",
  upgradeWebSocket((c) => {
    return {
      onOpen(_event, ws) {
        effect(() => {
          ws.send(state.get());
        });
      },
    };
  })
);

app.get("/state", (c) => {
  return c.text(state.get());
});

app.post("/state", async (c) => {
  const body = await c.req.json<{ state: string }>();

  state.set(body.state);

  return c.text(state.get());
});

const port = 3000;
console.log(`Server is running on http://localhost:${port}`);

const server = serve({
  fetch: app.fetch,
  port,
});

injectWebSocket(server);
