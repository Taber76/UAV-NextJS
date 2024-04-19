import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface GlobalState {
  global: {
    mapRef: any
  }
}

const initialState = {
  mapRef: null,
}

const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setMapRef: (state, action: PayloadAction<any>) => {
      state.mapRef = action.payload;
    },
  },
});

export const { setMapRef } = globalSlice.actions;
export default globalSlice.reducer;