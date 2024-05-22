import { useEffect } from "react";

export function Receiver() {
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");
    socket.onopen = () => {
      socket.send(JSON.stringify({ type: "receiver" }));
    };

    /* When we receive data from Backend, then we have to 
       check the things and Do correct routing*/
    socket.onmessage = async (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "create-offer") {
        // Create Answer
        const pc = new RTCPeerConnection();
        pc.setRemoteDescription(message.sdp);
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.send(
          JSON.stringify({ type: "create-answer", sdp: pc.localDescription })
        );
      }
    };
  }, []);

  return <div>receiver</div>;
}
