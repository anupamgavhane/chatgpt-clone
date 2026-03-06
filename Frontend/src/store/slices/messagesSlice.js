import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  messagesByChatId: {},
  isLoading: false,
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      const { chatId, message } = action.payload;
      if (!state.messagesByChatId[chatId]) {
        state.messagesByChatId[chatId] = [];
      }
      state.messagesByChatId[chatId].push(message);
    },
    loadMessagesForChat: (state, action) => {
      const { chatId, messages } = action.payload;
      state.messagesByChatId[chatId] = messages;
    },
    clearMessages: (state, action) => {
      const chatId = action.payload;
      state.messagesByChatId[chatId] = [];
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    deleteChat: (state, action) => {
      const chatId = action.payload;
      delete state.messagesByChatId[chatId];
    },
  },
});

export const { addMessage, loadMessagesForChat, clearMessages, setLoading, deleteChat } = messagesSlice.actions;
export default messagesSlice.reducer;
