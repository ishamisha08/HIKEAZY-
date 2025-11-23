import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Trails = () => {
  const { state } = useParams();
  const [filterTrail, setFilterTrail] = useState([]);
  const [ showFilter, setShowFilter ] = useState(false)
  const navigate = useNavigate();
  const { trails } = useContext(AppContext);

  const applyFilter = () => {
    if (state) {
      setFilterTrail(trails.filter(trail => trail.state === state));
    } else {
      setFilterTrail(trails);
    }
  };

  useEffect(() => {
    applyFilter();
  }, [trails, state]);

  return (
    <div>
      <p className='text-gray-600'>Browse through state.</p>
      <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
        <button
          className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${showFilter ? 'bg-primary text-white' : ''}`}
          onClick={() => setShowFilter(prev => !prev)}
        >
          Filters
        </button>

        <div className={`flex-col gap-4 text-sm text-gray-600 ${showFilter ? 'flex' : 'hidden sm:flex'}`}>
          <p
            onClick={() => (state === 'Sabah' ? navigate('/trails') : navigate('/trails/Sabah'))}
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${state === "Sabah" ? "bg-red-100 text-black" : ""}`}
          >
            Sabah
          </p>
          <p
            onClick={() => (state === 'Sarawak' ? navigate('/trails') : navigate('/trails/Sarawak'))}
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${state === "Sarawak" ? "bg-red-100 text-black" : ""}`}
          >
            Sarawak
          </p>
          <p
            onClick={() => (state === 'Terengganu' ? navigate('/trails') : navigate('/trails/Terengganu'))}
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${state === "Terengganu" ? "bg-red-100 text-black" : ""}`}
          >
            Terengganu
          </p>
          <p
            onClick={() => (state === 'Selangor' ? navigate('/trails') : navigate('/trails/Selangor'))}
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${state === "Selangor" ? "bg-red-100 text-black" : ""}`}
          >
            Selangor
          </p>
          <p
            onClick={() => (state === 'Pulau Pinang' ? navigate('/trails') : navigate('/trails/Pulau Pinang'))}
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${state === "Pulau Pinang" ? "bg-red-100 text-black" : ""}`}
          >
            Pulau Pinang
          </p>
          <p
            onClick={() => (state === 'Perlis' ? navigate('/trails') : navigate('/trails/Perlis'))}
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${state === "Perlis" ? "bg-red-100 text-black" : ""}`}
          >
            Perlis
          </p>
          <p
            onClick={() => (state === 'Perak' ? navigate('/trails') : navigate('/trails/Perak'))}
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${state === "Perak" ? "bg-red-100 text-black" : ""}`}
          >
            Perak
          </p>
          <p
            onClick={() => (state === 'Pahang' ? navigate('/trails') : navigate('/trails/Pahang'))}
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${state === "Pahang" ? "bg-red-100 text-black" : ""}`}
          >
            Pahang
          </p>
          <p
            onClick={() => (state === 'Negeri Sembilan' ? navigate('/trails') : navigate('/trails/Negeri Sembilan'))}
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${state === "Negeri Sembilan" ? "bg-red-100 text-black" : ""}`}
          >
            Negeri Sembilan
          </p>
          <p
            onClick={() => (state === 'Melaka' ? navigate('/trails') : navigate('/trails/Melaka'))}
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${state === "Melaka" ? "bg-red-100 text-black" : ""}`}
          >
            Melaka
          </p>
          <p
            onClick={() => (state === 'Kelantan' ? navigate('/trails') : navigate('/trails/Kelantan'))}
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${state === "Kelantan" ? "bg-red-100 text-black" : ""}`}
          >
            Kelantan
          </p>
          <p
            onClick={() => (state === 'Kedah' ? navigate('/trails') : navigate('/trails/Kedah'))}
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${state === "Kedah" ? "bg-red-100 text-black" : ""}`}
          >
            Kedah
          </p>
          <p
            onClick={() => (state === 'Johor' ? navigate('/trails') : navigate('/trails/Johor'))}
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${state === "Johor" ? "bg-red-100 text-black" : ""}`}
          >
            Johor
          </p>
          <p
            onClick={() => (state === 'Wilayah Persekutuan' ? navigate('/trails') : navigate('/trails/Wilayah Persekutuan'))}
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${state === "Wilayah Persekutuan" ? "bg-red-100 text-black" : ""}`}
          >
            Wilayah Persekutuan
          </p>
        </div>

        {/* Trails at the right side */}
        <div className='w-full grid grid-cols-auto gap-4 gap-y-6'>
          {filterTrail.map((item, index) => (
            <div
              onClick={() => navigate(`/booking/${item._id}`)}
              className='border border-red-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500'
              key={index}
            >
              <img
                className='w-full h-72 object-cover'
                src={Array.isArray(item.image) ? item.image[0] : item.image}
                alt={item.name}
              />
              <div className='p-4'>
                <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
                <p className='text-gray-600 text-sm'>{item.state}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Trails;
