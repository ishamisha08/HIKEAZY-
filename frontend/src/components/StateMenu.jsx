import React from 'react';
import { trailsData } from '../assets/assets';
import { Link } from 'react-router-dom';

const StateMenu = () => {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-gray-800" id="state">
      <h1 className="text-3xl font-medium">Find by State</h1>
      <p className="sm:w-1/3 text-center text-sm">
        Browse our extensive list of trails, book your adventure, and enjoy an unforgettable holiday!
      </p>

      {/* Scrollable container */}
      <div className="w-full overflow-x-auto">
        <div className="flex gap-4 pt-5" style={{ width: `${trailsData.length * 100}px` }}>
          {trailsData.map((item, index) => (
            <Link 
              onClick={() => scrollTo(0, 0)} 
              className="flex flex-col items-center text-xs cursor-pointer flex-shrink-0 hover:translate-y-[-10px] transition-all duration-500" 
              key={index} 
              to={`/trails/${item.state}`}
              style={{ minWidth: '100px' }} // Set a minimum width for each state
            >
              <img className="w-16 sm:w-24 mb-2" src={item.image} alt={item.state} />
              <p>{item.state}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StateMenu;
