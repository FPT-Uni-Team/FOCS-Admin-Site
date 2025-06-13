import { call, put, takeLatest } from 'redux-saga/effects';
import { login } from '../../../services/authService';
import { loginRequest, loginSuccess, loginFailure } from '../../slices/auth/authSlice';
import type { PayloadAction } from '@reduxjs/toolkit';

interface LoginPayload {
  email: string;
  password: string;
}

interface User {
  is_succes: boolean;
  access_token: string;
  refresh_token: string;
  errors: string[];
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

function* handleLogin(action: PayloadAction<LoginPayload>) {
  try {
    const { email, password } = action.payload;
    const response: User = yield call(login, { email, password });
    yield put(loginSuccess(response));
  } catch (error) {
    const err = error as ApiError;
    yield put(loginFailure(err.response?.data?.message || 'Login failed'));
  }
}

export default function* authSaga() {
  yield takeLatest(loginRequest.type, handleLogin);
} 