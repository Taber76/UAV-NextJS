'use client'

import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TileLayer, MapContainer, Marker, Popup, useMapEvents, Polyline, useMap } from "react-leaflet";
import { Dispatch } from "redux";

import { UavState, removeUAV, addWaypoint } from "../../store/uavSlice";

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
  const mapRef = useRef<L.Map | null>(null);
  const uavMarkRef = useRef<L.Marker | null>(null);
  const dispatch = useDispatch();
  const uavData = useSelector((state: UavState) => state.uavList[0]);

  // Center map on UAV conection -------------------------------------------------
  useEffect(() => {
    if (mapRef.current && uavData.connected) {
      const map = mapRef.current;
      const newPosition = L.latLng(uavData.position.lat, uavData.position.lon);
      map.flyTo(newPosition, map.getZoom(), { animate: true });
    }
  }, [uavData.connected, mapRef.current]);


  // Update uav marker position -------------------------------------------------
  useEffect(() => {
    if (uavMarkRef.current && uavData.connected) {
      const uav = uavMarkRef.current;
      const newPosition = L.latLng(uavData.position.lat, uavData.position.lon);
      uav.setLatLng(newPosition);
      uav.setRotationAngle(uavData.position.hdg);
    }
  }, [uavData.position]);


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

      {/* UAV Marker */}
      {uavData.connected && (
        <Marker
          key={uavData.position.hdg}
          ref={uavMarkRef}
          position={[uavData.position.lat, uavData.position.lon]}
          icon={IconLocation}
          rotationAngle={uavData.position.hdg}
          rotationOrigin="center"
        />
      )}

      {/* Waypoints Markers */}
      {uavData.waypoints.map((position, idx) => (
        <div key={`marker-${idx}`}>
          <Marker position={[position.lat, position.lon]}>
            <Popup>
              <span>WP {idx}</span>
            </Popup>
          </Marker>
          {idx > 0 && uavData.waypoints[idx - 1] && (
            <Polyline
              pathOptions={{ color: 'red' }}
              positions={[
                [uavData.waypoints[idx - 1].lat, uavData.waypoints[idx - 1].lon],
                [position.lat, position.lon]
              ]}
            >
              <Popup>
                <span>Tramo {idx} -- {position.dist.toFixed(2)}Km</span>
              </Popup>
            </Polyline>
          )}
        </div>
      ))}

      <LocationMarker dispatch={dispatch} />

    </MapContainer>
  );
};

// Location Marker is a react-leaflet hook
function LocationMarker({ dispatch }: { dispatch: Dispatch<any> }) {
  useMapEvents({
    click(e) {
      console.log(e.latlng);
      const { lat, lng } = e.latlng;
      dispatch(addWaypoint({ uavIndex: 0, waypoint: [lat, lng], type: 'type', alt: 0 }));
    }
  });
  return null;
}

export default MapComponent;
