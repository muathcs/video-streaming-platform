import { useNavigate } from "react-router-dom";

type CelebCardProps = {
  name: any;
  category: any;
  reviews: any;
  price: any;
  description: String;
  photoURl: string;
  uid: string;
};

function CelebCard({
  name,
  category,
  reviews,
  price,
  description,
  photoURl,
  uid,
}: CelebCardProps) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    // Pass information about the clicked celeb as state
    navigate("/profile", {
      state: { name, category, reviews, price, description, photoURl, uid },
    });
  };

  return (
    <div className="shadow-xl rounded-t-xl rounded-md card-zoom w-[20rem] h-[30rem]  text-white">
      <div className="h-[85%]   w-full overflow-hidden rounded-t-xl ">
        <img
          onClick={handleCardClick}
          src={photoURl}
          className="card-zoom-image h-full w-full object-cover rounded-lg"
        />
      </div>
      <div className=" h-[35%] text-left left-1  relative pl-1 pt-2">
        <p>{name}</p>
        <p className="text-gray-500">{category}</p>
        <p className="">⭐⭐⭐⭐</p>
        <p className="">£{price.toFixed(2)}</p>
      </div>
    </div>
  );
}
export default CelebCard;
