'use client'
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { UavState } from "../../store/uavSlice";


const AltitudeInstrument = () => {
  const { width, height } = { width: 150, height: 150 };
  const uavData = useSelector((state: UavState) => state.uavList[0]);
  const [previousAltitude, setPreviousAltitude] = useState(0);
  const [currentAltitude, setCurrentAltitude] = useState(0);

  useEffect(() => {
    setPreviousAltitude(currentAltitude);
    setCurrentAltitude(uavData.position.alt || 0);
  }, [uavData.position.alt]);

  return (
    <div className="relative w-full h-1/2">

      <div className="absolute inset-0 flex items-center justify-center">
        <Image
          src='/instruments/altitude_pressure.svg'
          className=""
          alt=""
          width={width} height={height}
        />
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <Image
          src='/instruments/altitude_ticks.svg'
          className=""
          alt=""
          width={width} height={height}
        />
      </div>

      <div className="absolute inset-0 flex items-center justify-center" style={{ transform: `rotate(${previousAltitude * 0.36}deg)`, transition: 'transform 0.5s ease' }}>
        <Image
          src='/instruments/fi_needle_small.svg'
          className=""
          alt=""
          width={width} height={height}
        />
      </div>

      <div className="absolute inset-0 flex items-center justify-center" style={{ transform: `rotate(${previousAltitude * 3.6 + 90}deg)`, transition: 'transform 0.5s ease' }}>
        <Image
          src='/instruments/fi_needle.svg'
          className=""
          alt=""
          width={width} height={height}
        />
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <Image
          src='/instruments/fi_circle.svg'
          className=""
          alt=""
          width={width} height={height}
        />
      </div>

    </div>
  )
}

export default AltitudeInstrument