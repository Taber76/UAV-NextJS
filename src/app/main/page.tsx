'use client'
import { useEffect, useState } from 'react'
import io from 'socket.io-client';
import { StatusBar, Map } from "../../components";
import FetchLib from '@/lib/fetch.lib';

import './styles.css'


export default function Main() {
  const [uavs, setUavs] = useState([]);

  useEffect(() => {

    // set socket
    const socketInit = async (id: string) => {
      await fetch('/api/socket');
      const socket = io(process.env.SOCKET_IO_URI as string);
      socket.emit('authenticate', id);
      socket.on('authenticated', (clientSocketId) => {
        console.log('Authenticated for server with socket id:', clientSocketId); ///CONSOLE
        localStorage.setItem('clientSocketId', clientSocketId);
      });
      const interval = setInterval(() => {
        // verificar estodo del uav
      }, 15000);
    }

    // get connected uavs
    const getConnectedUavs = async () => {
      const response = await FetchLib.get('/api/uav/getconnected');
      setUavs(response);
    }

    // check localstorage
    const tokenString = localStorage.getItem('token')
    const token = tokenString ? JSON.parse(tokenString) : null
    if (!token) {
      window.location.href = '/login'
    }

    socketInit(token.id);
    //getConnectedUavs();

    return () => {
      //clearInterval(interval);
      //socket.disconnect();
    };
  }, []);

  return (
    <div className="mainContainer">
      <div className="statusBarContainer">
        <StatusBar
          uavs={uavs}
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