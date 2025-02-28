import React, { useState } from "react";
import { SketchPicker } from "react-color";
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
  price: number;
  via: string;
  distance: string;
  travelTime: number; // Travel time in minutes
}
const stationRoutes: Route[] = [
  {
    id: 4,
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
    price: 5,
    via: "KLMC",
    distance: "8 km",
    travelTime: 25,
  },
  {
    id: 1,
    source: {
      stationCode: "S",
      stationNameHindi: "दिवा",
      stationNameEnglish: "DIVA",
      stationNameMarathi: "दिवा",
    },
    destination: {
      stationCode: "D",
      stationNameHindi: "छ. शिवाजी महा. ट.",
      stationNameEnglish: "C SHIVAJI MAH T",
      stationNameMarathi: "छ. शिवाजी महा ट",
    },
    price: 15,
    via: "CLA",
    distance: "43 km",
    travelTime: 60,
  },
  {
    id: 2,
    source: {
      stationCode: "S",
      stationNameHindi: "खारघर",
      stationNameEnglish: "KHARGHAR",
      stationNameMarathi: "खारघर",
    },
    destination: {
      stationCode: "D",
      stationNameHindi: "राबाडा",
      stationNameEnglish: "RABADA",
      stationNameMarathi: "राबाडा",
    },
    price: 10,
    via: "JNJ-TUH",
    distance: "18 km",
    travelTime: 40,
  },
  {
    id: 3,
    source: {
      stationCode: "S",
      stationNameHindi: "दिवा",
      stationNameEnglish: "DIVA",
      stationNameMarathi: "दिवा",
    },
    destination: {
      stationCode: "D",
      stationNameHindi: "ठाणे",
      stationNameEnglish: "THANE",
      stationNameMarathi: "ठाणे",
    },
    price: 5,
    via: "------",
    distance: "10 km",
    travelTime: 25,
  },
  {
    id: 5,
    source: {
      stationCode: "S",
      stationNameHindi: "पनवेल",
      stationNameEnglish: "PANVEL",
      stationNameMarathi: "पनवेल",
    },
    destination: {
      stationCode: "D",
      stationNameHindi: "ठाणे",
      stationNameEnglish: "THANE",
      stationNameMarathi: "ठाणे",
    },
    price: 15,
    via: "JNJ-TUH",
    distance: "27 km",
    travelTime: 40,
  },
  {
    id: 6,
    source: {
      stationCode: "S",
      stationNameHindi: "छ. शिवाजी महा. ट.",
      stationNameEnglish: "C SHIVAJI MAH T",
      stationNameMarathi: "छ. शिवाजी महा ट",
    },
    destination: {
      stationCode: "D",
      stationNameHindi: "पनवेल",
      stationNameEnglish: "PANVEL",
      stationNameMarathi: "पनवेल",
    },
    price: 20,
    via: "CLA",
    distance: "49 km",
    travelTime: 50,
  },
  {
    id: 7,
    source: {
      stationCode: "S",
      stationNameHindi: "छ. शिवाजी महा. ट.",
      stationNameEnglish: "C SHIVAJI MAH T",
      stationNameMarathi: "छ. शिवाजी महा ट",
    },
    destination: {
      stationCode: "D",
      stationNameHindi: "पनवेल",
      stationNameEnglish: "PANVEL",
      stationNameMarathi: "पनवेल",
    },
    price: 25,
    via: "TNA-TUH-JNJ",
    distance: "68 km",
    travelTime: 50,
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


const Home: React.FC = () => {

  const [numAdults, setNumAdults] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(stationRoutes[0]);
  const [isSwapped, setIsSwapped] = useState<boolean>(false);
  const [isJourney, setIsJourney] = useState(true);
  const totalPrice = selectedRoute.price * numAdults * (isJourney ? 1 : 2);
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
      source: {
        ...prevRoute.source,
        stationNameHindi: prevRoute.destination.stationNameHindi,
        stationNameEnglish: prevRoute.destination.stationNameEnglish,
        stationNameMarathi: prevRoute.destination.stationNameMarathi,
      },
      destination: {
        ...prevRoute.destination,
        stationNameHindi: prevRoute.source.stationNameHindi,
        stationNameEnglish: prevRoute.source.stationNameEnglish,
        stationNameMarathi: prevRoute.source.stationNameMarathi,
      },
    }));
  };
  const handleBlur = () => {
    setShowPicker(false);
  };

  return (
    <div>
      <div className=" w-full">

        <div className=" bg-orange-500 h-8 w-full"> </div>

        <div className=" px-4 shadow-lg rounded-lg overflow-hidden ">

          <div className="relative flex items-center justify-between mt-2 px-4">
            {/* Left Image */}
            <img
              src="https://cms.indianrail.gov.in/CMSREPORT/JSPRWD/BootSnipp/dist/img/cris.png"
              alt="Left"
              className="relative z-10 w-8 h-8 object-cover rounded-full"
            />

            {/* Right Image */}
            <img
              src="https://cms.indianrail.gov.in/CMSREPORT/JSPRWD/BootSnipp/dist/img/IR.png"
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
                              "#FF0000", // Red
                              "#00FF00", // Green
                              "#0000FF", // Blue
                              "#FFFF00", // Yellow
                             " #38BDF8",
                             "#60A5FA",
                              "#800080", // Purple
                              "#FFFFFF", // White
                              "#bbf7d0",

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
                        setSelectedRoute(stationRoutes.find(route => route.id === Number(e.target.value)) || stationRoutes[0])
                      }
                      className="border border-gray-400 rounded px-2 py-1 w-full"
                    >
                      {stationRoutes.map((route) => (
                        <option key={route.id} value={route.id}>
                          {route.source.stationNameEnglish} TO {route.destination.stationNameEnglish}
                        </option>
                      ))}
                    </select>
                    <label className="flex items-center mt-2">
                      <input
                        type="checkbox"
                        checked={isSwapped}
                        onChange={handleSwapToggle}
                        className="mr-2"
                      />
                      Swap
                    </label>


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
                    <div className="flex flex-col font-bold items-start">
                      <div className="w-14">द्वितीय</div>
                      <div className="w-14 ont-bold">SECOND</div>
                      <div className="w-14">द्वि श्रे</div>
                    </div>
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
