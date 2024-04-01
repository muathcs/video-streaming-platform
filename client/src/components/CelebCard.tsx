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

function CelebCard({ celeb }: { celeb: CelebCardProps }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    // Pass information about the clicked celeb as state
    navigate("/profile", {
      state: { celeb },
    });
  };

  return (
    <div className="shadow-xl rounded-t-xl rounded-md card-zoom md:w-full md:h-full w-[12rem] h-[20rem]  text-white ">
      <div className="h-[85%]   w-full overflow-hidden rounded-t-xl ">
        <img
          onClick={handleCardClick}
          src={celeb.imgurl}
          className="card-zoom-image h-full w-full object-cover rounded-lg"
        />
      </div>
      <div className=" h-[35%] text-left left-1  relative pl-1 pt-2">
        <p>{celeb.displayname}</p>
        <p className="text-gray-500">{celeb.category}</p>
        <p className="">⭐⭐⭐⭐</p>
        <p className="">£{celeb.price.toFixed(2)}</p>
      </div>
    </div>
  );
}
export default CelebCard;
