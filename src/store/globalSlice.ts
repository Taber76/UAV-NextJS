import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface GlobalState {
  global: {
    mapLat: number;
    mapLon: number;
    mapZoom: number;
  }
}

const initialState = {
  mapLat: -32.7983559,
  mapLon: -55.9612037,
  mapZoom: 7,
};


const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setMapView: (state, action: PayloadAction<any>) => {
      console.log('setMapView', action.payload);
      state.mapLat = action.payload.mapLat;
      state.mapLon = action.payload.mapLon;
      state.mapZoom ? state.mapZoom = action.payload.zoom : state.mapZoom = state.mapZoom
    },
  },
});

export const { setMapView } = globalSlice.actions;
export default globalSlice.reducer;