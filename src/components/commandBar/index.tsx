'use client'

import React, { useEffect, useState } from 'react';
import { Button } from "@nextui-org/react";
import { useSelector } from "react-redux";
import { UavState } from "../../store/uavSlice";
import BatteryGauge from 'react-battery-gauge';

import { DropDownButton } from '..';
import './styles.css';

const CommandBar: React.FC<{ uavs: any[]; handleSelectedUav: (socketId: string, uavname: string) => void }> = ({ uavs, handleSelectedUav }) => {
  // Estado local para controlar el estado de cada botón
  const [armButtonActive, setArmButtonActive] = useState(false);
  const [takeoffButtonActive, setTakeoffButtonActive] = useState(false);
  const [landButtonActive, setLandButtonActive] = useState(false);
  const [buttonColor, setButtonColor] = useState<"default" | "success" | "warning" | "primary" | "secondary" | "danger" | undefined>('default');
  const [buttonText, setButtonText] = useState('Default');
  const [battery, setBattery] = useState(0);
  const uavData = useSelector((state: UavState) => state.uavList[0]);

  useEffect(() => {
    setBattery(uavData.battery);
  }, [uavData.battery]);

  useEffect(() => {
    switch (uavData.status) {
      case 'Disconnected':
        setButtonColor('default');
        setButtonText('DISCONNECTED');
        break;
      case 'Connected':
        setButtonColor('success');
        setButtonText('CONNECTED');
        break;
      case 'Armed':
        setButtonColor('warning');
        setButtonText('ARMED');
        break;
      case 'Takeoff':
        setButtonColor('warning');
        setButtonText('TAKEOFF');
        break;
      case 'Landing':
        setButtonColor('warning');
        setButtonText('LANDING');
        break;
      default:
        setButtonColor('default');
        setButtonText('DEFAULT');
        break;
    }
  }, [uavData.status]);


  // Funciones de manejo de eventos para cada botón
  const handleArmButtonClick = () => {
    // Lógica para activar/desactivar el botón
    setArmButtonActive(!armButtonActive);
    // Otras acciones que quieras realizar
  };

  const handleTakeoffButtonClick = () => {
    // Lógica para activar/desactivar el botón
    setTakeoffButtonActive(!takeoffButtonActive);
    // Otras acciones que quieras realizar
  };

  const handleLandButtonClick = () => {
    // Lógica para activar/desactivar el botón
    setLandButtonActive(!landButtonActive);
    // Otras acciones que quieras realizar
  };



  return (
    <div className='statusBar'>
      <div className="flex px-4 w-full justify-left gap-2 m-1">

        {/* Botón de Arm */}
        <Button
          size='sm'
          variant='ghost'
          color={armButtonActive ? "success" : "warning"}
          onClick={handleArmButtonClick}
          disabled={!armButtonActive}
          className={armButtonActive ? '' : 'disabled'}
        >
          Arm
        </Button>

        {/* Botón de Takeoff */}
        <Button
          size='sm'
          variant='ghost'
          color={takeoffButtonActive ? "success" : "warning"}
          onClick={handleTakeoffButtonClick}
          disabled={!takeoffButtonActive}
          className={takeoffButtonActive ? '' : 'disabled'}
        >
          Takeoff
        </Button>

        {/* Botón de Land */}
        <Button
          size='sm'
          variant='ghost'
          color={landButtonActive ? "success" : "warning"}
          onClick={handleLandButtonClick}
          disabled={!landButtonActive}
          className={landButtonActive ? '' : 'disabled'}
        >
          Land
        </Button>
      </div>

      <div className='flex px-4 w-full justify-center items-center gap-2 m-1'>
      </div>

      <div className="flex px-2 w-full justify-end gap-2 m-1">

        <DropDownButton
          uavs={uavs}
          handleSelectedUav={handleSelectedUav}
        />

        {/* Botón de Status */}
        <Button
          size='sm'
          variant='faded'
          color={buttonColor}
          isDisabled
        >
          {buttonText}
        </Button>

        <div className='flex justify-center items-center'>

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
        </div>


      </div>

    </div>
  );
};

export default CommandBar;