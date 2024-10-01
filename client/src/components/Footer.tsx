function Footer() {
    return (
      <div className="w-full flex justify-center    bg-black border-t-[0.5px] border-gray-600 py-5   ">
        <div className="max-w-7xl w-full px-4">
          <div className="text-center">
            {/* Branding */}
            <p className="bg-gradient-to-r from-[#BA58E8] to-white text-transparent bg-clip-text mb-4 text-xl font-semibold">
              Cameo
            </p>
            {/* Slogan */}
            <p className="w-full md:w-80 mx-auto text-lg font-semibold leading-6">
              Get Personal Shoutouts from Celebrities, Made Just for You!
            </p>
  
            {/* Call to Action */}
            <div className="mt-4">
              <button className="bg-gradient-to-r from-[#BA58E8] to-[#6258E8] rounded-full py-2 px-6 font-semibold mr-4 hover:shadow-lg transition">
                Join as Talent
              </button>
              <button className="bg-gradient-to-r from-[#BA58E8] to-[#6258E8] rounded-full py-2 px-6 font-semibold hover:shadow-lg transition">
                Log in
              </button>
            </div>
  
            {/* Social Proof */}
            <div className="mt-10">
              <h3 className="text-2xl font-semibold">Trusted by Thousands</h3>
              <p className="mt-2 text-sm text-gray-600">
                Join over 50,000 satisfied users who have received personal
                shoutouts from their favorite celebrities.
              </p>
            </div>
  
            {/* Footer Links */}
            <div className="mt-10 flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-8">
              <a href="#" className="text-sm font-semibold hover:text-[#BA58E8]">
                About Us
              </a>
              <a href="#" className="text-sm font-semibold hover:text-[#BA58E8]">
                Help Center
              </a>
              <a href="#" className="text-sm font-semibold hover:text-[#BA58E8]">
                Privacy Policy
              </a>
              <a href="#" className="text-sm font-semibold hover:text-[#BA58E8]">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }


  export default Footer