import React, { useContext, useEffect, useRef } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const EmailVerify = () => {
  axios.defaults.withCredentials = true;

  const { backendUrl, getUserData, isLoggedin, userData } = useContext(AppContext);
  const navigate = useNavigate();
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

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const otpArray = inputRefs.current.map((input) => input?.value || '');
    const otp = otpArray.join('');

    if (otp.length !== 6) {
      toast.error('Invalid OTP');
      return;
    }

    try {
      const { data } = await axios.post(`${backendUrl}/api/user/verify-account`, { otp });

      if (data.success) {
        toast.success(data.message);
        getUserData();
        navigate('/');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred');
    }
  };

  useEffect(()=>{
    isLoggedin && userData && userData.isAccountVerified && navigate ('/')
  })

  return (
    <form onSubmit={onSubmitHandler} className="min-h-screen flex items-center justify-center ">
      <div className="flex flex-col items-center gap-6 p-8 w-[90%] max-w-lg bg-gradient-to-br from-[#fdf6e3] to-[#f5e1c1] border border-[#e3c7a8] rounded-3xl shadow-lg">
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
          Verify Email
        </button>

      </div>
    </form>
  );
};

export default EmailVerify;
