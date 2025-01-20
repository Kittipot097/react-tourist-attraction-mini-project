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
        fetchTrips();
    }, []);

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
        <div className="max-w-5xl m-auto">
            <h1 className="text-2xl font-bold mb-4 text-cyan-500 text-center">วางแพลน เที่ยวไหนดี</h1>
            <div className="flex items-end gap-2">
                <div className="w-full">
                    <label htmlFor="search" className="block text-sm/6 font-medium text-gray-900">
                        ค้นหาสถานที่ท่องเที่ยว
                    </label>
                    <input
                        id="search"
                        name="search"
                        type="text"
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                        placeholder="ป้อนคำค้นหา เช่น เกาะช้าง แล้วไปกัน..."
                        className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                    />
                </div>
                <button
                    onClick={fetchTrips}
                    className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2.5 rounded-lg"
                >
                    ค้นหา
                </button>
            </div>
            {loading && <p>กำลังโหลด...</p>}
            {error && <p className="text-red-500">เกิดข้อผิดพลาด: {error}</p>}
            <div className="list-disc divide-y divide-gray-200">
                {trips.map((trip) => (
                    <div key={trip.eid} className="py-8 grid grid-cols-4 gap-6">
                        <div className="col-span-full lg:col-span-1">
                            {/* แสดงรูปที่ index 0 */}
                            <img
                                src={trip.photos[0]}
                                alt={`Trip image 0`}
                                className="h-[272px] w-full object-cover rounded-xl"
                            />
                        </div>
                        <div className="col-span-full lg:col-span-3">
                            <h2 className="font-semibold text-lg mb-2">{trip.title}</h2>
                            <div className="mb-2">
                                <p className={`text-gray-600 ${!(descriptionVisibility[trip.eid]) ? 'truncate' : ''}`}>
                                    {trip.description}
                                </p>

                                {trip.description.length > 100 && !descriptionVisibility[trip.eid] && (
                                    <button
                                        onClick={() => toggleDescription(trip.eid)}
                                        className="text-cyan-500 underline hover:underline-offset-4"
                                    >
                                        อ่านต่อ
                                    </button>
                                )}

                                {descriptionVisibility[trip.eid] && (
                                    <button
                                        onClick={() => toggleDescription(trip.eid)}
                                        className="text-cyan-500 underline hover:underline-offset-4"
                                    >
                                        ย่อ
                                    </button>
                                )}
                            </div>
                            <div className="mb-2 flex flex-col sm:flex-row gap-2">
                                <p className="min-w-fit">หยวดหมู่:</p>
                                <ul className="list-inline">
                                    {trip.tags.map((tag, index) => (
                                        <li
                                            key={index}
                                            className="inline-block bg-gray-200 text-gray-700 text-sm px-2 py-1 rounded-full mr-2 mb-2 cursor-pointer hover:bg-gray-300"
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
                            <div className="md:flex justify-between items-end gap-4">
                                {/* แสดงรูปที่เหลือ */}
                                <div className="flex gap-2 mb-2 overflow-x-auto">
                                    {trip.photos.slice(1).map((photoUrl, index) => (
                                        <img
                                            key={index}
                                            src={photoUrl}
                                            alt={`Trip image ${index + 1}`}
                                            className="w-32 h-32 object-cover rounded-lg"
                                        />
                                    ))}
                                </div>
                                <div className="mt-6 md:mt-2">
                                    <button
                                        onClick={() => handleCopyLink(trip.url, trip.eid)}
                                        className="text-cyan-500 w-[80px] h-[40px] rounded-lg border border-cyan-500 hover:bg-gray-100 flex justify-center items-center"
                                    >
                                        {copiedTripId === trip.eid ? (
                                            <span className="text-xs">Copied!</span>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 w-5 h-5">
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
                <div className="flex flex-col justify-center w-full items-center">
                    <img
                        src={NotingSearch}
                        className="w-72 h-72 bg-cover bg-center rounded-xl"
                    />
                    <p>ไม่มีทริปที่ตรงกับคำค้นหา ลองป้อนคำใหม่</p>
                </div>
            )}
        </div>
    );
};

export default Trips;
