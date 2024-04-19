'use client'

import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TileLayer, MapContainer, Marker, Popup, useMapEvents, Polyline, useMap } from "react-leaflet";
import { Dispatch } from "redux";

import { UavState, removeUAV, addWaypoint } from "../../store/uavSlice";
import { setMapRef } from "@/store/globalSlice";

import '../../../node_modules/leaflet/dist/leaflet.css';
import "../../../node_modules/leaflet-defaulticon-compatibility"
import "../../../node_modules/leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"
import './styles.css';

//import 'leaflet-bing-layer'
import L from 'leaflet';
import 'leaflet-rotatedmarker'

const HomeMarker = L.icon({
  iconUrl: 'map/home_mark.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
})

const WaypointMarker = L.icon({
  iconUrl: 'map/waypoint_mark.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
})

const UavMarker = L.icon({
  iconUrl: 'map/uav_mark.png',
  iconSize: [40, 40],
  iconAnchor: [20, 20],
})

const MapComponent = () => {
  const mapRef = useRef<L.Map | null>(null);
  const uavMarkRef = useRef<L.Marker | null>(null);
  const dispatch = useDispatch();
  const uavConnected = useSelector((state: UavState) => state.uavList[0].connected);
  const uavPosition = useSelector((state: UavState) => state.uavList[0].position);
  const uavWaypoints = useSelector((state: UavState) => state.uavList[0].waypoints);

  // Center map on UAV conection -------------------------------------------------
  useEffect(() => {
    if (mapRef.current && uavConnected) {
      const map = mapRef.current;
      const lat = uavPosition.lat !== 0 ? uavPosition.lat : -32.7983559;
      const lon = uavPosition.lon !== 0 ? uavPosition.lon : -55.9612037;
      map.flyTo([lat, lon], map.getZoom(), { animate: true });
    }
  }, [uavConnected]);

  // Update uav marker position -------------------------------------------------
  useEffect(() => {
    if (uavMarkRef.current && uavConnected) {
      const uav = uavMarkRef.current;
      uav.setLatLng([uavPosition.lat, uavPosition.lon]);
      uav.setRotationAngle(uavPosition.hdg);
    }
  }, [uavPosition.lat, uavPosition.lon, uavPosition.hdg]);

  // Update map ref -------------------------------------------------------------
  useEffect(() => {
    if (mapRef.current) {
      dispatch(setMapRef(mapRef.current));
    }
  }, [mapRef.current]);


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
      {uavConnected && (
        <Marker
          key={uavPosition.hdg}
          ref={uavMarkRef}
          position={[uavPosition.lat, uavPosition.lon]}
          icon={UavMarker}
          rotationAngle={uavPosition.hdg}
          rotationOrigin="center"
        />
      )}

      {/* Waypoints Markers */}
      {uavWaypoints.map((position, idx) => (
        <div key={`marker-${idx}`}>
          <Marker
            position={[position.lat, position.lon]}
            icon={idx === 0 ? HomeMarker : WaypointMarker}
          >
            <Popup>
              <span>WP {idx}</span>
            </Popup>
          </Marker>
          {idx > 0 && uavWaypoints[idx - 1] && (
            <Polyline
              pathOptions={{ color: 'red' }}
              positions={[
                [uavWaypoints[idx - 1].lat, uavWaypoints[idx - 1].lon],
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

// Location Marker is a react-leaflet hook - add waypoint
function LocationMarker({ dispatch }: { dispatch: Dispatch<any> }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      dispatch(addWaypoint({ uavIndex: 0, lat: lat, lon: lng, type: 'Waypoint', alt: 0 }));
    }
  });
  return null;
}

export default MapComponent;
