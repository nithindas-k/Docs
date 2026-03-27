import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../services/api';
import { API_ROUTES } from '../constants';

export interface Person {
  _id: string;
  name: string;
  imageUrl?: string;
  createdAt: string | number | Date;
}

interface PersonState {
  persons: Person[];
  loading: boolean;
  isAdding: boolean;
  error: string | null;
}

const initialState: PersonState = {
  persons: [],
  loading: false,
  isAdding: false,
  error: null,
};

export const fetchPersons = createAsyncThunk('persons/fetchAll', async () => {
  const response = await api.get<{ data: Person[] }>(API_ROUTES.PERSON.BASE);
  return response.data;
});

export const addPerson = createAsyncThunk('persons/add', async (data: { name: string; imageFile?: File }) => {
  const formData = new FormData();
  formData.append('name', data.name);
  if (data.imageFile) {
    formData.append('photo', data.imageFile);
  }
  const response = await api.postFormData<{ data: Person }>(API_ROUTES.PERSON.BASE, formData);
  return response.data;
});

export const updatePerson = createAsyncThunk('persons/update', async ({ id, data }: { id: string; data: { name?: string; imageFile?: File } }) => {
  const formData = new FormData();
  if (data.name) formData.append('name', data.name);
  if (data.imageFile) {
    formData.append('photo', data.imageFile);
  }
  const response = await api.putFormData<{ data: Person }>(API_ROUTES.PERSON.ID(id), formData);
  return response.data;
});

export const deletePerson = createAsyncThunk('persons/delete', async (id: string) => {
  await api.delete(API_ROUTES.PERSON.ID(id));
  return id;
});

const personSlice = createSlice({
  name: 'persons',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPersons.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPersons.fulfilled, (state, action) => {
        state.persons = action.payload;
        state.loading = false;
      })
      .addCase(fetchPersons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load persons';
      })
      .addCase(addPerson.pending, (state) => {
        state.isAdding = true;
      })
      .addCase(addPerson.fulfilled, (state, action) => {
        state.persons.push(action.payload);
        state.isAdding = false;
      })
      .addCase(addPerson.rejected, (state, action) => {
        state.isAdding = false;
        state.error = action.error.message || 'Failed to add person';
      })
      .addCase(updatePerson.pending, (state) => {
        state.isAdding = true;
      })
      .addCase(updatePerson.fulfilled, (state, action) => {
        const index = state.persons.findIndex(p => p._id === action.payload._id);
        if (index !== -1) state.persons[index] = action.payload;
        state.isAdding = false;
      })
      .addCase(updatePerson.rejected, (state, action) => {
        state.isAdding = false;
        state.error = action.error.message || 'Failed to update person';
      })
      .addCase(deletePerson.fulfilled, (state, action) => {
        state.persons = state.persons.filter(p => p._id !== action.payload);
      });
  },
});

export default personSlice.reducer;
