import { createFFmpeg, fetchFile} from "@ffmpeg/ffmpeg";
const actionBtn = document.getElementById("actionBtn");
const video = document.getElementById("preview");

let stream;     // 영상
let recorder;   
let videoFile;  // 브라우저 메모리에 저장된 실제 녹화 파일 URL

const files = {
    input : "recording.webm",
    output : "output.mp4",
    thumb : "thumbnail.jpg"
}

const downloadFile = (fileUrl, fileName) =>{
    const a = document.createElement("a");
    a.href = fileUrl;
    a.download = fileName;     //anchor의 download속성
    document.body.appendChild(a);
    a.click();        //anchor를 누른효과.
}

const handleDownload = async () => {

    actionBtn.removeEventListener("click", handleDownload);
    actionBtn.innerText = "Transcording....";
    actionBtn.disabled = true;

    const ffmpeg = createFFmpeg({corePath: 'https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js', log : true});
    await ffmpeg.load();

    ffmpeg.FS("writeFile", files.input, await fetchFile(videoFile));

    await ffmpeg.run("-i", files.input, "-r", "60", files.output);

    await ffmpeg.run("-i", files.input, "-ss", "00:00:01", "-frames:v" , "1", files.thumb);

    const mp4file = ffmpeg.FS("readFile", files.output);
    const thumbfile = ffmpeg.FS("readFile", files.thumb); 

    const mp4Blob = new Blob([mp4file.buffer], {type : "video/mp4"});
    const thumbBlob = new Blob([thumbfile.buffer], {type: "image/jpg"});

    const mp4Url = URL.createObjectURL(mp4Blob);
    const thumbUrl = URL.createObjectURL(thumbBlob);

    downloadFile(mp4Url, "MyRecording.mp4");
    downloadFile(thumbUrl, "MyThumbnail.jpg");

    ffmpeg.FS("unlink", files.input);
    ffmpeg.FS("unlink", files.output);
    ffmpeg.FS("unlink", files.thumb);

    URL.revokeObjectURL(videoFile);
    URL.revokeObjectURL(mp4Url);
    URL.revokeObjectURL(thumbUrl);

    actionBtn.innerText = "Recoring again";
    actionBtn.disabled = false;
    actionBtn.addEventListener("click", handleStart);
}

const handleStop = ()  => {
    actionBtn.innerText = "Download Recording";
    actionBtn.removeEventListener("click", handleStop);
    actionBtn.addEventListener("click", handleDownload);

    recorder.stop();
};

const handleStart = () => {
    actionBtn.innerText = "Stop Recording";
    actionBtn.removeEventListener("click", handleStart);
    actionBtn.addEventListener("click", handleStop);
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
        video: {
            width: 1024,
            height: 576,
          }, 
    });
    video.srcObject = stream;
    video.play();
};

init();
actionBtn.addEventListener("click", handleStart)