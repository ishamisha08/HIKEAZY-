import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'



const RelatedTrails = ({state,trailId}) => {

    const {trails} = useContext(AppContext)
    const navigate =useNavigate()

    const [relTrail,setRelTrails] = useState([])

    useEffect(()=>{
        if(trails.length > 0 && state){
            const trailsData =trails.filter((trail)=> trail.state === state && trail._id  !== trailId )
            setRelTrails(trailsData)
        }



    },[trails,state,trailId])

  return (
    <div className='flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10'>
    <h1 className='text-3xl font-medium mt-8'>Related Trails</h1>
    <div className='w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
      {relTrail.slice(0,5).map((item, index) => (
        <div
          onClick={() => {navigate(`/booking/${item._id}`); scrollTo(0,0)}}
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
    <button
      onClick={() => {
        navigate('/trails');
        scrollTo(0, 0);
      }}
      className='bg-red-100 text-gray-600 px-12 py-3 rounded-full mt-10'
    >
      more
    </button>
  </div>
  )
}

export default RelatedTrails