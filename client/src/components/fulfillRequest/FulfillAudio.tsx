import { errorMessage } from "aws-sdk/clients/datapipeline";
import { Error } from "aws-sdk/clients/servicecatalog";
import React, { useRef, useState } from "react";

/* your mimeType, e.g., 'audio/wav' */
const mimeType = "audio/webm";

function FulfillAudio() {
  const [permission, setPermission] = useState(false);
  const [stream, setStream] = useState<any>(null);
  const mediaRecorder = useRef<any>(null);
  const [recordingStatus, setRecordingStatus] = useState("inactive");
  const [audioChunks, setAudioChunks] = useState([]);
  const [audio, setAudio] = useState(null);

  async function getMicrophonePermission() {
    if ("MediaRecorder" in window) {
      try {
        const streamData = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });

        setPermission(true);
        setStream(streamData);
      } catch (error: any) {
        alert(error.message);
      }
    } else {
      alert("The meidaRecorder API is not supported on your browser.");
    }
  }

  const startRecording = async () => {
    setRecordingStatus("recording");
    //create new Media recorder instance using the stream
    const media: any = new MediaRecorder(stream, { mimeType });
    //set the MediaRecorder instance to the mediaRecorder ref
    mediaRecorder.current = media;
    //invokes the start method to start the recording process
    mediaRecorder.current.start();
    let localAudioChunks: any = [];
    mediaRecorder.current.ondataavailable = (event: any) => {
      if (typeof event.data === "undefined") return;
      if (event.data.size === 0) return;
      localAudioChunks.push(event.data);
    };
    setAudioChunks(localAudioChunks);
  };

  const stopRecording = () => {
    setRecordingStatus("inactive");
    //stops the recording instance
    mediaRecorder.current.stop();
    mediaRecorder.current.onstop = () => {
      //creates a blob file from the audiochunks data
      const audioBlob = new Blob(audioChunks, { type: mimeType });
      //creates a playable URL from the blob file.
      const audioUrl: any = URL.createObjectURL(audioBlob);
      setAudio(audioUrl);
      setAudioChunks([]);
    };
  };
  return (
    <>
      <div className="audio-controls">
        {!permission ? (
          <button
            className="px-12 py-4 m-2 bg-red-800 rounded-md hover:bg-red-900"
            onClick={getMicrophonePermission}
            type="button"
          >
            Get Microphone
          </button>
        ) : null}
        {permission && recordingStatus === "inactive" ? (
          <button
            className="px-12 py-4 m-2 bg-red-800 rounded-md hover:bg-red-900"
            onClick={startRecording}
            type="button"
          >
            Start Recording
          </button>
        ) : null}
        {recordingStatus === "recording" ? (
          <button
            className="px-12 py-4 m-2 bg-red-800 rounded-md hover:bg-red-900"
            onClick={stopRecording}
            type="button"
          >
            Stop Recording
          </button>
        ) : null}
      </div>
      {audio ? (
        <div className="audio-container mt-10 flex  flex-col justify-center items-center ">
          <audio src={audio} controls className=" relative " />
          <a
            className="px-12 py-4 m-2 bg-red-800 rounded-md hover:bg-red-900 text-white"
            download
            href={audio}
          >
            Download Recording
          </a>
        </div>
      ) : null}
    </>
  );
}

export default FulfillAudio;
