import { createSlice } from '@reduxjs/toolkit';
import formatDate from '../utils/formatDate';

const lineManagerSlice = createSlice({
  name: 'lineManager',
  initialState: {
    lineManagersData:[],
    lineManagerCredentials:{},
    loading: false,
    error: null,
    lineManageTime:formatDate(new Date())
  },
  reducers: {
    fetchLineManagersStart(state) {
        state.loading = true;
        state.error = null;
      },
      fetchLineManagersData(state, action) {
        state.loading = false;
        state.lineManagersData = action.payload;
      },
      fetchLineManagersCredentails(state, action) {
        state.loading = false;
        state.lineManagerCredentials = action.payload;
      },
      fetchLineManagersTime(state, action) {
        state.lineManageTime = action.payload;
      },


  }});
  export const { fetchLineManagersStart,fetchLineManagersTime,fetchLineManagersCredentails, fetchLineManagersData } = lineManagerSlice.actions;
  export default lineManagerSlice.reducer;