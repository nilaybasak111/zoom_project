import { useEffect, useState } from "react"

export function Sender(){
    const [ socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const socket = new WebSocket("ws://localhost:8080");
        socket.onopen = () => {
            socket.send(JSON.stringify({ type: 'Sender' }));
        }
        setSocket(socket)
    }, []);

    // Here we write all WebRtc Logic
    async function startSendingVideo() {
        if(!socket) return;
        // Create Offer
        const pc = new RTCPeerConnection();
        const offer = await pc.createOffer();
        console.log(offer); // It sends the sdp
        await pc.setLocalDescription(offer);

        pc.onicecandidate = (event) => {
            console.log("this is print sender "+ event);
            if(event.candidate) {
                socket?.send(JSON.stringify ({ type: 'iceCandidate', candidtes: event.candidate }));
            }
        }
        socket?.send(JSON.stringify({ type: 'create-offer', sdp: pc.localDescription }));

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'create-answer') {
                pc.setRemoteDescription(data.sdp);
            } else if (data.type === 'iceCandidate') {
                pc.addIceCandidate(data.candidate);
            }

        }

        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        pc.addTrack(stream.getVideoTracks()[0]); // Get the video from here
        pc.addTrack(stream.getAudioTracks()[0]); // Get the Audio from here
    }
   
    return <div>
        Sender
        <button onClick={startSendingVideo}>Send Video</button>
        </div>
}