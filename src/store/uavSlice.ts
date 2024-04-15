import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Position {
  lat: number;
  lon: number;
  alt: number;
  relative_alt: number;
  hdg: number;
}

export interface Waypoint {
  type: string;  // 'waypoint' | 'takeoff' | 'land'
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
  speed: number;
  battery: number;
  waypoints: Waypoint[];
  reachedWaypoints: Waypoint[];
}

export interface UavState {
  uavList: UAV[]
}

const initialState: UAV[] =
  [{
    uavname: 'Unselected',
    connected: false,
    status: 'Disconnected',
    socketId: null,
    position: {
      lat: -32.7983559,
      lon: -55.9612037,
      alt: 0,
      relative_alt: 0,
      hdg: 0
    },
    roll: 0,
    pitch: 0,
    speed: 0,
    battery: 0,
    waypoints: [],
    reachedWaypoints: []
  }]
  ;

const uavSlice = createSlice({
  name: 'uavList',
  initialState,
  reducers: {
    addUAV: (state, action: PayloadAction<UAV>) => {
      state.push(action.payload);
    },
    removeUAV: (state, action: PayloadAction<string>) => {
      state = state.filter(uav => uav.uavname !== action.payload);
    },
    select: (state, action: PayloadAction<{ uavName: string; uavIndex: number }>) => {
      state[action.payload.uavIndex].uavname = action.payload.uavName;
    },
    connecting: (state, action: PayloadAction<number>) => {
      state[action.payload].status = 'Connecting...';
    },
    connected: (state, action: PayloadAction<{ uavIndex: number; status: string; socketId: string; position: Position; speed: number; battery: number; waypoints: Waypoint[] }>) => {
      const { uavIndex, status, socketId, position, speed, battery, waypoints } = action.payload;
      state[uavIndex].connected = true;
      state[uavIndex].status = status;
      state[uavIndex].socketId = socketId;
      state[uavIndex].position = {
        lat: position.lat,
        lon: position.lon,
        alt: position.alt,
        relative_alt: position.relative_alt,
        hdg: position.hdg
      };
      state[uavIndex].speed = speed;
      state[uavIndex].battery = battery;
      state[uavIndex].waypoints = waypoints.length === 0 ? [{ type: 'takeoff', lat: position.lat, lon: position.lon, alt: 0, dist: 0 }] : waypoints;
    },
    rejectedConnection: (state, action: PayloadAction<number>) => {
      state[action.payload].status = 'Connection rejected';
      state[action.payload].connected = false;
    },
    disconnect: (state, action: PayloadAction<number>) => {
      state[action.payload].uavname = 'Unselected';
      state[action.payload].status = 'Offline';
      state[action.payload].connected = false;
    },
    setSocketId: (state, action: PayloadAction<{ uavIndex: number; socketId: string }>) => {
      state[action.payload.uavIndex].socketId = action.payload.socketId;
    },
    setStatus: (state, action: PayloadAction<{ uavIndex: number; status: string }>) => {
      const { uavIndex, status } = action.payload;
      state[uavIndex].status = status;
    },
    setPosition: (state, action: PayloadAction<{ uavIndex: number; position: Position }>) => {
      const { uavIndex, position } = action.payload;
      state[uavIndex].position = {
        lat: position.lat,
        lon: position.lon,
        alt: position.alt,
        relative_alt: position.relative_alt,
        hdg: position.hdg
      };
    },
    setPitchAndRoll: (state, action: PayloadAction<{ uavIndex: number; roll: number; pitch: number }>) => {
      const { uavIndex, roll, pitch } = action.payload;
      state[uavIndex].roll = roll;
      state[uavIndex].pitch = pitch
    },
    setSpeed: (state, action: PayloadAction<{ uavIndex: number; speed: number }>) => {
      const { uavIndex, speed } = action.payload;
      state[uavIndex].speed = speed;
    },
    setBattery: (state, action: PayloadAction<{ uavIndex: number; battery: number }>) => {
      const { uavIndex, battery } = action.payload;
      state[uavIndex].battery = battery;
    },
    addWaypoint: (state, action: PayloadAction<{ uavIndex: number; waypoint: [number, number]; type: string, alt: number }>) => {
      const { uavIndex, waypoint, type, alt } = action.payload;
      let distance = 0
      if (state[uavIndex].waypoints.length > 0) {
        const prevWaypoint = state[uavIndex].waypoints[state[uavIndex].waypoints.length - 1];
        distance = calculateDistance(prevWaypoint.lat, prevWaypoint.lon, waypoint[0], waypoint[1]);
      }
      const newWaypoint: Waypoint = {
        type,
        lat: waypoint[0],
        lon: waypoint[1],
        alt,
        dist: distance
      };
      state[uavIndex].waypoints.push(newWaypoint);
      state[uavIndex].waypoints[0].dist = calculateTotalDistance(state[uavIndex].waypoints);
    },
    removeWaypoint: (state, action: PayloadAction<{ uavIndex: number; index: number }>) => {
      const { uavIndex, index } = action.payload;
      state[uavIndex].waypoints.splice(index, 1);
      for (let i = index; i < state[uavIndex].waypoints.length; i++) {
        const prevWaypoint = state[uavIndex].waypoints[i - 1];
        const distance = calculateDistance(prevWaypoint.lat, prevWaypoint.lon, state[uavIndex].waypoints[i].lat, state[uavIndex].waypoints[i].lon);
        state[uavIndex].waypoints[i].dist = distance;
      }
      state[uavIndex].waypoints[0].dist = calculateTotalDistance(state[uavIndex].waypoints);
    },
    reachedWaypoint: (state, action: PayloadAction<{ uavIndex: number }>) => {
      const { uavIndex } = action.payload;
      const reachedWaypoint = state[uavIndex].waypoints[0];
      state[uavIndex].reachedWaypoints.push(reachedWaypoint);
      state[uavIndex].waypoints.shift();
    }
  },
});

export const { addUAV, removeUAV, select, connecting, connected, rejectedConnection, disconnect, setSocketId, setStatus, setPosition, setPitchAndRoll, setSpeed, setBattery, addWaypoint, removeWaypoint, reachedWaypoint } = uavSlice.actions;
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
