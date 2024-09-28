import { useNavigate } from "react-router-dom";

type CelebCardProps = {
  account: null;
  category: string;
  celebid: number;
  description: string;
  displayname: string;
  document: string;
  document_with_idx: string;
  email: string;
  followers: number;
  imgurl: string;
  price: number;
  request_num: number;
  reviews: number;
  uid: string;
  username: string;
};

function CelebCard({ celeb, size }: { celeb: CelebCardProps; size?: number }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    // Pass information about the clicked celeb as state
    navigate(`/profile/${celeb.displayname}/${celeb.uid}`, {
      state: { celeb },
    });
  };

  // if (!celeb.price) {
  //   return;
  // }

  return (
    <div className="shadow-xl border border-gray-700 rounded-t-xl rounded-md card-zoom w-[18rem] sm:w-[20rem] h-[32rem] md:w-full  sm:h-[28rem]  text-white flex justify-center items-center  ">
      <div className="h-[85%] w-full overflow-hidden rounded-t-xl ">
        <img
          onClick={handleCardClick}
          src={celeb?.imgurl}
          className="card-zoom-image h-full w-full object-cover rounded-lg"
        />
      </div>
      <div className=" h-[35%] text-left left-1  relative pl-1 pt-2">
        <p>{celeb.displayname}</p>
        <p className="text-gray-500">{celeb?.category}</p>
        <p className="">⭐⭐⭐⭐</p>
        <p className="">£{celeb?.price?.toFixed(2)}</p>
      </div>
    </div>
  );
}
export default CelebCard;
