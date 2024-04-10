'use client'
import Image from "next/image";
import { useSelector } from "react-redux";
import { UavState } from "../../store/uavSlice";

const HeadingInstrument = ({ heading }: { heading: number }) => {
  const { width, height } = { width: 150, height: 150 };
  const uavData = useSelector((state: UavState) => state.uavList[0]);


  return (
    <div className="relative w-full h-1/2">
      <div className="absolute inset-0 flex items-center justify-center" style={{ transform: `rotate(${uavData.position.hdg ? uavData.position.hdg : 0}deg)` }}>
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