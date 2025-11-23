import React, { useContext } from 'react';
import { assets } from '../assets/assets'
import { AdminContext } from '../context/AdminContext'
import { useNavigate } from 'react-router-dom';
import { TrailContext } from '../context/TrailContext';

const Navbar = () => {

    const {aToken,setAToken} = useContext(AdminContext)
    const {cToken,setCToken} = useContext(TrailContext)

    const navigate = useNavigate()

    const logout = () => {
        navigate('/')
        aToken && setAToken ('')
        aToken && localStorage.removeItem('aToken')
        cToken && setCToken ('')
        cToken && localStorage.removeItem('cToken')
    }

    return (
        <div className='flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white'>
            <div className='flex items-center gap-2 text-xs'>
                <img className='w-36 sm:w-40 cursor-pointer' src={assets.logo} alt="" />
                <p className='border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-500'>{aToken ? 'Admin' : 'Hiking Coordinator'}</p>
            </div>

            <button onClick={logout} className='bg-primary text-white text-sm px-10 py-2 rounded-full'>Logout</button>

        </div>
    )
}

export default Navbar