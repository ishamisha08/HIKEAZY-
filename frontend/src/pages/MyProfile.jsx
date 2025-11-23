import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

const MyProfile = () => {
  const { userData, setUserData, backendUrl, loadUserProfileData } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(null);

  const updateUserProfileData = async () => {
    try {
      const formData = new FormData();
      formData.append('name', userData.name);
      formData.append('phone', userData.phone);
      formData.append('gender', userData.gender);
      formData.append('dob', userData.dob);
      formData.append('address', JSON.stringify(userData.address));
      if (image) formData.append('image', image);

      const { data } = await axios.post(`${backendUrl}/api/user/update-profile`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (data.success) {
        toast.success(data.message);
        await loadUserProfileData();
        setIsEdit(false);
        setImage(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while updating the profile.');
    }
  };

  if (!userData) {
    return <div className="text-center text-lg p-6">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center gap-6 p-8 w-[90%] max-w-lg bg-gradient-to-br from-[#fdf6e3] to-[#f5e1c1] border border-[#e3c7a8] rounded-3xl shadow-lg mx-auto mt-10">
      {isEdit ? (
        <label htmlFor="image">
          <div className="inline-block relative cursor-pointer">
            <img
              className="w-32 h-32 rounded-full object-cover shadow-md mb-4"
              src={image ? URL.createObjectURL(image) : userData.image || assets.default_image}
              alt="Profile"
            />
          </div>
          <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden />
        </label>
      ) : (
        <div className="flex flex-col items-center">
          <img
            src={userData.image || assets.person_icon}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover shadow-md mb-4"
          />
        </div>
      )}

      {isEdit ? (
        <input
          type="text"
          className="text-2xl font-semibold border border-gray-300 p-3 rounded-lg w-full text-center"
          value={userData.name}
          onChange={(e) => setUserData((prev) => ({ ...prev, name: e.target.value }))}
        />
      ) : (
        <p className="text-2xl font-bold text-gray-800">{userData.name}</p>
      )}

      <p className="text-sm text-gray-600">{userData.email}</p>
      <hr className="w-full border-gray-300" />

      <section className="text-left text-gray-700 space-y-6 w-full">
        <div>
          <p className="text-lg font-semibold text-gray-800">Contact Information</p>
          <div className="grid grid-cols-2 gap-y-4 mt-4">
            <p className="font-medium">Phone:</p>
            {isEdit ? (
              <input
                type="text"
                className="border border-gray-300 rounded-lg p-3 w-full"
                value={userData.phone}
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, phone: e.target.value }))
                }
              />
            ) : (
              <p>{userData.phone}</p>
            )}

            <p className="font-medium">Address:</p>
            {isEdit ? (
              <div className="space-y-2">
                <input
                  type="text"
                  className="border border-gray-300 rounded-lg p-3 w-full"
                  value={userData.address?.line1 || ''}
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      address: { ...prev.address, line1: e.target.value },
                    }))
                  }
                />
                <input
                  type="text"
                  className="border border-gray-300 rounded-lg p-3 w-full"
                  value={userData.address?.line2 || ''}
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      address: { ...prev.address, line2: e.target.value },
                    }))
                  }
                />
              </div>
            ) : (
              <p>{userData.address?.line1}, {userData.address?.line2}</p>
            )}
          </div>
        </div>

        <div>
          <p className="text-lg font-semibold text-gray-800">Basic Information</p>
          <div className="grid grid-cols-2 gap-y-4 mt-4">
            <p className="font-medium">Gender:</p>
            {isEdit ? (
              <select
                className="border border-gray-300 rounded-lg p-3 w-full"
                value={userData.gender}
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, gender: e.target.value }))
                }
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            ) : (
              <p>{userData.gender}</p>
            )}

            <p className="font-medium">Birthday:</p>
            {isEdit ? (
              <input
                type="date"
                className="border border-gray-300 rounded-lg p-3 w-full"
                value={userData.dob}
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, dob: e.target.value }))
                }
              />
            ) : (
              <p>{userData.dob}</p>
            )}

            <p className="font-medium">Points:</p>
            <p>{userData.points || 0}</p>

          </div>
        </div>
      </section>


      <div className="mt-6 flex justify-center">
        <button
          className="mt-4 px-6 py-3 bg-[#333A5C] text-white font-medium rounded-lg shadow-md hover:bg-[#1f283e] transition duration-200"
          onClick={() => {
            if (isEdit) updateUserProfileData();
            setIsEdit(!isEdit);
          }}
        >
          {isEdit ? 'Save Information' : 'Edit'}
        </button>
      </div>
    </div>





  );
};

export default MyProfile;
