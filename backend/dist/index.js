"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
let senderSocket = null;
let receiverSocket = null;
wss.on('connection', function connection(ws) {
    ws.on('error', console.error);
    ws.on('message', function message(data) {
        const message = JSON.parse(data);
        //console.log(message);
        // Identify-as-Sender
        if (message.type === 'Sender') {
            console.log("sender set");
            senderSocket = ws;
        }
        // Identify-as-Receiver
        else if (message.type === 'Receiver') {
            console.log("receiver set");
            receiverSocket = ws;
        }
        // Create Offer
        else if (message.type === 'create-offer') {
            if (ws !== senderSocket) {
                return;
            }
            console.log("got the offer");
            receiverSocket === null || receiverSocket === void 0 ? void 0 : receiverSocket.send(JSON.stringify({ type: 'create-offer', sdp: message.sdp }));
        }
        // Create Answer
        else if (message.type === 'create-answer') {
            if (ws !== receiverSocket) {
                return;
            }
            console.log("got the answer");
            senderSocket === null || senderSocket === void 0 ? void 0 : senderSocket.send(JSON.stringify({ type: 'create-answer', sdp: message.sdp }));
        }
        // Add Ice Candidate
        else if (message.type === 'icecandidate') {
            // Checks is it come from SenderSocket
            if (ws === senderSocket) {
                receiverSocket === null || receiverSocket === void 0 ? void 0 : receiverSocket.send(JSON.stringify({ type: 'iceCandidate', candidate: message.candidate }));
            }
            else if (ws === receiverSocket) {
                // Checks is it come from ReceiverSocket
                senderSocket === null || senderSocket === void 0 ? void 0 : senderSocket.send(JSON.stringify({ type: 'iceCandidate', candidate: message.candidate }));
            }
        }
    });
    ws.send('something');
});
// 53:13
