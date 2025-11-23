import React, { useState, useContext } from 'react';
import { assets } from '../assets/assets';
import { NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const Navbar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const { userData, backendUrl, setUserData, setIsLoggedin,  isLoggedin, getUserData } = useContext(AppContext)

  const sendVerificationOtp = async () => {
    try {

      axios.defaults.withCredentials = true;
      
      const {data} = await axios.post(backendUrl +'/api/user/send-verify-otp')

      if(data.success){
        navigate('/email-verify')
        toast.success(data.message)
      }else{
        toast.error(data.message)
      }
      
    } catch (error) {
      toast.error(error.message)
    }
  
  }

const handleRestrictedNavigation = (path) => {
    if (isLoggedin && userData && userData.isAccountVerified) {
      navigate(path);
    } else {
      toast.error("You need to be Verified to access this page.");
    }
  };

  const menuItems = [
    { label: 'HOME', path: '/' },
    { label: 'ALL TRAILS', path: '/trails' },
    { label: 'LEADERBOARD', path: '/leaderboard' },
    { label: 'ABOUT', path: '/about' },
    { label: 'WEATHER', path: '/weather' },
  ];

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true
      const {data} = await axios.post(backendUrl + '/api/user/logout')
      data.success && setIsLoggedin(false)
      data.success && setUserData(false)
      navigate('/')
      
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleMenuClick = (path) => {
    setShowMenu(false);
    navigate(path);
  };

  return (
    <nav className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-grey-400">
      <img
        onClick={() => navigate('/')}
        className="w-40 cursor-pointer"
        src={assets.logo3}
        alt="Logo"
      />
      <ul className="hidden md:flex items-start gap-5 font-medium">
        {menuItems.map((item, index) => (
          <NavLink key={index} to={item.path}>
            <li className="py-1">{item.label}</li>
          </NavLink>
        ))}
      </ul>

      {userData ? (
        <div className="flex items-center gap-4">
          <div
            className="relative flex items-center gap-2 cursor-pointer"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <img className="w-8 rounded-full" src={userData.image || assets.default_image} alt="Profile" />
            <img className="w-5" src={assets.dropdown_icon} alt="Dropdown Icon" />
            <div
              role="menu"
              aria-hidden={!showDropdown}
              className={`absolute top-14 right-0 text-base font-medium bg-stone-100 rounded p-4 z-20 ${showDropdown ? 'block' : 'hidden'}`}
            >
              <p
                onClick={() => handleRestrictedNavigation('/my-profile')}
                className="text-black hover:text-red-400 cursor-pointer mb-2"
              >
                My Profile
              </p>
              <p
                onClick={() => handleRestrictedNavigation('/my-booking')}
                className="text-black hover:text-red-400 cursor-pointer mb-2"
              >
                My Booking
              </p>
              <p
                onClick={() => handleRestrictedNavigation('/chat')}
                className="text-black hover:text-red-400 cursor-pointer mb-2"
              >
                Chat
              </p>

              {!userData.isAccountVerified &&
                <p
                  onClick={sendVerificationOtp}
                  className="text-red-500 hover:text-red-800 cursor-pointer mb-2"
                >
                  Verify Email
                </p>
              }

              <p onClick={logout} className="text-black hover:text-red-400 cursor-pointer mb-2">
                Logout
              </p>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => navigate('/login')}
          className="bg-primary text-white px-7 py-3 rounded-full font-light hidden md:block"
        >
          Create Account
        </button>
      )}

      <img
        onClick={() => setShowMenu(true)}
        className="w-6 md:hidden"
        src={assets.menu_1}
        alt="Menu"
      />
      <div
        className={`fixed top-0 right-0 bottom-0 z-20 bg-white transition-transform duration-300 ${showMenu ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between px-5 py-6">
          <img className="w-40" src={assets.logo3} alt="Logo" />
          <img
            className="w-5"
            onClick={() => setShowMenu(false)}
            src={assets.close}
            alt="Close Menu"
          />
        </div>
        <ul className="flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                isActive ? 'text-primary py-1' : 'py-1 text-black'
              }
              onClick={() => handleMenuClick(item.path)}
            >
              {item.label}
            </NavLink>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;