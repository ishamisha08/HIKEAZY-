import React, { useContext, useEffect } from 'react'
import { TrailContext } from '../../context/TrailContext'
import { assets } from '../../assets/assets'

const CoordinatorDashboard = () => {

  const { dashData, setDashData, getDashData, cToken, completeBooking,cancelBooking } = useContext(TrailContext)

  useEffect(() => {
    if (cToken) {
      getDashData()
    }
  }, [cToken])

  return dashData && (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-4xl font-bold text-gray-800 mb-8">Dashboard</h2>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-10 max-w-[95%] mx-auto">
        {/* Card for Trails */}
        <div className="bg-gradient-to-br from-[#F5F5DC] to-[#E8E6D1] text-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <img className="w-16 h-16 rounded-full" src={assets.income} alt="Trails" />
            <div>
              <p className="text-4xl font-bold">RM{dashData.earnings}</p>
              <p className="text-gray-600 text-lg font-medium">Earnings</p>
            </div>
          </div>
        </div>

        {/* Card for Bookings */}
        <div className="bg-gradient-to-br from-[#F5F5DC] to-[#E8E6D1] text-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <img className="w-16 h-16 rounded-full" src={assets.calendar} alt="Bookings" />
            <div>
              <p className="text-4xl font-bold">{dashData.bookings}</p>
              <p className="text-gray-600 text-lg font-medium">Bookings</p>
            </div>
          </div>
        </div>

        {/* Card for Hikers */}
        <div className="bg-gradient-to-br from-[#F5F5DC] to-[#E8E6D1] text-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <img className="w-16 h-16 rounded-full" src={assets.mountain} alt="Hikers" />
            <div>
              <p className="text-4xl font-bold">{dashData.hikers}</p>
              <p className="text-gray-600 text-lg font-medium">Hikers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Latest Bookings Section */}
      <div className="bg-white rounded-xl shadow-md max-w-[95%] mx-auto">
        <div className="flex items-center gap-3 px-6 py-4 bg-gray-50 rounded-t-xl border-b">
          <img className="w-8 h-8" src={assets.list} alt="Latest Bookings" />
          <p className="text-lg font-semibold text-gray-800">Latest Bookings</p>
        </div>

        {/* Scrollable Bookings */}
        <div
          className="max-h-96 overflow-y-auto divide-y divide-gray-200 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#9CA3AF #F3F4F6',
          }}
        >
          {dashData.latestBookings.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-6 py-4 px-6 hover:bg-gray-50 transition-all"
            >
              {/* Trail Image */}
              <img
                src={item.userData.image || assets.default_image}
                alt={item.userData.name || 'Trail'}
                className="w-16 h-16 rounded-lg object-cover"
              />

              {/* Booking Info */}
              <div className="flex-1">
                <p className="text-gray-800 font-medium">{item.trailData.name}</p>
                <p className="text-gray-500 text-sm">
                  Date: {new Date(item.slotDate).toLocaleDateString()}
                </p>
              </div>

              {/* Cancel and complte Action */}
              {
                item.cancelled
                  ? <p className='text-red-500 text-s font-medium'>Cancelled</p>
                  : item.isCompleted
                    ? <p className='text-green-500'>Completed</p> 
                    : <div>
                      <img onClick={() => cancelBooking(item._id)} src={assets.cancel_icon} alt="" />
                      <img onClick={() => completeBooking(item._id)} src={assets.tick_icon} alt="" />
                    </div>
              }

            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CoordinatorDashboard