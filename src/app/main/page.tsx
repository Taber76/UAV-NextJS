'use client'
import { useEffect, useState, useRef } from 'react'
import io, { Socket } from 'socket.io-client';
import { StatusBar, Map } from "../../components";
import FetchLib from '@/lib/fetch.lib';
import MsgHandler from '@/lib/msgHandler.lib';

import './styles.css'

export default function Main() {
  const [uavs, setUavs] = useState([]);
  const [uavConnectedSocketId, setUavConnectedSocketId] = useState('');
  const socketRef = useRef<Socket | null>(null);

  const handleSelectedUav = (uavSocketId: string) => {
    if (uavSocketId !== '' && socketRef.current) {
      socketRef.current.emit('message', MsgHandler.outgoing({
        type: 'connectToUav',
        username: localStorage.getItem('username') as string,
        userSocket: socketRef.current.id
      }),
        uavSocketId
      );
    } else if (socketRef.current) {
      socketRef.current.emit('message', MsgHandler.outgoing({
        type: 'disconnectUav',
        username: localStorage.getItem('username') as string,
        userSocket: socketRef.current.id
      }),
        uavSocketId
      );
    }
    setUavConnectedSocketId(uavSocketId);
  }

  useEffect(() => {
    let interval: NodeJS.Timeout

    // set socket
    const socketInit = async (id: string) => {
      await fetch('/api/socket');
      socketRef.current = io(process.env.SOCKET_IO_URI as string);
      socketRef.current.emit('authenticate', id);
      socketRef.current.on('authenticated', (clientSocketId) => {
        localStorage.setItem('clientSocketId', clientSocketId);
      });
      socketRef.current.on('message', (msg, uavConnectedSocket) => {
        console.log('Message received:', msg, ' from: ', uavConnectedSocket);
      });

      // heartbeat
      interval = setInterval(() => {
        if (uavConnectedSocketId && socketRef.current) {
          console.log('ping');
          socketRef.current.emit('message', 'Beat', uavConnectedSocketId);
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
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

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