import { useEffect } from "react"

export function Receiver(){
    
    useEffect(() => {
        const socket = new WebSocket("ws://localhost:8080");
        socket.onopen = () => {
            socket.send(JSON.stringify({ type: 'Receiver' }));
        }

        socket.onmessage = async (event) => {
            const message = JSON.parse(event.data);
            //let pc: RTCPeerConnection | null = null;
            if (message.type === 'create-offer') {
                // Create Answer
                const pc = new RTCPeerConnection();
                pc.setRemoteDescription(message.sdp);
                
                 pc.onicecandidate = (event) => {
                    console.log("this is print receiver "+ event);
                    if(event.candidate) {
                        socket?.send(JSON.stringify ({ type: 'iceCandidate', candidtes: event.candidate }));
                    }
                }

                pc.ontrack = (track) => {
                    console.log(track);
                }
        
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                socket.send(JSON.stringify({ type:'create-answer', sdp: pc.localDescription }));
            } else if (message.type === 'iceCandidate') {
                const pc = new RTCPeerConnection();
                pc.addIceCandidate(message.candidate); // 59:40  
            } 
        }
    }, []);

   return <div>Receiver</div>
}