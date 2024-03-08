import { createSlice } from '@reduxjs/toolkit';

const lineManagerSlice = createSlice({
  name: 'lineManager',
  initialState: {
    lineManagersData:[],
    loading: false,
    error: null,
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


  }});
  export const { fetchLineManagersStart, fetchLineManagersData } = lineManagerSlice.actions;
  export default lineManagerSlice.reducer;