import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';

const Login = () => {

  const navigate = useNavigate(); 

  const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContext);

  const [region, setRegion] = useState('Sign Up');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onSubmitHandler = async (event) => {

    try{
      event.preventDefault()

      axios.defaults.withCredentials = true

      if (region == 'Sign Up') {

        const {data} = await axios.post(backendUrl + '/api/user/register',{name, email, password})

        if (data.success){
          setIsLoggedin(true)
          getUserData()
          navigate('/')
        }else {
          toast.error(data.message)
        }

      }else {
        const {data} = await axios.post(backendUrl + '/api/user/login',{ email, password})

        if (data.success){
          setIsLoggedin(true)
          getUserData()
          navigate('/')
        }else {
          toast.error(data.message)
        }

      }


    }catch (error){
      toast.error(error.message)


    }

  }




  return (
    <form onSubmit={onSubmitHandler} className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col gap-6 items-center p-8 w-[90%] max-w-lg bg-gradient-to-br from-[#fdf6e3] to-[#f5e1c1] border border-[#e3c7a8] rounded-3xl text-gray-800 shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold">{region === 'Sign Up' ? 'Join Us at Hikeazy' : 'Welcome Back!'}</h1>
          <p className="text-sm mt-2 text-gray-600">
            {region === 'Sign Up' ? 'Start your journey with a new account!' : 'Log in to access your account.'}
          </p>
        </div>

        {region === 'Sign Up' && (
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <div className="flex items-center gap-2 border border-[#e3c7a8] rounded-lg p-3 focus-within:ring-2 focus-within:ring-[#eadaba]">
              <img src={assets.person_icon} alt="Full Name Icon" className="w-5 h-5 text-gray-500" />
              <input
                type="text"
                onChange={(e) => setName(e.target.value)}
                value={name}
                required
                className="flex-1 outline-none text-gray-800 placeholder-gray-400 bg-transparent"
                placeholder="Enter your full name"
              />
            </div>
          </div>
        )}

        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <div className="flex items-center gap-2 border border-[#e3c7a8] rounded-lg p-3 focus-within:ring-2 focus-within:ring-[#eadaba]">
            <img src={assets.mail_icon} alt="Email Icon" className="w-5 h-5 text-gray-500" />
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
              className="flex-1 outline-none text-gray-800 placeholder-gray-400 bg-transparent"
              placeholder="Enter your email"
            />
          </div>
        </div>

        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <div className="flex items-center gap-2 border border-[#e3c7a8] rounded-lg p-3 focus-within:ring-2 focus-within:ring-[#eadaba]">
            <img src={assets.lock_icon} alt="Password Icon" className="w-5 h-5 text-gray-500" />
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
              className="flex-1 outline-none text-gray-800 placeholder-gray-400 bg-transparent"
              placeholder="Enter your password"
            />
          </div>
        </div>

        <p
          onClick={() => navigate('/reset-password')}
          className="text-[#b98c62] underline cursor-pointer hover:text-[#a57a53] transition self-start mt-2"
        >
          Forgot password?
        </p>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full ${
            isLoading ? 'bg-[#FF7F50]/70' : 'bg-[#FF7F50]'
          } hover:bg-[#FF4500] text-white py-2 rounded-lg text-sm font-medium shadow-md transition duration-300`}
        >
          {isLoading ? 'Processing...' : region === 'Sign Up' ? 'Create Account' : 'Login'}
        </button>

        <div className="text-center text-sm">
          {region === 'Sign Up' ? (
            <p>
              Already have an account?{' '}
              <span
                onClick={() => setRegion('Login')}
                className="text-[#b98c62] underline cursor-pointer hover:text-[#a57a53] transition"
              >
                Login here
              </span>
            </p>
          ) : (
            <p>
              Don’t have an account?{' '}
              <span
                onClick={() => setRegion('Sign Up')}
                className="text-[#b98c62] underline cursor-pointer hover:text-[#a57a53] transition"
              >
                Create one
              </span>
            </p>
          )}
        </div>
      </div>
    </form>
  );
};

export default Login;

