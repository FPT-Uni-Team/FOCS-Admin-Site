import { createSlice } from '@reduxjs/toolkit';


interface User {
  is_succes: boolean;
  access_token: string;
  refresh_token: string;
  errors: string[];
}

interface AuthState {
  loading: boolean;
  user: User | null;
  error: string | null;
}

interface LoginPayload {
  email: string;
  password: string;
}

// Check if user is already logged in
const getInitialUser = (): User | null => {
  const token = localStorage.getItem('token');
  if (token) {
    // You might want to validate the token here
    return {
      is_succes: true,
      access_token: token,
      refresh_token: '',
      errors: [],
    };
  }
  return null;
};

const initialState: AuthState = {
  loading: false,
  user: getInitialUser(),
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginRequest: {
      reducer: (state) => {
        state.loading = true;
        state.error = null;
      },
      prepare: (payload: LoginPayload) => ({ payload }),
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.user = action.payload;
      // Save tokens to localStorage
      if (action.payload.access_token) {
        localStorage.setItem('token', action.payload.access_token);
      }
      if (action.payload.refresh_token) {
        localStorage.setItem('refreshToken', action.payload.refresh_token);
      }
    },
    loginFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    logout(state) {
      state.user = null;
      // Remove tokens from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    },
    refreshTokenRequest(state) {
      state.loading = true;
      state.error = null;
    },
    refreshTokenSuccess(state, action) {
      state.loading = false;
      if (state.user) {
        state.user.access_token = action.payload.access_token;
        localStorage.setItem('token', action.payload.access_token);
      }
    },
    refreshTokenFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
      // Clear all auth data on refresh failure
      state.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    },
  },
});

export const { 
  loginRequest, 
  loginSuccess, 
  loginFailure, 
  logout,
  refreshTokenRequest,
  refreshTokenSuccess,
  refreshTokenFailure
} = authSlice.actions;
export default authSlice.reducer; 