import { useContext } from "react";
// import CelebCard from "./CelebCard";
// import { useGlobalAxios } from "../hooks/useGlobalAxios";
// import background from "../assets/background.jpg";
import { RequestContext } from "../context/RequestContext";
import { useNavigate } from "react-router-dom";
function Celebs() {
  // const { data, loading, error } = useGlobalAxios(
  //   "get",
  //   "http://localhost:3001/celebs"
  // );

  // const shopByCategory = [
  //   {
  //     categoryName: "Actors",
  //     // img: "https://cy-vide-stream-imgfiles.s3.eu-west-2.amazonaws.com/categories/idris.jpg",
  //     img: "hello",
  //   },
  //   {
  //     categoryName: "Footballers",
  //     // img: "https://cy-vide-stream-imgfiles.s3.eu-west-2.amazonaws.com/categories/son.jpeg",
  //     img: "hello",
  //   },
  //   {
  //     categoryName: "Comedians",
  //     // img: "https://cy-vide-stream-imgfiles.s3.eu-west-2.amazonaws.com/categories/jack-whitehall.jpg",
  //     img: "hello",
  //   },
  //   {
  //     categoryName: "Kids",
  //     // img: "https://cy-vide-stream-imgfiles.s3.eu-west-2.amazonaws.com/categories/sponge-bob.png",
  //     img: "hello",
  //   },
  //   {
  //     categoryName: "Athletes",
  //     // img: "https://cy-vide-stream-imgfiles.s3.eu-west-2.amazonaws.com/categories/mo-farah.jpg",
  //     img: "hello",
  //   },
  //   {
  //     categoryName: "Reality TV",
  //     // img: "https://cy-vide-stream-imgfiles.s3.eu-west-2.amazonaws.com/categories/jeremy.jpg",
  //     img: "hello",
  //   },
  //   {
  //     categoryName: "Business",
  //     // img: "https://cy-vide-stream-imgfiles.s3.eu-west-2.amazonaws.com/categories/peter.jpg",
  //     img: "hello",
  //   },
  //   {
  //     categoryName: "View All",
  //     img: "",
  //   },
  // ];

  const { requests } = useContext(RequestContext);

  // const navigate = useNavigate();

  console.log("here", requests);
  return (
    <>
      <h1>hello World</h1>
    </>
  );
}

export default Celebs;
