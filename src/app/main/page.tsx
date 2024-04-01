'use client'

import { StatusBar, Map } from "../../components";

import './styles.css'



export default function Main() {

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