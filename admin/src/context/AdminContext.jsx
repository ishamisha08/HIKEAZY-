import { createContext, useState } from "react";
import axios from 'axios'
import {toast} from 'react-toastify'

export const AdminContext = createContext()

const AdminContextProvider = (props) => {


    const [aToken,setAToken] = useState(localStorage.getItem('aToken')?localStorage.getItem('aToken'):'')
    const [trail,setTrail] = useState([])
    const [bookings, setBookings] = useState([])
    const [dashData, setDashData] = useState(false)


    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const getAllTrail = async () => {

        try{

            const {data} = await axios.post(backendUrl + '/api/admin/all-trail' , {} , {headers:{aToken}})
            if (data.success) {
                setTrail(data.trail)
                console.log(data.trail);
            } else {
                toast.error(data.message)
            }


        } catch (error) {
            toast.error(error.message)
        }
    }

    const deleteTrail = async (id) => {
        try {
            const { data } = await axios.delete(`${backendUrl}/api/trail/delete/${id}`, {
                headers: { aToken },
            });
    
            if (data.success) {
                // Update the trail state by removing the deleted trail
                setTrail(trail.filter((t) => t._id !== id));
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };


    const getAllBooking = async() =>{
        try{

            const{data} = await axios.get(backendUrl+'/api/admin/bookings', {headers:{aToken}})

            if (data.success){
                setBookings(data.bookings)
            }else{
                toast.error(data.message)
            }

        }catch(error){
            toast.error(error.response?.data?.message || error.message);

        }
    }

    const cancelBooking = async (bookingId) => {

        try {

            const {data} = await axios.post(backendUrl+'/api/admin/cancel-booking',{bookingId},{headers:{aToken}})

            if (data.success){
                toast.success(data.message)
                getAllBooking()
            } else{
                toast.error(data.message)
            }
            
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    }

    const getDashData = async () => {

        try{

            const {data} = await axios.get(backendUrl + '/api/admin/dashboard', {headers:{aToken}})

            if (data.success) {
                setDashData(data.dashData)
                console.log(data.dashData)
            }else {
                toast.error(data.message)
            }

        }catch(error){
            toast.error(error.response?.data?.message || error.message);
        }
    }
    


    const value ={
        aToken,setAToken,
        backendUrl,trail,
        getAllTrail,
        deleteTrail,
        bookings,setBookings,
        getAllBooking,
        cancelBooking,
        dashData,getDashData
    }

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
}

export default AdminContextProvider