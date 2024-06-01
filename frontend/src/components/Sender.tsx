import { useEffect, useState } from "react"

export function Sender(){
    const [ socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const socket = new WebSocket("ws://localhost:8080");
        socket.onopen = () => {
            console.log("inside socket sender");
            socket.send(JSON.stringify({ type: 'Sender' }));
        }
        setSocket(socket)
    }, []);

    // Here we write all WebRtc Logic
    async function startSendingVideo() {
        if(!socket) return;
        // Create Offer
        const pc = new RTCPeerConnection();
        console.log("peerconnection sender");
        const offer = await pc.createOffer();
        console.log(offer); // May be it sends the sdp
        await pc.setLocalDescription(offer);
        console.log("local dec set");
        socket?.send(JSON.stringify({ type: 'create-offer', sdp: pc.localDescription }));

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'create-answer') {
                pc.setRemoteDescription(data.sdp);
            }

        }
    }
   
    return <div>
        Sender
        <button onClick={startSendingVideo}>Send Video</button>
        </div>
}