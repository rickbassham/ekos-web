const http = require('http');
const WebSocket = require('ws');
const url = require('url');
const gpsd = require('node-gpsd');
const static = require('node-static');
const enableGracefulShutdown = require('server-graceful-shutdown');

const debug = process.env.EKOS_WEB_DEBUG === "1";

const server = http.createServer();

// These three listen for messages from Ekos.
const messageServer = new WebSocket.Server({ noServer: true });
const mediaServer = new WebSocket.Server({ noServer: true });
const cloudServer = new WebSocket.Server({ noServer: true });

// This one listens for messages from the web client.
const interfaceServer = new WebSocket.Server({ noServer: true });

// The signals we want to handle
// NOTE: although it is tempting, the SIGKILL signal (9) cannot be intercepted and handled
var signals = {
  'SIGHUP': 1,
  'SIGINT': 2,
  'SIGTERM': 15
};

// Do any necessary shutdown logic for our application here
const shutdown = (signal, value) => {
  console.log("shutdown!");

  messageServer.close();
  mediaServer.close();
  cloudServer.close();
  interfaceServer.close();

  server.shutdown(() => {
    console.log(`server stopped by ${signal} with value ${value}`);
    process.exit(128 + value);
  });
};

// Create a listener for each of the signals that we want to handle
Object.keys(signals).forEach((signal) => {
  process.on(signal, () => {
    console.log(`process received a ${signal} signal`);
    shutdown(signal, signals[signal]);
  });
});

const gpsdListener = new gpsd.Listener({
  hostname: process.env.GPSD_HOST || "127.0.0.1",
  parse: true,
  logger: {
    info: () => { },
    warn: () => { },
    error: () => { },
  }
});

// Keep track of the last messages of each type (merging them together) so we can
// send new web clients our current status immediately.
let lastMessages = {};
const saveToLastMessages = (msg) => {
  if (typeof msg.payload === "object") {
    lastMessages[msg.type] = {
      ...lastMessages[msg.type],
      ...msg.payload,
    };
  } else {
    lastMessages[msg.type] = msg.payload;
  }
};

const sendJSON = (ws, msg) => {
  if (debug) {
    console.log('sending message', msg);
  }

  ws.send(JSON.stringify(msg));
};

const setupMessageServerOptions = (ws) => {
  // Send Ekos options needed to get images, notifications, and then get the
  // current state of the world directly from Ekos.
  sendJSON(ws, { type: "option_set_high_bandwidth", payload: true });
  sendJSON(ws, { type: "option_set_image_transfer", payload: true });
  sendJSON(ws, { type: "option_set_notifications", payload: true });
  sendJSON(ws, { type: "get_states" });
};

const setupMediaServerOptions = (ws) => {
  sendJSON(ws, { type: "set_blobs", payload: true });
}

gpsdListener.on('TPV', (loc) => {
  const msg = {
    type: "new_gps_state",
    payload: {
      lat: loc.lat,
      lon: loc.lon,
      alt: loc.alt,
      mode: loc.mode,
    },
  };

  saveToLastMessages(msg);

  interfaceServer.clients.forEach(c => {
    sendJSON(c, msg);
  });
});

gpsdListener.on("error", () => { });

gpsdListener.connect(() => {
  gpsdListener.watch();
});

interfaceServer.on("connection", (ws) => {
  ws.on("message", (msg) => {
    // Every message we get from the client should be forwarded to Ekos.
    messageServer.clients.forEach(c => {
      sendJSON(c, JSON.parse(msg));
    });
  });

  // Update the web client with our current state.
  Object.keys(lastMessages).forEach(key => {
    sendJSON(ws, { type: key, payload: lastMessages[key] });
  });

  messageServer.clients.forEach(c => {
    setupMessageServerOptions(c);
  });

  // Tell Ekos to send us images.
  mediaServer.clients.forEach(c => {
    setupMediaServerOptions(c);
  });
});

messageServer.on("connection", (ws) => {
  ws.on("message", (msg) => {
    // Forward all messages to the web client, remembering the last one of
    // each type for future connections.
    const msgObj = JSON.parse(msg);

    saveToLastMessages(msgObj);

    interfaceServer.clients.forEach(c => {
      sendJSON(c, msgObj);
    });

    if (msgObj.type === "new_connection_state" && msgObj.payload.online) {
      messageServer.clients.forEach(c => {
        setupMessageServerOptions(c);
      });

      // Tell Ekos to send us images.
      mediaServer.clients.forEach(c => {
        setupMediaServerOptions(c);
      });
    }
  });

  setupMessageServerOptions(ws);
});

mediaServer.on("connection", (ws) => {
  ws.on("message", (msg) => {
    // The media connection either sends a JSON string or a binary blob.
    // The JSON string is image metadata, the blob is the jpeg image itself.
    // Let's turn those into well formed packets that match our other packet's
    // structure.
    if (typeof msg === "string") {
      msg = { type: "image_metadata", payload: JSON.parse(msg) };
    } else {
      msg = {
        type: "image_data",
        payload: "data:image/jpeg;base64," + msg.toString('base64')
      };
    }

    interfaceServer.clients.forEach(c => {
      sendJSON(c, msg);
    });

    saveToLastMessages(msg);
  });

  setupMediaServerOptions(ws);
});

cloudServer.on("connection", (ws) => {
  // In offline mode, Ekos won't send any data here, but will still try to
  // connect to the web socket.
  // In online mode, it will send the full compressed FITS files.
  ws.on("message", (msg) => {
    console.log('received cloud message', JSON.parse(msg));
  });
});

var file = new static.Server("./static");

server.addListener("request", (req, res) => {
  console.log('request started', req.url);

  switch (req.url) {
    // Ekos will send a call to this route on initial connection. It must
    // return a 200 response with a token and success == true for Ekos to
    // set up the web socket connections.
    case "/api/authenticate": {
      res.writeHead(200);
      res.end(JSON.stringify({
        "token": "TOKEN",
        "success": true,
      }));
      break;
    }
    default:
      file.serve(req, res);
  }
})

server.on("upgrade", (req, socket, head) => {
  console.log('upgrade started', req.url);

  const pathname = url.parse(req.url).pathname;

  switch (pathname) {
    case "/message/ekos": {
      messageServer.handleUpgrade(req, socket, head, (ws) => {
        messageServer.emit("connection", ws, req);
      });
      break;
    }
    case "/cloud/ekos": {
      cloudServer.handleUpgrade(req, socket, head, (ws) => {
        cloudServer.emit("connection", ws, req);
      });
      break;
    }
    case "/media/ekos": {
      mediaServer.handleUpgrade(req, socket, head, (ws) => {
        mediaServer.emit("connection", ws, req);
      });
      break;
    }
    case "/interface": {
      interfaceServer.handleUpgrade(req, socket, head, (ws) => {
        interfaceServer.emit("connection", ws, req);
      });
      break;
    }
    default:
      socket.destroy();
  }
});

enableGracefulShutdown(server, 1000);

// Ekos in offline mode will try to connect to localhost:3000.
server.listen(3000);
