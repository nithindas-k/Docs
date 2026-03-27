import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../services/api';
import { API_ROUTES } from '../constants';

export interface LinkedUser {
  connectionId: string;
  user: {
    _id: string;
    name: string;
    email: string;
    picture?: string;
  };
}

export interface PendingRequest {
  _id: string;
  fromUser: {
    _id: string;
    name: string;
    email: string;
    picture?: string;
  };
  status: 'pending';
  createdAt: string;
}

interface ConnectionState {
  linkedUsers: LinkedUser[];
  pendingRequests: PendingRequest[];
  loading: boolean;
  error: string | null;
}

const initialState: ConnectionState = {
  linkedUsers: [],
  pendingRequests: [],
  loading: false,
  error: null,
};

export const sendLinkRequest = createAsyncThunk(
  'connections/sendRequest',
  async (email: string, { rejectWithValue }) => {
    try {
      return await api.post(API_ROUTES.CONNECTION.REQUEST, { email });
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to send request');
    }
  }
);

export const fetchPendingRequests = createAsyncThunk(
  'connections/fetchPending',
  async () => {
    const res = await api.get<{ data: PendingRequest[] }>(API_ROUTES.CONNECTION.PENDING);
    return res.data;
  }
);

export const respondToRequest = createAsyncThunk(
  'connections/respond',
  async ({ id, action }: { id: string; action: 'accept' | 'reject' }) => {
    await api.post(API_ROUTES.CONNECTION.RESPOND(id), { action });
    return { id, action };
  }
);

export const fetchLinkedUsers = createAsyncThunk(
  'connections/fetchLinked',
  async () => {
    const res = await api.get<{ data: LinkedUser[] }>(API_ROUTES.CONNECTION.LINKED);
    return res.data;
  }
);

export const disconnectUser = createAsyncThunk(
  'connections/disconnect',
  async (connectionId: string) => {
    await api.delete(API_ROUTES.CONNECTION.DISCONNECT(connectionId));
    return connectionId;
  }
);

const connectionSlice = createSlice({
  name: 'connections',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLinkedUsers.pending, (state) => { state.loading = true; })
      .addCase(fetchLinkedUsers.fulfilled, (state, action) => {
        state.linkedUsers = action.payload;
        state.loading = false;
      })
      .addCase(fetchLinkedUsers.rejected, (state) => { state.loading = false; })

      .addCase(fetchPendingRequests.fulfilled, (state, action) => {
        state.pendingRequests = action.payload;
      })

      .addCase(respondToRequest.fulfilled, (state, action) => {
        const { id } = action.payload;
        state.pendingRequests = state.pendingRequests.filter(r => r._id !== id);
      })

      .addCase(disconnectUser.fulfilled, (state, action) => {
        state.linkedUsers = state.linkedUsers.filter(u => u.connectionId !== action.payload);
      });
  },
});

export default connectionSlice.reducer;
