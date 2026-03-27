import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { api } from '../services/api';
import { API_ROUTES } from '../constants';

export interface User {
  _id: string;
  name: string;
  email: string;
  picture?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  currentPersonId: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('lockr_token'),
  currentPersonId: localStorage.getItem('lockr_current_person'),
  loading: false,
  error: null,
};

export const fetchProfile = createAsyncThunk<User>('auth/fetchProfile', async () => {
  const response = await api.get<{ data: User }>(API_ROUTES.AUTH.PROFILE);
  return response.data;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<{ user: User; token: string }>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
      localStorage.setItem('lockr_token', action.payload.token);
    },
    setCurrentPerson(state, action: PayloadAction<string | null>) {
      state.currentPersonId = action.payload;
      if (action.payload) {
        localStorage.setItem('lockr_current_person', action.payload);
      } else {
        localStorage.removeItem('lockr_current_person');
      }
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.currentPersonId = null;
      localStorage.removeItem('lockr_token');
      localStorage.removeItem('lockr_current_person');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch profile';
        state.token = null; // Auto logout if profile fails
        localStorage.removeItem('lockr_token');
      });
  },
});

export const { loginSuccess, logout, setCurrentPerson } = authSlice.actions;
export default authSlice.reducer;
