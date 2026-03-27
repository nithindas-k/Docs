export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'dummy-google-client-id';

export const ROUTES = {
  LOGIN: '/login',
  HOME: '/',
  CATEGORY: '/category/:id',
  PERSONS: '/persons',
  PERSON_DETAIL: '/persons/:id',
};

export const API_ROUTES = {
  AUTH: {
    GOOGLE: '/auth/google',
    PROFILE: '/auth/profile',
  },
  CATEGORY: {
    BASE: '/categories',
  },
  ITEM: {
    BASE: '/items',
    BY_CATEGORY: (id: string) => `/items/category/${id}`,
    BY_PERSON: (id: string) => `/items/person/${id}`,
    ID: (id: string) => `/items/${id}`,
  },
  PERSON: {
    BASE: '/persons',
    ID: (id: string) => `/persons/${id}`,
  }
};

export const DEFAULT_CATEGORIES = [
  { _id: 'aadhaar', name: 'Aadhaar', icon: 'credit-card' },
  { _id: 'driving-licence', name: 'Driving Licence', icon: 'car' },
  { _id: 'pan-card', name: 'PAN Card', icon: 'file-text' },
  { _id: 'bank-account', name: 'Bank Account', icon: 'landmark' },
  { _id: 'sslc', name: 'SSLC', icon: 'graduation-cap' },
  { _id: 'voter-id', name: 'Voter ID', icon: 'user-check' },
  { _id: 'passport', name: 'Passport', icon: 'book' },
] as const;
