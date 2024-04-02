'use client'
import { useEffect, useState } from 'react'
import io from 'socket.io-client';
import { StatusBar, Map } from "../../components";

import './styles.css'

export default function Main() {

  useEffect(() => {

    const socketInit = async () => {
      await fetch('/api/socket');
      const socket = io()

      socket.emit('authenticate', localStorage.getItem('username'));

      socket.on('authenticated', () => {
        console.log('authenticated for server');
      });
      const interval = setInterval(() => {
        // verificar estodo del uav

      }, 15000);
    }

    socketInit();
    return () => {
      //clearInterval(interval);
      //socket.disconnect();
    };
  }, []);

  return (
    <div className="mainContainer">
      <div className="statusBarContainer">
        <StatusBar />
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