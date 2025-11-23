import React, { useContext, useEffect } from 'react';
import { assets, leaderboard } from '../assets/assets';
import { AppContext } from '../context/AppContext';

const Leaderboard = () => {
  const { leaderboard, getLeaderboard } = useContext(AppContext);

  useEffect(() => {
    getLeaderboard(); // Fetch leaderboard data on mount
  }, []);

  const sortedHikers = leaderboard.slice(0); // Clone leaderboard
  const podiumHikers = sortedHikers.slice(0, 3); // Top 3 hikers
  const topTenHikers = sortedHikers.slice(3, 10); // Remaining top 10

  return (
    <div className="flex flex-col items-center py-16 bg-gradient-to-b from-gray-700 to-gray-900 min-h-screen text-gray-200">
      <h1 className="text-6xl font-extrabold mb-12 tracking-wide text-yellow-400 drop-shadow-lg">
        Leaderboard
      </h1>
      <div className="flex flex-col md:flex-row gap-12 justify-center items-end">
        
        {/* Second Place */}
        <div className="relative flex flex-col items-center bg-gradient-to-t from-gray-100 via-gray-300 to-gray-100 rounded-3xl w-60 h-80 shadow-xl p-6 transform hover:scale-105 transition-transform duration-300">
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-gray-400 mb-4">
            <img
              src={podiumHikers[1]?.image}
              alt={podiumHikers[1]?.name}
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-xl font-semibold text-gray-800 text-center">
            {podiumHikers[1]?.name || 'N/A'}
          </p>
          <div className="flex items-center mt-2">
            <img
              src={assets.points}
              alt="Points Icon"
              className="w-8 h-8 mr-2"
            />
            <p className="text-lg text-gray-700">{podiumHikers[1]?.points || 0} pts</p>
          </div>
          <img
            src={assets.trophy_silver}
            alt="Silver Trophy"
            className="absolute bottom-6 w-16"
          />
        </div>

        {/* First Place */}
        <div className="relative flex flex-col items-center bg-gradient-to-t from-yellow-400 via-yellow-300 to-yellow-200 rounded-3xl w-72 h-96 shadow-2xl p-6 transform hover:scale-110 transition-transform duration-300">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-yellow-600 mb-6">
            <img
              src={podiumHikers[0]?.image}
              alt={podiumHikers[0]?.name}
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-xl font-bold text-gray-900 text-center">
            {podiumHikers[0]?.name || 'N/A'}
          </p>
          <div className="flex items-center mt-4">
            <img
              src={assets.points}
              alt="Points Icon"
              className="w-8 h-8 mr-3"
            />
            <p className="text-2xl text-gray-800">{podiumHikers[0]?.points || 0} pts</p>
          </div>
          <img
            src={assets.trophy_gold}
            alt="Gold Trophy"
            className="absolute bottom-6 w-20"
          />
        </div>

        {/* Third Place */}
        <div className="relative flex flex-col items-center bg-gradient-to-t from-orange-300 via-orange-200 to-orange-100 rounded-3xl w-60 h-80 shadow-xl p-6 transform hover:scale-105 transition-transform duration-300">
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-orange-400 mb-4">
            <img
              src={podiumHikers[2]?.image || assets.default_image}
              alt={podiumHikers[2]?.name}
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-xl font-semibold text-gray-800 text-center">
            {podiumHikers[2]?.name || 'N/A'}
          </p>
          <div className="flex items-center mt-2">
            <img
              src={assets.points}
              alt="Points Icon"
              className="w-8 h-8 mr-2"
            />
            <p className="text-lg text-gray-700">{podiumHikers[2]?.points || 0} pts</p>
          </div>
          <img
            src={assets.trophy_bronze}
            alt="Bronze Trophy"
            className="absolute bottom-6 w-16"
          />
        </div>
      </div>

      {/* Top Ten List */}
      <div className="mt-16 w-full max-w-4xl">
        <h2 className="text-3xl font-bold mb-6 text-yellow-400 tracking-wide drop-shadow-lg">
          Top 10 Hikers
        </h2>
        <ul className="space-y-4">
          {topTenHikers.map((hiker, index) => (
            <li
              key={index}
              className="flex items-center bg-gray-800 rounded-lg p-4 shadow-md hover:bg-gray-700 transition-colors"
            >
              <div className="text-xl font-bold text-yellow-400 w-12">{index + 4}</div>
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-600 mr-4">
                <img
                  src={hiker.image}
                  alt={hiker.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="text-lg font-semibold text-gray-100">{hiker.name}</p>
              </div>
              <div className="text-lg text-gray-300">{hiker.points} pts</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Leaderboard;
