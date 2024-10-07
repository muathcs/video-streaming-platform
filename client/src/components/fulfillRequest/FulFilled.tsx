import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Modal from "../Modal";
import ReviewInput from "../ReviewInput";
import { RequestType } from "@/TsTypes/types";
import { apiUrl } from "@/utilities/fetchPath";
import axios from "@/api/axios";
import { FaDownload, FaStar } from "react-icons/fa";

function FulFilled() {
  const [openModal, setOpenModal] = useState(false);
  const [reviewMessage, setReviewMessage] = useState<string>("");
  const [rated, setRated] = useState<number>();
  const [loading, setLoading] = useState(true);
  const [request, setRequest] = useState<RequestType | null>(null);
  const [celeb, setCeleb] = useState<any>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;

  useEffect(() => {
    if (!state) {
      navigate("/");
      return;
    }

    setRequest(state.request);
    setCeleb(state.celeb);

    const getReview = async () => {
      if (!state.request.isReviewed) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get<{ message: string; rating: number }>(
          `${apiUrl}/reviews/${state.request.requestid}`
        );

        setReviewMessage(response.data.message);
        setRated(response.data.rating);
      } catch (error) {
        console.error("Failed to fetch review:", error);
      } finally {
        setLoading(false);
      }
    };

    getReview();
  }, [state, navigate]);

  if (loading) {
    return <div className="text-white text-center py-10">Loading...</div>;
  }

  if (!request || !celeb) {
    return null;
  }

  function downloadVideo() {
    const link = document.createElement("a");
    link.href = request.celebmessage;
    link.download = `${celeb.displayname}_video_${request.requestid}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Your Fulfilled Request</h1>
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Request Details</h2>
            <p className="mb-2">You requested a {request.reqtype} from {celeb.displayname} on {new Date(request.timestamp1).toLocaleDateString()}.</p>
            <p className="mb-2">Request ID: {request.requestid}</p>
            <p className="text-sm text-gray-400">If there's an issue with your request, please contact our customer support.</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Your {request.reqtype}</h2>
            {request.reqtype === "video" ? (
              <video
                className="w-full rounded-lg"
                src={request.celebmessage}
                controls
                poster="/path-to-thumbnail-image.jpg"
              />
            ) : (
              <div className="text-center text-red-500">
                <p>Something went wrong. The content type is not supported.</p>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <button
              onClick={downloadVideo}
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 rounded-md transition duration-300 ease-in-out flex items-center justify-center"
            >
              <FaDownload className="mr-2" /> Download Video
            </button>
            <button
              onClick={() => setOpenModal(true)}
              className="flex-1 py-3 bg-yellow-600 hover:bg-yellow-700 rounded-md transition duration-300 ease-in-out flex items-center justify-center"
            >
              <FaStar className="mr-2" /> {!request.isReviewed ? "Leave a Review" : "Edit Review"}
            </button>
          </div>

          {request.isReviewed && (
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Your Review</h2>
              <p className="mb-2">Rating: {rated} / 5</p>
              <p>"{reviewMessage}"</p>
            </div>
          )}
        </div>
      </div>

      <Modal openModal={openModal} setOpenModal={setOpenModal}>
        <ReviewInput
          requestid={request.requestid}
          setOpenModal={setOpenModal}
          celebuid={request.celebuid}
          fanuid={request.fanuid}
          date={request.timestamp1}
          event={request.reqaction}
          isReviewed={request.isReviewed}
          reviewMessage={reviewMessage}
          setReviewMessage={setReviewMessage}
          rated={rated}
          setRated={setRated}
        />
      </Modal>
    </div>
  );
}

export default FulFilled;
