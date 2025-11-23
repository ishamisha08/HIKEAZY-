import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import { toast } from 'react-toastify'
import axios from 'axios'
import { AdminContext } from '../../context/AdminContext'

const AddTrail = () => {


    const [image1, setImage1] = useState(false)
    const [image2, setImage2] = useState(false)
    const [image3, setImage3] = useState(false)
    const [image4, setImage4] = useState(false)


    const [trailName, setTrailName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [state, setState] = useState('')
    const [location, setLocation] = useState('')
    const [priceMalaysian, setPriceMalaysian] = useState(0)
    const [priceForeign, setPriceForeign] = useState(0)
    const [packages, setPackages] = useState([])
    const [mealsOption, setMealsOption] = useState([])
    const [guideOption, setGuideOption] = useState([])
    const [moreInfo, setMoreInfo] = useState('')
    const [dailyQuota, setDailyQuota] = useState(0)
    const [rentalOptions, setRentalOptions] = useState([]);


    const handleChange = (e) => {
        setMoreInfo(e.target.value);  // Update the state with the textarea input

    };




    const { backendUrl, aToken } = useContext(AdminContext)



    const handleSubmit = async (e) => {
        e.preventDefault();

        try {


            if (!trailName || !email || !password || !state) {
                return toast.error('Please fill in all required fields.');
            }

            const formData = new FormData();

            formData.append('name', trailName);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('state', state);
            formData.append('location', location);
            formData.append('nationality', JSON.stringify({ malaysian: parseFloat(priceMalaysian), foreign: parseFloat(priceForeign) }));
            formData.append('packages', JSON.stringify(packages));
            formData.append('mealsOption', JSON.stringify(mealsOption));
            formData.append('guideOption', JSON.stringify(guideOption));
            formData.append('add_info', moreInfo)
            formData.append('dailyQuota', dailyQuota);
            formData.append('rentalOptions', JSON.stringify(rentalOptions))

            // Append rental images
            rentalOptions.forEach((option, index) => {
                if (option.image instanceof File) {
                    formData.append(`rentalImages`, option.image);
                }

            })


            image1 && formData.append("image1", image1)
            image2 && formData.append("image2", image2)
            image3 && formData.append("image3", image3)
            image4 && formData.append("image4", image4)





            // Debugging FormData
            formData.forEach((value, key) => {
                console.log(`${key}:`, value);
            });

            const { data } = await axios.post(backendUrl + '/api/admin/add-trail', formData, { headers: { aToken } });

            if (data.success) {
                toast.success(data.message)
                // Clear images
                setImage1(null);
                setImage2(null);
                setImage3(null);
                setImage4(null);

                // Reset form fields
                setTrailName('');
                setEmail('');
                setPassword('');
                setLocation('');
                setState('');
                setPackages([]); // Assuming `packages` is an array
                setRentalOptions([]); // Assuming `rentalOptions` is an array
                setMealsOption([]); // Assuming `mealsOption` is an array
                setGuideOption([]); // Assuming `guideOption` is an array
                setMoreInfo('');
                setDailyQuota('');
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.error("Error adding trail:", error.response?.data || error.message);
            toast.error(error.response?.data?.message || "An unexpected error occurred");
        }
    };




    return (
        <form
            onSubmit={handleSubmit}
            className="m-5 max-h-[80vh] w-full max-w-6xl bg-gray-100 p-6 rounded-lg shadow-md overflow-y-auto"
        >


            <h1 className="text-3xl font-extrabold text-center mb-8 text-gray-800">Add Hiking Coordinator</h1>

            <div>
                <p className="block font-medium mb-1">Upload Image</p>

                <div className='flex gap-2'>
                    <label htmlFor="image1">
                        <img className='w-40' src={!image1 ? assets.upload_area : URL.createObjectURL(image1)} alt="" />
                        <input onChange={(e) => setImage1(e.target.files[0])} type="file" id="image1" hidden />
                    </label>
                    <label htmlFor="image2">
                        <img className='w-40' src={!image2 ? assets.upload_area : URL.createObjectURL(image2)} alt="" />
                        <input onChange={(e) => setImage2(e.target.files[0])} type="file" id="image2" hidden />
                    </label>
                    <label htmlFor="image3">
                        <img className='w-40' src={!image3 ? assets.upload_area : URL.createObjectURL(image3)} alt="" />
                        <input onChange={(e) => setImage3(e.target.files[0])} type="file" id="image3" hidden />
                    </label>
                    <label htmlFor="image4">
                        <img className='w-40' src={!image4 ? assets.upload_area : URL.createObjectURL(image4)} alt="" />
                        <input onChange={(e) => setImage4(e.target.files[0])} type="file" id="image4" hidden />
                    </label>

                </div>

            </div>



            {/* Trail Details */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label htmlFor="trail-name" className="block font-medium mb-1">
                        Trail Name
                    </label>
                    <input onChange={(e) => setTrailName(e.target.value)} type="text" id="trail-name" className="w-full p-2 border rounded-lg"
                        value={trailName}
                        placeholder="Name"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block font-medium mb-1">
                        Email
                    </label>
                    <input onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border rounded-lg" type="email" id="email"
                        value={email}
                        placeholder="email"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block font-medium mb-1">
                        Password
                    </label>
                    <input onChange={(e) => setPassword(e.target.value)} className="w-full p-2 border rounded-lg" type="password" id="password"
                        value={password}
                        placeholder="password"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="state" className="block font-medium mb-1">
                        State
                    </label>
                    <select onChange={(e) => setState(e.target.value)} className="w-full p-2 border rounded-lg"
                        id="state"
                        value={state}
                        required
                    >
                        <option value="" disabled>
                            Select a state
                        </option>
                        <option value="Johor">Johor</option>
                        <option value="Kedah">Kedah</option>
                        <option value="Kelantan">Kelantan</option>
                        <option value="Melaka">Melaka</option>
                        <option value="Negeri Sembilan">Negeri Sembilan</option>
                        <option value="Pahang">Pahang</option>
                        <option value="Perak">Perak</option>
                        <option value="Perlis">Perlis</option>
                        <option value="Pulau Pinang">Pulau Pinang</option>
                        <option value="Sabah">Sabah</option>
                        <option value="Sarawak">Sarawak</option>
                        <option value="Selangor">Selangor</option>
                        <option value="Terengganu">Terengganu</option>
                        <option value="Wilayah Persekutuan">Wilayah Persekutuan</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="location" className="block font-medium mb-1">
                        Location
                    </label>
                    <input onChange={(e) => setLocation(e.target.value)} className="w-full p-2 border rounded-lg" type="text" id="location"
                        value={location}
                        placeholder="Location"
                    />
                </div>

            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label htmlFor="price-malaysian" className="block font-medium mb-1">
                        Price (Malaysian)
                    </label>
                    <input onChange={(e) => setPriceMalaysian(e.target.value)} className="w-full p-2 border rounded-lg" type="number" id="price-malaysian"
                        value={priceMalaysian}
                        min="0"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="price-foreign" className="block font-medium mb-1">
                        Price (Non-Malaysian)
                    </label>
                    <input onChange={(e) => setPriceForeign(e.target.value)} className="w-full p-2 border rounded-lg" type="number" id="price-foreign"
                        value={priceForeign}
                        min="0"
                        required
                    />
                </div>

            </section>


            {/* Packages Section */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800">Packages</h2>

                {packages.map((pkg, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg shadow-sm">
                        {/* Package Header */}
                        <div className="flex items-center justify-between bg-gray-100 p-4 rounded-t-lg">
                            <h3 className="text-lg font-semibold text-gray-700">Package {index + 1}</h3>
                            <button
                                type="button"
                                onClick={() => {
                                    const updatedPackages = packages.filter((_, i) => i !== index);
                                    setPackages(updatedPackages);
                                }}
                                className="text-red-500 hover:text-red-700"
                            >
                                Remove
                            </button>
                        </div>

                        {/* Package Content */}
                        <div className="p-6 space-y-4">
                            {/* Duration */}
                            <div className="space-y-2">
                                <label htmlFor={`duration-${index}`} className="block text-gray-600 font-medium" >
                                    Duration
                                </label>
                                <input className="w-full p-3 border border-gray-300 rounded-md focus:outline-blue-500" type="text"
                                    id={`duration-${index}`}
                                    value={pkg.duration.join(', ')} // Convert array to string for display
                                    onChange={(e) => {
                                        const updatedPackages = packages.map((p, i) =>
                                            i === index
                                                ? { ...p, duration: e.target.value.split(',').map(d => d.trim()) }
                                                : p
                                        );
                                        setPackages(updatedPackages);
                                    }}
                                    placeholder="e.g., 3 days, 2 nights"
                                    required
                                />
                            </div>

                            {/* Map URL */}
                            <div className="space-y-2">
                                <label htmlFor={`mapUrl-${index}`} className="block text-gray-600 font-medium">
                                    Map URL
                                </label>
                                <input className="w-full p-3 border border-gray-300 rounded-md focus:outline-blue-500" type="text"
                                    id={`mapUrl-${index}`}
                                    value={pkg.mapUrl || ''}
                                    onChange={(e) => {
                                        const updatedPackages = packages.map((p, i) =>
                                            i === index ? { ...p, mapUrl: e.target.value } : p
                                        );
                                        setPackages(updatedPackages);
                                    }}
                                    placeholder="Enter Map URL"
                                />
                            </div>

                            {/* Stays Section */}
                            <div>
                                <h4 className="text-lg font-semibold text-gray-700">Stays</h4>
                                <div className="space-y-4 mt-4">
                                    {pkg.stays.map((stay, stayIndex) => (
                                        <div key={stayIndex} className="p-4 border border-gray-200 rounded-md bg-gray-50 shadow-sm">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {/* Stay Place */}
                                                <div>
                                                    <label htmlFor={`stay-place-${index}-${stayIndex}`} className="block text-gray-600 font-medium">
                                                        Stay Place
                                                    </label>
                                                    <input className="w-full p-3 border border-gray-300 rounded-md focus:outline-blue-500" type="text"
                                                        id={`stay-place-${index}-${stayIndex}`}
                                                        value={stay.place || ''}
                                                        onChange={(e) => {
                                                            const updatedPackages = packages.map((p, i) => {
                                                                if (i === index) {
                                                                    const updatedStays = p.stays.map((s, si) =>
                                                                        si === stayIndex
                                                                            ? { ...s, place: e.target.value }
                                                                            : s
                                                                    );
                                                                    return { ...p, stays: updatedStays };
                                                                }
                                                                return p;
                                                            });
                                                            setPackages(updatedPackages);
                                                        }}
                                                        placeholder="e.g., Laban Rata Resthouse"
                                                        required
                                                    />
                                                </div>

                                                {/* Stay Price */}
                                                <div>
                                                    <label htmlFor={`stay-price-${index}-${stayIndex}`} className="block text-gray-600 font-medium">
                                                        Stay Price
                                                    </label>
                                                    <input className="w-full p-3 border border-gray-300 rounded-md focus:outline-blue-500" type="number"
                                                        id={`stay-price-${index}-${stayIndex}`}
                                                        value={stay.price || ''}
                                                        onChange={(e) => {
                                                            const updatedPackages = packages.map((p, i) => {
                                                                if (i === index) {
                                                                    const updatedStays = p.stays.map((s, si) =>
                                                                        si === stayIndex
                                                                            ? { ...s, price: parseFloat(e.target.value) }
                                                                            : s
                                                                    );
                                                                    return { ...p, stays: updatedStays };
                                                                }
                                                                return p;
                                                            });
                                                            setPackages(updatedPackages);
                                                        }}
                                                        min="0"
                                                        placeholder="e.g., 200"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            {/* Stay Map URL */}
                                            <div className="mt-4">
                                                <label htmlFor={`stay-mapUrl-${index}-${stayIndex}`} className="block text-gray-600 font-medium">
                                                    Map URL
                                                </label>
                                                <input className="w-full p-3 border border-gray-300 rounded-md focus:outline-blue-500" type="text"
                                                    id={`stay-mapUrl-${index}-${stayIndex}`}
                                                    value={stay.mapUrl || ''}
                                                    onChange={(e) => {
                                                        const updatedPackages = packages.map((p, i) => {
                                                            if (i === index) {
                                                                const updatedStays = p.stays.map((s, si) =>
                                                                    si === stayIndex
                                                                        ? { ...s, mapUrl: e.target.value }
                                                                        : s
                                                                );
                                                                return { ...p, stays: updatedStays };
                                                            }
                                                            return p;
                                                        });
                                                        setPackages(updatedPackages);
                                                    }}
                                                    placeholder="Enter Stay Map URL"
                                                />
                                            </div>

                                            {/* Remove Stay Button */}
                                            <div className="text-right mt-4">
                                                <button className="text-red-500 hover:text-red-700" type="button"
                                                    onClick={() => {
                                                        const updatedPackages = packages.map((p, i) => {
                                                            if (i === index) {
                                                                const updatedStays = p.stays.filter(
                                                                    (_, si) => si !== stayIndex
                                                                );
                                                                return { ...p, stays: updatedStays };
                                                            }
                                                            return p;
                                                        });
                                                        setPackages(updatedPackages);
                                                    }}
                                                >
                                                    Remove Stay
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Add Stay Button */}
                                <div className="text-right mt-4">
                                    <button className="p-2 bg-red-400 text-white rounded-md hover:bg-red-600" type="button"
                                        onClick={() => {
                                            const updatedPackages = packages.map((p, i) =>
                                                i === index
                                                    ? { ...p, stays: [...p.stays, { place: '', price: 0, mapUrl: '' }] }
                                                    : p
                                            );
                                            setPackages(updatedPackages);
                                        }}
                                    >
                                        Add Stay
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Add Package Button */}
                <button className="w-auto p-3 bg-red-400 text-white rounded-lg hover:bg-red-600" type="button"
                    onClick={() => {
                        setPackages([...packages, { duration: [], stays: [], mapUrl: '' }]);
                    }}
                >
                    Add Package
                </button>
            </div>






            <h2 className="text-2xl font-bold text-gray-800 mt-6">Rental Options</h2>
            {rentalOptions.map((option, index) => (
                <div key={index} className="relative border border-gray-300 rounded-md p-6 mb-6 bg-grey shadow-md">

                    {/* Title and Remove Button */}
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-700">
                            Rental Option {index + 1}
                        </h3>
                        <button className="text-red-500 hover:text-red-7" type="button"
                            onClick={() => {
                                const updatedOptions = rentalOptions.filter((_, i) => i !== index);
                                setRentalOptions(updatedOptions);
                            }}
                        >
                            Remove
                        </button>
                    </div>

                    {/* Rental Option Name */}
                    <div className="mb-4">
                        <label htmlFor={`rental-item-${index}`} className="block text-gray-600 font-medium">
                            Item Name
                        </label>
                        <input className="w-full p-3 border border-gray-300 rounded-md focus:outline-blue-500" type="text"
                            id={`rental-item-${index}`}
                            value={option.item || ""}
                            onChange={(e) => {
                                const updatedOptions = rentalOptions.map((rental, i) =>
                                    i === index ? { ...rental, item: e.target.value } : rental
                                );
                                setRentalOptions(updatedOptions);
                            }}
                            placeholder="e.g., Hiking Pole"
                            required
                        />
                    </div>

                    {/* Rental Price */}
                    <div className="mb-4">
                        <label htmlFor={`rental-price-${index}`} className="block text-gray-600 font-medium">
                            Price (RM)
                        </label>
                        <input className="w-full p-3 border border-gray-300 rounded-md focus:outline-blue-500" type="number"
                            id={`rental-price-${index}`}
                            value={option.price || ""}
                            onChange={(e) => {
                                const updatedOptions = rentalOptions.map((rental, i) =>
                                    i === index
                                        ? { ...rental, price: parseFloat(e.target.value) }
                                        : rental
                                );
                                setRentalOptions(updatedOptions);
                            }}
                            min="0"
                            placeholder="e.g., 1200"
                            required
                        />
                    </div>

                    {/* Rental Quantity */}
                    <div className="mb-4">
                        <label htmlFor={`rental-quantity-${index}`} className="block text-gray-600 font-medium">
                            Quantity
                        </label>
                        <input
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-blue-500"
                            type="number"
                            id={`rental-quantity-${index}`}
                            value={option.quantity || ""}
                            onChange={(e) => {
                                const updatedOptions = rentalOptions.map((rental, i) =>
                                    i === index ? { ...rental, quantity: parseInt(e.target.value, 10) || 0 } : rental
                                );
                                setRentalOptions(updatedOptions);
                            }}
                            min="1"
                            placeholder="e.g., 5"
                            required
                        />
                    </div>


                    {/* Rental Image */}
                    <div>
                        <label htmlFor={`rental-image-${index}`} className="block text-gray-600 font-medium">
                            Image
                        </label>
                        <input className="w-full"
                            type="file"
                            id={`rental-image-${index}`}
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    if (!file.type.startsWith("image/")) {
                                        alert("Please upload a valid image file.");
                                        return;
                                    }
                                    if (file.size > 2 * 1024 * 1024) {
                                        alert("File size exceeds 2MB.");
                                        return;
                                    }

                                    // Update the rentalOptions state with the selected file
                                    const updatedOptions = rentalOptions.map((rental, i) =>
                                        i === index ? { ...rental, image: file } : rental
                                    );
                                    setRentalOptions(updatedOptions);
                                }
                            }}
                            accept="image/*"
                        />
                        {option.image && (
                            <img
                                src={option.image instanceof File ? URL.createObjectURL(option.image) : option.image}
                                alt={`Rental Option ${index + 1}`}
                                className="mt-2 w-24 h-24 object-cover rounded-md border"
                            />
                        )}

                    </div>

                </div>
            ))}

            {/* Add Rental Option Button */}
            <button onClick={() => setRentalOptions([...rentalOptions, { item: "", price: 0, quantity: 1, image: null }])}
                type="button"
                className="w-auto p-3 mt-6 bg-red-400 text-white font-semibold rounded-md hover:bg-red-600 transition duration-200">
                Add Rental Option
            </button>
















            {/* Meals Options */}
            <h2 className="text-xl font-semibold mt-6 mb-4">Meals Options</h2>
            <div className="flex flex-col gap-4 mb-6 p-4 border rounded-lg shadow-sm bg-white">

                {/* Is meal Included? */}
                <div className="flex items-center justify-between">
                    <label htmlFor="meals-included" className="font-medium text-gray-700">
                        Is a Meal included?
                    </label>
                    <select className="p-2 border rounded-lg focus:outline-blue-500" id="meals-included"
                        value={mealsOption.mealsIncluded ? "yes" : "no"}
                        onChange={(e) =>
                            setMealsOption({
                                ...mealsOption,
                                mealsIncluded: e.target.value === "yes",
                                price: e.target.value === "yes" ? mealsOption.price || 0 : 0,
                                mealsInfo: e.target.value === "yes" ? mealsOption.mealsInfo || [] : [],
                            })
                        }
                    >
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                    </select>
                </div>

                {/* Meals Price */}
                {mealsOption.mealsIncluded && (
                    <div className="flex flex-col mt-4">
                        <label htmlFor="meals-price" className="font-medium text-gray-700">
                            Set Meal Price (RM):
                        </label>
                        <input type="number" id="meals-price" className="p-2 border rounded-lg mt-1 focus:outline-blue-500"
                            value={mealsOption.price ?? ""}
                            onChange={(e) =>
                                setMealsOption({
                                    ...mealsOption,
                                    price: parseFloat(e.target.value), // Allow setting 0
                                })
                            }
                            min="0"
                            placeholder="e.g., 100"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            Set to RM 0 if the meal price is already included in the package.
                        </p>
                    </div>
                )}

            </div>



            {/* Guide Options */}
            <h2 className="text-xl font-semibold mt-6 mb-4">Guide Options</h2>
            <div className="flex flex-col gap-4 mb-6 p-4 border rounded-lg shadow-sm bg-white">

                {/* Is Guide Included? */}
                <div className="flex items-center justify-between">
                    <label htmlFor="guide-included" className="font-medium text-gray-700">
                        Is a guide included?
                    </label>
                    <select
                        id="guide-included"
                        value={guideOption.guideIncluded ? "yes" : "no"}
                        onChange={(e) =>
                            setGuideOption({
                                ...guideOption,
                                guideIncluded: e.target.value === "yes",
                                price: e.target.value === "yes" ? guideOption.price || 0 : 0,
                                guidesInfo: e.target.value === "yes" ? guideOption.guidesInfo || [] : [],
                            })
                        }
                        className="p-2 border rounded-lg focus:outline-blue-500"
                    >
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                    </select>
                </div>

                {/* Guide Price */}
                {guideOption.guideIncluded && (
                    <div className="flex flex-col mt-4">
                        <label htmlFor="guide-price" className="font-medium text-gray-700">
                            Set Guide Price (RM):
                        </label>
                        <input
                            type="number"
                            id="guide-price"
                            className="p-2 border rounded-lg mt-1 focus:outline-blue-500"
                            value={guideOption.price ?? ""}
                            onChange={(e) =>
                                setGuideOption({
                                    ...guideOption,
                                    price: parseFloat(e.target.value), // Allow setting 0
                                })
                            }
                            min="0"
                            placeholder="e.g., 100"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            Set to RM 0 if the guide price is already included in the package.
                        </p>
                    </div>
                )}

                {/* Guides Info */}
                {guideOption.guideIncluded && (
                    <>
                        <h3 className="mt-6 font-medium text-gray-700">Guides Information</h3>
                        <div className="flex flex-col gap-4 mt-4">
                            {guideOption.guidesInfo.map((guide, index) => (
                                <div
                                    key={index}
                                    className="p-4 border rounded-lg shadow-sm bg-gray-50 relative"
                                >
                                    <div className="absolute top-2 right-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const updatedGuides = guideOption.guidesInfo.filter(
                                                    (_, i) => i !== index
                                                );
                                                setGuideOption({ ...guideOption, guidesInfo: updatedGuides });
                                            }}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                    {/* Guide Name */}
                                    <div className="flex flex-col mt-2">
                                        <label className="text-sm font-medium text-gray-700">
                                            Guide Name:
                                        </label>
                                        <input
                                            type="text"
                                            className="p-2 border rounded-lg mt-1 focus:outline-blue-500"
                                            value={guide.guideName || ""}
                                            onChange={(e) => {
                                                const updatedGuides = [...guideOption.guidesInfo];
                                                updatedGuides[index].guideName = e.target.value;
                                                setGuideOption({ ...guideOption, guidesInfo: updatedGuides });
                                            }}
                                            placeholder="e.g., John Doe"
                                            required
                                        />
                                    </div>
                                    {/* Contact Number */}
                                    <div className="flex flex-col mt-2">
                                        <label className="text-sm font-medium text-gray-700">
                                            Contact Number:
                                        </label>
                                        <input
                                            type="text"
                                            className="p-2 border rounded-lg mt-1 focus:outline-blue-500"
                                            value={guide.contactNumber || ""}
                                            onChange={(e) => {
                                                const updatedGuides = [...guideOption.guidesInfo];
                                                updatedGuides[index].contactNumber = e.target.value;
                                                setGuideOption({ ...guideOption, guidesInfo: updatedGuides });
                                            }}
                                            placeholder="e.g., +60123456789"
                                            required
                                        />
                                    </div>
                                    {/* Email */}
                                    <div className="flex flex-col mt-2">
                                        <label className="text-sm font-medium text-gray-700">
                                            Email:
                                        </label>
                                        <input
                                            type="email"
                                            className="p-2 border rounded-lg mt-1 focus:outline-blue-500"
                                            value={guide.email || ""}
                                            onChange={(e) => {
                                                const updatedGuides = [...guideOption.guidesInfo];
                                                updatedGuides[index].email = e.target.value;
                                                setGuideOption({ ...guideOption, guidesInfo: updatedGuides });
                                            }}
                                            placeholder="e.g., guide@example.com"
                                            required
                                        />
                                    </div>
                                    {/* Experience */}
                                    <div className="flex flex-col mt-2">
                                        <label className="text-sm font-medium text-gray-700">
                                            Years of Experience:
                                        </label>
                                        <input type="number" className="p-2 border rounded-lg mt-1 focus:outline-blue-500"
                                            value={guide.experience || ""}
                                            onChange={(e) => {
                                                const updatedGuides = [...guideOption.guidesInfo];
                                                updatedGuides[index].experience = parseFloat(e.target.value) || 0;
                                                setGuideOption({ ...guideOption, guidesInfo: updatedGuides });
                                            }}
                                            min="0"
                                            placeholder="e.g., 5"
                                        />
                                    </div>
                                    {/* Max Hikers */}
                                    <div className="flex flex-col mt-2">
                                        <label className="text-sm font-medium text-gray-700">
                                            Max Hikers:
                                        </label>
                                        <input type="number" className="p-2 border rounded-lg mt-1 focus:outline-blue-500"
                                            value={guide.maxHikers || 10}
                                            onChange={(e) => {
                                                const updatedGuides = [...guideOption.guidesInfo];
                                                updatedGuides[index].maxHikers = parseInt(e.target.value, 10) || 10;
                                                setGuideOption({ ...guideOption, guidesInfo: updatedGuides });
                                            }}
                                            min="1"
                                            placeholder="e.g., 10"
                                        />
                                    </div>
                                </div>
                            ))}

                            {/* Add New Guide */}
                            <button type="button" className="mt-4 p-2 bg-red-400 text-white rounded-lg hover:bg-red-600"
                                onClick={() =>
                                    setGuideOption({
                                        ...guideOption,
                                        guidesInfo: [
                                            ...guideOption.guidesInfo,
                                            {
                                                guideName: "",
                                                contactNumber: "",
                                                email: "",
                                                experience: 0,
                                                maxHikers: 10,
                                            },
                                        ],
                                    })
                                }
                            >
                                Add New Guide
                            </button>
                        </div>
                    </>
                )}
            </div>


            <div className="mb-6">
                <label htmlFor="more-info" className="block text-lg font-semibold mb-2 text-gray-700">
                    More Information
                </label>
                <textarea id="more-info" className="w-full p-4 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 resize-none"
                    placeholder="Enter additional details about the trail"
                    rows={6}
                    value={moreInfo}  // Bind the value of the textarea to state
                    onChange={handleChange}  // Update state on text change
                />
            </div>



            <div className="mb-6">
                <label htmlFor="daily-quota" className="block text-lg font-semibold mb-2 text-gray-700">
                    Daily Trail Quota
                </label>
                <input className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-200 focus:border-blue-500" type="number" id="daily-quota"
                    name="dailyQuota"
                    min="1"
                    required
                    placeholder="Enter the maximum number of hikers allowed per day"
                    value={dailyQuota}
                    onChange={(e) => setDailyQuota(e.target.value)} // Update the state on input change
                />
            </div>











            {/* Submit Button */}
            <button type="submit" className="w-full mt-6 bg-red-400 text-white font-semibold p-3 rounded-lg hover:bg-red-600 transition duration-200">
                Add Trail
            </button>

        </form>
    )
}

export default AddTrail