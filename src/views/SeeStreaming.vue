<script setup lang="ts">
// Create WebSocket connection.
const socket = new WebSocket("ws://localhost:8080/streaming");
socket.binaryType = 'arraybuffer';

socket.onmessage = (data) => {
    // console.log(data.data);

    var newBytes = new Uint8Array(data.data);
    var binary = '';
    var len = newBytes.length;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(newBytes[i]);
    }
    var image = new Image();
    image.src = 'data:image/jpg;base64,' + window.btoa(binary);
    console.log(image.src);
    document.body.appendChild(image);








    // var myblob = new Blob([data.data], {
    //     type: 'video/x-matroska;codecs=avc1'
    // });

    // console.log(myblob.bytes);

    // var image = new Image();
    // image.src = URL.createObjectURL(myblob);
    // console.log(image.src);
    // document.body.appendChild(image);

    // var img = document.getElementById('local-video') as any;

    // myblob.text().then((bytes: any) => {
    //     var newBytes = new Uint8Array(bytes);
    //     var binary = '';
    //     var len = newBytes.length;
    //     for (var i = 0; i < len; i++) {
    //         binary += String.fromCharCode(newBytes[i]);
    //     }
    //     var image = new Image();
    //     image.src = 'data:image/jpg;base64,' + window.btoa(binary);
    //     document.body.appendChild(image);
    //     // img.src = 'data:image/jpg;base64,' + window.btoa(binary);
    //     // console.log(img.src);
    // }).catch((error: any) => {
    //     console.error('Error reading blob bytes:', error);
    // });

    // var binary= '';
    // var len = myblob.byteLength;
    // for (var i = 0; i < len; i++) {
    //     binary += String.fromCharCode(myblob[i])
    // }
    // console.log(binary);
    // img.src = 'data:image/jpg;base64,' + window.btoa(binary);

    // var myblob = new Blob([data.data], {
    //     type: 'video/x-matroska;codecs=avc1'
    // });
    // console.log(myblob);

    // video.srcObject = myblob;


    // const newObjectUrl = URL.createObjectURL( myblob );
        
    // // URLs created by `URL.createObjectURL` always use the `blob:` URI scheme: https://w3c.github.io/FileAPI/#dfn-createObjectURL
    // const oldObjectUrl = video.currentSrc;
    // if( oldObjectUrl && oldObjectUrl.startsWith('blob:') ) {
    //     // It is very important to revoke the previous ObjectURL to prevent memory leaks. Un-set the `src` first.
    //     // See https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL

    //     video.src = ''; // <-- Un-set the src property *before* revoking the object URL.
    //     URL.revokeObjectURL( oldObjectUrl );
    // }

    // // Then set the new URL:
    // video.src = newObjectUrl;

    // // And load it:
    // video.load();
};

</script>

<template>
    <img class="video-player" id="local-video" />
</template>

<style lang="scss" scoped>
</style>