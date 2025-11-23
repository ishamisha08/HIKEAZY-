import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";


const MyBooking = () => {
  const { userData, backendUrl, isLoggedin, getTrailsData } = useContext(AppContext);
  const navigate = useNavigate();

  const [booking, setBooking] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [reviewedBookings, setReviewedBookings] = useState({});


  const getUserBooking = async () => {
    if (!isLoggedin || !userData || !userData._id) {
      console.log("User is not logged in or user data is missing.");
      return;
    }

    try {
      const { data } = await axios.get(`${backendUrl}/api/user/bookings`, {
        params: { userId: userData._id },
      });

      if (data.success) {
        setBooking(data.booking.reverse());
        checkReviewedBookings(data.booking); // Check for reviews
      } else {
        toast.info("No bookings found.");
      }
    } catch (error) {
      console.error("Booking List error:", error.message || error);
      toast.error("An error occurred while fetching bookings.");
    }
  };

  const cancelBooking = async (bookingId) => {
    try {
      const payload = {
        userId: userData._id,
        bookingId,
      };

      const { data } = await axios.post(`${backendUrl}/api/user/cancel-booking`, payload);

      if (data.success) {
        toast.success(data.message);
        getUserBooking();
        getTrailsData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Cancel error:", error.message || error);
      toast.error("An error occurred while canceling the booking.");
    }
  };

  const openModal = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedBooking(null);
  };

  const confirmCancel = () => {
    if (selectedBooking) {
      cancelBooking(selectedBooking._id);
    }
    closeModal();
  };

  const payBooking = async (bookingId, amount) => {
    try {
      const payload = {
        userId: userData._id,
        bookingId,
        amount,
        items: [
          {
            name: `Booking ${bookingId}`,
            amount,
            quantity: 1,
          },
        ],
      };

      const { data } = await axios.post(`${backendUrl}/api/user/create-checkout-session`, payload);

      if (data.success) {
        window.location.replace(data.session_url);
      } else {
        toast.error("Failed to create payment session.");
      }
    } catch (error) {
      console.error("Payment error:", error.message || error);
      toast.error("An error occurred while initiating payment.");
    }
  };

  useEffect(() => {
    if (isLoggedin && userData?._id) {
      getUserBooking();
    }
  }, [isLoggedin, userData]);



  const checkReviewedBookings = async (bookings) => {
    const reviewed = {};
    for (const item of bookings) {
      try {
        const response = await axios.get(`${backendUrl}/api/review/trail/${item.trailId}`);
        if (response.data.success) {
          reviewed[item._id] = response.data.reviews.some(
            (review) => review.bookingId === item._id
          );
        }
      } catch (error) {
        console.error("Error checking reviewed bookings:", error.message || error);
      }
    }
    setReviewedBookings(reviewed);
  };

  const handleReview = (trailId, bookingId) => {
    navigate(`/booking/${trailId}?bookingId=${bookingId}#review`);
  };


  

  return (
    <div className="w-full px-4 py-6 bg-gray-50">
      <h2 className="pb-4 text-3xl font-semibold text-gray-800 border-b border-gray-300">
        My Bookings
      </h2>
      <div className="space-y-6 mt-6">
        {booking.length > 0 ? (
          booking.map((item, index) => {
            const trailId = item._id || `trail-${index}`;
            const trailImage = item.trailData?.image?.[0];
            const trailName = item.trailData?.name || "Unnamed Trail";
            const trailState = item.trailData?.state || "Unknown State";
            const trailLocation = item.trailData?.location || "Unknown Location";
            const trailDuration =
              item.packages?.[0]?.duration?.[0] || "Not specified";

            const guideInfo = item.guideOption?.guidesInfo || [];
            const mealInfo = item.mealsOption || [];

            return (
              <div
                key={trailId}
                className="w-full p-6 bg-white shadow-xl rounded-lg border border-gray-200 hover:shadow-2xl transition-shadow ease-in-out duration-300"
              >
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  <div className="w-full sm:w-48 h-32 overflow-hidden rounded-md shadow-md">
                    <img
                      className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-110"
                      src={trailImage || "/images/default-trail.jpg"}
                      alt={trailName}
                    />
                  </div>

                  <div className="flex-1 text-gray-700">
                    <p className="text-2xl font-semibold text-gray-900">{trailName}</p>
                    <p className="text-medium font-medium text-gray-600 mt-1">{trailState}</p>
                    <p className="text-sm mt-1">
                      <span className="font-medium text-gray-800">Booking ID:</span> {trailId}
                    </p>
                    <p className="text-sm mt-1">
                      <span className="font-medium text-gray-800">Location:</span> {trailLocation}
                    </p>
                    <p className="text-sm mt-1">
                      <span className="font-medium text-gray-800">Duration:</span> {trailDuration}
                    </p>
                    <p className="text-sm mt-1">
                      <span className="font-medium text-gray-800">Hike Date:</span>{" "}
                      {new Date(item.slotDate).toLocaleDateString()}
                    </p>

                    {guideInfo.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-800">Guide Information:</p>
                        {guideInfo.map((guide, idx) => (
                          <div key={idx} className="text-sm text-gray-600">
                            <p>Name: {guide.guideName}</p>
                            <p>Contact: {guide.contactNumber}</p>
                            <p>
                              Email:{" "}
                              <a
                                href={`mailto:${guide.email}`}
                                className="text-blue-500 hover:text-blue-700"
                              >
                                {guide.email}
                              </a>
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {mealInfo.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-800">Meal Options:</p>
                        {mealInfo.map((meal, idx) => (
                          <div key={idx} className="text-sm text-gray-600">
                            <p>{meal.mealsIncluded ? "Meals Included" : "No Meals Included"}</p>
                            {meal.specialNotes && <p>Special Notes: {meal.specialNotes}</p>}
                          </div>
                        ))}
                      </div>
                    )}

                    <p className="text-lg font-semibold text-gray-900 mt-3">
                      Total Amount: RM {item.amount.toFixed(2)}
                    </p>
                  </div>

                  {/* Buttons aligned to the right */}
                  <div className="flex flex-col gap-3 mt-4 sm:mt-0 sm:ml-auto">
                    {!item.cancelled && !item.isCompleted && (
                      item.payment ? (
                        <button className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-md cursor-default" disabled>
                          Paid
                        </button>
                      ) : (
                        <button
                          onClick={() => payBooking(item._id, item.amount)}
                          className="mt-4 px-6 py-3 bg-[#333A5C] text-white font-medium rounded-lg shadow-md hover:bg-[#1f283e] transition duration-200"
                        >
                          Pay
                        </button>
                      )
                    )}

                    {!item.cancelled && !item.isCompleted && (
                      <button
                        onClick={() => openModal(item)}
                        className="mt-4 px-6 py-3 bg-[#333A5C] text-white font-medium rounded-lg shadow-md hover:bg-[#1f283e] transition duration-200"
                      >
                        Cancel Booking
                      </button>
                    )}

                    {item.cancelled && !item.isCompleted && (
                      <button className="sm:min-w-48 py-2 border border-red-600 rounded text-red-600">
                        Booking Cancelled
                      </button>
                    )}
                   
                   
                    {item.isCompleted && (
                      <div className="flex flex-col items-start gap-2">
                        {/* Completed Button */}
                        <button
                          className="sm:min-w-48 py-2 border border-green-400 rounded text-green-400"
                        >
                          Completed
                        </button>

                        {/* Review Button: Only appears if item.isCompleted is true */}
                        {item.isCompleted && (
                    <button
                      onClick={() =>
                        reviewedBookings[item._id]
                          ? toast.info("You have already reviewed this booking.")
                          : handleReview(item.trailId, item._id)
                      }
                      className={`sm:min-w-48 py-2 px-4 rounded-lg shadow-md ${
                        reviewedBookings[item._id]
                          ? "bg-green-400 text-white cursor-not-allowed"
                          : "bg-blue-500 text-white hover:bg-blue-600"
                      }`}
                      disabled={reviewedBookings[item._id]}
                    >
                      {reviewedBookings[item._id] ? "Reviewed" : "Review"}
                    </button>
                  )}
      </div>
                    )}



                      </div>
                </div>

                {/* Packages Section */}
                <div className="mt-4">
                  <p className="font-medium text-gray-800">Packages:</p>
                  {item.packages.map((pkg, idx) => (
                    <div key={idx} className="mt-2">
                      <p className="text-sm text-gray-600">Duration: {pkg.duration.join(", ")}</p>

                      {pkg.stays?.length > 0
                        ? pkg.stays.map((stay, i) => (
                            <div key={i} className="text-sm text-gray-600">
                              <p>Stay Place: {stay.place}</p>
                              {stay.mapUrl && (
                                <iframe
                                  src={stay.mapUrl}
                                  width="100%"
                                  height="300"
                                  style={{ border: 0 }}
                                  allowFullScreen
                                  loading="lazy"
                                  title={`Map of ${stay.place}`}
                                ></iframe>
                              )}
                            </div>
                          ))
                        : pkg.mapUrl && (
                            <iframe
                              src={pkg.mapUrl}
                              width="100%"
                              height="300"
                              style={{ border: 0 }}
                              allowFullScreen
                              loading="lazy"
                              title="Trail Map"
                            ></iframe>
                          )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-lg text-gray-700">No bookings found.</p>
        )}
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 sm:w-1/3">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Confirm Cancellation</h2>
            <p className="text-gray-600 mb-4">
              This booking has already been paid. Please review our{" "}
              <a href="/about" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                cancellation policy
              </a>{" "}
              before proceeding.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmCancel}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBooking;
