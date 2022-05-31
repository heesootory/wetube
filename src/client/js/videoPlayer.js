const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("FullScreen");
const videoContainer = document.getElementById("videoContainer");

let controlsTimeout = null; 
let controlsMovementTimeout = null;
let volumeValue = 0.5;
video.volume = volumeValue; //default volumn

const handlePlayClick = (e) => {
    //if the video playing, pause it
    if(video.paused){
        video.play();
    }else{
        video.pause();
    }
    playBtn.innerText = video.paused ? "Play" : "Pause";
    //else play the video
};

const handleMute = (e) => {
    if(video.muted){
        video.muted = false;
    }else{
        video.muted = true;
    }
    muteBtn.innerText = video.muted ? "Unmute" : "Mute";
    volumeRange.value = video.muted ? 0 : volumeValue;     // 음소거 해제 시, 기존의 음량으로 돌아가게 설정.
}

const handleVolumeChange = (event) => {
    const {target: {value} } = event;
    // mute상태에서 볼륨을 control하면, false상태로 변하고, 버튼은 mute로.
    if(video.muted){
        video.muted = false;
        muteBtn.innerText = "Mute";
    }
    volumeValue = value;    //실시간 음량이 전역변수로 저장.
    video.volume = value;   //실제 video player의 음량 조절.
}

const formatTime = (seconds) => {
    return new Date(seconds * 1000).toISOString().substring(11,19);
}

const handleLoadedMetadata = () =>{     //영상의 총 길이
    totalTime.innerText = formatTime(Math.floor(video.duration));
    //console.log(formatTime(Math.floor(video.duration)));
    timeline.max = Math.floor(video.duration);
};

const handleTimeUpdate = () =>{     //영상의 실시간 시간
    currentTime.innerText = formatTime(Math.floor(video.currentTime));
    timeline.value = Math.floor(video.currentTime);
};

const handleTimelineChange = (event) => {
    const {
        target : {value},
    } = event;
    video.currentTime = value;
};

const handleFullScreen = () => {
    const fullscreen = document.fullscreenElement;
    if(fullscreen){
        document.exitFullscreen();
        fullScreenBtn.innerText = "Enter Full Screen";
    }else{
        videoContainer.requestFullscreen();
        fullScreenBtn.innerText = "Exit Full Screen";
    }
}

const hidecontrols = () => videoControls.classList.remove("showing");   //showing 없애기

const handleMouseMove = () => {
    if(controlsTimeout){
        clearTimeout(controlsTimeout);  //3초간 지연되던걸 중단.
        controlsTimeout = null;
    }
    if(controlsMovementTimeout) {
        clearTimeout(controlsMovementTimeout);  //3초간 지연되던걸 중단.
        controlsMovementTimeout = null;
    }
    videoControls.classList.add("showing");
    controlsMovementTimeout = setTimeout(hidecontrols, 3000);
}

const handleMouseLeave = () => {
    controlsTimeout = setTimeout(hidecontrols, 3000);
}

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("loadedmetadata", handleLoadedMetadata)
video.addEventListener("timeupdate", handleTimeUpdate);
timeline.addEventListener("input", handleTimelineChange);
fullScreenBtn.addEventListener("click", handleFullScreen);
video.addEventListener("mousemove", handleMouseMove);
video.addEventListener("mouseleave", handleMouseLeave);