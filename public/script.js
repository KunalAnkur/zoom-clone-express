const videoGrid = document.getElementById('video-grid')
console.log(videoGrid)
const myVideo = document.createElement('video')
myVideo.muted = true

let myVideoStream
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    myVideoStream = stream
    addVideoStream(myVideo, stream)
}).catch(err => {
    console.log(err)
})

const addVideoStream = (video, stream) => {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', ()=>{
        video.play()
    })
    videoGrid.append(video)
}