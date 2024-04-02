'use client'

import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TileLayer, MapContainer, Marker, Popup, useMapEvents, Polyline, useMap } from "react-leaflet";

import { UAVState, addWaypoint, initialize } from "../../store/uavSlice";

import '../../../node_modules/leaflet/dist/leaflet.css';
import "../../../node_modules/leaflet-defaulticon-compatibility"
import "../../../node_modules/leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"
import './styles.css';

//import 'leaflet-bing-layer'
import L from 'leaflet';
import 'leaflet-rotatedmarker'

const IconLocation = L.icon({
  iconUrl: '../../public/uavmark.png',
  iconSize: [40, 40],
  iconAnchor: [20, 20],
})

const MapComponent = () => {
  //const bingMapsKey = 'AjfnsByYOk_tdufEWpdpE9PLJ_Wlz0vTia_5FZzhKstX5sWKMXEc4wPgGUQsSQvx'
  const mapRef = useRef<L.Map | null>(null);
  const [map, setMap] = useState(null);
  const dispatch = useDispatch();
  const uavData = useSelector((state: UAVState) => state.uavs.uavs[0]);

  useEffect(() => {
    if (mapRef.current && uavData.connected) {
      const map = mapRef.current;
      const newPosition = L.latLng(uavData.position.lat, uavData.position.lon);
      map.setView(newPosition, map.getZoom(), { animate: true });
    }
  }, [uavData.connected]);

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