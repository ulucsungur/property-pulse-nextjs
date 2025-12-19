'use client';
import { useState } from "react";
import addProperty from "@/app/actions/addProperty";
import { toast } from "react-toastify";
import { PROPERTY_TYPES } from "@/config/propertyTypes";
import { FaMagic, FaSpinner } from "react-icons/fa";

const PropertyAddForm = () => {
    const [aiLoading, setAiLoading] = useState(false);

    // --- YAPAY ZEKA METİN ÜRETİCİ ---
    const generateAIDescription = async () => {
        // Formdaki mevcut verileri topla
        const name = document.getElementById("name").value;
        const type = document.getElementById("type").value;
        const city = document.getElementById("city").value;
        const state = document.getElementById("state").value;
        const beds = document.getElementById("beds").value;
        const baths = document.getElementById("baths").value;

        // Olanaklar (Checkboxları topla)
        const amenities = Array.from(document.querySelectorAll('input[name="amenities"]:checked'))
            .map(cb => cb.value)
            .join(", ");

        if (!name || !city) {
            toast.warn("Yapay zekanın çalışması için lütfen önce 'Listing Name' ve 'City' alanlarını doldurun.");
            return;
        }

        setAiLoading(true);
        try {
            const res = await fetch("/api/generate-description", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name, type, location: { city, state }, beds, baths, amenities
                })
            });

            const data = await res.json();

            if (res.ok) {
                // Textarea'yı bul ve doldur
                document.getElementById("description").value = data.description;
                toast.success("Açıklama yapay zeka tarafından yazıldı! ✨");
            } else {
                toast.error("Yapay zeka hatası: " + (data.error || "Bilinmeyen hata"));
            }

        } catch (error) {
            console.error(error);
            toast.error("Sunucu ile iletişim kurulamadı.");
        } finally {
            setAiLoading(false);
        }
    };

    // --- FORM GÖNDERME VE VALIDASYON ---
    const handleFormSubmit = async (formData) => {
        const email = formData.get("seller_info.email");
        const phone = formData.get("seller_info.phone");

        // 1. Telefon Kontrolü
        const phoneRegex = /^[\d-]+$/;
        const strictPhoneRegex = /^(\d{3}-?\d{3}-?\d{4}|\d{10,11})$/;

        if (phone) {
            if (!phoneRegex.test(phone)) {
                toast.error("Telefon alanına Email veya Harf giremezsiniz!");
                return;
            }
            if (!strictPhoneRegex.test(phone)) {
                toast.error("Telefon formatı hatalı! (Örn: 555-555-5555)");
                return;
            }
        }

        // 2. Email Kontrolü
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            toast.error("Please enter a valid email address!");
            return;
        }

        // --- SUNUCUYA GÖNDER ---
        try {
            await addProperty(formData);
            toast.success("Property added successfully!");
        } catch (error) {
            if (error.message === 'NEXT_REDIRECT' || error.message.includes('NEXT_REDIRECT')) {
                throw error;
            }
            console.error("Form Submission Error:", error);
            toast.error("Bir hata oluştu.");
        }
    };

    return (
        <form action={handleFormSubmit}>
            <h2 className="text-3xl text-center font-semibold mb-6">
                Add Property
            </h2>

            <div className="mb-4">
                <label htmlFor="type" className="block text-gray-700 font-bold mb-2">Property Type</label>
                <select
                    id="type"
                    name="type"
                    className="border rounded w-full py-2 px-3"
                    required
                >
                    {PROPERTY_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                            {type.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Listing Name</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    className="border rounded w-full py-2 px-3 mb-2"
                    placeholder="eg. Beautiful Apartment In Miami"
                    required
                />
            </div>

            {/* --- YAPAY ZEKA BUTONLU AÇIKLAMA ALANI --- */}
            <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                    <label htmlFor="description" className="block text-gray-700 font-bold">
                        Description
                    </label>
                    <button
                        type="button"
                        onClick={generateAIDescription}
                        disabled={aiLoading}
                        className="text-xs bg-purple-100 text-purple-700 hover:bg-purple-200 px-3 py-1 rounded-full flex items-center gap-1 transition-colors border border-purple-200"
                    >
                        {aiLoading ? <FaSpinner className="animate-spin" /> : <FaMagic />}
                        {aiLoading ? "Yazılıyor..." : "AI ile Yaz"}
                    </button>
                </div>
                <textarea
                    id="description"
                    name="description"
                    className="border rounded w-full py-2 px-3 focus:ring-2 focus:ring-purple-200 transition-all"
                    rows="6"
                    placeholder="Describe your property or press the 'Write with AI' button and wait for the magic to happen..."
                ></textarea>
            </div>
            {/* ----------------------------------------- */}

            <div className="mb-4 bg-blue-50 p-4">
                <label className="block text-gray-700 font-bold mb-2">Location</label>
                <input type="text" id="street" name="location.street" className="border rounded w-full py-2 px-3 mb-2" placeholder="Street" />
                <input type="text" id="city" name="location.city" className="border rounded w-full py-2 px-3 mb-2" placeholder="City" required />
                <input type="text" id="state" name="location.state" className="border rounded w-full py-2 px-3 mb-2" placeholder="State" required />
                <input type="text" id="zipcode" name="location.zipCode" className="border rounded w-full py-2 px-3 mb-2" placeholder="ZipCode" />
            </div>

            <div className="mb-4 flex flex-wrap">
                <div className="w-full sm:w-1/3 pr-2">
                    <label htmlFor="beds" className="block text-gray-700 font-bold mb-2">Beds</label>
                    <input type="number" id="beds" name="beds" className="border rounded w-full py-2 px-3" required />
                </div>
                <div className="w-full sm:w-1/3 px-2">
                    <label htmlFor="baths" className="block text-gray-700 font-bold mb-2">Baths</label>
                    <input type="number" id="baths" name="baths" className="border rounded w-full py-2 px-3" required />
                </div>
                <div className="w-full sm:w-1/3 pl-2">
                    <label htmlFor="square_feet" className="block text-gray-700 font-bold mb-2">Square Feet</label>
                    <input type="number" id="square_feet" name="square_feet" className="border rounded w-full py-2 px-3" required />
                </div>
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Amenities</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    <div>
                        <input type="checkbox" id="amenity_wifi" name="amenities" value="Wifi" className="mr-2" />
                        <label htmlFor="amenity_wifi">Wifi</label>
                    </div>
                    <div>
                        <input type="checkbox" id="amenity_kitchen" name="amenities" value="Full kitchen" className="mr-2" />
                        <label htmlFor="amenity_kitchen">Full kitchen</label>
                    </div>
                    <div>
                        <input type="checkbox" id="amenity_washer_dryer" name="amenities" value="Washer & Dryer" className="mr-2" />
                        <label htmlFor="amenity_washer_dryer">Washer & Dryer</label>
                    </div>
                    <div>
                        <input type="checkbox" id="amenity_free_parking" name="amenities" value="Free Parking" className="mr-2" />
                        <label htmlFor="amenity_free_parking">Free Parking</label>
                    </div>
                    <div>
                        <input type="checkbox" id="amenity_pool" name="amenities" value="Swimming Pool" className="mr-2" />
                        <label htmlFor="amenity_pool">Swimming Pool</label>
                    </div>
                    <div>
                        <input type="checkbox" id="amenity_hot_tub" name="amenities" value="Hot Tub" className="mr-2" />
                        <label htmlFor="amenity_hot_tub">Hot Tub</label>
                    </div>
                    <div>
                        <input type="checkbox" id="amenity_24_7_security" name="amenities" value="24/7 Security" className="mr-2" />
                        <label htmlFor="amenity_24_7_security">24/7 Security</label>
                    </div>
                    <div>
                        <input type="checkbox" id="amenity_wheelchair_accessible" name="amenities" value="Wheelchair Accessible" className="mr-2" />
                        <label htmlFor="amenity_wheelchair_accessible">Wheelchair Accessible</label>
                    </div>
                    <div>
                        <input type="checkbox" id="amenity_elevator_access" name="amenities" value="Elevator Access" className="mr-2" />
                        <label htmlFor="amenity_elevator_access">Elevator Access</label>
                    </div>
                    <div>
                        <input type="checkbox" id="amenity_dishwasher" name="amenities" value="Dishwasher" className="mr-2" />
                        <label htmlFor="amenity_dishwasher">Dishwasher</label>
                    </div>
                    <div>
                        <input type="checkbox" id="amenity_gym_fitness_center" name="amenities" value="Gym/Fitness Center" className="mr-2" />
                        <label htmlFor="amenity_gym_fitness_center">Gym/Fitness Center</label>
                    </div>
                    <div>
                        <input type="checkbox" id="amenity_air_conditioning" name="amenities" value="Air Conditioning" className="mr-2" />
                        <label htmlFor="amenity_air_conditioning">Air Conditioning</label>
                    </div>
                    <div>
                        <input type="checkbox" id="amenity_balcony_patio" name="amenities" value="Balcony/Patio" className="mr-2" />
                        <label htmlFor="amenity_balcony_patio">Balcony/Patio</label>
                    </div>
                    <div>
                        <input type="checkbox" id="amenity_smart_tv" name="amenities" value="Smart TV" className="mr-2" />
                        <label htmlFor="amenity_smart_tv">Smart TV</label>
                    </div>
                    <div>
                        <input type="checkbox" id="amenity_coffee_maker" name="amenities" value="Coffee Maker" className="mr-2" />
                        <label htmlFor="amenity_coffee_maker">Coffee Maker</label>
                    </div>
                </div>
            </div>

            <div className="mb-4 bg-blue-50 p-4">
                <label className="block text-gray-700 font-bold mb-2">Rates (Leave blank if not applicable)</label>
                <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                    <div className="flex items-center">
                        <label htmlFor="weekly_rate" className="mr-2">Weekly</label>
                        <input type="number" id="weekly_rate" name="rates.weekly" className="border rounded w-full py-2 px-3" />
                    </div>
                    <div className="flex items-center">
                        <label htmlFor="monthly_rate" className="mr-2">Monthly</label>
                        <input type="number" id="monthly_rate" name="rates.monthly" className="border rounded w-full py-2 px-3" />
                    </div>
                    <div className="flex items-center">
                        <label htmlFor="nightly_rate" className="mr-2">Nightly</label>
                        <input type="number" id="nightly_rate" name="rates.nightly" className="border rounded w-full py-2 px-3" />
                    </div>
                </div>
            </div>

            <div className="mb-4">
                <label htmlFor="seller_name" className="block text-gray-700 font-bold mb-2">Seller Name</label>
                <input type="text" id="seller_name" name="seller_info.name" className="border rounded w-full py-2 px-3" placeholder="Name" />
            </div>

            {/* Email ve Telefon Inputları (Validation ile) */}
            <div className="mb-4">
                <label htmlFor="seller_email" className="block text-gray-700 font-bold mb-2">Seller Email</label>
                <input type="email" id="seller_email" name="seller_info.email" className="border rounded w-full py-2 px-3" placeholder="john@example.com" required />
            </div>
            <div className="mb-4">
                <label htmlFor="seller_phone" className="block text-gray-700 font-bold mb-2">Seller Phone</label>
                <input type="tel" id="seller_phone" name="seller_info.phone" className="border rounded w-full py-2 px-3" placeholder="555-555-5555" required />
            </div>

            <div className="mb-4">
                <label htmlFor="images" className="block text-gray-700 font-bold mb-2">Images (Select up to 4 images)</label>
                <input type="file" id="images" name="images" className="border rounded w-full py-2 px-3" accept="image/*" multiple required />
            </div>

            <div>
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline" type="submit">
                    Add Property
                </button>
            </div>
        </form>
    );
}

export default PropertyAddForm;


// 'use client'; // Toast ve Validation için client component olmalı
// import addProperty from "@/app/actions/addProperty";
// import { toast } from "react-toastify";
// import { PROPERTY_TYPES } from "@/config/propertyTypes";

// const PropertyAddForm = () => {

//     const handleFormSubmit = async (formData) => {
//         const email = formData.get("seller_info.email");
//         const phone = formData.get("seller_info.phone");

//         // 1. Telefon Kontrolü
//         const phoneRegex = /^[\d-]+$/;
//         const strictPhoneRegex = /^(\d{3}-?\d{3}-?\d{4}|\d{10,11})$/;

//         if (phone) {
//             if (!phoneRegex.test(phone)) {
//                 toast.error("Telefon alanına Email veya Harf giremezsiniz!");
//                 return;
//             }
//             if (!strictPhoneRegex.test(phone)) {
//                 toast.error("Telefon formatı hatalı! (Örn: 555-555-5555)");
//                 return;
//             }
//         }

//         // 2. Email Kontrolü
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (!email || !emailRegex.test(email)) {
//             toast.error("Lütfen geçerli bir Email adresi girin!");
//             return;
//         }

//         // --- SUNUCUYA GÖNDERME KISMI (DÜZELTİLDİ) ---
//         try {
//             await addProperty(formData);
//             // Başarılı olursa buraya gelmeden redirect olur, ya da:
//             toast.success("Mülk başarıyla eklendi!");
//         } catch (error) {
//             // Next.js Yönlendirme Hatası mı? (Bu aslında başarıdır)
//             if (error.message === 'NEXT_REDIRECT' || error.message.includes('NEXT_REDIRECT')) {
//                 // Hata mesajı basma, işlemi durdurma.
//                 // Yönlendirmenin çalışması için hatayı tekrar fırlatmamız gerekir:
//                 throw error;
//             }

//             // Gerçek bir hata ise:
//             console.error("Form Gönderme Hatası:", error);
//             toast.error("Bir hata oluştu.");
//         }
//     };
//     // -----------------------------------------------

//     return (
//         <form action={handleFormSubmit}>
//             <h2 className="text-3xl text-center font-semibold mb-6">
//                 Add Property
//             </h2>

//             <div className="mb-4">
//                 <label htmlFor="type" className="block text-gray-700 font-bold mb-2"
//                 >Property Type</label
//                 >
//                 <select
//                     id="type"
//                     name="type"
//                     className="border rounded w-full py-2 px-3"
//                     required
//                 >
//                     {/* Merkezi listeden seçenekleri oluştur */}
//                     {PROPERTY_TYPES.map((type) => (
//                         <option key={type.value} value={type.value}>
//                             {type.label}
//                         </option>
//                     ))}
//                 </select>
//             </div>
//             <div className="mb-4">
//                 <label className="block text-gray-700 font-bold mb-2"
//                 >Listing Name</label
//                 >
//                 <input
//                     type="text"
//                     id="name"
//                     name="name"
//                     className="border rounded w-full py-2 px-3 mb-2"
//                     placeholder="eg. Beautiful Apartment In Miami"
//                     required
//                 />
//             </div>
//             <div className="mb-4">
//                 <label
//                     htmlFor="description"
//                     className="block text-gray-700 font-bold mb-2"
//                 >Description</label
//                 >
//                 <textarea
//                     id="description"
//                     name="description"
//                     className="border rounded w-full py-2 px-3"
//                     rows="4"
//                     placeholder="Add an optional description of your property"
//                 ></textarea>
//             </div>

//             <div className="mb-4 bg-blue-50 p-4">
//                 <label className="block text-gray-700 font-bold mb-2">Location</label>
//                 <input
//                     type="text"
//                     id="street"
//                     name="location.street"
//                     className="border rounded w-full py-2 px-3 mb-2"
//                     placeholder="Street"
//                 />
//                 <input
//                     type="text"
//                     id="city"
//                     name="location.city"
//                     className="border rounded w-full py-2 px-3 mb-2"
//                     placeholder="City"
//                     required
//                 />
//                 <input
//                     type="text"
//                     id="state"
//                     name="location.state"
//                     className="border rounded w-full py-2 px-3 mb-2"
//                     placeholder="State"
//                     required
//                 />
//                 <input
//                     type="text"
//                     id="zipcode"
//                     name="location.zipCode"
//                     className="border rounded w-full py-2 px-3 mb-2"
//                     placeholder="ZipCode"
//                 />
//             </div>

//             <div className="mb-4 flex flex-wrap">
//                 <div className="w-full sm:w-1/3 pr-2">
//                     <label htmlFor="beds" className="block text-gray-700 font-bold mb-2"
//                     >Beds</label
//                     >
//                     <input
//                         type="number"
//                         id="beds"
//                         name="beds"
//                         className="border rounded w-full py-2 px-3"
//                         required
//                     />
//                 </div>
//                 <div className="w-full sm:w-1/3 px-2">
//                     <label htmlFor="baths" className="block text-gray-700 font-bold mb-2"
//                     >Baths</label
//                     >
//                     <input
//                         type="number"
//                         id="baths"
//                         name="baths"
//                         className="border rounded w-full py-2 px-3"
//                         required
//                     />
//                 </div>
//                 <div className="w-full sm:w-1/3 pl-2">
//                     <label
//                         htmlFor="square_feet"
//                         className="block text-gray-700 font-bold mb-2"
//                     >Square Feet</label
//                     >
//                     <input
//                         type="number"
//                         id="square_feet"
//                         name="square_feet"
//                         className="border rounded w-full py-2 px-3"
//                         required
//                     />
//                 </div>
//             </div>

//             <div className="mb-4">
//                 <label className="block text-gray-700 font-bold mb-2"
//                 >Amenities</label
//                 >
//                 <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
//                     <div>
//                         <input
//                             type="checkbox"
//                             id="amenity_wifi"
//                             name="amenities"
//                             value="Wifi"
//                             className="mr-2"
//                         />
//                         <label htmlFor="amenity_wifi">Wifi</label>
//                     </div>
//                     <div>
//                         <input
//                             type="checkbox"
//                             id="amenity_kitchen"
//                             name="amenities"
//                             value="Full kitchen"
//                             className="mr-2"
//                         />
//                         <label htmlFor="amenity_kitchen">Full kitchen</label>
//                     </div>
//                     <div>
//                         <input
//                             type="checkbox"
//                             id="amenity_washer_dryer"
//                             name="amenities"
//                             value="Washer & Dryer"
//                             className="mr-2"
//                         />
//                         <label htmlFor="amenity_washer_dryer">Washer & Dryer</label>
//                     </div>
//                     <div>
//                         <input
//                             type="checkbox"
//                             id="amenity_free_parking"
//                             name="amenities"
//                             value="Free Parking"
//                             className="mr-2"
//                         />
//                         <label htmlFor="amenity_free_parking">Free Parking</label>
//                     </div>
//                     <div>
//                         <input
//                             type="checkbox"
//                             id="amenity_pool"
//                             name="amenities"
//                             value="Swimming Pool"
//                             className="mr-2"
//                         />
//                         <label htmlFor="amenity_pool">Swimming Pool</label>
//                     </div>
//                     <div>
//                         <input
//                             type="checkbox"
//                             id="amenity_hot_tub"
//                             name="amenities"
//                             value="Hot Tub"
//                             className="mr-2"
//                         />
//                         <label htmlFor="amenity_hot_tub">Hot Tub</label>
//                     </div>
//                     <div>
//                         <input
//                             type="checkbox"
//                             id="amenity_24_7_security"
//                             name="amenities"
//                             value="24/7 Security"
//                             className="mr-2"
//                         />
//                         <label htmlFor="amenity_24_7_security">24/7 Security</label>
//                     </div>
//                     <div>
//                         <input
//                             type="checkbox"
//                             id="amenity_wheelchair_accessible"
//                             name="amenities"
//                             value="Wheelchair Accessible"
//                             className="mr-2"
//                         />
//                         <label htmlFor="amenity_wheelchair_accessible"
//                         >Wheelchair Accessible</label
//                         >
//                     </div>
//                     <div>
//                         <input
//                             type="checkbox"
//                             id="amenity_elevator_access"
//                             name="amenities"
//                             value="Elevator Access"
//                             className="mr-2"
//                         />
//                         <label htmlFor="amenity_elevator_access">Elevator Access</label>
//                     </div>
//                     <div>
//                         <input
//                             type="checkbox"
//                             id="amenity_dishwasher"
//                             name="amenities"
//                             value="Dishwasher"
//                             className="mr-2"
//                         />
//                         <label htmlFor="amenity_dishwasher">Dishwasher</label>
//                     </div>
//                     <div>
//                         <input
//                             type="checkbox"
//                             id="amenity_gym_fitness_center"
//                             name="amenities"
//                             value="Gym/Fitness Center"
//                             className="mr-2"
//                         />
//                         <label htmlFor="amenity_gym_fitness_center"
//                         >Gym/Fitness Center</label
//                         >
//                     </div>
//                     <div>
//                         <input
//                             type="checkbox"
//                             id="amenity_air_conditioning"
//                             name="amenities"
//                             value="Air Conditioning"
//                             className="mr-2"
//                         />
//                         <label htmlFor="amenity_air_conditioning">Air Conditioning</label>
//                     </div>
//                     <div>
//                         <input
//                             type="checkbox"
//                             id="amenity_balcony_patio"
//                             name="amenities"
//                             value="Balcony/Patio"
//                             className="mr-2"
//                         />
//                         <label htmlFor="amenity_balcony_patio">Balcony/Patio</label>
//                     </div>
//                     <div>
//                         <input
//                             type="checkbox"
//                             id="amenity_smart_tv"
//                             name="amenities"
//                             value="Smart TV"
//                             className="mr-2"
//                         />
//                         <label htmlFor="amenity_smart_tv">Smart TV</label>
//                     </div>
//                     <div>
//                         <input
//                             type="checkbox"
//                             id="amenity_coffee_maker"
//                             name="amenities"
//                             value="Coffee Maker"
//                             className="mr-2"
//                         />
//                         <label htmlFor="amenity_coffee_maker">Coffee Maker</label>
//                     </div>
//                 </div>
//             </div>

//             <div className="mb-4 bg-blue-50 p-4">
//                 <label className="block text-gray-700 font-bold mb-2"
//                 >Rates (Leave blank if not applicable)</label
//                 >
//                 <div
//                     className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4"
//                 >
//                     <div className="flex items-center">
//                         <label htmlFor="weekly_rate" className="mr-2">Weekly</label>
//                         <input
//                             type="number"
//                             id="weekly_rate"
//                             name="rates.weekly"
//                             className="border rounded w-full py-2 px-3"
//                         />
//                     </div>
//                     <div className="flex items-center">
//                         <label htmlFor="monthly_rate" className="mr-2">Monthly</label>
//                         <input
//                             type="number"
//                             id="monthly_rate"
//                             name="rates.monthly"
//                             className="border rounded w-full py-2 px-3"
//                         />
//                     </div>
//                     <div className="flex items-center">
//                         <label htmlFor="nightly_rate" className="mr-2">Nightly</label>
//                         <input
//                             type="number"
//                             id="nightly_rate"
//                             name="rates.nightly"
//                             className="border rounded w-full py-2 px-3"
//                         />
//                     </div>
//                 </div>
//             </div>

//             <div className="mb-4">
//                 <label
//                     htmlFor="seller_name"
//                     className="block text-gray-700 font-bold mb-2"
//                 >Seller Name</label
//                 >
//                 <input
//                     type="text"
//                     id="seller_name"
//                     name="seller_info.name"
//                     className="border rounded w-full py-2 px-3"
//                     placeholder="Name"
//                 />
//             </div>

//             {/* Email ve Telefon Inputları (Validation ile) */}
//             <div className="mb-4">
//                 <label
//                     htmlFor="seller_email"
//                     className="block text-gray-700 font-bold mb-2"
//                 >Seller Email</label
//                 >
//                 <input
//                     type="email"
//                     id="seller_email"
//                     name="seller_info.email"
//                     className="border rounded w-full py-2 px-3"
//                     placeholder="john@example.com"
//                     required
//                 />
//             </div>
//             <div className="mb-4">
//                 <label
//                     htmlFor="seller_phone"
//                     className="block text-gray-700 font-bold mb-2"
//                 >Seller Phone</label
//                 >
//                 <input
//                     type="tel"
//                     id="seller_phone"
//                     name="seller_info.phone"
//                     className="border rounded w-full py-2 px-3"
//                     placeholder="555-555-5555"
//                     required
//                 />
//             </div>

//             <div className="mb-4">
//                 <label htmlFor="images" className="block text-gray-700 font-bold mb-2"
//                 >Images (Select up to 4 images)</label
//                 >
//                 <input
//                     type="file"
//                     id="images"
//                     name="images"
//                     className="border rounded w-full py-2 px-3"
//                     accept="image/*"
//                     multiple
//                     required
//                 />
//             </div>

//             <div>
//                 <button
//                     className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline"
//                     type="submit"
//                 >
//                     Add Property
//                 </button>
//             </div>
//         </form>
//     );
// }

// export default PropertyAddForm;
