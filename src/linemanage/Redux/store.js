import { configureStore } from '@reduxjs/toolkit';
import ticketReducer from './ticketDetailSlice';
import lineManager from './lineManager';

export const store = configureStore({
  reducer: {
    tickets: ticketReducer,
    lineManagers:lineManager
  },
});
