import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Trails from './pages/Trails';
import About from './pages/About';
import Chat from './pages/Chat';
import Login from './pages/Login';
import MyBooking from './pages/MyBooking';
import Weather from './pages/Weather';
import Booking from './pages/Booking';
import MyProfile from './pages/MyProfile';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Leaderboard from './pages/Leaderboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EmailVerify from './pages/EmailVerify';
import ResetPassword from './pages/ResetPassword';
import Verify from './pages/Verify/Verify';


const App = () => {
  return (
    <div className='mx-4 sm:mx-[10%]'>
      <ToastContainer />
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/trails' element={<Trails />} />
        <Route path='/trails/:state' element={<Trails />} />
        <Route path='/about' element={<About />} />
        <Route path='/chat' element={<Chat />} />
        <Route path='/leaderboard' element={<Leaderboard />} />
        <Route path='/login' element={<Login />} />
        <Route path='/email-verify' element={<EmailVerify />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/my-profile' element={<MyProfile />} />
        <Route path='/weather' element={<Weather />} />
        <Route path='/my-booking' element={<MyBooking />} />
        <Route path='/booking/:trailId' element={<Booking />} />
        <Route path='/verify' element={<Verify/>}/>
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
