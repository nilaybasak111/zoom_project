import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

let senderSocket: null | WebSocket = null;
let receiverSocket: null | WebSocket = null;

wss.on("connection", function connection(ws) {
  ws.on("message", function message(data: any) {
    const message = JSON.parse(data);

    // identify-as-sender
    if (message.type === "sender") {
      senderSocket = ws;
      console.log("sender set");
    }

    // identify-as-receiver
    else if (message.type === "receiver") {
      receiverSocket = ws;
      console.log("receiver set");
    }

    // create offer
    else if (message.type === "create-offer") {
      if (ws != senderSocket) {
        return;
      }
      console.log("offer created");
      receiverSocket?.send(
        JSON.stringify({ type: "create-offer", offer: message.offer })
      );
    }

    // create answer
    else if (message.type === "create-answer") {
      if (ws != receiverSocket) {
        return;
      }
      console.log("offer created");
      receiverSocket?.send(
        JSON.stringify({ type: "create-answer", offer: message.offer })
      );
    }

    // add ice candidate
    else if (message.type === "icecandidate") {
      if (ws === senderSocket) {
        receiverSocket?.send(
          JSON.stringify({ type: "icecandidate", candidate: message.candidate })
        );
      } else if (ws === receiverSocket) {
        senderSocket?.send(
          JSON.stringify({ type: "icecandidate", candidate: message.candidate })
        );
      }
    }
  });
});
