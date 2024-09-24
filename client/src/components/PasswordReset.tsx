import { useAuth } from '@/context/AuthContext';
import React, { useState } from 'react'

function PasswordReset() {

    const [email, setEmail] = useState<string>("");
    const [message, setMessage] = useState<string>("")
  const { resetPassword } = useAuth();

  console.log("email: ", email)

      // reset password
  async function handleResetPassword() {
    try {
      await resetPassword(email);
      setMessage("A password reset link has been sent to your email");
    } catch (error) {
      console.log(error);
    }
  }
  return (
<div className="h-full bg-black w-full flex items-center justify-center">

  <div className=" w-1/3 max-w-md p-8 rounded-md shadow-lg flex flex-col items-center justify-center">
  {
    message ? 
    <p className="mb-6 text-md text-white text-center">
    
    {message}
    
       </p> :
    <>
    <h2 className="text-lg font-semibold mb-4 text-center text-white">Password Reset</h2>
    <p className="mb-6 text-sm text-white text-center">
    Enter your email, and we'll send you a reset link if your account is registered.
        </p>
    <form className="w-full">
      <label htmlFor="email" className="sr-only">Email</label>
      <input
        type="email"
        id="email"
        value={email}
        onChange={(e:React.ChangeEvent<HTMLInputElement>)=> setEmail(e.target.value)}
        className="w-full rounded border border-gray-300 bg-gray-100 px-4 py-2 mb-4 text-gray-700 outline-none  focus:bg-white"
        placeholder="Type Your Email"
        aria-label="Email"
        required
      />
      <button
      onClick={handleResetPassword}
        type="submit"
        className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 active:bg-blue-800 transition duration-150 ease-in-out"
      >
        Send Reset Link
      </button>
    </form>
    </>

  }

  </div>
</div>

  )
}

export default PasswordReset