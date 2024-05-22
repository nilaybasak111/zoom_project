"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
let senderSocket = null;
let receiverSocket = null;
wss.on("connection", function connection(ws) {
    ws.on("message", function message(data) {
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
            receiverSocket === null || receiverSocket === void 0 ? void 0 : receiverSocket.send(JSON.stringify({ type: "create-offer", offer: message.offer }));
        }
        // create answer
        else if (message.type === "create-answer") {
            if (ws != receiverSocket) {
                return;
            }
            console.log("offer created");
            receiverSocket === null || receiverSocket === void 0 ? void 0 : receiverSocket.send(JSON.stringify({ type: "create-answer", offer: message.offer }));
        }
        // add ice candidate
        else if (message.type === "icecandidate") {
            if (ws === senderSocket) {
                receiverSocket === null || receiverSocket === void 0 ? void 0 : receiverSocket.send(JSON.stringify({ type: "icecandidate", candidate: message.candidate }));
            }
            else if (ws === receiverSocket) {
                senderSocket === null || senderSocket === void 0 ? void 0 : senderSocket.send(JSON.stringify({ type: "icecandidate", candidate: message.candidate }));
            }
        }
    });
});