import React, { useCallback, useEffect, useMemo, useState } from "react";
import { SketchPicker } from "react-color";
import left_side from "./left_side.png";
import right_side from "./right_side.png";


interface Station {
  stationCode: string;
  stationNameHindi: string;
  stationNameEnglish: string;
  stationNameMarathi: string;
}


interface Route {
  id: number;
  source: Station;
  destination: Station;
  price: number | Record<ClassKey, number>; // 👈 supports both
  via: string;
  distance: string;
  travelTime: number; // Travel time in minutes
}


const githubRawUrl =
  "https://raw.githubusercontent.com/R0GDEV/R0GDEV/refs/heads/main/stationRoutes.ts"; // Replace with actual URL

// ✅ Default Data (Used if fetch fails)
const defaultRoutes: Route[] = [
  {
    id: 1,
    source: {
      stationCode: "S",
      stationNameHindi: "नवाडे रोड",
      stationNameEnglish: "NAVADE ROAD",
      stationNameMarathi: "नवाडे रोड",
    },
    destination: {
      stationCode: "D",
      stationNameHindi: "पनवेल",
      stationNameEnglish: "PANVEL",
      stationNameMarathi: "पनवेल",
    },
    price: { SECOND: 5, FIRST: 25 },
    via: "KLMC",
    distance: "8 km",
    travelTime: 25,
  },
];


const today = new Date();
const formattedDate = today.toLocaleDateString("en-GB"); // Format: DD/MM/YYYY
const calculateBookingTime = (travelTime: number) => {
  const currentTime = new Date();
  currentTime.setMinutes(currentTime.getMinutes() - travelTime);
  return currentTime.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
};



const StationInfo1: React.FC<{ station: Station }> = ({ station }) => (
  <div className="flex items-center gap-1  pt-[5px]">
    <div className="flex items-center justify-center w-[20px] h-[20px] rounded-full bg-fuchsia-800 text-white text-base">
      {station.stationCode}
    </div>
    <div className="flex flex-col font-bold">
      <span className="text-black text-base">{station.stationNameHindi}</span>
      <span className="text-black text-base">{station.stationNameEnglish}</span>
      <span className="text-black text-base">{station.stationNameMarathi}</span>
    </div>
  </div>
);

type ClassKey = "FIRST" | "SECOND";

function normalizePrice(price: number | { SECOND: number; FIRST: number }) {
  if (typeof price === "number") {
    // If the old schema (number) is used, simply use that number
    // for both classes, effectively "skipping calculation"
    return {
      SECOND: price,
      FIRST: price,
    };
  }

  // new schema (object) → return as-is
  return price;
}



const Home: React.FC = () => {

  const [routes, setRoutes] = useState<Route[]>(defaultRoutes);
  const [error, setError] = useState<string | null>(null);
  const [numAdults, setNumAdults] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<Route>(defaultRoutes[0]);
  const [isSwapped, setIsSwapped] = useState<boolean>(false);
  const [isJourney, setIsJourney] = useState(true);
  
  // 🔹 Always get normalized version of selectedRoute
  const normalizedRoute = useMemo(() => ({
    ...selectedRoute,
    price: normalizePrice(selectedRoute.price),
  }), [selectedRoute]);

  const [selectedClass, setSelectedClass] = useState<ClassKey>("SECOND");

  const totalPrice = normalizedRoute.price[selectedClass] * numAdults * (isJourney ? 1 : 2);

  const [bgColor, setBgColor] = useState("#bbf7d0"); // Default background color
  const [showPicker, setShowPicker] = useState(false);
  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };
  // Swap Source & Destination Names Only
  const handleSwapToggle = () => {
    setIsSwapped(!isSwapped);
    setSelectedRoute((prevRoute) => ({
      ...prevRoute,
      source: { ...prevRoute.destination },
      destination: { ...prevRoute.source },
    }));
  };
  const handleBlur = () => {
    setShowPicker(false);
  };

  // Fetch Routes
  const fetchRoutes = useCallback(async () => {
    try {
      const response = await fetch(githubRawUrl);
      if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);

      const tsContent = await response.text(); // Get TypeScript file as text

      // Extract only the array from the raw TypeScript file
      const extractedArray = new Function(`return ${tsContent}`)(); // Avoid using eval()

      // console.log("Fetched Routes:", extractedArray);
      setRoutes(extractedArray);
      setSelectedRoute(extractedArray[0]); // Update selected route
      // console.log(extractedArray);
      setError(null); // Clear error on success
    } catch (error) {
      // console.error("Error fetching routes:", error.message);
      setError("Failed to load data. Showing default routes.");
    }
  }, []);

  useEffect(() => {
    fetchRoutes();
  }, [fetchRoutes]);

// Helper function to extract a recognizable short name
const getShortName = (name: string): string => {
  // 1. Handle common acronyms/abbreviations explicitly
  if (name.includes("SHIVAJI MAH T")) return "CSMT"; // A common abbreviation
  if (name.includes("TERMINUS")) return name.split(' ')[0] + " T"; // E.g., 'KALYAN TERMINUS' -> 'KALYAN T'

  const words = name.split(' ');
  // 2. If the first word is short (e.g., 'C' or 'A'), use the first two words
  if (words.length > 1 && words[0].length <= 2) {
    return `${words[0]} ${words[1]}`; // E.g., "C SHIVAJI"
  }
  
  // 3. Otherwise, use the first word (e.g., "PANVEL")
  return words[0];
};
  const classOptions: Record<ClassKey, { hi: string; en: string; short: string }> = {
    FIRST: { hi: "प्रथम", en: "FIRST", short: "प्र श्रे" },
    SECOND: { hi: "द्वितीय", en: "SECOND", short: "द्वि श्रे" },
  };

  return (
    <div>
      <div className=" w-full">

        <div className=" bg-orange-500 h-8 w-full"> </div>

        <div className=" px-4 shadow-lg rounded-lg overflow-hidden ">

          <div className="relative flex items-center justify-between mt-2 px-4">
            {/* Left Image */}
            <img
              src={left_side}
              alt="Left"
              className="relative z-10 w-8 h-8 object-cover rounded-full"
            />

            {/* Right Image */}
            <img
              src={right_side}
              alt="Right"
              className="relative z-10 w-8 h-8 object-cover rounded-full cursor-pointer"
              onClick={handleEditClick}
            />

            {/* Animated Text Behind Images */}
            <div className="absolute top-1/2 -translate-y-1/2 w-full">
              <div className="whitespace-nowrap  animate-marquee duration-[5s] text-2xl font-bold text-blue-800">
                IR Unreserved Ticketing
              </div>
            </div>
          </div>
          <div className=" mx-auto bg-white shadow-md rounded-lg overflow-none mt-4">

            {/* Header */}
            <div className="bg-sky-400" style={{ backgroundColor: bgColor }}>
              <div className="font-bold p-4 pb-1">
                <div className="flex justify-between items-center">
                  <div className="text-xl pb-[5px] font-black">HAPPY JOURNEY</div>
                  {isEditing && (
                    <div className="right-5 flex flex-col  items-center">
                      {showPicker && (
                        <div className="absolute left-1/2 transform -translate-x-1/2 z-10 shadow-lg rounded-md p-2 bg-white max-w-xs" tabIndex={0} onBlur={handleBlur}>
                          <SketchPicker
                            color={bgColor}
                            onChange={(color) => setBgColor(color.hex)}
                            disableAlpha={true}
                            presetColors={[
                              "#FFFF00", // Yellow
                              "#38BDF8",
                              "#60A5FA",
                              "#8C8CD8",
                              "#800080", // Purple
                              "#FFFFFF", // White
                              "#bbf7d0",
                              "#B49B9B",
                              "#5BECEC",

                            ]}
                          />
                        </div>
                      )}

                      <button
                        onClick={() => setShowPicker(!showPicker)}
                        className="px-4 py-3 bg-gray-200 border border-gray-800 rounded-md shadow "
                        style={{ backgroundColor: bgColor }}
                      />
                    </div>
                  )}
                </div>
                <div className="h-[1.5px] bg-black w-full"></div>
                <div className="grid grid-cols-3 h-[22px] mt-[1px] text-center">
                  <div className="col-start-2">
                    {isEditing ? (
                      <button onClick={() => setIsJourney(!isJourney)} className="border border-gray-400 rounded font-bold">
                        {isJourney ? "JOURNEY" : "RETURN"}
                      </button>
                    ) : (
                      isJourney ? "JOURNEY" : "RETURN"
                    )}
                  </div>
                  <div className="text-right">{formattedDate}</div>
                </div>

                <div className="grid grid-cols-3 ">
                  <div className=" col-start-1 font-bold">₹{totalPrice.toFixed(2)}/-</div>
                  <div className="col-start-3 text-end font-bold">8591365770</div>
                </div>
                <div className="">
                  <div className="">UTS No: X0FNDY0089</div>
                  <div className="h-[1.5px] bg-black w-full"></div>
                </div>
              </div>

              {/* Station Info Section */}
              <div className=" px-4">
                {isEditing && (
                  <>
                   <select
  value={selectedRoute.id}
  onChange={(e) =>
    setSelectedRoute(routes.find(route => route.id === Number(e.target.value)) || routes[0])
  }
  className="border border-gray-400 rounded px-2 py-1 w-full"
>
{routes.map((route) => {
    const displayPrice = normalizePrice(route.price);
    
    // Use the improved short name logic
    const sourceName = getShortName(route.source.stationNameEnglish);
    const destName = getShortName(route.destination.stationNameEnglish);

    return (
      <option key={route.id} value={route.id}>
        {/* Route: Short Source → Short Destination */}
        {sourceName} → {destName}
        {/* Via and Price remain the same compact format */}
        {` (v.${route.via}) | ₹${displayPrice.FIRST}/${displayPrice.SECOND}`}
      </option>
    );
  })}
</select>
                    <div className="flex items-center justify-between rounded-lg">
                      {/* Checkbox & Swap Label */}
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={isSwapped}
                          onChange={handleSwapToggle}
                          className="accent-blue-500"
                        />
                        <span className="font-medium">Swap</span>
                      </div>

                      {/* Error Message & Retry Button */}
                      {error && (
                        <div className="flex items-center text-red-500">
                          <span className="text-sm">{error}</span>
                          <button
                            onClick={fetchRoutes}
                            className="bg-blue-500 text-white px-3 my-1 rounded text-sm"
                          >
                            Try Again
                          </button>
                        </div>
                      )}
                    </div>




                  </>
                )}
                <StationInfo1 station={selectedRoute.source} />
                <StationInfo1 station={selectedRoute.destination} />
                {/* Additional Info */}
                <div className="mt-1 font-bold">
                  <div className="text-base">Adult:
                    {isEditing ? (
                      <input
                        type="number"
                        min="1"
                        value={numAdults}
                        onChange={(e) => setNumAdults(Number(e.target.value))}
                        className="border border-gray-400 h-[20px] text-center rounded px-2 w-14"
                      />
                    ) : (
                      <span className=""> {numAdults}</span>
                    )}
                    <span className="pl-[12px]"> Child: 0</span></div>
                </div>

                {/* Class and Train Type */}
                <div className="grid grid-cols-2 pt-[4px] text-base">
                  <div className="flex items-center">
                    <div className="text-base h-[64px] flex items-center mr-1">CLASS:</div>
                    {isEditing ? (
                      // --- Edit Mode: show dropdown ---
                      <select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value as ClassKey)}
                        className="border rounded px-2 py-1 text-sm"
                      >
                        <option value="FIRST">प्रथम / FIRST / प्र श्रे</option>
                        <option value="SECOND">द्वितीय / SECOND / द्वि श्रे</option>
                      </select>
                    ) : (
                      // --- View Mode: show stacked format ---
                      <div className="flex flex-col font-bold items-start">
                        <div className="w-14">{classOptions[selectedClass].hi}</div>
                        <div className="w-14">{classOptions[selectedClass].en}</div>
                        <div className="w-14">{classOptions[selectedClass].short}</div>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center">
                    <div className="text-base h-[64px] flex items-center mr-1">TRAIN TYPE:</div>
                    <div className="flex flex-col font-bold items-start">
                      <div className="w-14">साधारण</div>
                      <div className="w-14">ORDINARY</div>
                      <div className="w-14">साधारण</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Info Section */}
              <div className="px-4 ">
                <div className="h-[1.6px] bg-black w-full my-px"></div>
                <div className="flex items-center h-[24px] text-center">
                  <span className="via bg-fuchsia-800 text-white w-[26px]  py-[0.10rem]   h-[22px] font-bold ">
                    via
                  </span>
                  <span className="text-base font-normal px-1">
                    {isSwapped
                      ? selectedRoute.via.split("-").reverse().join("-")
                      : selectedRoute.via
                    }</span>
                </div>
                <div className="h-[1.6px] bg-black w-full my-px"></div>
                <div className=" py-[0.10rem]">SAC: <span className="font-bold pr-[4px]"> 996411 </span>IR: <span className="font-bold"> 27AAAGM0289C2ZI</span></div>
                <div className="h-[0.4px] bg-gray-800 w-full"></div>
                <div className="text-base pt-[4px]">Journey Should Commence within 1 hour</div>
                <div className="grid grid-cols-2 pt-[6px]">
                  <div className="text-base font-bold">R18209</div>
                  <div className="text-base text-center">Distance: {selectedRoute.distance}</div>
                </div>
                <div className="text-base pt-[2px] pb-[2px]"><span className="font-bold"> Booking Time:</span> {formattedDate} {calculateBookingTime(selectedRoute.travelTime)}</div>
              </div>
            </div>
            {/* Footer */}
            <div className="bg-white pt-[6px] px-4">
              <div className="text-[10px] tracking-wide text-blue-800">
                It is recommended not to perform factory reset or change your handset whenever you are having valid ticket in the mobile.{" "}
                <a href="#" className="text-orange-500 underline text-[10px]">Click for Changing Handset with Valid Ticket</a>
              </div>
              <div className="text-[12px] font-bold text-red-600 tracking-wide  text-center mt-2">
                FOR MEDICAL EMERGENCY | FIRST AID, CONTACT TICKET CHECKING STAFF | GUARD OR DIAL 139
              </div>
              <div className="mt-4">
                <button className="w-full bg-gradient-to-r from-red-400 to-orange-400 text-sm text-white py-[9px] rounded-full mb-2">OPEN QR CODE</button>
                <button className="w-full bg-gradient-to-r from-red-400 to-orange-400 text-sm text-white py-[9px] rounded-full mb-2">NEXT TRAINS TO {selectedRoute.destination.stationNameEnglish.toUpperCase()}</button>
                <button className="w-full bg-gradient-to-r from-red-400 to-orange-400 text-sm text-white py-[9px] rounded-full mb-2">OK</button>
              </div>
            </div>

            <div className="fixed bottom-0 w-full p-4 text-center text-lg text-gray-600">
              Centre for Railway Information Systems (CRIS)
            </div>

          </div>
        </div>
      </div>
    </div >
  );
};

export default Home;
