const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const time = document.getElementById("time");
const volumeRange = document.getElementById("volume");

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

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolumeChange);
