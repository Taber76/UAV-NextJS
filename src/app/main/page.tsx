'use client'
import { useEffect, useState, useRef } from 'react'
import io, { Socket } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { UavState, changeStatus } from '@/store/uavSlice';
import { addUAV } from '@/store/uavSlice';
import { HeadingInstrument, HorizonInstrument, AltitudeInstrument, SpeedInstrument, StatusBar, Map, WaypointsList } from "../../components";
import FetchLib from '@/lib/fetch.lib';
import MsgHandler from '@/lib/msgHandler.lib';

import './styles.css'

export default function Main() {
  const [uavs, setUavs] = useState([]);
  const [uavConnectedSocketId, setUavConnectedSocketId] = useState('');
  const socketRef = useRef<Socket | null>(null);
  const dispatch = useDispatch();

  const uavConnected = useSelector((state: UavState) => state.uavList[0]?.connected);
  const uavSocketId = useSelector((state: UavState) => state.uavList[0]?.socketId);
  const uavWaypoints = useSelector((state: UavState) => state.uavList[0]?.waypoints);


  const handleSelectedUav = (uavSocketId: string, uavname: string) => {
    if (uavSocketId !== '' && socketRef.current) { // connect to UAV ------------
      setUavConnectedSocketId(uavSocketId);
      socketRef.current.emit('message', MsgHandler.outgoing({
        type: 'connectUav',
        username: localStorage.getItem('username') as string,
        userSocket: socketRef.current.id
      }),
        uavSocketId
      );
      dispatch(addUAV({
        uavname: uavname,
        connected: false,
        status: 'Disconnected',
        socketId: uavSocketId,
        waypoints: [],
        reachedWaypoints: [],
        position: { health: false, lat: 0, lon: 0, alt: 0, relative_alt: 0, hdg: 0 },
        roll: 0,
        pitch: 0,
        speed: 0,
        battery: 0
      }));
    } else if (socketRef.current) { // disconnect from UAV  ---------------------
      socketRef.current.emit('message', MsgHandler.outgoing({
        type: 'sendCommand',
        command: { type: 'disconnect' }
      }),
        uavConnectedSocketId
      );
      dispatch(changeStatus({ uavIndex: 0, status: 'Disconnected' }));
      setUavConnectedSocketId('');
    }
    setUavConnectedSocketId(uavSocketId);
  }

  // set socket client ----------------------------------------------------
  useEffect(() => {

    // set socket client
    const socketInit = async (id: string) => {
      await fetch('/api/socket'); // power-on socket in server
      socketRef.current = io(process.env.SOCKET_IO_URI as string);
      socketRef.current.emit('authenticate', id);
      socketRef.current.on('authenticated', (clientSocketId) => {
        localStorage.setItem('clientSocketId', clientSocketId);
      });

      // on message
      socketRef.current.on('message', (msg, uavConnectedSocket) => {
        MsgHandler.incoming(msg, dispatch);
        console.log('Message received:', msg, ' from: ', uavConnectedSocket);
      });
    }

    // get connected uavs
    const getConnectedUavs = async () => {
      const response = await FetchLib.get('/api/uav/getconnected');
      response.push({ uavname: "Desconectar", uavId: 'No Id', socketId: '' });
      setUavs(response);
    }

    // check localstorage
    const tokenString = localStorage.getItem('token')
    const token = tokenString ? JSON.parse(tokenString) : null
    if (!token) {
      window.location.href = '/login'
    }

    socketInit(token.id);
    getConnectedUavs();

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

  // heartbeat to UAV ---------------------------------------------------
  useEffect(() => {
    let interval: NodeJS.Timeout
    const heartbeat = () => {
      interval = setInterval(() => {
        if (uavConnectedSocketId && socketRef.current) {
          const msgToUav = {
            type: "sendCommand",
            command: { type: "heartbeat" }
          }
          socketRef.current.emit('message', MsgHandler.outgoing(msgToUav), uavConnectedSocketId);
        }
      }, 200);
    }

    heartbeat();
    return () => {
      clearInterval(interval);
    };
  }, [uavConnectedSocketId])

  // Syncronize waypoints with UAV ---------------------------------------------------
  useEffect(() => {
    if (uavConnected) {
      const msgToUav = {
        type: "sendCommand",
        command: {
          type: "syncWaypoints",
          waypoints: uavWaypoints
        }
      }
      socketRef.current?.emit('message', MsgHandler.outgoing(msgToUav), uavSocketId);
    }
  }, [uavWaypoints]);


  return (
    <div className="mainContainer">

      {/*Status Bar*/}
      <div className="statusBarContainer">
        <StatusBar
          uavs={uavs}
          handleSelectedUav={handleSelectedUav}
          socketRef={socketRef}
        />
      </div>

      {/*Map*/}
      <div className="mapContainer">
        <Map />
      </div>

      {/*Waypoints List*/}
      <div className="waypointsContainer">
        <WaypointsList waypoints={uavWaypoints} />
      </div>

      {/*Instruments*/}
      <div className="instrumentsContainer">
        <HeadingInstrument />
        <HorizonInstrument />
        <AltitudeInstrument />
        <SpeedInstrument />
      </div>

    </div>
  )
}

