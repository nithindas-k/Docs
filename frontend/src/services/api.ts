import { API_URL } from '../constants';

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = 'ApiError';
  }
}

class ApiService {
  private getToken() {
    return localStorage.getItem('docs_token');
  }

  private getHeaders() {
    const token = this.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  async get<T>(path: string): Promise<T> {
    const response = await fetch(`${API_URL}${path}`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(errorData.message || 'API Error', response.status);
    }
    return response.json();
  }

  async post<T>(path: string, body: any): Promise<T> {
    const response = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(errorData.message || 'API Error', response.status);
    }
    return response.json();
  }

  async postFormData<T>(path: string, formData: FormData): Promise<T> {
    const response = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: {
        'Authorization': this.getToken() ? `Bearer ${this.getToken()}` : '',
      },
      body: formData,
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(errorData.message || 'API Error', response.status);
    }
    return response.json();
  }

  async put<T>(path: string, body: any): Promise<T> {
    const response = await fetch(`${API_URL}${path}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(errorData.message || 'API Error', response.status);
    }
    return response.json();
  }

  async putFormData<T>(path: string, formData: FormData): Promise<T> {
    const response = await fetch(`${API_URL}${path}`, {
      method: 'PUT',
      headers: {
        'Authorization': this.getToken() ? `Bearer ${this.getToken()}` : '',
      },
      body: formData,
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(errorData.message || 'API Error', response.status);
    }
    return response.json();
  }

  async delete<T>(path: string): Promise<T> {
    const response = await fetch(`${API_URL}${path}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(errorData.message || 'API Error', response.status);
    }
    return response.json();
  }
}

export const api = new ApiService();
