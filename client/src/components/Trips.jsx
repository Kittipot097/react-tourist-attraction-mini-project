import React, { useState, useEffect } from "react";
import NotingSearch from '../assets/noting-search.png'

const Trips = () => {
    const [trips, setTrips] = useState([]);
    const [keywords, setKeywords] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    //optional
    const [descriptionVisibility, setDescriptionVisibility] = useState({});
    const [copiedTripId, setCopiedTripId] = useState(null);

    const fetchTrips = () => {
        setLoading(true);
        setError(null);

        const url = `http://localhost:4001/trips?keywords=${keywords}`;

        fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch trips");
                }
                return response.json();
            })
            .then((data) => {
                setTrips(data.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching trips:", error);
                setError(error.message);
                setLoading(false);
            });
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchTrips();
        }, 500);
    
        return () => clearTimeout(delayDebounceFn);
    }, [keywords]);
    

    const handleCopyLink = (link, tripId) => {
        navigator.clipboard.writeText(link).then(() => {
            setCopiedTripId(tripId);
            setTimeout(() => {
                setCopiedTripId(null);
            }, 2000);
        }).catch((error) => {
            console.error("Error copying link:", error);
            alert("ไม่สามารถคัดลอกลิงก์ได้");
        });
    };

    const toggleDescription = (tripId) => {
        setDescriptionVisibility(prevState => ({
            ...prevState,
            [tripId]: !prevState[tripId]
        }));
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-cyan-500 text-center">เที่ยวไหนดี</h1>
            
            {/* ค้นหาที่เที่ยว */}
            <div className="max-w-5xl mx-auto">
                <label htmlFor="search" className="block text-base font-medium text-gray-900 text-start">
                    ค้นหาที่เที่ยว
                </label>
                <div className="flex gap-2 mt-2">
                    <input
                        id="search"
                        name="search"
                        type="text"
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                        placeholder="หาที่เที่ยวแล้วไปกัน..."
                        className="p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500 text-center shadow-md"
                    />
                </div>
            </div>

            {loading && <p className="text-center text-gray-500 mt-4">กำลังโหลด...</p>}
            {error && <p className="text-center text-red-500 mt-4">เกิดข้อผิดพลาด: {error}</p>}

            {/* รายการทริป */}
            <div className="mt-10 space-y-10">
                {trips.map((trip) => (
                    <div key={trip.eid} className="flex flex-col md:flex-row gap-6">
                        
                        {/* รูปภาพหลัก */}
                        <img
                            src={trip.photos[0]}
                            alt={`Trip image 0`}
                            className="w-full md:w-[24rem] aspect-[16/9] md:h-[280px] object-cover rounded-3xl"
                        />


                        {/* ข้อมูลทริป */}
                        <div className="flex-1">
                            <h2 className="font-semibold text-2xl sm:text-3xl mb-2">{trip.title}</h2>
                            
                            <div className="mb-2">
                                <p className={`text-gray-600 ${!descriptionVisibility[trip.eid] ? 'line-clamp-1' : ''}`}>
                                    {trip.description}
                                </p>

                                {trip.description.length > 100 && (
                                    <button
                                        onClick={() => toggleDescription(trip.eid)}
                                        className="text-cyan-500 underline hover:underline-offset-4 mt-2"
                                    >
                                        {descriptionVisibility[trip.eid] ? 'ย่อ' : 'อ่านต่อ'}
                                    </button>
                                )}
                            </div>

                            {/* หมวดหมู่ */}
                            <div className="mb-2 flex flex-wrap gap-2">
                                <p className="min-w-fit">หมวดหมู่:</p>
                                <ul className="list-inline flex gap-2">
                                    {trip.tags.slice(0, -1).map((tag, index) => (
                                        <li
                                            key={index}
                                            className="text-gray-600 underline hover:underline-offset-4 cursor-pointer min-w-fit"
                                            onClick={() => {
                                                setKeywords(tag);
                                                fetchTrips();
                                            }}
                                        >
                                            {tag}
                                        </li>
                                    ))}
                                </ul>
                                และ
                                <ul className="list-inline flex gap-2">
                                    {trip.tags.slice(-1).map((tag, index) => (
                                        <li
                                            key={index}
                                            className="text-gray-600 underline hover:underline-offset-4 cursor-pointer min-w-fit"
                                            onClick={() => {
                                                setKeywords(tag);
                                                fetchTrips();
                                            }}
                                        >
                                            {tag}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="flex justify-between items-end">
                                {/* รูปภาพเพิ่มเติม */}
                                <div className="flex gap-2 overflow-x-auto mt-3">
                                    {trip.photos.slice(1).map((photoUrl, index) => (
                                        <img
                                            key={index}
                                            src={photoUrl}
                                            alt={`Trip image ${index + 1}`}
                                            className="w-24 h-24 object-cover rounded-xl"
                                        />
                                    ))}
                                </div>

                                {/* ปุ่ม Copy Link */}
                                <div className="mt-4">
                                    <button
                                        onClick={() => handleCopyLink(trip.url, trip.eid)}
                                        className="text-cyan-500 w-12 h-12 rounded-full border-2 border-cyan-500 hover:bg-gray-100 flex justify-center items-center"
                                    >
                                        {copiedTripId === trip.eid ? (
                                            <span className="text-xs">Copied!</span>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {!loading && !trips.length && !error && (
                <div className="flex flex-col justify-center items-center mt-10">
                    <img src={NotingSearch} className="w-56 h-56 object-cover rounded-xl" />
                    <p className="text-center mt-4">ไม่มีทริปที่ตรงกับคำค้นหา ลองป้อนคำใหม่</p>
                </div>
            )}
        </div>
    );
};

export default Trips;