

const socket = io('/');
const videoGrid = document.getElementById('video-grid');

const myVideo = document.createElement('video');
myVideo.muted = true;

var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '3000'
});

let myVideoStream;
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    peer.on('call', call => {
        call.answer(stream);
        const video = document.createElement('video');
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        });
    });


    socket.on('user-connected',(userId)=>{
        connectTONewUser(userId, stream);
    });

}).catch(err => {
    console.log(err)
});

peer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id);
    // console.log(id)
});

// socket.emit('join-room',ROOM_ID)


 const connectTONewUser = (userId, stream) => {
    const call = peer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream);
    })
    console.log(userId);
 }   




const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', ()=>{
        video.play();
    });
    videoGrid.append(video);
}

let text = $('input');


$('html').keydown((e)=>{
    if(e.which === 13 && text.val().length !== 0) {
        console.log(text.val())
        socket.emit('message', text.val());
        text.val('');
    }
})

socket.on('createMessage', message => {
    console.log('this is coming from server',message);
    $('ul').append(`<li class="message"><b>user</b><br/>${message}</li>`);
    scrollToBottom();
})

const scrollToBottom = () => {
    var d = $('.mainChatWindow');
    d.scrollTop(d.prop("scrollHeight"));
}

const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if(enabled) {
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnmuteButton();
    } else{
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled = true;
    }
} 
const setMuteButton = () =>{
    const html = `
    <i class="mute fas fa-microphone"></i>
    <span>Mute</span>`;
    document.querySelector('.mainMuteButton').innerHTML = html;
}
const setUnmuteButton = () =>{
    const html = `
    <i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>`;
    document.querySelector('.mainMuteButton').innerHTML = html;
}

const playStop = () => {
    const enabled = myVideoStream.getVideoTracks()[0].enabled;
    if(enabled) {
        myVideoStream.getVideoTracks()[0].enabled = false;
        setPlayVideo();
    } else{
        setStopVideo();
        myVideoStream.getVideoTracks()[0].enabled = true;
    }
}

const setStopVideo = () => {
    const html = `
    <i class="fas fa-video"></i>
    <span>Stop</span>
    `;
    document.querySelector('.mainVideoButton').innerHTML = html;
}

const setPlayVideo = () => {
    const html = `
    <i class="stop fas fa-video-slash"></i>
    <span>Play</span>
    `;
    document.querySelector('.mainVideoButton').innerHTML = html;
}

