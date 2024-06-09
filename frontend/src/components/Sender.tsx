import { useEffect, useState } from "react"

export function Sender(){
    const [ socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const socket = new WebSocket("ws://localhost:8080");
        setSocket(socket);
        socket.onopen = () => {
            socket.send(JSON.stringify({ type: 'Sender' }));
        }
    }, []);

    // Here we write all WebRtc Logic
    async function startSendingVideo() {
        if (!socket) {
            alert("Socket not found");
            return;
        }
        // Create Offer
        const pc = new RTCPeerConnection();
        pc.onnegotiationneeded = async () => {
            console.log("onnegotiationneeded");
            const offer = await pc.createOffer();
            console.log(offer); // It sends the sdp
            await pc.setLocalDescription(offer);
            socket?.send(JSON.stringify({ type: 'create-offer', sdp: pc.localDescription }));
        }
        

        pc.onicecandidate = (event) => {
            console.log("this is print sender "+ event);
            if(event.candidate) {
                console.log("inside sender event.candidate ");
                socket?.send(JSON.stringify ({ type: 'iceCandidate', candidate: event.candidate }));
            }
        }

        socket.onmessage = async (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'create-answer') {
                await pc.setRemoteDescription(data.sdp);
            } else if (data.type === 'iceCandidate') {
                pc.addIceCandidate(data.candidate);
        }
    }

        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        pc.addTrack(stream.getVideoTracks()[0]); // Get the video from here
        //pc.addTrack(stream.getAudioTracks()[0]); // Get the Audio from here
        const video = document.createElement('video');
        document.body.appendChild(video);
        video.srcObject= stream;
        video.play();
    }
    
   
    return <div>
        Sender
        <button onClick={startSendingVideo}>Send Video</button>
        </div>
} 