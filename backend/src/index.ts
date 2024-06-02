import { WebSocket, WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

let senderSocket: null | WebSocket = null;
let receiverSocket: null | WebSocket = null;

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);

  ws.on('message', function message(data: any) {
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
      receiverSocket?.send (JSON.stringify({ type: 'create-offer', sdp: message.sdp }));
    } 

    // Create Answer
    else if (message.type === 'create-answer') {
      if (ws !== receiverSocket) {
        return;
      }
      console.log("got the answer");
      senderSocket?.send (JSON.stringify({ type: 'create-answer', sdp: message.sdp }));
    }

    // Add Ice Candidate
    else if (message.type === 'icecandidate') {
      // Checks is it come from SenderSocket
      if (ws === senderSocket) {
        console.log("Got ic 1")
        receiverSocket?.send(JSON.stringify({ type: 'iceCandidate', candidate: message.candidate }));
      } else if (ws === receiverSocket) {
        // Checks is it come from ReceiverSocket
        console.log("Got ic 2")
        senderSocket?.send(JSON.stringify({ type: 'iceCandidate', candidate: message.candidate }));
      }
    }
  });

  ws.send('something');
});

// 53:13