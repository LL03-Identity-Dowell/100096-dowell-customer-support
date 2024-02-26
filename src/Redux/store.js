import { configureStore } from '@reduxjs/toolkit';
import serviceReducer from './counterSlice';

export const store = configureStore({
  reducer: {
    service: serviceReducer,
  },
});
