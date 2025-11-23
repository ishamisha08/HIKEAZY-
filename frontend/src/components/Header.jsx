
import React, { useContext } from 'react';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';

const Header = () => {

  const {userData} = useContext(AppContext)
  
  return (
    <div 
      className='flex flex-col md:flex-row flex-wrap bg-primary rounded-lg px-6 md:px-10 lg:px-20 bg-cover bg-center' 
      style={{ backgroundImage: `url(${assets.img4})` }} // Setting background image
    >
      {/* Left side */}
      <div className='md:w-1/2 flex flex-col items-start justify-center gap-4 py-10 m-auto md:py-[10vw] md:mb-[-30px]'>
        <p className='text-3xl md:text-4xl lg:text-5xl text-white font-semibold leading-tight md:leading-tight lg:leadinh-tight'>
          Wander Beyond <br/> the Horizon
        </p>
        <p className='flex flex-col md:flex-row item-center gap-3 text-white text-md font-light'>
          Embrace the Adventure, Explore the Trails and Experience the Wild
        </p>

        <a href="#state" className='flex items-center gap-2 bg-white px-8 py-3 rounded-full text-grey-600 text-sm m-auto md:m-0 hover:scale-105 transition-all duration-300 '>
        View Trails <img className='w-3 h-auto' src={assets.arrow_icon} alt="" />
       </a>



      </div>

    </div>
  );
};

export default Header;
