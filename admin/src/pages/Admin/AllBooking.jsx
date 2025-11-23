import React, { useEffect, useContext } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { assets } from '../../assets/assets';

const AllBooking = () => {
  const { aToken, bookings, getAllBooking, cancelBooking } = useContext(AdminContext);

  useEffect(() => {
    if (aToken) {
      getAllBooking();
    }
  }, [aToken]);

  return (
    <div className="w-full max-w-7xl mx-auto p-6 min-h-screen">
      <h2 className="text-4xl font-bold mb-6 text-gray-800">All Bookings</h2>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden h-full flex flex-col">
        {/* Table Header */}
        <div className="hidden sm:grid grid-cols-[0.3fr_1.5fr_1fr_2fr_1fr_1fr_1fr] py-3 px-6 bg-gray-100 text-gray-600 font-medium text-sm uppercase tracking-wider">
          <p className="hidden sm:block">#</p>
          <p>Hiker</p>
          <p>Date</p>
          <p>Trail</p>
          <p>Total</p>
          <p>Guide</p>
          <p>Actions</p>
        </div>

        {/* Scrollable Table Rows */}
        <div
          className="overflow-y-auto flex-grow scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100"
          style={{
            maxHeight: 'calc(100vh - 200px)', // Dynamically adjust height based on viewport
            scrollbarWidth: 'thin',
            scrollbarColor: '#9CA3AF #F3F4F6',
          }}
        >
          {bookings.map((booking, index) => (
            <div
              key={index}
              className="grid sm:grid-cols-[0.3fr_1.5fr_1fr_2fr_1fr_1fr_1fr] grid-cols-1 gap-4 py-4 px-6 border-b hover:bg-gray-50 transition-all"
            >
              {/* # Column */}
              <p className="hidden sm:block text-gray-700">{index + 1}</p>

              {/* Hiker Column */}
              <div className="flex items-center space-x-3">
                {/* User Image */}
                <img
                  src={booking.userData?.image || assets.default_image}
                  alt={booking.userData?.name || 'Hiker'}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <p className="text-gray-700 font-medium">{booking.userData?.name || 'N/A'}</p>
              </div>

              {/* Date Column */}
              <p className="text-gray-500">{new Date(booking.slotDate).toLocaleDateString()}</p>

              {/* Trail Column */}
              <p className="text-gray-700">{booking.trailData?.name || 'N/A'}</p>

              {/* Total Amount */}
              <p className="text-gray-700 font-bold">RM {booking.amount}</p>

              {/* Guide Column */}
              <p className="text-gray-700">
                {booking.guideOption?.guideIncluded && booking.guideOption?.guidesInfo?.length > 0
                  ? booking.guideOption.guidesInfo[0]?.guideName || 'No guide available'
                  : 'No guide'}
              </p>

              {/* Actions */}
              <div className="flex space-x-2">
                {booking.cancelled ? (
                  <p className="text-red-400 text-sm font-medium">Cancelled</p>
                ) : booking.isCompleted 
                ? <p className="text-green-500 text-sm font-medium">Completed</p>  
                : (
                  <img
                    onClick={() => cancelBooking(booking._id)}
                    className="w-10 h-10 cursor-pointer"
                    src={assets.cancel_icon}
                    alt="Cancel Booking"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllBooking;
