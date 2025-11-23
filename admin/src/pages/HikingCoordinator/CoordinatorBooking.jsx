import React, { useContext, useEffect } from 'react';
import { TrailContext } from '../../context/TrailContext';
import { assets } from '../../assets/assets';

const CoordinatorBooking = () => {
  const { cToken, bookings, getBookings, completeBooking, cancelBooking } = useContext(TrailContext);

  useEffect(() => {
    if (cToken) {
      getBookings();
    }
  }, [cToken]);

  return (
    <div className="w-full max-w-6xl mx-auto mt-10 px-5">
      <h1 className="text-2xl font-bold mb-5 text-gray-800">All Bookings</h1>

      <div className="bg-white border rounded-lg shadow-lg text-sm max-h-[80vh] overflow-x-auto">
        {/* Table Container */}
        <div className="min-w-[1400px]">
          {/* Table Header */}
          <div className="grid grid-cols-[40px_150px_120px_180px_150px_120px_150px_80px_80px_120px] gap-4 py-3 px-6 border-b bg-gray-100 text-gray-700 font-medium">
            <p className="text-center">#</p>
            <p className="text-left">Hiker</p>
            <p className="text-center">Date</p>
            <p className="text-left">Packages</p>
            <p className="text-left">Meals</p>
            <p className="text-left">Guide</p>
            <p className="text-left">Rentals</p>
            <p className="text-center">Payment</p>
            <p className="text-center">Total</p>
            <p className="text-center">Action</p>
          </div>

          {/* Table Rows */}
          {bookings.length > 0 ? (
            bookings.reverse().map((booking, index) => (
              <div
                key={booking.id || index}
                className="grid grid-cols-[40px_150px_120px_180px_150px_120px_150px_80px_80px_120px] gap-4 py-4 px-6 border-b hover:bg-gray-50 transition-colors items-center"
                style={{ minHeight: '80px' }}
              >
                {/* Index */}
                <p className="text-center text-gray-600">{index + 1}</p>

                {/* Hiker */}
                <div className="flex items-center gap-4">
                  <img
                    src={booking.userData?.image || assets.default_image}
                    alt={booking.userData?.name || 'Hiker'}
                    className="w-10 h-10 rounded-full object-cover border border-gray-300"
                  />
                  <p className="text-gray-800 truncate">{booking.userData?.name || 'N/A'}</p>
                </div>

                {/* Booking Date */}
                <p className="text-center text-gray-600">
                  {new Date(booking.slotDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>

                {/* Packages */}
                <div className="text-gray-600">
                  {booking.packages?.map((pkg, pkgIndex) => (
                    <div key={pkgIndex} className="mb-2">
                      <p>Duration: {pkg.duration.join(', ')}</p>
                      {pkg.stays?.length > 0 && (
                        <ul>
                          {pkg.stays.map((stay, stayIndex) => (
                            <li key={stayIndex}>
                              Stay: {stay.place}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>

                {/* Meals */}
                <div className="text-gray-600">
                  {booking.mealsOption?.map((meal, mealIndex) => (
                    <div key={mealIndex}>
                      <p>{meal.mealsIncluded ? 'Yes' : 'No'}</p>
                      {meal.mealsIncluded && meal.specialNotes && (
                        <p className="italic text-gray-500">
                          Special Notes: {meal.specialNotes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Guide */}
                <div className="text-gray-600">
                  {booking.guideOption?.guideIncluded ? (
                    <div>
                      <p>Guide: {booking.guideOption.guidesInfo?.[0]?.guideName || 'N/A'}</p>
                    </div>
                  ) : (
                    <p>No Guide</p>
                  )}
                </div>

                {/* Rentals */}
                <div className="text-gray-600">
                  {booking.rentalOptions?.length > 0 ? (
                    <ul>
                      {booking.rentalOptions.map((rental, rentalIndex) => (
                        <li key={rentalIndex}>
                          {rental.item} (Qty: {rental.rentedQuantity})
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No Rentals</p>
                  )}
                </div>

                {/* Payment */}
                <p
                  className={`text-sm font-medium text-center ${booking.payment ? 'text-green-600' : 'text-red-600'
                    }`}
                >
                  {booking.payment ? 'Paid' : 'Pending'}
                </p>

                {/* Total */}
                <p className="text-center text-gray-800 font-bold">RM{booking.amount.toFixed(2)}</p>

                {/* Action */}
                <div className="flex justify-center gap-2">
                  {booking.cancelled ? (
                    <p className="text-red-500 font-medium">Cancelled</p>
                  ) : booking.isCompleted ? (
                    <p className="text-green-500">Completed</p>
                  ) : (
                    <>
                      <img
                        onClick={() => cancelBooking(booking._id)}
                        src={assets.cancel_icon}
                        alt="Cancel"
                        className="w-10 h-10 cursor-pointer"
                      />
                      <img
                        onClick={() => completeBooking(booking._id)}
                        src={assets.tick_icon}
                        alt="Complete"
                        className="w-10 h-10 cursor-pointer"
                      />
                    </>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-gray-500">No bookings available at the moment.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoordinatorBooking;
