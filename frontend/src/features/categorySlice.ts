import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../services/api';
import { API_ROUTES, DEFAULT_CATEGORIES, DEMO_TOKEN } from '../constants';

export interface Category {
  _id: string;
  name: string;
  icon: string;
}

interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  categories: [...DEFAULT_CATEGORIES],
  loading: false,
  error: null,
};

export const fetchCategories = createAsyncThunk('categories/fetchAll', async () => {
  if (localStorage.getItem('lockr_token') === DEMO_TOKEN) {
    return [...DEFAULT_CATEGORIES];
  }

  const response = await api.get<{ data: Category[] }>(API_ROUTES.CATEGORY.BASE);
  return response.data;
});

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
        state.loading = false;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load categories';
        state.categories = [...DEFAULT_CATEGORIES];
      });
  },
});

export default categorySlice.reducer;
