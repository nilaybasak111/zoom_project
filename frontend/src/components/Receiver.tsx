import { useEffect } from "react" // add useRef

export function Receiver(){
    //const videoRef = useRef<HTMLVideoElement>(null)
    
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
                    pc?.addIceCandidate(data.candidate);
                }  
            } 
        }
    }, []);

   return <div>
   Receiver <button>OK</button>
   </div>
}