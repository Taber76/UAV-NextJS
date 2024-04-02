import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Position {
  lat: number;
  lon: number;
  alt: number;
  relative_alt: number;
  hdg: number;
}

export interface Waypoint {
  lat: number;
  lon: number;
  alt: number;
  dist: number;
}

export interface UAV {
  uavname: string;
  connected: boolean;
  status: string;
  socketId: string | null;
  position: Position;
  roll: number;
  pitch: number;
  speed: number | null;
  battery: number | null;
  waypoints: Waypoint[];
}

export interface UAVState {
  uavs: UAV[];
}

const initialState: UAVState = {
  uavs: [{
    uavname: 'Unselected',
    connected: false,
    status: 'Disconnected',
    socketId: null,
    position: {
      lat: 0,
      lon: 0,
      alt: 0,
      relative_alt: 0,
      hdg: 0
    },
    roll: 0,
    pitch: 0,
    speed: null,
    battery: null,
    waypoints: []
  }],
};

const uavSlice = createSlice({
  name: 'uavList',
  initialState,
  reducers: {
    initialize: (state) => {
      state.uavs = [initialState.uavs[0]];
    },
    addUAV: (state, action: PayloadAction<UAV>) => {
      state.uavs.push(action.payload);
    },
    removeUAV: (state, action: PayloadAction<string>) => {
      state.uavs = state.uavs.filter(uav => uav.uavname !== action.payload);
    },
    select: (state, action: PayloadAction<{ uavName: string; uavIndex: number }>) => {
      state.uavs[action.payload.uavIndex].uavname = action.payload.uavName;
    },
    connecting: (state, action: PayloadAction<number>) => {
      state.uavs[action.payload].status = 'Connecting...';
    },
    connected: (state, action: PayloadAction<{ uavIndex: number; status: string; socketId: string; position: Position; speed: number | null; battery: number | null; waypoints: Waypoint[] }>) => {
      const { uavIndex, status, socketId, position, speed, battery, waypoints } = action.payload;
      state.uavs[uavIndex].connected = true;
      state.uavs[uavIndex].status = status;
      state.uavs[uavIndex].socketId = socketId;
      state.uavs[uavIndex].position = {
        lat: position.lat / 10000000,
        lon: position.lon / 10000000,
        alt: position.alt,
        relative_alt: position.relative_alt,
        hdg: position.hdg / 100
      };
      state.uavs[uavIndex].speed = speed;
      state.uavs[uavIndex].battery = battery;
      state.uavs[uavIndex].waypoints = waypoints.length === 0 ? [{ lat: position.lat / 10000000, lon: position.lon / 10000000, alt: 50, dist: 0 }] : waypoints;
    },
    arm: (state, action: PayloadAction<number>) => {
      state.uavs[action.payload].status = 'Armed';
    },
    disconnect: (state, action: PayloadAction<number>) => {
      state.uavs[action.payload].uavname = 'Unselected';
      state.uavs[action.payload].status = 'Offline';
      state.uavs[action.payload].connected = false;
    },
    setSocketId: (state, action: PayloadAction<{ uavIndex: number; socketId: string }>) => {
      state.uavs[action.payload.uavIndex].socketId = action.payload.socketId;
    },
    setPosition: (state, action: PayloadAction<{ uavIndex: number; position: Position }>) => {
      const { uavIndex, position } = action.payload;
      state.uavs[uavIndex].position = {
        lat: position.lat / 10000000,
        lon: position.lon / 10000000,
        alt: position.alt,
        relative_alt: position.relative_alt,
        hdg: position.hdg / 100
      };
    },
    setPitchAndRoll: (state, action: PayloadAction<{ uavIndex: number; roll: number; pitch: number }>) => {
      const { uavIndex, roll, pitch } = action.payload;
      state.uavs[uavIndex].roll = roll * (180 / Math.PI);
      state.uavs[uavIndex].pitch = pitch * (180 / Math.PI)
    },
    setSpeed: (state, action: PayloadAction<{ uavIndex: number; speed: number | null }>) => {
      const { uavIndex, speed } = action.payload;
      state.uavs[uavIndex].speed = speed;
    },
    setBattery: (state, action: PayloadAction<{ uavIndex: number; battery: number | null }>) => {
      const { uavIndex, battery } = action.payload;
      state.uavs[uavIndex].battery = battery;
    },
    addWaypoint: (state, action: PayloadAction<{ uavIndex: number; waypoint: [number, number] }>) => {
      const { uavIndex, waypoint } = action.payload;
      const prevWaypoint = state.uavs[uavIndex].waypoints[state.uavs[uavIndex].waypoints.length - 1];
      const distance = calculateDistance(prevWaypoint.lat, prevWaypoint.lon, waypoint[0], waypoint[1]);
      const newWaypoint: Waypoint = {
        lat: waypoint[0],
        lon: waypoint[1],
        alt: 50,
        dist: distance
      };
      state.uavs[uavIndex].waypoints.push(newWaypoint);
      state.uavs[uavIndex].waypoints[0].dist = calculateTotalDistance(state.uavs[uavIndex].waypoints);
    },
    removeWaypoint: (state, action: PayloadAction<{ uavIndex: number; index: number }>) => {
      const { uavIndex, index } = action.payload;
      state.uavs[uavIndex].waypoints.splice(index, 1);
      for (let i = index; i < state.uavs[uavIndex].waypoints.length; i++) {
        const prevWaypoint = state.uavs[uavIndex].waypoints[i - 1];
        const distance = calculateDistance(prevWaypoint.lat, prevWaypoint.lon, state.uavs[uavIndex].waypoints[i].lat, state.uavs[uavIndex].waypoints[i].lon);
        state.uavs[uavIndex].waypoints[i].dist = distance;
      }
      state.uavs[uavIndex].waypoints[0].dist = calculateTotalDistance(state.uavs[uavIndex].waypoints);
    }
  },
});

export const { initialize, addUAV, removeUAV, select, connecting, connected, arm, disconnect, setSocketId, setPosition, setPitchAndRoll, setSpeed, setBattery, addWaypoint, removeWaypoint } = uavSlice.actions;
export default uavSlice.reducer;

// Funciones auxiliares
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radio de la Tierra en kilómetros
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distancia en kilómetros
  return distance;
};

const calculateTotalDistance = (waypoints: Waypoint[]): number => {
  let totalDistance = 0;
  for (let i = 1; i < waypoints.length; i++) {
    totalDistance += waypoints[i].dist;
  }
  const returnDistance = calculateDistance(waypoints[0].lat, waypoints[0].lon, waypoints[waypoints.length - 1].lat, waypoints[waypoints.length - 1].lon);
  totalDistance += returnDistance;
  return totalDistance;
};
