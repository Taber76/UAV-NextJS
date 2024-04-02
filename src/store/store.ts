import { configureStore } from '@reduxjs/toolkit';
import uavReducer from './uavSlice';

export default configureStore({
  reducer: {
    uavs: uavReducer,
  },
});

