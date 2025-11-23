import React, { useContext, useState, useRef } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify';


const ResetPassword = () => {

  const { backendUrl } = useContext(AppContext)

  axios.defaults.withCredentials = true

  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false)

  const inputRefs = useRef([]);

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text').slice(0, 6); // Limit to 6 characters
    const pasteArray = paste.split('');
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  const onSubmitEmail = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post(backendUrl + '/api/user/send-reset-otp', { email })
      data.success ? toast.success(data.message) : toast.error(data.message)
      data.success && setIsEmailSent(true)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const onSubmitOTP = async (e) => {
    e.preventDefault()
    const otpArray = inputRefs.current.map(e => e.value)
    setOtp(otpArray.join(''))
    setIsOtpSubmitted(true)
  }

  const onSubmitNewPassword = async (e) => {
    e.preventDefault()

    try {
      const { data } = await axios.post(backendUrl + '/api/user/reset-password', { email, otp, newPassword })
      data.success ? toast.success(data.message) : toast.error(data.message)
      data.success && navigate('/login')
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      {!isEmailSent &&
        <form onSubmit={onSubmitEmail} className="flex flex-col items-center gap-6 p-8 w-[90%] max-w-lg bg-gradient-to-br from-[#fdf6e3] to-[#f5e1c1] border border-[#e3c7a8] rounded-3xl shadow-lg">
          <h1 className="text-2xl font-bold text-gray-800">Reset Password</h1>
          <p className="text-sm font-medium text-gray-600 text-center">Enter your registered email address.</p>
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <div className="flex items-center gap-2 border border-[#e3c7a8] rounded-lg p-3 focus-within:ring-2 focus-within:ring-[#eadaba]">
              <img src={assets.mail_icon} alt="Email Icon" className="w-5 h-5 text-gray-500" />
              <input
                type="email" value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 outline-none text-gray-800 placeholder-gray-400 bg-transparent"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <button className="w-full bg-[#FF7F50] hover:bg-[#FF4500] text-white py-2 rounded-lg text-sm font-medium shadow-md transition duration-300">  Submit  </button>
        </form>
      }

      {/*otp input form */}
      {!isOtpSubmitted && isEmailSent &&
        <form onSubmit={onSubmitOTP} className="flex flex-col items-center gap-6 p-8 w-[90%] max-w-lg bg-gradient-to-br from-[#fdf6e3] to-[#f5e1c1] border border-[#e3c7a8] rounded-3xl shadow-lg">
          <h1 className="text-2xl font-bold text-gray-800">Verify Your Email</h1>
          <p className="text-sm font-medium text-gray-600 text-center">
            Please enter the 6-digit code we sent to your email address.
          </p>
          <div className="flex justify-center gap-3" onPaste={handlePaste}>
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  required
                  className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  ref={(el) => (inputRefs.current[index] = el)}
                  onInput={(e) => handleInput(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ))}
          </div>
          <button
            type="submit"
            className="mt-4 px-6 py-3 bg-[#333A5C] text-white font-medium rounded-lg shadow-md hover:bg-[#1f283e] transition duration-200"
          >
            Submit
          </button>
        </form>
      }


      {/*enter new password*/}
      {isOtpSubmitted && isEmailSent &&
        <form onSubmit={onSubmitNewPassword} className="flex flex-col items-center gap-6 p-8 w-[90%] max-w-lg bg-gradient-to-br from-[#fdf6e3] to-[#f5e1c1] border border-[#e3c7a8] rounded-3xl shadow-lg">
          <h1 className="text-2xl font-bold text-gray-800">New Password</h1>
          <p className="text-sm font-medium text-gray-600 text-center">Enter your new password.</p>
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <div className="flex items-center gap-2 border border-[#e3c7a8] rounded-lg p-3 focus-within:ring-2 focus-within:ring-[#eadaba]">
              <img src={assets.lock_icon} alt="Email Icon" className="w-5 h-5 text-gray-500" />
              <input
                type="password" value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="flex-1 outline-none text-gray-800 placeholder-gray-400 bg-transparent"
                placeholder="Enter your new password"
              />
            </div>
          </div>

          <button className="w-full bg-[#FF7F50] hover:bg-[#FF4500] text-white py-2 rounded-lg text-sm font-medium shadow-md transition duration-300">  Submit  </button>
        </form>
      }
    </div>
  )
}

export default ResetPassword