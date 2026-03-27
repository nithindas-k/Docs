import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../services/api';
import { API_ROUTES } from '../constants';

export interface Item {
  title: string;
  createdAt: string | number | Date;
  _id: string;
  name: string;
  category: string;
  photoUrl?: string; // Legacy
  photoUrls?: string[];
  fields: Array<{ key: string; value: string; isEncrypted?: boolean }>;
  lastAccessed: string;
}

interface ItemState {
  itemsByCategory: Record<string, Item[]>;
  itemsByPerson: Record<string, Item[]>;
  itemsById: Record<string, Item>;
  loading: boolean;
  loadingItem: boolean;
  error: string | null;
}

const initialState: ItemState = {
  itemsByCategory: {},
  itemsByPerson: {},
  itemsById: {},
  loading: false,
  loadingItem: false,
  error: null,
};

export const fetchItemById = createAsyncThunk<Item, string>(
  'items/fetchById',
  async (itemId: string) => {
    const response = await api.get<{ data: Item }>(API_ROUTES.ITEM.ID(itemId));
    return response.data; // This is the Item
  }
);

export const fetchItemsByCategory = createAsyncThunk(
  'items/fetchByCategory',
  async (categoryId: string) => {
    const response = await api.get<{ data: Item[] }>(API_ROUTES.ITEM.BY_CATEGORY(categoryId));
    return { categoryId, data: response.data };
  }
);

export const fetchItemsByPerson = createAsyncThunk(
  'items/fetchByPerson',
  async (personId: string) => {
    const response = await api.get<{ data: Item[] }>(API_ROUTES.ITEM.BY_PERSON(personId));
    return { personId, data: response.data };
  }
);

export const updateItem = createAsyncThunk<Item, { id: string; data: FormData }>(
  'items/update',
  async ({ id, data }) => {
    const response = await api.put<{ data: Item }>(API_ROUTES.ITEM.ID(id), data);
    return response.data;
  }
);

export const deleteItem = createAsyncThunk<string, string>(
  'items/delete',
  async (id: string) => {
    await api.delete(API_ROUTES.ITEM.ID(id));
    return id;
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
      })
      .addCase(fetchItemsByPerson.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchItemsByPerson.fulfilled, (state, action) => {
        state.itemsByPerson[action.payload.personId] = action.payload.data;
        state.loading = false;
      })
      .addCase(fetchItemsByPerson.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch items';
      })
      .addCase(fetchItemById.pending, (state) => {
        state.loadingItem = true;
      })
      .addCase(fetchItemById.fulfilled, (state, action) => {
        state.itemsById[action.payload._id] = action.payload;
        state.loadingItem = false;
      })
      .addCase(fetchItemById.rejected, (state, action) => {
        state.loadingItem = false;
        state.error = action.error.message || 'Failed to fetch item';
      })
      .addCase(updateItem.pending, (state) => {
        state.loadingItem = true;
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        state.itemsById[action.payload._id] = action.payload;
        state.loadingItem = false;
      })
      .addCase(updateItem.rejected, (state, action) => {
        state.loadingItem = false;
        state.error = action.error.message || 'Failed to update item';
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        delete state.itemsById[action.payload];
      });
  },
});

export default itemSlice.reducer;
