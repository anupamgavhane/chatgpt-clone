import { configureStore } from '@reduxjs/toolkit';
import chatSlice from './slices/chatSlice';
import messagesSlice from './slices/messagesSlice';

const store = configureStore({
  reducer: {
    chats: chatSlice,
    messages: messagesSlice,
  },
});

export default store;
