import React, { useContext, useEffect, useState } from 'react';
import { useParams , useSearchParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import RelatedTrails from '../components/RelatedTrails';
import Reviews from '../components/Reviews';
import axios from 'axios';
import { toast } from 'react-toastify';


const Booking = () => {
  const { trailId } = useParams();
  const [searchParams] = useSearchParams();
  const { trails, currencySymbol } = useContext(AppContext);

  const [trailData, setTrailData] = useState(null);
  const [image, setImage] = useState('');
  const [isMalaysian, setIsMalaysian] = useState(null); // Track nationality
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedStay, setSelectedStay] = useState(null);
  const [selectedMealOption, setSelectedMealOption] = useState(null);
  const [selectedGuideOption, setSelectedGuideOption] = useState(null);
  const [selectedGuide, setSelectedGuide] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [rentalOptions, setRentalOptions] = useState([]); // State for rental options
  const [summary, setSummary] = useState({ allergyNotes: '' });
  const [allergyNotes, setAllergyNotes] = useState("");

  const { userData, backendUrl, isLoggedin, bookings} = useContext(AppContext)




  const [currentBookings, setCurrentBookings] = useState(0); // Track current bookings for selected date
  const [isFullyBooked, setIsFullyBooked] = useState(false); // Track if fully booked
  

  const handleDateSelect = (date) => {
    const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000); // Adjust for local timezone
    setSelectedDate(localDate); // Store the adjusted local date
    setShowCalendar(false); // Hide the calendar after selecting the date
  };


  const dateKey = selectedDate ? selectedDate.toISOString().split("T")[0] : null;


  
// Fetch trail data and current bookings
const fetchTrailData = async () => {
  const foundTrail = trails.find((item) => item._id === trailId);
  if (foundTrail) {
    setTrailData({
      ...foundTrail,
      bookingsPerDay: foundTrail.bookingsPerDay || {}, // Ensure bookingsPerDay is an object
    });

    const initialImage = Array.isArray(foundTrail.image) && foundTrail.image.length > 0
      ? foundTrail.image[0]
      : foundTrail.image || '';
    setImage(initialImage);

    // Fetch current bookings for the selected date
    const formattedDate = selectedDate ? selectedDate.toISOString().split('T')[0] : '';
    const bookingsForSelectedDate = foundTrail.bookingsPerDay[formattedDate] || 0;
    setCurrentBookings(bookingsForSelectedDate);

    // Check if the trail is fully booked
    setIsFullyBooked(bookingsForSelectedDate >= foundTrail.dailyQuota);
    
    const updatedRentalOptions = (foundTrail.rentalOptions || []).map((option) => ({
      ...option,
      quantity: 0,
    }));
    setRentalOptions(updatedRentalOptions);
  }

  try {
    const response = await axios.get(`${backendUrl}/api/trail/${trailId}`);

    const trail = response.data.trail;

    const reviewsResponse = await axios.get(`${backendUrl}/api/review/trail/${trailId}`);
    trail.reviews = reviewsResponse.data.reviews || [];

    setTrailData(trail);
} catch (error) {
    console.error("Error fetching trail data:", error);
    toast.error("Failed to load trail details.");
}

};




  useEffect(() => {
    fetchTrailData();
  }, [trailId, trails,selectedDate]);


  useEffect(() => {
    if (!trailData || !trailData.nationality) return;

    const basePrice = 0;

    const nationalityPrice = isMalaysian
      ? trailData.nationality.malaysian
      : trailData.nationality.foreign;
    const mealPrice = selectedMealOption ? selectedMealOption.price : 0;
    const guidePrice = selectedGuideOption ? selectedGuideOption.price : 0;
    const stayPrice = selectedStay ? selectedStay.price : 0;

    const rentalPrice = rentalOptions.reduce(
      (total, option) => total + option.price * option.quantity,
      0
    );

    setTotalPrice(basePrice + mealPrice + guidePrice + stayPrice + rentalPrice + nationalityPrice);
  }, [
    selectedPackage,
    selectedStay,
    selectedMealOption,
    selectedGuideOption,
    rentalOptions,
    isMalaysian,
    trailData?.nationality, // Safe access to nationality
  ]);


  const formattedDate = selectedDate ? selectedDate.toISOString().split('T')[0] : '';

  const updateSummary = (key, value) => {
    setSummary((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleBooking = async () => {
    if (!isLoggedin) {
      toast.error("You need to log in to book a trail.");
      navigate('/login');
      return;
    }
  
    if (!userData?.isAccountVerified) {
      toast.error("Please verify your email to proceed with the booking.");
      navigate('/email-verify');
      return;
    }
  
    if (!selectedDate || isFullyBooked) {
      toast.error("Please select an available date before booking.");
      return;
    }
  
    const insufficientStockItem = rentalOptions.find((option) => {
      const trailRental = trailData.rentalOptions.find((item) => item.item === option.item);
      if (trailRental) {
        const availableStock = trailRental.quantity - trailRental.rentedQuantity;
        return option.quantity > availableStock;
      }
      return false;
    });
  
    if (insufficientStockItem) {
      const trailRental = trailData.rentalOptions.find((item) => item.item === insufficientStockItem.item);
      const availableStock = trailRental.quantity - trailRental.rentedQuantity;
  
      toast.error(
        `The item "${insufficientStockItem.item}" has insufficient stock. Available: ${availableStock}. Please adjust the quantity.`
      );
      return;
    }
  
    const dateKey = selectedDate.toISOString().split("T")[0];
  
    if (selectedGuide) {
      const assignedHikers = selectedGuide.assignedHikers?.[dateKey] || 0;
      if (assignedHikers >= selectedGuide.maxHikers) {
        toast.error(
          `The guide "${selectedGuide.guideName}" is fully booked for ${dateKey}. Please select another guide or date.`
        );
        return;
      }
    }
  
    const bookingData = {
      userId: userData._id,
      trailId: trailId,
      slotDate: dateKey,
      state: trailData.state,
      nationality: isMalaysian
        ? { malaysian: trailData.nationality.malaysian, foreign: 0 }
        : { malaysian: 0, foreign: trailData.nationality.foreign },
      packages: selectedPackage
        ? [
            {
              ...selectedPackage,
              stays: selectedStay ? [selectedStay] : selectedPackage.stays || [],
              price: selectedStay?.price || selectedPackage.price || 0,
            },
          ]
        : [],
      mealsOption: selectedMealOption
        ? [
            {
              mealsIncluded: selectedMealOption.mealsIncluded,
              specialNotes: allergyNotes,
              price: selectedMealOption.price,
            },
          ]
        : [],
      guideOption: selectedGuideOption && selectedGuide
        ? {
            guideIncluded: selectedGuideOption.guideIncluded,
            guidesInfo: [
              {
                ...selectedGuide,
                assignedHikers: {
                  ...selectedGuide.assignedHikers,
                  [dateKey]: (selectedGuide.assignedHikers?.[dateKey] || 0) + 1,
                },
              },
            ],
            price: selectedGuideOption.price,
          }
        : null,
      rentalOptions: rentalOptions
        .filter((option) => option.quantity > 0)
        .map((option) => ({
          item: option.item,
          rentedQuantity: option.quantity,
          price: option.price,
        })),
    };

  

  
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/book-trail`, bookingData);
      if (data.success) {
        toast.success(data.message);
        fetchTrailData();
        setSelectedDate(null);
        console.log("Booking Data Sent to Backend:", bookingData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Booking Error:", error);
      toast.error(
        error.response?.data?.message ||
        "An unexpected error occurred. Please try again later."
      );
    }
  };

  const urlBookingId = searchParams.get('bookingId');
  const currentBooking = bookings.find(
    (booking) => booking.trailId === trailId
  );
  const bookingId = urlBookingId || currentBooking?._id;

  const handleNewReview = (newReview) => {
    setTrailData((prev) => ({
      ...prev,
      reviews: [...prev.reviews, newReview],
    }));
  };



  return trailData ? (
    <div className="pt-8 transition-opacity ease-in duration-500 opacity-100">
      <h1 className="font-bold text-4xl text-center mt-6">{trailData.name}</h1>

      {/* Images Section */}
      <div className="flex mt-6">
        <div className="flex flex-col w-1/6 gap-3">
          {(Array.isArray(trailData.image) ? trailData.image : [trailData.image]).map((item, index) => (
            <img
              key={index}
              src={item}
              alt={trailData.name}
              className="w-full h-[100px] object-cover cursor-pointer border border-gray-300 p-1 rounded-lg"
              onClick={() => setImage(item)}
            />
          ))}
        </div>
        <div className="flex-1">
          <img
            className="w-full h-[500px] object-cover rounded-lg"
            src={image}
            alt={trailData.name}
          />
        </div>
      </div>

      {/* Booking Options */}
      <h2 className="text-2xl font-semibold mt-8">Package Options</h2>
      <div className="flex mt-6 gap-6">
        <div className="w-[60%] border border-red-200 rounded-lg p-6 bg-gray-50 shadow-md">
          {/* Date Picker */}
          <h3 className="text-xl font-medium mb-4">Select Option</h3>
          <div className="mt-4">
            <p>Please select date:</p>
            <button
              onClick={() => setShowCalendar((prev) => !prev)}
              className="bg-red-50 p-2 rounded mt-2"
            >
              Check Availability
            </button>
            {showCalendar && (
              <div className="mt-2">
         <DatePicker
  selected={selectedDate}
  onChange={handleDateSelect}
  inline
  filterDate={(date) => {
    const today = new Date();
    // Allow date selection for today and future dates
    return date >= today;
  }}
/> 


              </div>
            )}
            {formattedDate && <p className="mt-2">Date: {formattedDate}</p>}
          </div>


          {/* Nationality Selection */}
          <h4 className="mt-6 font-medium">Nationality:</h4>
          <div className="flex gap-4 mt-2">
            {trailData?.nationality ? ( // Safe access to nationality
              <>
                {/* Malaysian Option */}
                <div
                  onClick={() => setIsMalaysian(true)}
                  className={`cursor-pointer rounded-full border border-red-200 p-2 text-center flex items-center justify-center ${isMalaysian === true ? 'bg-red-500 text-white' : 'bg-white text-black'
                    }`}
                >
                  Malaysian
                  <span className="ml-2 text-sm text-gray-600">
                    RM {trailData.nationality.malaysian.toFixed(2)}
                  </span>
                </div>

                {/* Foreign Option */}
                <div
                  onClick={() => setIsMalaysian(false)}
                  className={`cursor-pointer rounded-full border border-red-200 p-2 text-center flex items-center justify-center ${isMalaysian === false ? 'bg-red-500 text-white' : 'bg-white text-black'
                    }`}
                >
                  Non-Malaysian
                  <span className="ml-2 text-sm text-gray-600">
                    RM {trailData.nationality.foreign.toFixed(2)}
                  </span>
                </div>
              </>
            ) : (
              <div className="p-4">No Option Available</div>
            )}
          </div>



          {/* Package Selection */}
          <h4 className="mt-6 font-medium">Package Type:</h4>
          <div className="flex gap-4 mt-2">
            {trailData.packages && trailData.packages.length > 0 ? (
              trailData.packages.map((pkg, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setSelectedPackage(pkg);
                    setSelectedStay(null); // Reset stay selection
                    setSelectedMealOption(null); // Reset meal selection
                    setSelectedGuideOption(null); // Reset guide selection
                  }}
                  className={`cursor-pointer rounded-full border border-red-200 p-2 text-center flex items-center justify-center ${selectedPackage === pkg ? 'bg-red-500 text-white' : 'bg-white text-black'}`}
                >
                  {pkg.duration}
                </div>
              ))
            ) : (
              <div className="p-4">No packages available</div>
            )}
          </div>

          {/* Stay Option Selection */}
          <h4 className="mt-6 font-medium">Stay Option:</h4>
          <div className="flex gap-4 mt-2">
            {selectedPackage && selectedPackage.stays && selectedPackage.stays.length > 0 ? (
              selectedPackage.stays.map((stay, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedStay(stay)}
                  className={`cursor-pointer rounded-full border border-red-200 p-2 text-center flex items-center justify-center ${selectedStay === stay ? 'bg-red-500 text-white' : 'bg-white text-black'}`}
                >
                  Stay at {stay.place} - RM {stay.price.toFixed(2)}
                </div>
              ))
            ) : (
              <div className="p-4">No Stay available</div>
            )}
          </div>



          {/* Meal Option Selection */}
          <h4 className="mt-6 font-medium">Meal Option:</h4>
          <div className="flex flex-col gap-4 mt-2">
            {trailData.mealsOption?.length > 0 ? (
              trailData.mealsOption.map((option, index) => (
                <div key={index} className="flex items-center gap-4">
                  {/* Include Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedMealOption(option);
                      updateSummary("mealOption", "Included");
                    }}
                    className={`cursor-pointer rounded-full border p-2 text-center flex items-center justify-center transition ${selectedMealOption === option
                      ? "bg-red-500 text-white border-red-500"
                      : "bg-white text-black border-red-200"
                      }`}
                    aria-pressed={selectedMealOption === option}
                  >
                    Include
                  </button>

                  {/* Not Include Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedMealOption(null); // Deselect meal option
                      updateSummary("mealOption", "Not Included");
                    }}
                    className={`cursor-pointer rounded-full border p-2 text-center flex items-center justify-center transition ${selectedMealOption === option ? "bg-white text-black border-red-200" : "bg-red-500 text-white border-red-500"
                      }`}
                    aria-pressed={selectedMealOption !== option}
                  >
                    Not Include
                  </button>
                </div>
              ))
            ) : (
              <div className="p-4 text-gray-600">
                No meal options available for this trail.
              </div>
            )}


            {selectedMealOption?.mealsIncluded && (
              <form className="mt-4">
                <label
                  htmlFor="allergyNotes"
                  className="block text-sm font-medium text-gray-700"
                >
                  Any food allergy?
                </label>
                <textarea
                  id="allergyNotes"
                  name="allergyNotes"
                  placeholder="Enter any food allergies here"
                  rows="3"
                  className="mt-2 w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                  value={allergyNotes}
                  onChange={(e) => setAllergyNotes(e.target.value)}
                ></textarea>
              </form>
            )}
          </div>


          {/* Guide Option Selection */}
          <h4 className="mt-6 font-medium">Guide Option:</h4>
          <div className="flex gap-4 mt-2">
            {/* 'Include' Option */}
            {trailData.guideOption?.guideIncluded && (
              <>
                <div
                  onClick={() => {
                    // Select the "Include" option
                    setSelectedGuideOption(trailData.guideOption);
                    setSelectedGuide(null); // Reset guide selection
                  }}
                  className={`cursor-pointer rounded-full border border-red-200 p-2 text-center flex items-center justify-center ${selectedGuideOption === trailData.guideOption
                    ? "bg-red-500 text-white"
                    : "bg-white text-black"
                    }`}
                >
                  Include {trailData.guideOption.price > 0 ? `(+RM ${trailData.guideOption.price})` : "(RM 0)"}
                </div>

                {/* 'Not Include' Option */}
                <div
                  onClick={() => {
                    // Select the "Not Include" option
                    setSelectedGuideOption(null);
                    setSelectedGuide(null); // Reset guide selection
                  }}
                  className={`cursor-pointer rounded-full border border-gray-300 p-2 text-center flex items-center justify-center ${!selectedGuideOption ? "bg-red-500 text-white" : "bg-white text-black"
                    }`}
                >
                  Not Include
                </div>
              </>
            )}

            {/* Fallback if no guide options are available */}
            {!trailData.guideOption?.guideIncluded && <div className="p-4">No Guide Option</div>}
          </div>

{/* Guide Selection Dropdown */}
{selectedGuideOption && (
  <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm">
    <label
      htmlFor="guideSelection"
      className="block text-md font-semibold text-gray-800 mb-2"
    >
      Select a Guide
    </label>
    <div className="relative">
      {selectedDate && (
        <select
          id="guideSelection"
          onChange={(e) => {
            const selectedGuideName = e.target.value;
            const guide = selectedGuideOption.guidesInfo.find(
              (g) => g.guideName === selectedGuideName
            );
            setSelectedGuide(guide || null);
          }}
          value={selectedGuide ? selectedGuide.guideName : ""}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-red-500 focus:outline-none transition ease-in-out"
        >
          <option value="" disabled>
            -- Select Guide --
          </option>
          {selectedGuideOption.guidesInfo.map((guide, index) => {
            const assignedHikers = dateKey
              ? guide.assignedHikers?.[dateKey] || 0
              : 0;
            const isAvailable = assignedHikers < guide.maxHikers;

            return (
              <option
                key={index}
                value={guide.guideName}
                disabled={!isAvailable} // Disable fully booked guides
              >
                {guide.guideName} (Assigned: {assignedHikers}/{guide.maxHikers})
                {isAvailable ? "" : " - Fully Booked"}
              </option>
            );
          })}
        </select>
      )}

      {/* Availability Message */}
      {selectedGuide && dateKey && (
        <p
          className={`mt-2 text-sm ${
            (selectedGuide.assignedHikers?.[dateKey] || 0) < selectedGuide.maxHikers
              ? "text-green-500"
              : "text-red-500"
          }`}
        >
          {(selectedGuide.assignedHikers?.[dateKey] || 0) < selectedGuide.maxHikers
            ? "Guide is available for the selected date."
            : "Guide is fully booked for the selected date."}
        </p>
      )}
    </div>
  </div>
)}


        </div>

        {/* Rental Options and Summary */}
        <div className="w-[40%] flex flex-col gap-4">
          {/* Rental Option Section */}
          <div className="border border-red-200 rounded-lg p-6 bg-gray-50 shadow-md">

            <h3 className="text-lg font-semibold mb-4 border-b pb-2 text-gray-800">Rental Options</h3>
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {rentalOptions.length > 0 ? (
                rentalOptions.map((option, index) => (
                  <div key={index} className="flex items-center justify-between mb-4">
                    <div className="flex flex-col items-center">
                      <img
                        src={option.image}
                        alt={option.item}
                        className="w-40 h-40 object-cover mb-2"
                      />
                      <p className="text-center font-bold">{option.item}</p>
                      <p className="text-center">{currencySymbol} {option.price.toFixed(2)} / unit</p>
                    </div>
                    <div className="flex items-center">
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded-l"
                        onClick={() => {
                          const updatedOptions = rentalOptions.map((opt, idx) =>
                            idx === index && opt.quantity > 0
                              ? { ...opt, quantity: opt.quantity - 1 }
                              : opt
                          );
                          setRentalOptions(updatedOptions);
                        }}
                      >
                        -
                      </button>
                      <span className="px-4">{option.quantity}</span>
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded-r"
                        onClick={() => {
                          const updatedOptions = rentalOptions.map((opt, idx) =>
                            idx === index ? { ...opt, quantity: opt.quantity + 1 } : opt
                          );
                          setRentalOptions(updatedOptions);
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p>No rental options available</p>
              )}
            </div>
          </div>

          <div className="border border-red-200 rounded-lg p-4 flex-1 shadow-sm bg-gray-50">
            {/* Summary Header */}
            <h3 className="text-lg font-semibold mb-4 border-b pb-2 text-gray-800">
              Summary
            </h3>

            {/* Trail and Date */}
            <div className="space-y-2 text-gray-700">
              <p>
                <strong>Trail:</strong> {trailData.name}
              </p>
              <p>
                <strong>Date:</strong> {formattedDate}
              </p>
            </div>

            {/* Nationality */}
            {isMalaysian !== null && (
              <p className="mt-2">
                <strong>Nationality:</strong> {isMalaysian ? "Malaysian" : "Non-Malaysian"}
                {" - "}
                {currencySymbol}{" "}
                {isMalaysian
                  ? (trailData.nationality?.malaysian || 0).toFixed(2)
                  : (trailData.nationality?.foreign || 0).toFixed(2)}
              </p>
            )}

            {/* Package */}
            {selectedPackage && (
              <p>
                <strong>Package:</strong> {selectedPackage.duration}
              </p>
            )}

            {/* Stay */}
            {selectedStay && (
              <p>
                <strong>Stay:</strong> {selectedStay.place} - {currencySymbol}{" "}
                {selectedStay.price.toFixed(2)}
              </p>
            )}

            {/* Meal Summary */}
            <p>
              <strong>Meal:</strong>{" "}
              {selectedMealOption
                ? selectedMealOption.mealsIncluded
                  ? "Included"
                  : "Not Included"
                : trailData.mealsOption?.length > 0
                  ? trailData.mealsOption[0].mealsIncluded
                    ? "Not Included"
                    : ""
                  : "No Meals Option"}
            </p>

            {/* Guide Summary */}
            <p>
              <strong>Guide:</strong>{" "}
              {selectedGuideOption
                ? selectedGuideOption.guideIncluded
                  ? "Included"
                  : "Not Included"
                : trailData.guideOption && trailData.guideOption.length > 0
                  ? "Included in Package"
                  : "No Guide Option"}
            </p>

            {/* Selected Guide Details */}
            {selectedGuide && (
              <div className="mt-4 bg-white border rounded-lg p-3 shadow-inner text-gray-700">
                <h4 className="text-md font-semibold text-gray-800 mb-2">
                  Selected Guide Details
                </h4>
                <div className="space-y-1 text-sm">
                  <p>
                    <strong>Name:</strong> {selectedGuide.guideName}
                  </p>
                  <p>
                    <strong>Experience:</strong> {selectedGuide.experience} years
                  </p>
                  <p>
                    <strong>Contact:</strong> {selectedGuide.contactNumber}
                  </p>
                  <p>
                    <strong>Email:</strong>{" "}
                    <a
                      href={`mailto:${selectedGuide.email}`}
                      className="text-red-500 hover:underline"
                    >
                      {selectedGuide.email}
                    </a>
                  </p>
                </div>
              </div>
            )}

            {/* Allergy Notes */}
            {allergyNotes && (
              <p className="mt-2">
                <strong>Allergy Notes:</strong> {allergyNotes}
              </p>
            )}

            {/* Rental Items */}
            {rentalOptions.filter((option) => option.quantity > 0).length > 0 && (
              <>
                <h4 className="mt-4 text-md font-semibold text-gray-800">Rentals:</h4>
                <div className="space-y-1">
                  {rentalOptions
                    .filter((option) => option.quantity > 0)
                    .map((option, index) => (
                      <p key={index} className="text-sm">
                        <strong>{option.item}:</strong> x{option.quantity}
                      </p>
                    ))}
                </div>
              </>
            )}

            {/* Total Price */}
            <h4 className="text-xl font-bold mt-4 text-gray-900">
              Total: {currencySymbol} {totalPrice.toFixed(2)}
            </h4>
            {/* Book Button */}
            <button
  disabled={!selectedDate || isFullyBooked || (selectedGuideOption && !selectedGuide)}
  onClick={handleBooking}
  className={`${!selectedDate || isFullyBooked || (selectedGuideOption && !selectedGuide)
    ? "bg-gray-400 cursor-not-allowed"
    : "bg-red-500 hover:bg-red-600"
    } text-white text-md font-medium px-8 py-3 rounded-full mt-6 w-full transition duration-300`}
>
  {isFullyBooked ? "Fully Booked" : "Book Now"}
</button>



          </div>


        </div>
      </div>


      <h5 className='text-2xl font-semibold mt-8 '>More To Know</h5>

      <div className="flex mt-6">
        <div className='w-[60%] border border-red-200 rounded-lg p-6 bg-gray-50 shadow-md'>
          {trailData.add_info && trailData.add_info.length > 0 ? (
            <div className="overflow-auto max-h-96">
              {Array.isArray(trailData.add_info) ? (
                <ul className="list-disc pl-5">
                  {trailData.add_info.map((info, index) => (
                    <li key={index} className="mb-2">{info}</li>
                  ))}
                </ul>
              ) : (
                <p>{trailData.add_info}</p> // Handles single long paragraph
              )}
            </div>
          ) : (
            <p>No additional information available for this trail.</p>
          )}
        </div>


        <div className='w-[40%] border border-red-200 rounded-lg p-6 bg-gray-50 shadow-md ml-4'>
          <h5 className='text-lg font-semibold mb-4 border-b pb-2 text-gray-800'>Additional Information</h5>

          {/* Map Section */}
          <div className="mt-8">
            <h4 className='mt-6 font-medium'>Trail Map</h4>
            {selectedStay?.mapUrl || trailData?.mapUrl ? (
              <iframe
                src={selectedStay?.mapUrl || trailData?.mapUrl}
                width="100%"
                height="450"
                className="rounded-lg border border-gray-300"
                allowFullScreen
                loading="lazy"
              ></iframe>
            ) : trailData.packages[0].mapUrl ? ( // Check mapUrl inside packages
              <iframe
                src={trailData.packages[0].mapUrl}
                className="w-full h-[400px] mt-4 border rounded-lg"
                title="Trail Map"
                allowFullScreen
              ></iframe>
            ) : (
              <p className="mt-4 text-red-500">No map available for this trail.</p>
            )}
          </div>






        </div>
      </div>



      <RelatedTrails trailId={trailId} state={trailData.state} />

      {/* Reviews Section */}
      <div id="review-section" className="mt-12">
      <h5 className="text-3xl font-semibold mt-8 mb-6">Reviews</h5>
      <div
        className="w-full border border-red-200 rounded-lg p-6 max-h-96 overflow-y-scroll scrollbar scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200"
      >
        <Reviews
          reviews={trailData.reviews || []}
          onSubmitReview={handleNewReview}
          userId={userData?._id}
          trailId={trailData?._id}
          bookingId={bookingId} // Corrected bookingId logic
        />
      </div>
    </div>


    </div>

  ) : (
    <div>Loading...</div>
  );


};


export default Booking;
