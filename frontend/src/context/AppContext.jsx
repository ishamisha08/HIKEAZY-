import { createContext, useEffect, useState } from "react";
import axios from 'axios';
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
    axios.defaults.withCredentials = true;

    const currencySymbol = 'RM';
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [isLoggedin, setIsLoggedin] = useState(false);
    const [userData, setUserData] = useState(null);
    const [trails, setTrails] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [reviews, setReviews] = useState([]); // Add reviews state
    const [leaderboard, setLeaderboard] = useState([]); // State for leaderboard


    // Get authentication state
    const getAuthState = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/user/is-auth`);
            if (data.success) {
                setIsLoggedin(true);
                await getUserData(); 
            }
        } catch (error) {
            toast.dismiss();
            toast.error(error.response?.data?.message || error.message);
        }
    };

    // Get user data
    const getUserData = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/hiker/data`);
            if (data.success) {
                setUserData(data.userData || {});
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.dismiss();
            toast.error(error.response?.data?.message || error.message);
        }
    };

    // Load user profile data
    const loadUserProfileData = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/user/get-profile`);
            if (data.success) {
                setUserData(data.profile || {});
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error.response?.data?.message || error.message);
            toast.error(error.response?.data?.message || error.message);
        }
    };

    // Fetch trails data
    const getTrailsData = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/trail/list`);
            if (data.success) {
                setTrails(data.trails || []);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.dismiss();
            toast.error(error.message);
        }
    };

    const getUserBooking = async () => {
        if (!isLoggedin || !userData || !userData._id) {
            return;
        }
    
        try {
            const { data } = await axios.get(`${backendUrl}/api/user/bookings`, {
                params: { userId: userData._id },
            });
    
            if (data.success) {
                setBookings(data.booking.reverse()); // Store bookings in context
            }
        } catch (error) {
            console.error("Error fetching bookings:", error);
        }
    };

     // Fetch reviews for a trail
     const getReviewsForTrail = async (trailId) => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/review/trail/${trailId}`);
            if (data.success) {
                setReviews(data.reviews || []);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error fetching reviews:", error);
            toast.error(error.response?.data?.message || error.message);
        }
    };

    // Add review to state after submission
    const addReviewToState = (review) => {
        setReviews((prevReviews) => [review, ...prevReviews]);
    };
    

    // Fetch leaderboard data
const getLeaderboard = async () => {
    try {
        const { data } = await axios.get(`${backendUrl}/api/user/leaderboard`);
        if (data.success) {
            setLeaderboard(data.leaderboard || []);
        } else {
            toast.error("Failed to fetch leaderboard.");
        }
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        toast.error(error.response?.data?.message || error.message);
    }
};


    // Load data when the app initializes
    useEffect(() => {
        getTrailsData();
        getAuthState();
        getUserBooking()
    }, []);

    // Handle login state changes
    useEffect(() => {
        if (isLoggedin) {
            loadUserProfileData();
        } else {
            setUserData(null); // Explicit reset
        }
    }, [isLoggedin]);

    const value = {
        trails,
        currencySymbol,
        backendUrl,
        isLoggedin,
        setIsLoggedin,
        userData,
        setUserData,
        getUserData,
        loadUserProfileData,
        getTrailsData,
        bookings, setBookings,
        getUserBooking,
        reviews, // Provide reviews in context
        setReviews,
        getReviewsForTrail, // Add this function to fetch reviews
        addReviewToState, // Add this function to update reviews
        leaderboard, // Add leaderboard to context
    getLeaderboard, // Add leaderboard fetch function
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;
