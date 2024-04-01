'use client'

import { useEffect, useState, useRef } from "react";
//import { useDispatch, useSelector } from "react-redux";
import { TileLayer, MapContainer, Marker, Popup, useMapEvents, Polyline } from "react-leaflet";
//import Uavicon from '../../assets/uavmark.png';

//import { addWaypoint } from "../../store/uavSlice";

import 'leaflet/dist/Leaflet.css';
import "leaflet-defaulticon-compatibility"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"
import './styles.css';

//import 'leaflet-bing-layer'
//import L from 'leaflet';
//import 'leaflet-rotatedmarker'
/*
const IconLocation = L.icon({
  iconUrl: Uavicon,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
})*/

const MapComponent = () => {
  //const bingMapsKey = 'AjfnsByYOk_tdufEWpdpE9PLJ_Wlz0vTia_5FZzhKstX5sWKMXEc4wPgGUQsSQvx'

  const mapRef = useRef(null);

  const [map, setMap] = useState(null);




  return (

    <MapContainer
      ref={mapRef}
      className='leaflet-container'
      center={[-32.7983559, -55.9612037]}
      zoom={7}
      scrollWheelZoom={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

    </MapContainer>


  );
};




export default MapComponent;

// <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"     attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'  />
//<TileLayer.Bing key={bingMapsKey}/>