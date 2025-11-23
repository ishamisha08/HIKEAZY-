import React, { useContext, useEffect, useState } from 'react';
import { TrailContext } from '../../context/TrailContext';
import axios from 'axios';
import { toast } from 'react-toastify';


const CoordinatorProfile = () => {
  const { cToken, profileData, getProfileData, setProfileData, backendUrl } = useContext(TrailContext);



  const [isEdit, setIsEdit] = useState(false)

  const updateProfile = async () => {
    try {

      const updateData = {
        add_info: profileData.add_info,
        nationality: profileData.nationality,
        packages: profileData.packages,
        mealsOption: profileData.mealsOption,
        guideOption: profileData.guideOption,
        rentalOptions: profileData.rentalOptions,
        dailyQuota: profileData.dailyQuota,
      }

      const { data } = await axios.post(backendUrl + '/api/trail/update-profile', updateData, { headers: { cToken } })

      if (data.success) {
        toast.success(data.message)
        setIsEdit(false)
        getProfileData()
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
      console.log(error)

    }
  }

  useEffect(() => {
    if (cToken) {
      getProfileData();
    }
  }, [cToken]);

  if (!profileData) {
    return (
      <div className=" flex items-center justify-center h-screen text-gray-500">
        Loading profile data...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 bg-gray-100 shadow-lg rounded-lg">
      {/* Profile Header */}
      <div className="text-center mb-8">
        <img
          src={profileData?.image?.[0] || '/assets/default-image.jpg'}
          alt={profileData?.name}
          onError={(e) => (e.target.src = '/assets/default-image.jpg')}
          className="w-32 h-32 rounded-full shadow-md object-cover border-4 border-gray-200 mx-auto"
        />
        <h1 className="text-2xl font-bold mt-4 text-gray-800">{profileData.name}</h1>
        <p className="text-gray-500">{profileData.location}, {profileData.state}</p>
      </div>

      {/* About Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-700 border-b pb-2 mb-4">About</h2>
        <p className="text-gray-600">
          {isEdit ? (
            <textarea
              value={profileData.add_info}
              onChange={(e) =>
                setProfileData((prev) => ({ ...prev, add_info: e.target.value }))
              }
              rows={10}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          ) : (
            profileData.add_info || 'No additional information provided.'
          )}
        </p>
      </div>

      {/* Nationality Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-700 border-b pb-2 mb-4">Nationality</h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-800">Malaysians</h3>
            <p className="text-gray-600 text-xl">RM{isEdit ? <input type="number" onChange={(e) => setProfileData(prev => ({ ...prev, nationality: { ...prev.nationality, malaysian: e.target.value } }))} value={profileData.nationality.malaysian} /> : profileData.nationality.malaysian}</p>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-800">Foreigners</h3>
            <p className="text-gray-600 text-xl">RM{isEdit ? <input type="number" onChange={(e) => setProfileData(prev => ({ ...prev, nationality: { ...prev.nationality, foreign: e.target.value } }))} value={profileData.nationality.foreign} /> : profileData.nationality.foreign}</p>
          </div>
        </div>
      </div>

      {/* Packages Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-700 border-b pb-2 mb-4">Packages</h2>
        {profileData.packages?.map((pkg, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-lg shadow-sm mb-6">
            <h3 className="text-lg font-medium text-gray-800">Package {index + 1}</h3>
            <p className="text-gray-600 mt-2">Duration: {isEdit ? <input type="text" onChange={(e) => setProfileData(prev => ({ ...prev, packages: prev.packages.map((pkg, i) => i === index ? { ...pkg, duration: e.target.value } : pkg) }))} value={pkg.duration} /> : pkg.duration}</p>
            <div className="mt-4 space-y-4">
              {pkg.stays?.map((stay, stayIndex) => (
                <div key={stayIndex} className="p-4 border rounded-lg bg-white shadow-sm">
                  <p className="font-semibold text-gray-700">Stays: {isEdit ? <input type="text" onChange={(e) => setProfileData(prev => ({ ...prev, packages: prev.packages.map((pkg, i) => i === index ? { ...pkg, stays: pkg.stays.map((stay, j) => j === stayIndex ? { ...stay, place: e.target.value } : stay) } : pkg) }))} value={stay.place} /> : stay.place}</p>
                  <p className="text-gray-600">Price: RM {isEdit ? <input type="number" onChange={(e) => setProfileData(prev => ({ ...prev, packages: prev.packages.map((pkg, i) => i === index ? { ...pkg, stays: pkg.stays.map((stay, j) => j === stayIndex ? { ...stay, price: e.target.value } : stay) } : pkg) }))} value={stay.price} /> : stay.price}</p>
                  {isEdit ? (
                    <input
                      type="text"
                      onChange={(e) => setProfileData(prev => ({ ...prev, packages: prev.packages.map((pkg, i) => i === index ? { ...pkg, stays: pkg.stays.map((stay, j) => j === stayIndex ? { ...stay, mapUrl: e.target.value } : stay) } : pkg) }))}
                      value={stay.mapUrl}
                      placeholder="Enter map URL"
                    />
                  ) : stay.mapUrl ? (
                    <div className="mt-4">
                      <iframe
                        title={`Map for ${stay.place}`}
                        src={stay.mapUrl}
                        width="100%"
                        height="300"
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        style={{ border: 0, borderRadius: '8px' }}
                      />
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">Map URL not available</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>


      {/* Meals Option */}

      {/* Meals Option */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-700 border-b pb-2 mb-4">Meals Options</h2>
        {profileData.mealsOption?.map((meal, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-lg shadow-sm mb-4">
            {/* Meals Included */}
            <p className="font-semibold text-gray-700">
              Meals Included:{" "}
              {isEdit ? (
                <select
                  onChange={(e) =>
                    setProfileData((prev) => {
                      const updatedMeals = [...prev.mealsOption];
                      updatedMeals[index].mealsIncluded = e.target.value === "Yes";
                      return { ...prev, mealsOption: updatedMeals };
                    })
                  }
                  value={meal.mealsIncluded ? "Yes" : "No"}
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              ) : (
                meal.mealsIncluded ? "Yes" : "No"
              )}
            </p>

            {/* Meal Price */}
            {meal.mealsIncluded && (
              <p className="text-gray-600 mt-2">
                Price: RM{" "}
                {isEdit ? (
                  <input
                    type="number"
                    onChange={(e) =>
                      setProfileData((prev) => {
                        const updatedMeals = [...prev.mealsOption];
                        updatedMeals[index].price = Number(e.target.value) || 0;
                        return { ...prev, mealsOption: updatedMeals };
                      })
                    }
                    value={meal.price || ""}
                    className="border border-gray-300 rounded px-2 py-1 w-20"
                  />
                ) : (
                  meal.price || "0"
                )}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Guide Option */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-700 border-b pb-2 mb-4">Guide Information</h2>

        {/* Guide Included */}
        <p className="text-gray-700 font-medium mb-4">
          Guide Included:{" "}
          {isEdit ? (
            <select
              onChange={(e) =>
                setProfileData((prev) => ({
                  ...prev,
                  guideOption: {
                    ...prev.guideOption,
                    guideIncluded: e.target.value === "Yes",
                  },
                }))
              }
              value={profileData.guideOption?.guideIncluded ? "Yes" : "No"}
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          ) : (
            profileData.guideOption?.guideIncluded ? "Yes" : "No"
          )}
        </p>

        {/* Guide Price */}
        {profileData.guideOption?.guideIncluded && (
          <p className="text-gray-700 font-medium mb-4">
            Price: RM{" "}
            {isEdit ? (
              <input
                type="number"
                onChange={(e) =>
                  setProfileData((prev) => ({
                    ...prev,
                    guideOption: {
                      ...prev.guideOption,
                      price: Number(e.target.value) || 0,
                    },
                  }))
                }
                value={profileData.guideOption?.price || ""}
                className="border border-gray-300 rounded px-2 py-1 w-20"
              />
            ) : (
              profileData.guideOption?.price || "0"
            )}
          </p>
        )}

        {/* Guides Info */}
        {profileData.guideOption?.guidesInfo?.map((guide, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-lg shadow-sm mb-4">
            <p className="font-semibold text-gray-700">
              Name:{" "}
              {isEdit ? (
                <input
                  type="text"
                  onChange={(e) =>
                    setProfileData((prev) => {
                      const updatedGuides = [...prev.guideOption.guidesInfo];
                      updatedGuides[index].guideName = e.target.value;
                      return {
                        ...prev,
                        guideOption: { ...prev.guideOption, guidesInfo: updatedGuides },
                      };
                    })
                  }
                  value={guide.guideName || ""}
                  className="border border-gray-300 rounded px-2 py-1 w-full"
                />
              ) : (
                guide.guideName
              )}
            </p>

            <p className="text-gray-600">
              Contact:{" "}
              {isEdit ? (
                <input
                  type="text"
                  onChange={(e) =>
                    setProfileData((prev) => {
                      const updatedGuides = [...prev.guideOption.guidesInfo];
                      updatedGuides[index].contactNumber = e.target.value;
                      return {
                        ...prev,
                        guideOption: { ...prev.guideOption, guidesInfo: updatedGuides },
                      };
                    })
                  }
                  value={guide.contactNumber || ""}
                  className="border border-gray-300 rounded px-2 py-1 w-full"
                />
              ) : (
                guide.contactNumber
              )}
            </p>

            <p className="text-gray-600">
              Email:{" "}
              {isEdit ? (
                <input
                  type="email"
                  onChange={(e) =>
                    setProfileData((prev) => {
                      const updatedGuides = [...prev.guideOption.guidesInfo];
                      updatedGuides[index].email = e.target.value;
                      return {
                        ...prev,
                        guideOption: { ...prev.guideOption, guidesInfo: updatedGuides },
                      };
                    })
                  }
                  value={guide.email || ""}
                  className="border border-gray-300 rounded px-2 py-1 w-full"
                />
              ) : (
                guide.email
              )}
            </p>

            <p className="text-gray-600">
              Experience:{" "}
              {isEdit ? (
                <input
                  type="number"
                  onChange={(e) =>
                    setProfileData((prev) => {
                      const updatedGuides = [...prev.guideOption.guidesInfo];
                      updatedGuides[index].experience = Number(e.target.value) || 0;
                      return {
                        ...prev,
                        guideOption: { ...prev.guideOption, guidesInfo: updatedGuides },
                      };
                    })
                  }
                  value={guide.experience || 0}
                  className="border border-gray-300 rounded px-2 py-1 w-20"
                />
              ) : (
                `${guide.experience} years`
              )}
            </p>

            <p className="text-gray-600">
              Max Hikers:{" "}
              {isEdit ? (
                <input
                  type="number"
                  onChange={(e) =>
                    setProfileData((prev) => {
                      const updatedGuides = [...prev.guideOption.guidesInfo];
                      updatedGuides[index].maxHikers = Number(e.target.value) || 0;
                      return {
                        ...prev,
                        guideOption: { ...prev.guideOption, guidesInfo: updatedGuides },
                      };
                    })
                  }
                  value={guide.maxHikers || 0}
                  className="border border-gray-300 rounded px-2 py-1 w-20"
                />
              ) : (
                guide.maxHikers
              )}
            </p>
          </div>
        ))}
      </div>



      {/* Rental Options */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-700 border-b pb-2 mb-4">Rental Options</h2>
        {profileData.rentalOptions?.map((item, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-lg shadow-sm mb-4 flex items-start gap-4">
            {/* Editable Image */}
            {isEdit ? (
              <div>
                <input
                  type="text"
                  placeholder="Image URL"
                  onChange={(e) =>
                    setProfileData((prev) => {
                      const updatedRental = [...prev.rentalOptions];
                      updatedRental[index].image = e.target.value;
                      return { ...prev, rentalOptions: updatedRental };
                    })
                  }
                  value={item.image || ""}
                  className="border border-gray-300 rounded px-2 py-1 w-48"
                />
                <img
                  src={item.image || "/assets/default-image.jpg"}
                  alt={item.item}
                  onError={(e) => (e.target.src = "/assets/default-image.jpg")}
                  className="w-16 h-16 rounded-md shadow-md object-cover mt-2"
                />
              </div>
            ) : (
              <img
                src={item.image || "/assets/default-image.jpg"}
                alt={item.item}
                onError={(e) => (e.target.src = "/assets/default-image.jpg")}
                className="w-16 h-16 rounded-md shadow-md object-cover"
              />
            )}

            <div className="flex-1">
              {/* Editable Item Name */}
              <p className="font-semibold text-gray-700">
                Item:{" "}
                {isEdit ? (
                  <input
                    type="text"
                    onChange={(e) =>
                      setProfileData((prev) => {
                        const updatedRental = [...prev.rentalOptions];
                        updatedRental[index].item = e.target.value;
                        return { ...prev, rentalOptions: updatedRental };
                      })
                    }
                    value={item.item || ""}
                    className="border border-gray-300 rounded px-2 py-1 w-full"
                  />
                ) : (
                  item.item
                )}
              </p>

              {/* Editable Price */}
              <p className="text-gray-600">
                Price: RM{" "}
                {isEdit ? (
                  <input
                    type="number"
                    onChange={(e) =>
                      setProfileData((prev) => {
                        const updatedRental = [...prev.rentalOptions];
                        updatedRental[index].price = Number(e.target.value) || 0;
                        return { ...prev, rentalOptions: updatedRental };
                      })
                    }
                    value={item.price || ""}
                    className="border border-gray-300 rounded px-2 py-1 w-24"
                  />
                ) : (
                  item.price
                )}
              </p>

              {/* Editable Quantity */}
              <p className="text-gray-600">
                Quantity:{" "}
                {isEdit ? (
                  <input
                    type="number"
                    onChange={(e) =>
                      setProfileData((prev) => {
                        const updatedRental = [...prev.rentalOptions];
                        updatedRental[index].quantity = Number(e.target.value) || 0;
                        return { ...prev, rentalOptions: updatedRental };
                      })
                    }
                    value={item.quantity || ""}
                    className="border border-gray-300 rounded px-2 py-1 w-24"
                  />
                ) : (
                  item.quantity
                )}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Daily Quota */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-700 border-b pb-2 mb-4">Daily Quota</h2>
        {isEdit ? (
          <input
            type="number"
            onChange={(e) =>
              setProfileData((prev) => ({
                ...prev,
                dailyQuota: Number(e.target.value) || 0,
              }))
            }
            value={profileData.dailyQuota || ""}
            className="border border-gray-300 rounded px-2 py-1 w-full"
          />
        ) : (
          <p className="text-gray-600 text-lg">{profileData.dailyQuota}</p>
        )}
      </div>


      {
        isEdit
          ? <button onClick={updateProfile} className='px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium text-sm rounded-full shadow-md transition duration-200 ease-in-out mt-5'>Save</button>
          : <button onClick={() => setIsEdit(true)} className='px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium text-sm rounded-full shadow-md transition duration-200 ease-in-out mt-5'>Edit</button>
      }
    </div>
  );
};

export default CoordinatorProfile;
