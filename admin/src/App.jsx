import React, { useContext } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AdminContext } from './context/AdminContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Admin/Dashboard';
import AddTrail from './pages/Admin/AddTrail';
import AllBooking from './pages/Admin/AllBooking';
import TrailsList from './pages/Admin/TrailsList';
import Login from './pages/Login';
import { TrailContext } from './context/TrailContext';
import CoordinatorDashboard from './pages/HikingCoordinator/CoordinatorDashboard';
import CoordinatorBooking from './pages/HikingCoordinator/CoordinatorBooking';
import CoordinatorProfile from './pages/HikingCoordinator/CoordinatorProfile';

const App = () => {

  const { aToken } = useContext(AdminContext)
  const { cToken } = useContext(TrailContext)

  return aToken || cToken ? (
    <div className='bg-[#F8F9FD]'>

      <ToastContainer />
      <Navbar />
      <div className='flex items-start'>
        <Sidebar />
        <Routes>
          {/*Admin Route */}
          <Route path='/' element={<></>} />
          <Route path='/admin-dashboard' element={<Dashboard/>} />
          <Route path='/all-bookings' element={<AllBooking/>} />
          <Route path='/add-trail' element={<AddTrail/>} />
          <Route path='/trail-list' element={<TrailsList/>} />
          
          {/*Hiking Coordinator Route*/}
          <Route path='/coordinator-dashboard' element={<CoordinatorDashboard/>} />
          <Route path='/coordinator-bookings' element={<CoordinatorBooking/>} />
          <Route path='/coordinator-profile' element={<CoordinatorProfile/>} />
        </Routes>
      </div>

    </div>
  ) : (
    <>

      <Login />
      <ToastContainer />

    </>
  )
}

export default App