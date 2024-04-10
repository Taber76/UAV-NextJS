'use client'
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { UavState } from "../../store/uavSlice";

const HeadingInstrument = () => {
  const { width, height } = { width: 150, height: 150 };
  const uavData = useSelector((state: UavState) => state.uavList[0]);
  const [previousHdg, setPreviousHdg] = useState(0);
  const [currentHdg, setCurrentHdg] = useState(0);

  useEffect(() => {
    setPreviousHdg(currentHdg);
    setCurrentHdg(uavData.position.hdg || 0);
  }, [uavData.position.hdg]);

  return (
    <div className="relative w-full h-1/2">
      <div className="absolute inset-0 flex items-center justify-center" style={{ transform: `rotate(${-1 * previousHdg}deg)`, transition: 'transform 1.0s ease' }}>
        <Image
          src='/instruments/heading_yaw.svg'
          className=""
          alt=""
          width={width} height={height}
        />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <Image
          src='/instruments/heading_mechanics.svg'
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

export default HeadingInstrument