import { createFFmpeg, fetchFile} from "@ffmpeg/ffmpeg";
const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

let stream;     // 영상
let recorder;   
let videoFile;  // 브라우저 메모리에 저장된 실제 녹화 파일 URL

const files = {
    input : "recording.webm",
    output : "output.mp4",
    thumb : "thumbnail.jpg"
}

const handleDownload = async () => {

    const ffmpeg = createFFmpeg({corePath: 'https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js', log : true});
    await ffmpeg.load();

    ffmpeg.FS("writeFile", files.input, await fetchFile(videoFile));

    await ffmpeg.run("-i", files.input, "-r", "60", files.output);

    await ffmpeg.run("-i", files.input, "-ss", "00:00:01", "-frames:v" , "1", files.thumb);

    const mp4file = ffmpeg.FS("readFile", files.output);
    const thumbfile = ffmpeg.FS("readFile", files.thumb);

    const mp4Blob = new Blob([mp4file.buffer], {type : "video/mp4"});
    const thumbBlob = new Blob([thumbfile.buffer], {type: "image/jpg"});

    const mp4URL = URL.createObjectURL(mp4Blob);
    const thumbURL = URL.createObjectURL(thumbBlob);

    const a = document.createElement("a");
    a.href = mp4URL;
    a.download = "MyRecording.mp4";     //anchor의 download속성
    document.body.appendChild(a);
    a.click();        //anchor를 누른효과.

    const thumba = document.createElement("a");
    thumba.href = thumbURL;
    thumba.download = "MyThumbnail.jpg";     //anchor의 download속성
    document.body.appendChild(thumba);
    thumba.click();        //anchor를 누른효과.

    ffmpeg.FS("unlink", files.input);
    ffmpeg.FS("unlink", files.output);
    ffmpeg.FS("unlink", files.thumb);

    URL.revokeObjectURL(videoFile);
    URL.revokeObjectURL(mp4URL);
    URL.revokeObjectURL(thumbURL);
}

const handleStop = ()  => {
    startBtn.innerText = "Download Recording";
    startBtn.removeEventListener("click", handleStop);
    startBtn.addEventListener("click", handleDownload);

    recorder.stop();
};

const handleStart = () => {
    startBtn.innerText = "Stop Recording";
    startBtn.removeEventListener("click", handleStart);
    startBtn.addEventListener("click", handleStop);
    // 녹화
    recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (event) => {
        videoFile = URL.createObjectURL(event.data);    
        video.srcObject = null;
        video.src = videoFile;
        video.loop = true;
        video.play();
    };
    recorder.start();    //녹화 시작.
};

const init = async () => {  //녹화 X, preview
    stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true,
    });
    video.srcObject = stream;
    video.play();
};

init();
startBtn.addEventListener("click", handleStart)