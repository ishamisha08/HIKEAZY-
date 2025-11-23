import React, { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'
import { TrailContext } from '../context/TrailContext'

const Sidebar = () => {

    const { aToken } = useContext(AdminContext)
    const { cToken } = useContext(TrailContext)

    return (
        <div className="min-h-[500vh] bg-white border-r flex flex-col p-4">

            {
                aToken && <ul className='text-[#515151] mt-5'>


                    <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`} to={'/admin-dashboard'}>
                        <img className='w-7 h-7' src={assets.home} alt="" />
                        <p className='hidden md:block'>Dashboard</p>
                    </NavLink>

                    <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`} to={'/all-bookings'}>
                        <img className='w-7 h-7' src={assets.booking} alt="" />
                        <p className='hidden md:block'>Bookings</p>
                    </NavLink>

                    <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`} to={'/add-trail'}>
                        <img src={assets.add_icon} alt="" />
                        <p className='hidden md:block'>Add Hiking Coordinator</p>
                    </NavLink>

                    <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`} to={'/trail-list'}>
                        <img src={assets.people_icon} alt="" />
                        <p className='hidden md:block'>All Trails</p>
                    </NavLink>


                </ul>
            }



            {
                cToken && <ul className='text-[#515151] mt-5'>


                    <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`} to={'/coordinator-dashboard'}>
                        <img className='w-7 h-7' src={assets.home} alt="" />
                        <p className='hidden md:block'>Dashboard</p>
                    </NavLink>

                    <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`} to={'/coordinator-bookings'}>
                        <img className='w-7 h-7' src={assets.booking} alt="" />
                        <p className='hidden md:block'>Bookings</p>
                    </NavLink>


                    <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`} to={'/coordinator-profile'}>
                        <img src={assets.people_icon} alt="" />
                        <p className='hidden md:block'>Profile</p>
                    </NavLink>


                </ul>
            }


        </div>
    )
}

export default Sidebar