import { useEffect, useState } from "react";

export function Sender() {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");
    socket.onopen = () => {
      socket.send(JSON.stringify({ type: "sender" }));
    };
    setSocket(socket);
  }, []);

  // Here we will write all Webrtc Logics
  async function startsendigvideo() {
    if (!socket) return;
    // Create an Offer
    const pc = new RTCPeerConnection();
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    console.log(offer); // probably gives SDP
    socket?.send(
      JSON.stringify({ type: "create-offer", sdp: pc.localDescription })
    );

    // We have to catch the message that receiver sends
    socket.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "create-answer") {
        pc.setRemoteDescription(data.sdp);
      }
    };
  }

  return (
    <div>
      sender
      <button onClick={startsendigvideo}>Send Video</button>
    </div>
  );
}
//38.33
