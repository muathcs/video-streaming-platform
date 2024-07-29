import React, { useEffect, useRef, useState } from "react";
const mimeType = 'video/webm; codecs="opus,vp8"';

// type CelebReplyType = {
//   Bucket: string;
//   Key: string;
//   Body: any;
//   ContentType: string;
// };
interface FulfillRequestProps {
  reRecord: number;
  setCelebReply: React.Dispatch<React.SetStateAction<FormData | string>>;
}

function FulfillVideo({ reRecord, setCelebReply }: FulfillRequestProps) {
  //custom hooks
  // const { uploadToS3, s3FileUrl } = useS3Upload();
  const [permission, setPermission] = useState(true);

  const mediaRecorder = useRef<any>(null);

  const liveVideoFeed = useRef<any>(null);

  // const recordedVideoRef = useRef<any>(null);
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
        console.error("custom hook error", err);
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

  // useEffect(() => {
  //   if (s3FileUrl) {
  //     setCelebReply(s3FileUrl);
  //   }
  // }, [s3FileUrl]);

  const stopRecording = async () => {
    setPermission(false);
    setRecordingStatus("inactive");
    mediaRecorder.current.stop();

    mediaRecorder.current.onstop = async () => {
      const videoBlob = new Blob(videoChunks, { type: mimeType });

      const videoUrl = URL.createObjectURL(videoBlob);

      // Create a FormData object to send the Blob as a file
      const formData = new FormData();

      formData.append("videoFile", videoBlob, "videoFileName.mp4");

      setCelebReply(formData);

      setVideoChunks([]);

      setRecordedVideo(videoUrl);
    };
  };

  useEffect(() => {
    getCameraPermission();
  }, [reRecord]);

  return (
    <div className=" h-full">
      <main>
        <div className="video-controls">
          {permission && recordingStatus === "inactive" ? (
            <button
              className="px-12 py-4  bg-red-800 rounded-md hover:bg-red-900"
              onClick={() => {
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
              onClick={() => {
                stopRecording();
              }}
              type="button"
            >
              Stop Recording
            </button>
          ) : null}
        </div>
      </main>
      <p className="text-lg relative top-3">
        {recordingStatus == "recording" ? "recording..." : null}
      </p>

      <div className="video-player flex justify-center ">
        {!recordedVideo ? (
          <>
            <video
              ref={liveVideoFeed}
              autoPlay
              className="live-player  my-5  rounded-md border border-gray-700 shadow-md shadow-red-50"
            ></video>
          </>
        ) : (
          <>
            <div>
              <p>Press Fulfill to send the video</p>
              <video
                src={recordedVideo}
                controls
                className="live-player  my-5 rounded-md border border-gray-700 shadow-md shadow-red-50 "
              ></video>
            </div>
          </>
        )}
        {/* {recordedVideo ? (
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
        ) : null} */}
      </div>
    </div>
  );
}

export default FulfillVideo;
