let stream = null,
	audio = null,
	mixedStream = null,
	chunks = [], 
	recorder = null
	startButton = null,
	stopButton = null,
	downloadButton = null,
	recordedVideo = null;

var stopbutton = document.querySelector(".stop-recording");

stopbutton.style.display="none";

async function setupStream () {
	try {
		stream = await navigator.mediaDevices.getDisplayMedia({
			video: true,
            audio: true
		});


		setupVideoFeedback();
	} catch (err) {
		console.error(err)
	}
}

function setupVideoFeedback() {
	if (stream) {
		const video = document.querySelector('.video-feedback');
		video.srcObject = stream;
        video.muted = true
		video.play();
	} else {
		console.warn('No stream available');
	}
}

async function startRecording () {
	await setupStream();

	if (stream) {
		mixedStream = new MediaStream([...stream.getTracks()]);
		recorder = new MediaRecorder(mixedStream);
		recorder.ondataavailable = handleDataAvailable;
		recorder.onstop = handleStop;
		recorder.start(1000);
		var recordbutton = document.querySelector(".start-recording");
		var stopbutton = document.querySelector(".stop-recording");
		var downloadbutton = document.querySelector(".download-video");

		recordbutton.style.display="none";
		stopbutton.style.display="block";
		downloadbutton.style.display="none";

	
		console.log('Recording started');
	} else {
		console.warn('No stream available.');
	}
}

function stopRecording () {
	recorder.stop();
	var recordbutton = document.querySelector(".start-recording");
	var stopbutton = document.querySelector(".stop-recording");
	var downloadbutton = document.querySelector(".download-video");
    recordbutton.style.display="inline-block";
    stopbutton.style.display="none";
	downloadbutton.style.display="inline-block";
}

function handleDataAvailable (e) {
	chunks.push(e.data);
}

function handleStop (e) {
	const blob = new Blob(chunks, { 'type' : 'video/mp4' });
	chunks = [];

	downloadButton.href = URL.createObjectURL(blob);
	downloadButton.download = 'cordview-video.mp4';
	downloadButton.disabled = false;
    downloadButton.classList.remove("hidden");



	stream.getTracks().forEach((track) => track.stop());

	console.log('Recording stopped');
}

window.addEventListener('load', () => {
	startButton = document.querySelector('.start-recording');
	stopButton = document.querySelector('.stop-recording');
	downloadButton = document.querySelector('.download-video');

	startButton.addEventListener('click', startRecording);
	stopButton.addEventListener('click', stopRecording);
})