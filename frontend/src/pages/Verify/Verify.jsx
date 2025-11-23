import React, { useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import "./Verify.css";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();

  const verifyPayment = async () => {
    console.log("Query Parameters:", { success, orderId });
  
    if (!success || !orderId) {
      toast.error("Invalid query parameters.");
      navigate("/my-booking");
      return;
    }
  
    try {
      const response = await axios.post(`${backendUrl}/api/user/verify`, {
        success, // This will be a string ("true" or "false")
        bookingId: orderId, // Ensure correct key is used
      });
  
      if (response.data.success) {
        toast.success("Payment verified successfully!");
        navigate("/my-booking");
      } else {
        toast.error(response.data.message || "Payment verification failed.");
        navigate("/my-booking");
      }
    } catch (error) {
      console.error("Error verifying payment:", error.message || error);
      toast.error("An error occurred while verifying payment.");
      navigate("/my-booking");
    }
  };
  
  

  useEffect(() => {
    verifyPayment();
  }, []);

  return (
    <div className="verify">
      <div className="spinner"></div>
    </div>
  );
};

export default Verify;
