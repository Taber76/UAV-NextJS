'use client'

import React, { useEffect, useState } from 'react';
import { Button } from "@nextui-org/react";
import { useSelector } from "react-redux";
import { UavState } from "../../store/uavSlice";

import { DropDownButton, BatteryInstrument } from '..';
import MsgHandler from '../../lib/msgHandler.lib';
import './styles.css';

const StatusBar: React.FC<{ uavs: any[]; handleSelectedUav: (socketId: string, uavname: string) => void; socketRef: any }> = ({ uavs, handleSelectedUav, socketRef }) => {
  // Estado local para controlar el estado de cada botón
  const [armButtonActive, setArmButtonActive] = useState(false);
  const [armButtonText, setArmButtonText] = useState('ARM');
  const [takeoffButtonActive, setTakeoffButtonActive] = useState(false);
  const [landButtonActive, setLandButtonActive] = useState(false);
  const [buttonColor, setButtonColor] = useState<"default" | "success" | "warning" | "primary" | "secondary" | "danger" | undefined>('default');
  const [buttonVariant, setButtonVariant] = useState<"solid" | "faded" | undefined>('faded');
  const [buttonText, setButtonText] = useState('Default');
  const uavStatus = useSelector((state: UavState) => state.uavList[0].status);
  const uavBattery = useSelector((state: UavState) => state.uavList[0].battery);
  const uavSocketId = useSelector((state: UavState) => state.uavList[0].socketId);

  useEffect(() => {
    switch (uavStatus) {
      case 'Disconnected':
        setButtonVariant('faded');
        setButtonColor('default');
        setButtonText('DISCONNECTED');
        setArmButtonActive(false);
        setTakeoffButtonActive(false);
        setLandButtonActive(false);
        break
      case 'Connected':
        setButtonVariant('solid');
        setButtonColor('success');
        setButtonText('CONNECTED');
        setArmButtonActive(true);
        setArmButtonText('ARM');
        break
      case 'Armed':
        setButtonColor('warning');
        setButtonText('ARMED');
        setTakeoffButtonActive(true);
        setArmButtonText('DISARM');
        break
      case 'Takeoff':
        setButtonColor('warning');
        setButtonText('TAKEOFF');
        setArmButtonActive(false);
        break
      case 'Flying':
        setButtonColor('warning');
        setButtonText('FLYING');
        setLandButtonActive(true);
        break
      case 'Landing':
        setButtonColor('warning');
        setButtonText('LANDING');
        setLandButtonActive(false);
        break
      default:
        setButtonColor('default');
        setButtonText('DEFAULT');
        break;
    }
  }, [uavStatus]);


  // Funciones de manejo de eventos para cada botón
  const handleArmButtonClick = () => {
    if (uavStatus === 'Connected') {
      const msgToUav = MsgHandler.outgoing({
        type: 'sendCommand',
        command: {
          type: 'arm'
        }
      })
      socketRef.current?.emit('message', msgToUav, uavSocketId);
    } else if (uavStatus === 'Armed') {
      const msgToUav = MsgHandler.outgoing({
        type: 'sendCommand',
        command: {
          type: 'disarm'
        }
      })
      socketRef.current?.emit('message', msgToUav, uavSocketId);
    }
  };

  const handleTakeoffButtonClick = () => {
    if (uavStatus === 'Armed') {
      const msgToUav = MsgHandler.outgoing({
        type: 'sendCommand',
        command: {
          type: 'takeoff'
        }
      })
      socketRef.current?.emit('message', msgToUav, uavSocketId);
    }
  };

  const handleLandButtonClick = () => {
    if (uavStatus === 'Flying') {
      const msgToUav = MsgHandler.outgoing({
        type: 'sendCommand',
        command: {
          command: 'land'
        }
      })
      socketRef.current?.emit('message', msgToUav, uavSocketId);
    }
  };


  return (
    <div className='statusBar'>

      {/* Buttons container */}
      <div className="flex px-4 w-full justify-left gap-2 m-1">

        {/* Botón de Arm */}
        <Button
          size='sm'
          variant='solid'
          color={armButtonActive ? "success" : "default"}
          onClick={handleArmButtonClick}
          disabled={!armButtonActive}
          className={armButtonActive ? '' : 'disabled'}
          fullWidth={true}
        >
          {armButtonText}
        </Button>

        {/* Botón de Takeoff */}
        <Button
          size='sm'
          variant='solid'
          color={takeoffButtonActive ? "success" : "default"}
          onClick={handleTakeoffButtonClick}
          disabled={!takeoffButtonActive}
          className={takeoffButtonActive ? '' : 'disabled'}
          fullWidth={true}
        >
          TAKEOFF
        </Button>

        {/* Botón de Land */}
        <Button
          size='sm'
          variant='solid'
          color={landButtonActive ? "success" : "default"}
          onClick={handleLandButtonClick}
          disabled={!landButtonActive}
          className={landButtonActive ? '' : 'disabled'}
          fullWidth={true}
        >
          LAND
        </Button>

      </div>

      {/* Messagges container */}
      <div className='flex px-4 w-full justify-center items-center gap-2 m-1'>
      </div>


      {/* Dropdown de Uavs, Botón de Status y Batería */}
      <div className="flex px-2 w-full justify-end gap-2 m-1">

        {/* Dropdown de Uavs */}
        <DropDownButton
          uavs={uavs}
          handleSelectedUav={handleSelectedUav}
        />

        {/* Botón de Status */}
        <Button
          size='sm'
          variant={buttonVariant}
          color={buttonColor}
          isDisabled
        >
          {buttonText}
        </Button>

        {/* Batería */}
        <div className='flex justify-center items-center'>
          <BatteryInstrument battery={uavBattery} />
        </div>


      </div>

    </div>
  );
};

export default StatusBar;