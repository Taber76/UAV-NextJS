'use client'

import {
  Airspeed,
  Altimeter,
  AttitudeIndicator,
  HeadingIndicator,
  TurnCoordinator,
  Variometer
} from 'react-flight-indicators'

const Instruments = () => {
  return (
    <div>
      <HeadingIndicator heading={Math.random() * 360} showBox={false} />
    </div>
  )
}

export default Instruments