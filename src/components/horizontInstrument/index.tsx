'use client'
import Image from "next/image";
import { useSelector } from "react-redux";
import { UavState } from "../../store/uavSlice";


const HorizontInstrument = ({ heading }: { heading: number }) => {
  const { width, height } = { width: 150, height: 150 };
  const uavData = useSelector((state: UavState) => state.uavList[0]);

  return (
    <div className="relative w-full h-1/2">

      <div className="absolute inset-0 flex items-center justify-center" style={{ transform: `rotate(${uavData.roll ? uavData.roll : 0}deg)` }}>
        <Image
          src='/instruments/horizon_back.svg'
          className=""
          alt=""
          width={width} height={height}
        />
      </div>

      <div className="absolute inset-0 flex items-center justify-center" style={{ transform: `translateY(${uavData.pitch ? uavData.pitch * -3 : 0}px)` }}>
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

export default HorizontInstrument