

"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { setDefaults, fromAddress } from "react-geocode";

// Leaflet componentlerini dinamik import et → SSR sırasında yüklenmez
const MapContainer = dynamic(
    async () => (await import("react-leaflet")).MapContainer,
    { ssr: false }
);
const TileLayer = dynamic(
    async () => (await import("react-leaflet")).TileLayer,
    { ssr: false }
);
const Marker = dynamic(
    async () => (await import("react-leaflet")).Marker,
    { ssr: false }
);
const Popup = dynamic(
    async () => (await import("react-leaflet")).Popup,
    { ssr: false }
);

import L from "leaflet";
import "leaflet/dist/leaflet.css";

const customIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconSize: [40, 60],
    iconAnchor: [20, 60],
    popupAnchor: [0, -60],
});

const PropertyMap = ({ property }) => {
    const [lat, setLat] = useState(null);
    const [lng, setLng] = useState(null);
    const [loading, setLoading] = useState(true);
    const [geocodeError, setGeocodeError] = useState(false);

    setDefaults({
        key: process.env.NEXT_PUBLIC_GOOGLE_GEOCODING_API_KEY,
        language: "en",
        region: "us",
    });

    useEffect(() => {
        const fetchCoords = async () => {
            try {
                const res = await fromAddress(
                    `${property.location.street} ${property.location.city} ${property.location.state} ${property.location.zipCode}`
                );
                if (res.results.length === 0) {
                    setGeocodeError(true);
                    return;
                }
                const { lat, lng } = res.results[0].geometry.location;
                setLat(lat);
                setLng(lng);
            } catch (error) {
                console.error(error);
                setGeocodeError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchCoords();
    }, [property]);

    if (loading) return <h3>Loading...</h3>;
    if (geocodeError) return <div className="text-xl">No location data found</div>;

    return (
        <MapContainer
            center={[lat, lng]}
            zoom={16}
            style={{ height: "500px", width: "100%" }}
        >
            <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[lat, lng]} icon={customIcon}>
                <Popup>
                    {property.location.street}, {property.location.city}
                </Popup>
            </Marker>
        </MapContainer>
    );
};

export default PropertyMap;





// 'use client';
// import { useEffect, useState } from "react";
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import { setDefaults, fromAddress } from "react-geocode";
// import L from 'leaflet';


// const customIcon = L.icon({
//     iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
//     iconSize: [40, 60],         // ← boyut büyütüldü
//     iconAnchor: [20, 60],       // ← alt ucu koordinata oturur
//     popupAnchor: [0, -60]       // ← popup yukarıdan açılır
// });

// const PropertyMap = ({ property }) => {
//     const [lat, setLat] = useState(null);
//     const [lng, setLng] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [geocodeError, setGeocodeError] = useState(false);
//     setDefaults({
//         key: process.env.NEXT_PUBLIC_GOOGLE_GEOCODING_API_KEY,
//         language: 'en',
//         region: 'us'
//     });

//     useEffect(() => {
//         const fetchCoords = async () => {
//             try {
//                 const res = await fromAddress(
//                     `${property.location.street} ${property.location.city} ${property.location.state} ${property.location.zipCode}`
//                 );
//                 if (res.results.length === 0) {
//                     setGeocodeError(true);
//                     return;
//                 }
//                 const { lat, lng } = res.results[0].geometry.location;
//                 setLat(lat);
//                 setLng(lng);
//             } catch (error) {
//                 console.log(error);
//                 setGeocodeError(true);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchCoords();
//     }, []);

//     if (loading) return <h3>Loading...</h3>;
//     if (geocodeError) return <div className="text-xl">No location data found</div>;

//     return (
//         <MapContainer center={[lat, lng]} zoom={16} style={{ height: "500px", width: "100%" }}>
//             <TileLayer
//                 attribution='&copy; OpenStreetMap contributors'
//                 url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//             />
//             <Marker position={[lat, lng]} icon={customIcon}>
//                 <Popup>
//                     {property.location.street}, {property.location.city}
//                 </Popup>
//             </Marker>
//         </MapContainer>
//     );
// };

// export default PropertyMap;

















// 'use client';
// import { useEffect, useState } from "react";
// import { setDefaults, fromAddress } from "react-geocode";

// const PropertyMap = ({ property }) => {
//     const [lat, setLat] = useState(null)
//     const [lng, setLng] = useState(null)
//     const [viewport, setViewport] = useState({
//         latitude: 0,
//         longitude: 0,
//         zoom: 12,
//         width: '100%',
//         height: '500px'
//     })
//     const [loading, setLoading] = useState(true)
//     const [geocodeError, setGeocodeError] = useState(false)

//     setDefaults({
//         key: process.env.NEXT_PUBLIC_GOOGLE_GEOCODING_API_KEY,
//         language: 'en',
//         region: 'us'
//     })

//     useEffect(() => {
//         const fetchCoords = async () => {
//             try {
//                 const res = await fromAddress(`${property.location.street} ${property.location.city} ${property.location.state} ${property.location.zipCode}`);

//                 //check geocode results
//                 if (res.results.length === 0) {
//                     setGeocodeError(true)
//                     return
//                 }
//                 const { lat, lng } = res.results[0].geometry.location;
//                 //console.log(lat, lng)
//                 setLat(lat)
//                 setLng(lng)
//                 setViewport({
//                     ...viewport,
//                     latitude: lat,
//                     longitude: lng
//                 })
//             } catch (error) {
//                 console.log(error)
//                 setGeocodeError(true)
//             } finally {
//                 setLoading(false)
//             }
//         }
//         fetchCoords()
//     }, [])
//     if (loading) return <h3>loading...</h3>
//     if (geocodeError) return <div className="text-xl">no location data found</div>

//     return (<div>Map</div>);
// }

// export default PropertyMap;
