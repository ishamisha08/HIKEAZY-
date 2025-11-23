import React, { useContext, useEffect, useState } from 'react';
import { AdminContext } from '../../context/AdminContext';

const TrailsList = () => {
  const { trail, aToken, getAllTrail, deleteTrail } = useContext(AdminContext);
  const [selectedTrailId, setSelectedTrailId] = useState(null); // To track the trail to delete
  const [showModal, setShowModal] = useState(false); // To toggle the delete confirmation modal

  useEffect(() => {
    if (aToken) {
      getAllTrail();
    }
  }, [aToken]);

  const handleDelete = (id) => {
    setSelectedTrailId(id);
    setShowModal(true);
  };

  const confirmDelete = () => {
    deleteTrail(selectedTrailId);
    setShowModal(false);
    setSelectedTrailId(null);
  };

  const cancelDelete = () => {
    setShowModal(false);
    setSelectedTrailId(null);
  };

  return (
    <div className="m-5 max-h-[80vh] overflow-y-auto bg-gray-50 p-6 rounded-lg shadow-lg">
      <h1 className="text-3xl font-extrabold text-center mb-8 text-gray-800">All Trails</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {trail.map((item, index) => (
          <div
            className="group border border-gray-200 rounded-lg shadow-md bg-white hover:shadow-lg transition-shadow duration-300 cursor-pointer overflow-hidden"
            key={index}
          >
            <div className="relative h-40 bg-gray-100 overflow-hidden">
              <img
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                src={Array.isArray(item.image) ? item.image[0] : item.image}
                alt={item.name}
              />
            </div>

            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800 truncate">{item.name}</h2>
              <p className="text-sm text-gray-600">{item.state}</p>
              <p className="text-sm text-gray-600">Daily Quota: {item.dailyQuota}</p>
              <p className="text-sm text-gray-500 italic">Bookings Available: {item.dailyQuota}</p>

              <button
                onClick={() => handleDelete(item._id)}
                className="mt-3 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded hover:from-red-600 hover:to-red-700 shadow-lg transition-transform duration-300 transform hover:scale-105"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for delete confirmation */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Confirm Delete</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this trail? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white font-bold rounded hover:bg-red-600 transition"
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

export default TrailsList;
