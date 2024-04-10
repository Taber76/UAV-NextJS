'use client'
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { UavState } from "../../store/uavSlice";


const SpeedInstrument = () => {
  const { width, height } = { width: 150, height: 150 };
  const uavData = useSelector((state: UavState) => state.uavList[0]);
  const [previousSpeed, setPreviousSpeed] = useState(0);
  const [currentSpeed, setCurrentSpeed] = useState(0);

  useEffect(() => {
    setPreviousSpeed(currentSpeed);
    setCurrentSpeed(uavData.speed || 0);
  }, [uavData.speed]);

  return (
    <div className="relative w-full h-1/2">

      <div className="absolute inset-0 flex items-center justify-center">
        <Image
          src='/instruments/speed_mechanics.svg'
          className=""
          alt=""
          width={width} height={height}
        />
      </div>

      <div className="absolute inset-0 flex items-center justify-center" style={{ transform: `rotate(${previousSpeed + 90}deg)`, transition: 'transform 1s ease' }}>
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

export default SpeedInstrument