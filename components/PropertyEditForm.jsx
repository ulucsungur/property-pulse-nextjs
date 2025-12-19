'use client';
import { useState } from "react";
import updateProperty from "@/app/actions/updateProperty";
import { toast } from "react-toastify";
import { PROPERTY_TYPES } from "@/config/propertyTypes";
import { FaMagic, FaSpinner, FaTrash, FaPlus } from "react-icons/fa";

const PropertyEditForm = ({ property }) => {
    const updatePropertyById = updateProperty.bind(null, property._id);
    const [aiLoading, setAiLoading] = useState(false);

    const [deletedImages, setDeletedImages] = useState([]);
    const [visibleImages, setVisibleImages] = useState(property.images || []);
    const [newImagesPreview, setNewImagesPreview] = useState([]);

    const generateAIDescription = async () => {
        const name = document.getElementById("name").value;
        const type = document.getElementById("type").value;
        const city = document.getElementById("city").value;
        const state = document.getElementById("state").value;
        const beds = document.getElementById("beds").value;
        const baths = document.getElementById("baths").value;

        const amenities = Array.from(document.querySelectorAll('input[name="amenities"]:checked'))
            .map(cb => cb.value)
            .join(", ");

        if (!name || !city) {
            toast.warn("Please enter Listing Name and City first.");
            return;
        }

        setAiLoading(true);
        try {
            const res = await fetch("/api/generate-description", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, type, location: { city, state }, beds, baths, amenities })
            });

            const data = await res.json();
            if (res.ok) {
                document.getElementById("description").value = data.description;
                toast.success("Description updated by AI! ✨");
            } else {
                toast.error("AI Error: " + (data.error || "Unknown error"));
            }
        } catch (error) {
            console.error(error);
            toast.error("Server error.");
        } finally {
            setAiLoading(false);
        }
    };

    const handleDeleteImage = (imageUrl) => {
        setDeletedImages((prev) => [...prev, imageUrl]);
        setVisibleImages((prev) => prev.filter((img) => img !== imageUrl));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const previews = files.map(file => URL.createObjectURL(file));
        setNewImagesPreview(previews);
    };

    const handleFormSubmit = async (formData) => {
        deletedImages.forEach((img) => {
            formData.append("delete_images", img);
        });

        const email = formData.get("seller_info.email");
        const phone = formData.get("seller_info.phone");
        const phoneRegex = /^[\d-]+$/;
        const strictPhoneRegex = /^(\d{3}-?\d{3}-?\d{4}|\d{10,11})$/;

        if (phone) {
            if (!phoneRegex.test(phone)) {
                toast.error("Phone cannot contain letters!");
                return;
            }
            if (!strictPhoneRegex.test(phone)) {
                toast.error("Invalid phone format! (Ex: 555-555-5555)");
                return;
            }
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            toast.error("Invalid Email!");
            return;
        }

        try {
            await updatePropertyById(formData);
            toast.success("Property updated successfully!");
        } catch (error) {
            if (error.message === 'NEXT_REDIRECT' || error.message.includes('NEXT_REDIRECT')) {
                throw error;
            }
            console.error("Update Error:", error);
            toast.error("An error occurred.");
        }
    };

    return (
        <form action={handleFormSubmit}>
            <h2 className="text-3xl text-center font-semibold mb-6 text-gray-800 dark:text-white">Edit Property</h2>

            {/* --- RESİM YÖNETİMİ --- */}
            {/* Arka plan: bg-gray-50 -> dark:bg-gray-700 */}
            <div className="mb-6 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                <label className="block text-gray-700 dark:text-gray-200 font-bold mb-3">Manage Images</label>

                {visibleImages.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        {visibleImages.map((img, index) => (
                            <div key={index} className="relative group w-full h-32 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-500 shadow-sm">
                                <img
                                    src={img}
                                    alt={`Image ${index}`}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteImage(img)}
                                        className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 shadow-lg transform hover:scale-110 transition-transform"
                                        title="Delete Image"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 dark:text-gray-300 text-sm mb-4 italic">No images available.</p>
                )}

                <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2 font-bold">Add New Images</label>
                <div className="flex items-center justify-center w-full mb-4">
                    <label htmlFor="new_images" className="flex flex-col items-center justify-center w-full h-32 border-2 border-blue-300 border-dashed rounded-lg cursor-pointer bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-600 transition">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <FaPlus className="text-blue-500 text-2xl mb-2" />
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span></p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">MAX 4 images total</p>
                        </div>
                        <input id="new_images" name="new_images" type="file" className="hidden" multiple accept="image/*" onChange={handleFileChange} />
                    </label>
                </div>

                {newImagesPreview.length > 0 && (
                    <div className="mt-4 p-2 bg-green-50 dark:bg-green-900 rounded-md border border-green-100 dark:border-green-800">
                        <p className="text-sm text-green-700 dark:text-green-200 font-bold mb-2">Selected to Upload ({newImagesPreview.length}):</p>
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {newImagesPreview.map((src, i) => (
                                <img key={i} src={src} className="w-20 h-20 object-cover rounded-md border border-green-300 shadow-sm" alt="Preview" />
                            ))}
                        </div>
                    </div>
                )}
            </div>
            {/* ------------------------------------------- */}

            <div className="mb-4">
                <label htmlFor="type" className="block text-gray-700 dark:text-gray-200 font-bold mb-2">Property Type</label>
                <select
                    id="type"
                    name="type"
                    className="border rounded w-full py-2 px-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-white dark:border-gray-600 focus:outline-none"
                    defaultValue={property.type}
                    required
                >
                    {PROPERTY_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                </select>
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-200 font-bold mb-2">Listing Name</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    className="border rounded w-full py-2 px-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-white dark:border-gray-600 focus:outline-none"
                    placeholder="eg. Beautiful Apartment In Miami"
                    defaultValue={property.name}
                    required
                />
            </div>

            <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                    <label htmlFor="description" className="block text-gray-700 dark:text-gray-200 font-bold">
                        Description
                    </label>
                    <button
                        type="button"
                        onClick={generateAIDescription}
                        disabled={aiLoading}
                        className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-200 px-3 py-1 rounded-full flex items-center gap-1 border border-purple-200 dark:border-purple-700"
                    >
                        {aiLoading ? <FaSpinner className="animate-spin" /> : <FaMagic />} AI Write
                    </button>
                </div>
                <textarea
                    id="description"
                    name="description"
                    className="border rounded w-full py-2 px-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-white dark:border-gray-600 focus:outline-none"
                    rows="6"
                    defaultValue={property.description}
                    placeholder="Add an optional description of your property"
                ></textarea>
            </div>

            <div className="mb-4 bg-gray-50 dark:bg-gray-700 p-4 rounded-md border border-gray-200 dark:border-gray-600">
                <label className="block text-gray-700 dark:text-gray-200 font-bold mb-2">Location</label>
                <input type="text" id="street" name="location.street" className="border rounded w-full py-2 px-3 mb-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-white dark:border-gray-600" placeholder="Street" defaultValue={property.location.street} />
                <input type="text" id="city" name="location.city" className="border rounded w-full py-2 px-3 mb-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-white dark:border-gray-600" placeholder="City" defaultValue={property.location.city} required />
                <input type="text" id="state" name="location.state" className="border rounded w-full py-2 px-3 mb-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-white dark:border-gray-600" placeholder="State" defaultValue={property.location.state} required />
                <input type="text" id="zipcode" name="location.zipCode" className="border rounded w-full py-2 px-3 mb-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-white dark:border-gray-600" placeholder="ZipCode" defaultValue={property.location.zipCode} />
            </div>

            <div className="mb-4 flex flex-wrap">
                <div className="w-full sm:w-1/3 pr-2">
                    <label htmlFor="beds" className="block text-gray-700 dark:text-gray-200 font-bold mb-2">Beds</label>
                    <input type="number" id="beds" name="beds" className="border rounded w-full py-2 px-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-white dark:border-gray-600" defaultValue={property.beds} required />
                </div>
                <div className="w-full sm:w-1/3 px-2">
                    <label htmlFor="baths" className="block text-gray-700 dark:text-gray-200 font-bold mb-2">Baths</label>
                    <input type="number" id="baths" name="baths" className="border rounded w-full py-2 px-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-white dark:border-gray-600" defaultValue={property.baths} required />
                </div>
                <div className="w-full sm:w-1/3 pl-2">
                    <label htmlFor="square_feet" className="block text-gray-700 dark:text-gray-200 font-bold mb-2">Square Feet</label>
                    <input type="number" id="square_feet" name="square_feet" className="border rounded w-full py-2 px-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-white dark:border-gray-600" defaultValue={property.square_feet} required />
                </div>
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-200 font-bold mb-2">Amenities</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-gray-700 dark:text-gray-300">
                    <div><input type="checkbox" id="amenity_wifi" name="amenities" value="Wifi" className="mr-2" defaultChecked={property.amenities.includes("Wifi")} /><label htmlFor="amenity_wifi">Wifi</label></div>
                    <div><input type="checkbox" id="amenity_kitchen" name="amenities" value="Full kitchen" className="mr-2" defaultChecked={property.amenities.includes("Full kitchen")} /><label htmlFor="amenity_kitchen">Full kitchen</label></div>
                    <div><input type="checkbox" id="amenity_washer_dryer" name="amenities" value="Washer & Dryer" className="mr-2" defaultChecked={property.amenities.includes("Washer & Dryer")} /><label htmlFor="amenity_washer_dryer">Washer & Dryer</label></div>
                    <div><input type="checkbox" id="amenity_free_parking" name="amenities" value="Free Parking" className="mr-2" defaultChecked={property.amenities.includes("Free Parking")} /><label htmlFor="amenity_free_parking">Free Parking</label></div>
                    <div><input type="checkbox" id="amenity_pool" name="amenities" value="Swimming Pool" className="mr-2" defaultChecked={property.amenities.includes("Swimming Pool")} /><label htmlFor="amenity_pool">Swimming Pool</label></div>
                    <div><input type="checkbox" id="amenity_hot_tub" name="amenities" value="Hot Tub" className="mr-2" defaultChecked={property.amenities.includes("Hot Tub")} /><label htmlFor="amenity_hot_tub">Hot Tub</label></div>
                    <div><input type="checkbox" id="amenity_24_7_security" name="amenities" value="24/7 Security" className="mr-2" defaultChecked={property.amenities.includes("24/7 Security")} /><label htmlFor="amenity_24_7_security">24/7 Security</label></div>
                    <div><input type="checkbox" id="amenity_wheelchair_accessible" name="amenities" value="Wheelchair Accessible" className="mr-2" defaultChecked={property.amenities.includes("Wheelchair Accessible")} /><label htmlFor="amenity_wheelchair_accessible">Wheelchair Accessible</label></div>
                    <div><input type="checkbox" id="amenity_elevator_access" name="amenities" value="Elevator Access" className="mr-2" defaultChecked={property.amenities.includes("Elevator Access")} /><label htmlFor="amenity_elevator_access">Elevator Access</label></div>
                    <div><input type="checkbox" id="amenity_dishwasher" name="amenities" value="Dishwasher" className="mr-2" defaultChecked={property.amenities.includes("Dishwasher")} /><label htmlFor="amenity_dishwasher">Dishwasher</label></div>
                    <div><input type="checkbox" id="amenity_gym_fitness_center" name="amenities" value="Gym/Fitness Center" className="mr-2" defaultChecked={property.amenities.includes("Gym/Fitness Center")} /><label htmlFor="amenity_gym_fitness_center">Gym/Fitness Center</label></div>
                    <div><input type="checkbox" id="amenity_air_conditioning" name="amenities" value="Air Conditioning" className="mr-2" defaultChecked={property.amenities.includes("Air Conditioning")} /><label htmlFor="amenity_air_conditioning">Air Conditioning</label></div>
                    <div><input type="checkbox" id="amenity_balcony_patio" name="amenities" value="Balcony/Patio" className="mr-2" defaultChecked={property.amenities.includes("Balcony/Patio")} /><label htmlFor="amenity_balcony_patio">Balcony/Patio</label></div>
                    <div><input type="checkbox" id="amenity_smart_tv" name="amenities" value="Smart TV" className="mr-2" defaultChecked={property.amenities.includes("Smart TV")} /><label htmlFor="amenity_smart_tv">Smart TV</label></div>
                    <div><input type="checkbox" id="amenity_coffee_maker" name="amenities" value="Coffee Maker" className="mr-2" defaultChecked={property.amenities.includes("Coffee Maker")} /><label htmlFor="amenity_coffee_maker">Coffee Maker</label></div>
                </div>
            </div>

            <div className="mb-4 bg-gray-50 dark:bg-gray-700 p-4 rounded-md border border-gray-200 dark:border-gray-600">
                <label className="block text-gray-700 dark:text-gray-200 font-bold mb-2">Rates (Leave blank if not applicable)</label>
                <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                    <div className="flex items-center"><label htmlFor="weekly_rate" className="mr-2 dark:text-gray-200">Weekly</label><input type="number" id="weekly_rate" name="rates.weekly" className="border rounded w-full py-2 px-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-white dark:border-gray-600" defaultValue={property.rates.weekly} /></div>
                    <div className="flex items-center"><label htmlFor="monthly_rate" className="mr-2 dark:text-gray-200">Monthly</label><input type="number" id="monthly_rate" name="rates.monthly" className="border rounded w-full py-2 px-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-white dark:border-gray-600" defaultValue={property.rates.monthly} /></div>
                    <div className="flex items-center"><label htmlFor="nightly_rate" className="mr-2 dark:text-gray-200">Nightly</label><input type="number" id="nightly_rate" name="rates.nightly" className="border rounded w-full py-2 px-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-white dark:border-gray-600" defaultValue={property.rates.nightly} /></div>
                </div>
            </div>

            <div className="mb-4">
                <label htmlFor="seller_name" className="block text-gray-700 dark:text-gray-200 font-bold mb-2">Seller Name</label>
                <input type="text" id="seller_name" name="seller_info.name" className="border rounded w-full py-2 px-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-white dark:border-gray-600" placeholder="Name" defaultValue={property.seller_info.name} />
            </div>
            <div className="mb-4">
                <label htmlFor="seller_email" className="block text-gray-700 dark:text-gray-200 font-bold mb-2">Seller Email</label>
                <input type="email" id="seller_email" name="seller_info.email" className="border rounded w-full py-2 px-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-white dark:border-gray-600" placeholder="john@example.com" defaultValue={property.seller_info.email} required />
            </div>
            <div className="mb-4">
                <label htmlFor="seller_phone" className="block text-gray-700 dark:text-gray-200 font-bold mb-2">Seller Phone</label>
                <input type="tel" id="seller_phone" name="seller_info.phone" className="border rounded w-full py-2 px-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-white dark:border-gray-600" placeholder="555-555-5555" defaultValue={property.seller_info.phone} required />
            </div>

            <div>
                <button className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline transition-colors" type="submit">
                    Update Property
                </button>
            </div>
        </form>
    );
}

export default PropertyEditForm;
