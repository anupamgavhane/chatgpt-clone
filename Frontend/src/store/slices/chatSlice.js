import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

// Async thunk to create a new chat
export const createChatAsync = createAsyncThunk(
  'chats/createChat',
  async (title, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/chat`,
        { title },
        { withCredentials: true }
      );

      return response.data.chat;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to create chat');
    }
  }
);

// Async thunk to fetch all chats for the logged-in user
export const fetchChatsAsync = createAsyncThunk(
  'chats/fetchChats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/chat`,
  { withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch chats');
    }
  }
);

// Async thunk to delete a chat
export const deleteChatAsync = createAsyncThunk(
  'chats/deleteChat',
  async (chatId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_BASE_URL}/chat/${chatId}`);
      return chatId;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete chat');
    }
  }
);

const initialState = {
  chats: [],
  currentChatId: null,
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    selectChat: (state, action) => {
      state.currentChatId = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Create Chat
    builder
      .addCase(createChatAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createChatAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.chats.unshift(action.payload);
        state.currentChatId = action.payload.id;
      })
      .addCase(createChatAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Chats
    builder
      .addCase(fetchChatsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChatsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.chats = action.payload;
        if (action.payload.length > 0 && !state.currentChatId) {
          state.currentChatId = action.payload[0].id;
        }
      })
      .addCase(fetchChatsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete Chat
    builder
      .addCase(deleteChatAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteChatAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.chats = state.chats.filter(chat => chat.id !== action.payload);
        if (state.currentChatId === action.payload) {
          state.currentChatId = state.chats.length > 0 ? state.chats[0].id : null;
        }
      })
      .addCase(deleteChatAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { selectChat, clearError } = chatSlice.actions;
export default chatSlice.reducer;
