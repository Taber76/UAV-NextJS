'use client'
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { UavState } from "../../store/uavSlice";


const HorizonInstrument = () => {
  const { width, height } = { width: 150, height: 150 };
  const uavData = useSelector((state: UavState) => state.uavList[0]);
  const [previousRoll, setPreviousRoll] = useState(0);
  const [currentRoll, setCurrentRoll] = useState(0);
  const [previousPitch, setPreviousPitch] = useState(0);
  const [currentPitch, setCurrentPitch] = useState(0);

  useEffect(() => {
    setPreviousRoll(currentRoll);
    setCurrentRoll(uavData.roll || 0);
    setPreviousPitch(currentPitch);
    setCurrentPitch(uavData.pitch || 0);
  }, [uavData.roll, uavData.pitch]);

  return (
    <div className="relative w-full h-1/2">

      <div className="absolute inset-0 flex items-center justify-center" style={{ transform: `rotate(${previousRoll}deg)`, transition: 'transform 0.2s ease' }}>
        <Image
          src='/instruments/horizon_back.svg'
          className=""
          alt=""
          width={width} height={height}
        />
      </div>

      <div className="absolute inset-0 flex items-center justify-center" style={{ transform: `translateY(${previousPitch * -1}px) rotate(${previousRoll}deg)`, transition: 'transform 0.2s ease' }}>
        <Image
          src='/instruments/horizon_ball.svg'
          className=""
          alt=""
          width={width} height={height}
        />
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <Image
          src='/instruments/horizon_circle.svg'
          className=""
          alt=""
          width={width} height={height}
        />
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <Image
          src='/instruments/horizon_mechanics.svg'
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

export default HorizonInstrument