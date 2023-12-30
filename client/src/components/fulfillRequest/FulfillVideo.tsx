import React, { useEffect, useReducer, useRef, useState } from "react";
const mimeType = 'video/webm; codecs="opus,vp8"';

function FulfillVideo() {
  const [permission, setPermission] = useState(true);

  const mediaRecorder = useRef<any>(null);

  const liveVideoFeed = useRef<any>(null);

  const [recordingStatus, setRecordingStatus] = useState("inactive");

  const [stream, setStream] = useState<any>(null);

  const [recordedVideo, setRecordedVideo] = useState<any>(null);

  const [videoChunks, setVideoChunks] = useState([]);

  const getCameraPermission = async () => {
    setRecordedVideo(null);
    //get video and audio permissions and then stream the result media stream to the videoSrc variable
    if ("MediaRecorder" in window) {
      try {
        const videoConstraints = {
          audio: false,
          video: true,
        };
        const audioConstraints = { audio: true };

        // create audio and video streams separately
        const audioStream = await navigator.mediaDevices.getUserMedia(
          audioConstraints
        );
        const videoStream = await navigator.mediaDevices.getUserMedia(
          videoConstraints
        );

        setPermission(true);

        //combine both audio and video streams

        const combinedStream = new MediaStream([
          ...videoStream.getVideoTracks(),
          ...audioStream.getAudioTracks(),
        ]);

        setStream(combinedStream);

        //set videostream to live feed player
        liveVideoFeed.current.srcObject = videoStream;
      } catch (err: any) {
        alert(err.message);
      }
    } else {
      alert("The MediaRecorder API is not supported in your browser.");
    }
  };

  const startRecording = async () => {
    setRecordingStatus("recording");

    const media = new MediaRecorder(stream, { mimeType });

    mediaRecorder.current = media;

    mediaRecorder.current.start();

    let localVideoChunks: any = [];

    mediaRecorder.current.ondataavailable = (event: any) => {
      if (typeof event.data === "undefined") return;
      if (event.data.size === 0) return;
      localVideoChunks.push(event.data);
    };

    setVideoChunks(localVideoChunks);
  };

  const stopRecording = () => {
    setPermission(false);
    setRecordingStatus("inactive");
    mediaRecorder.current.stop();

    mediaRecorder.current.onstop = () => {
      const videoBlob = new Blob(videoChunks, { type: mimeType });
      const videoUrl = URL.createObjectURL(videoBlob);

      setRecordedVideo(videoUrl);

      setVideoChunks([]);
    };
  };

  return (
    <div>
      <h2 className="">Video Recorder</h2>
      <main>
        <div className="video-controls">
          {permission && recordingStatus === "inactive" ? (
            <button
              className="px-12 py-4  bg-red-800 rounded-md hover:bg-red-900"
              onClick={(e) => {
                getCameraPermission();
                startRecording();
              }}
              type="button"
            >
              Start Recording
            </button>
          ) : null}
          {recordingStatus === "recording" ? (
            <button
              className="px-12 py-4  bg-red-800 rounded-md hover:bg-red-900"
              onClick={(e) => {
                getCameraPermission();
                startRecording();
              }}
              type="button"
            >
              Stop Recording
            </button>
          ) : null}
        </div>
      </main>

      <div className="video-player flex justify-center ">
        {!recordedVideo ? (
          <video ref={liveVideoFeed} autoPlay className="live-player"></video>
        ) : null}
        {recordedVideo ? (
          <div className="  flex justify-center flex-col items-center">
            <video className="recorded   " src={recordedVideo} controls />
            <a
              className="bg-red-800 w-24 rounded-md p-5 px-20 flex justify-center items-center text-white relative top-6 "
              download
              href={recordedVideo}
            >
              Download Recording
            </a>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default FulfillVideo;
