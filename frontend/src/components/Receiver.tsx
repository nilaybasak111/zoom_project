import { useEffect } from "react"

export function Receiver(){
    
    useEffect(() => {
        const socket = new WebSocket("ws://localhost:8080");
        socket.onopen = () => {
            socket.send(JSON.stringify({ type: 'Receiver' }));
        }

        socket.onmessage = async (event) => {
            const data = JSON.parse(event.data);
            let pc: RTCPeerConnection | null = null;
            if (data.type === 'create-offer') {
                // Create Answer
                const pc = new RTCPeerConnection();
                pc.setRemoteDescription(data.sdp);
                
                 pc.onicecandidate = (event) => {
                    console.log("this is print receiver "+ event);
                    if(event.candidate) {
                        console.log("inside receiver event.candidate ");
                        socket?.send(JSON.stringify ({ type: 'iceCandidate', candidate: event.candidate }));
                    }
                }

                pc.ontrack = (event) => {
                    const video = document.createElement('video');
                    document.body.appendChild(video);
                    video.srcObject = new MediaStream([event.track]);
                    video.play();
                }
        
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                socket.send(JSON.stringify({ type:'create-answer', sdp: pc.localDescription }));
            } else if (data.type === 'iceCandidate') {
                if (pc !== null) {
                    //@ts-ignore
                    pc?.addIceCandidate(message.candidate); // 59:53
                }  
            } 
        }
    }, []);

   return <div>
   Receiver
   </div>
}

/* import { useEffect } from "react"


export const Receiver = () => {
    
    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8080');
        socket.onopen = () => {
            socket.send(JSON.stringify({
                type: 'receiver'
            }));
        }
        startReceiving(socket);
    }, []);

    function startReceiving(socket: WebSocket) {
        const video = document.createElement('video');
        document.body.appendChild(video);

        const pc = new RTCPeerConnection();
        pc.ontrack = (event) => {
            video.srcObject = new MediaStream([event.track]);
            video.play();
        }

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.type === 'create-Offer') {
                pc.setRemoteDescription(message.sdp).then(() => {
                    pc.createAnswer().then((answer) => {
                        pc.setLocalDescription(answer);
                        socket.send(JSON.stringify({
                            type: 'create-Answer',
                            sdp: answer
                        }));
                    });
                });
            } else if (message.type === 'iceCandidate') {
                pc.addIceCandidate(message.candidate);
            }
        }
    }

    return <div>
        
    </div>
} */