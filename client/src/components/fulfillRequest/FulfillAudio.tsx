import React, { useEffect, useRef, useState } from "react";
import { useS3Upload } from "../../hooks/useS3Upload";
interface FulfillRequestProps {
  reRecord: number;
  setCelebReply: React.Dispatch<React.SetStateAction<string | undefined>>;
}

/* your mimeType, e.g., 'audio/wav' */
const mimeType = "audio/webm";

function FulfillAudio({ reRecord, setCelebReply }: FulfillRequestProps) {
  const [permission, setPermission] = useState(true);
  const [stream, setStream] = useState<any>(null);
  const mediaRecorder = useRef<any>(null);
  const [recordingStatus, setRecordingStatus] = useState("inactive");
  const [audioChunks, setAudioChunks] = useState([]);
  const [audio, setAudio] = useState(null);

  // custom hooks
  const { uploadToS3 }: any = useS3Upload();

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

  const stopRecording = async () => {
    setPermission(false);
    setRecordingStatus("inactive");
    //stops the recording instance
    mediaRecorder.current.stop();
    mediaRecorder.current.onstop = async () => {
      //creates a blob file from the audiochunks data
      const audioBlob = new Blob(audioChunks, { type: mimeType });
      //creates a playable URL from the blob file.
      const audioUrl: any = URL.createObjectURL(audioBlob);

      const key = `audio/${Date.now()}.webm`;

      const params = {
        Bucket: "cy-vide-stream-imgfiles",
        Key: key,
        Body: audioBlob,
        ContentType: mimeType,
      };

      // Use the result from the hook, which is updated asynchronously
      const s3url = await uploadToS3(params);

      setCelebReply(s3url);

      setAudio(audioUrl);
      setAudioChunks([]);
    };
  };

  // use effect to get the microphone permission on componenet mount, better than having a seperate button for permission.
  useEffect(() => {
    getMicrophonePermission();
  }, [reRecord]);
  return (
    <>
      <div className="audio-controls">
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
          <>
            <button
              className="px-12 py-4 m-2 bg-red-800 rounded-md hover:bg-red-900"
              onClick={stopRecording}
              type="button"
            >
              Stop Recording
            </button>
            <p className="text-lg relative top-3">recording...</p>
          </>
        ) : null}
      </div>
      {audio ? (
        <div className="audio-container mt-10 flex  flex-col justify-center items-center ">
          <audio src={audio} controls className=" relative " />
          {/* <a
            className="px-12 py-4 m-2 bg-red-800 rounded-md hover:bg-red-900 text-white"
            download
            href={audio}
          >
            Download Recording
          </a> */}
        </div>
      ) : (
        <div className="audio-container mt-10 flex  flex-col justify-center items-center">
          <audio controls className=" relative " />
        </div>
      )}
    </>
  );
}

export default FulfillAudio;
