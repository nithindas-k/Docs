import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../services/api';
import { API_ROUTES, DEMO_TOKEN } from '../constants';

export interface Item {
  title: string;
  createdAt: string | number | Date;
  _id: string;
  name: string;
  category: string;
  fields: Array<{ key: string; value: string; isEncrypted?: boolean }>;
  lastAccessed: string;
}

interface ItemState {
  itemsByCategory: Record<string, Item[]>;
  loading: boolean;
  error: string | null;
}

const initialState: ItemState = {
  itemsByCategory: {},
  loading: false,
  error: null,
};

export const fetchItemsByCategory = createAsyncThunk(
  'items/fetchByCategory',
  async (categoryId: string) => {
    if (localStorage.getItem('lockr_token') === DEMO_TOKEN) {
      return { categoryId, data: [] };
    }

    const response = await api.get<{ data: Item[] }>(API_ROUTES.ITEM.BY_CATEGORY(categoryId));
    return { categoryId, data: response.data };
  }
);

const itemSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchItemsByCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchItemsByCategory.fulfilled, (state, action) => {
        state.itemsByCategory[action.payload.categoryId] = action.payload.data;
        state.loading = false;
      })
      .addCase(fetchItemsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch items';
      });
  },
});

export default itemSlice.reducer;
