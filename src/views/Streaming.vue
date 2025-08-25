<script setup lang="ts">
import { onMounted, ref } from 'vue';


// Create WebSocket connection.
const socket = new WebSocket("ws://localhost:8080/streaming");
socket.binaryType = 'arraybuffer';
socket.onmessage = handleMessages;
socket.onopen = () => socket.send({ type: 'joined' });

onMounted(async () => {
	await startLocalPlayback();
})

const localVid = document.getElementById('local-video') as HTMLVideoElement;
const remoteVid = document.getElementById('remote-video') as HTMLVideoElement;
const videoBtn = document.getElementById('video-ctl');
const endCallBtn = document.getElementById('endcall');
const audioBtn = document.getElementById('audio-ctl');

const localStream = ref() as any;
const remoteStream = ref() as any;
const peerConnection = ref() as any;

async function handleMessages(e: any) {
	const msg = JSON.parse(e.data);
	console.log(msg);
	switch (msg.type) {
		case 'joined':
			await makeCall();
			break;
		case 'candidate':
			await acceptCandidate(msg.candidate);
			break;
		case 'offer':
			await answerCall(msg.offer);
			break;
		case 'answer':
			await startCall(msg.answer);
			break;
		case 'left':
			endCall();
			break;
		default:
			break;
	}
}

const wssend = (data: any) => socket.send(JSON.stringify(data));

async function startLocalPlayback() {
	const config = { video: { width: { min: 1280, ideal: 1920 }, height: { min: 720, ideal: 1080 } }, audio: true };
	localStream.value = await navigator.mediaDevices.getUserMedia(config);
	localVid.srcObject = localStream;
}

async function connectToPeer() {
	peerConnection.value = new RTCPeerConnection(env.servers);
	remoteStream.value = new MediaStream();

	localVid.classList.add('video-player-secondary');
	remoteVid.srcObject = remoteStream;
	remoteVid.classList.remove('hide');

	if (!localStream) await startLocalPlayback();

	//send local video
	localStream.getTracks().forEach((t: any) => {
		peerConnection.addTrack(t, localStream);
	});

	//receive & display remote video
	peerConnection.ontrack = (e: any) => {
		e.streams[0].getTracks().forEach((t: any) => {
			remoteStream.addTrack(t);
		});
	};

	peerConnection.onicecandidate = (e: any) => {
		if (e.candidate) {
			wssend({ type: 'candidate', candidate: e.candidate });
		}
	};
}

async function makeCall() {
	await connectToPeer();
	const offer = await peerConnection.createOffer();
	await peerConnection.setLocalDescription(offer);
	wssend({ type: 'offer', offer });
}

async function acceptCandidate(c: any) {
	try {
		await peerConnection.addIceCandidate(c);
	} catch (e) {
		console.log('Error adding ice candidate', e);
	}
}

async function answerCall(offer: any) {
	await connectToPeer();
	await peerConnection.setRemoteDescription(offer);
	const answer = await peerConnection.createAnswer();
	await peerConnection.setLocalDescription(answer);
	wssend({ type: 'answer', answer });
}

async function startCall(answer: any) {
	await peerConnection.setRemoteDescription(answer);
}

function endCall() {
	peerConnection.close();
	remoteVid.classList.add('hide');
	localVid.classList.remove('video-player-secondary');
}

videoBtn!.addEventListener('click', () => toggleTrack('video'));
audioBtn!.addEventListener('click', () => toggleTrack('audio'));
endCallBtn!.addEventListener('click', () => (location.href = '/'));

function toggleTrack(kind: any) {
	const track = localStream.value.getTracks().find((t: any) => t.kind === kind);
	track.enabled = !track.enabled;
	document.querySelector(`#${kind}-ctl img`)!.src = `../images/${kind}${!track.enabled ? '_off' : ''}.svg`;
}

// // When a WebSocket error occurs
// socket.onerror = (error) => {
//     console.error('WebSocket error:', error);
// };

// // When the WebSocket connection is closed
// socket.onclose = () => {
//     console.log('WebSocket connection closed.');
// };

// const startVideo = () => {
// 	let truc = 0;
// 	var video = document.querySelector("#local-video") as HTMLVideoElement;
	
// 	// Capture video streams
//     navigator.mediaDevices.getUserMedia({ audio: false, video: 
// 		{
// 			width: { max: 645 },
// 			height: { max: 360 },
// 			frameRate: { max: 10 }
// 		}
// 	 })
//         .then(stream => {
// 			video.srcObject = stream;
//             // Create MediaRecorder to encode the media streams
//             const mediaRecorder = new MediaRecorder(stream);

//             // When data is available from the MediaRecorder
//             mediaRecorder.ondataavailable = (event) => {
//                 // Send the data chunk over the WebSocket connection
// 				if(truc < 3) {
// 					console.log(event)
// 					if (event.data && event.data.size > 0) {
// 						event.data.arrayBuffer().then((bytes) => {
// 							// Handle the buffer if needed
// 							console.log(bytes)
// 							socket.send(bytes);
// 							truc++;
// 						}).catch((error: any) => {
// 							console.error(error);
// 						});
// 					}
//                 }
//             };

//             // Start recording the media streams
//             mediaRecorder.start(100); // Call ondataavailable every 100ms
//         })
//         .catch(error => {
//             console.error('Error accessing media devices:', error);
//         });
// }

// const closeVideo = () => {
// 	var video = document.querySelector("#local-video") as any;

// 	var stream = video.srcObject;
// 	var tracks = stream.getTracks();

// 	for (var i = 0; i < tracks.length; i++) {
// 		var track = tracks[i];
// 		track.stop();
// 	}

// 	video.srcObject = null;

//     // Close connection
//     socket.close();
// }

</script>

<template>
	<div class="call">
		<div id="videos">
			<video class="video-player hide" id="remote-video" autoplay playsinline></video>
			<video class="video-player" id="local-video" autoplay playsinline muted></video>
		</div>
		<div id="controls">
			<div id="audio-ctl">
				<img src="../images/audio.svg" />
			</div>
			<div id="video-ctl">
				<img src="../images/video.svg" />
			</div>
			<div id="endcall">
				<img src="../images/call_end.svg" />
			</div>
		</div>
	</div>
</template>

<style>

.call {
	display: flex;
	padding: 20px;
	flex-direction: column;
	width: calc(100% - 40px);
	height: calc(100vh - 40px);
	justify-content: space-between;
}
#videos {
	width: 100%;
	margin: 0 auto;
	position: relative;
	max-width: calc(100% - 300px);
}
.video-player {
	width: 100%;
	height: auto;
	border-radius: 10px;
	background-color: black;
}
.video-player-secondary {
	right: 0;
	bottom: 0;
	width: 300px;
	position: absolute;
}
.hide {
	display: none;
}
#controls {
	display: flex;
	margin-top: 10px;
	justify-content: center;
}
#controls div {
	width: 50px;
	height: 50px;
	display: grid;
	margin: 0 5px;
	cursor: pointer;
	border-radius: 100%;
	align-content: center;
	justify-content: center;
	background-color: #3c4042;
}
#controls div#endcall {
	background-color: #eb5757;
}
#controls div:hover {
	background-color: #545759;
}
@media screen and (max-width: 500px) {
	#videos {
		display: flex;
		margin-top: 20vh;
	}
}
@media screen and (max-width: 700px) {
	#videos {
		display: flex;
		max-width: unset;
		position: initial;
		align-items: center;
		flex-direction: column;
	}
	.video-player-secondary {
		width: 80%;
		margin-top: 20px;
		position: initial;
	}
}
</style>