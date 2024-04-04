'use client'
import { useEffect, useState } from 'react'
import io, { Socket } from 'socket.io-client';
import { StatusBar, Map } from "../../components";
import FetchLib from '@/lib/fetch.lib';

import './styles.css'


export default function Main() {
  const [uavs, setUavs] = useState([]);
  const [uavConnectedSocket, setUavConnectedSocket] = useState('');

  const handleSelectedUav = (socketId: string) => {
    setUavConnectedSocket(socketId);
  }

  useEffect(() => {
    //let socket: Socket;
    let interval: NodeJS.Timeout

    // set socket
    const socketInit = async (id: string) => {
      await fetch('/api/socket');
      const socket = io(process.env.SOCKET_IO_URI as string);
      socket.emit('authenticate', id);
      socket.on('authenticated', (clientSocketId) => {
        localStorage.setItem('clientSocketId', clientSocketId);
      });
      socket.on('message', (msg, uavConnectedSocket) => {
        console.log('Message received:', msg, ' from: ', uavConnectedSocket);
      });

      // heartbeat
      interval = setInterval(() => {
        if (uavConnectedSocket) {
          console.log('ping');
          socket.emit('message', 'Beat', uavConnectedSocket);
        }
      }, 5000);
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
      clearInterval(interval);
      // socket.disconnect();
    };
  }, [uavConnectedSocket]);

  return (
    <div className="mainContainer">
      <div className="statusBarContainer">
        <StatusBar
          uavs={uavs}
          handleSelectedUav={handleSelectedUav}
        />
      </div>

      <div className="mapContainer">
        <Map />
      </div>


    </div>
  )
}
/*

<div className="horizonContainer">
<HorizonInst />
</div>
<div className="videoContainer">
<UavVideo videoUrl={videoUrl} />
</div>
<div className="waypointsContainer">
<WaypointList />
</div>
<div className="mapContainer">
<MapComponent />
</div>
</div>
)
}*/