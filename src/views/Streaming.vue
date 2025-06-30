<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';

// Create WebSocket connection.
const socket = new WebSocket("ws://localhost:8080/streaming");
socket.binaryType = 'arraybuffer';

// When WebSocket connection is established
socket.onopen = () => {
    
};

// When a WebSocket error occurs
socket.onerror = (error) => {
    console.error('WebSocket error:', error);
};

// When the WebSocket connection is closed
socket.onclose = () => {
    console.log('WebSocket connection closed.');
};

const startVideo = () => {
	var video = document.querySelector("#local-video") as HTMLVideoElement;
	
	// Capture video streams
    navigator.mediaDevices.getUserMedia({ audio: false, video: 
		{
			width: { max: 645 },
			height: { max: 360 },
			frameRate: { max: 10 }
		}
	 })
        .then(stream => {
			video.srcObject = stream;
            // Create MediaRecorder to encode the media streams
            const mediaRecorder = new MediaRecorder(stream);

            // When data is available from the MediaRecorder
            mediaRecorder.ondataavailable = (event) => {
                console.log('ondataavailable', event.data)
                // Send the data chunk over the WebSocket connection
                if (event.data && event.data.size > 0) {
                    socket.send(event.data);
                }
            };

            // Start recording the media streams
            mediaRecorder.start(100); // Call ondataavailable every 100ms
        })
        .catch(error => {
            console.error('Error accessing media devices:', error);
        });
}

const closeVideo = () => {
	var video = document.querySelector("#local-video") as any;

	var stream = video.srcObject;
	var tracks = stream.getTracks();

	for (var i = 0; i < tracks.length; i++) {
		var track = tracks[i];
		track.stop();
	}

	video.srcObject = null;

    // Close connection
    socket.close();
}

</script>

<template>
	<div class="call">
		<div id="controls">
			<div @click.prevent="startVideo" id="start">
				<img src="@/assets/images/video_add.svg" />
			</div>
		</div>
	</div>
	<div class="call">
		<div id="videos">
			<video class="video-player" id="local-video" autoplay="true"></video>
		</div>
		<div id="controls">
			<div @click.prevent="closeVideo" id="endcall">
				<img src="@/assets/images/call_end.svg" />
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