// ticketsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const ticketsSlice = createSlice({
  name: 'tickets',
  initialState: {
    topicData: [],
    messageData: [],
    ticketInfo: {},
    ticketMessage: [],
    selectedTopic:{},
    selectedTicket:{},
    loading: false,
    error: null,
  },
  reducers: {
    fetchTicketDetailsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchTopicData(state, action) {
      state.loading = false;
      state.topicData = action.payload;
    },
    fetchMessageData(state, action) {
      state.loading = false;
      state.messageData = action.payload;
    },
    fetchSelectedTopic(state, action) {
      state.loading = false;
      state.selectedTopic = action.payload;
    },
    fetchSelectedTicket(state, action) {
      state.loading = false;
      //state.selectedTicket=[];
      state.selectedTicket = action.payload;
    },
    fetchTicketInfo(state, action) {
      state.loading = false;
      state.ticketInfo = action.payload;
    },
    fetchTicketMessage(state, action) {
      state.loading = false;
      state.ticketMessage=action.payload;
    },
  
  },
});

export const { fetchTicketDetailsStart,fetchMessageData, fetchSelectedTopic,fetchSelectedTicket,fetchTopicData, fetchTicketInfo,fetchTicketMessage} = ticketsSlice.actions;
export default ticketsSlice.reducer;
