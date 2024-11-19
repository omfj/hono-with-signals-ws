# Hono with signals and websockets

Using signals we can easily send messages over websocket when some server state has changed.

1. Start the server
2. Visit `http://localhost:3000`
3. Update the server state `curl http://localhost:3000/state --data '{ "state": "Whats up?" }'`
4. Se the changes in the browser

