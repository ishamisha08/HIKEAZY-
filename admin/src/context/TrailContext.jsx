import { useState } from "react";
import { createContext } from "react";
import axios from 'axios'
import {toast} from 'react-toastify'


export const TrailContext = createContext()

const TrailContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [cToken, setCToken] = useState(localStorage.getItem('cToken')?localStorage.getItem('cToken'):'')

    const [bookings, setBookings] = useState([])
    const [dashData, setDashData] = useState(false)
    const [profileData,setProfileData] = useState(false)

    const getBookings = async () =>{
        try {

            const {data} = await axios.get(backendUrl+'/api/trail/bookings', {headers:{cToken}})

            if (data.success){
                setBookings(data.bookings)
                console.log(data.bookings)
            }else{
                toast.error(data.message)
            }
             
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const completeBooking = async (bookingId) =>{
        try {
            const {data} = await axios.post(backendUrl + '/api/trail/complete-booking',{bookingId},{headers:{cToken}})
            if (data.success){
                toast.success(data.message)
                getBookings()
            }else{
                toast.error(data.message)
            }
            
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }


    const cancelBooking = async (bookingId) =>{
        try {
            const {data} = await axios.post(backendUrl + '/api/trail/cancel-booking',{bookingId},{headers:{cToken}})
            if (data.success){
                toast.success(data.message)
                getBookings()
            }else{
                toast.error(data.message)
            }
            
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }


    const getDashData = async () =>{

        try {
            const {data} = await axios.get(backendUrl + '/api/trail/dashboard', {headers:{cToken}})
            if (data.success){
                setDashData(data.dashData)
                console.log(data.dashData)
            }else{
                toast.error(data.message)
            }
            
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }


    const getProfileData = async () => {
        try {
            const {data} = await axios.get(backendUrl + '/api/trail/profile', {headers:{cToken}})
            if (data.success){
                setProfileData(data.profileData)
                console.log(data.profileData)
            }
            
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }


    const value ={
        cToken, setCToken,
        backendUrl,
        bookings,setBookings,
        getBookings,
        completeBooking,
        cancelBooking,
        dashData,setDashData,
        getDashData,
        profileData,setProfileData,
        getProfileData,

    }

    return (
        <TrailContext.Provider value={value}>
            {props.children}
        </TrailContext.Provider>
    )
}

export default TrailContextProvider