'use client'
import BatteryGauge from 'react-battery-gauge';

const BatteryInstrument = (props: any) => {
  const { battery } = props;
  return (

    <BatteryGauge
      value={battery}
      size={120}
      aspectRatio={0.25}
      formatValue={value => { return value === 0 ? '-' : `${value}%` }}
      customization={{
        batteryBody: {
          strokeWidth: 2,
          cornerRadius: 2,
          fill: 'none',
          strokeColor: '#7bb4e3'
        },
        batteryMeter: {
          lowBatteryFill: 'red',
          lowBatteryValue: 20,
          outerGap: 2,
          noOfCells: 10,
        },
        batteryCap: {
          fill: 'none',
          strokeWidth: 4,
          strokeColor: '#7bb4e3',
          cornerRadius: 2,
          capToBodyRatio: 0.4
        },
        readingText: {
          lightContrastColor: '#fff',
          darkContrastColor: '#fff',
          lowBatteryColor: 'red',
          fontFamily: 'Helvetica',
          fontSize: 14,
          showPercentage: false,
        },
      }}
    />

  );
};

export default BatteryInstrument