import { configureStore } from '@reduxjs/toolkit';
import uavReducer from './uavSlice';
import globalReducer from './globalSlice';

export default configureStore({
  reducer: {
    uavList: uavReducer,
    global: globalReducer
  },
});

