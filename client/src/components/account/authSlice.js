// authSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API } from '../../service/api';

const initialState = {
  login: {
    username: '',
    password: '',
  },
  signup: {
    name: '',
    username: '',
    password: '',
    role: '',
    state: '',
    adminCode: '',
  },
  error: '',
  account: 'login',
};

export const loginUser = createAsyncThunk('auth/loginUser', async (loginData) => {
  try {
    const response = await API.userLogin(loginData);
    if (response.isSuccess) {
      return response.data;
    }
    throw new Error('Failed to login');
  } catch (error) {
    throw new Error('An error occurred during user login');
  }
});

export const signupUser = createAsyncThunk('auth/signupUser', async (signupData) => {
  try {
    const response = await API.userSignup(signupData);
    if (response.isSuccess) {
      return response.data;
    }
    throw new Error('Failed to signup');
  } catch (error) {
    throw new Error('An error occurred during user signup');  
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    toggleAccount: (state) => {
      state.account = state.account === 'login' ? 'signup' : 'login';
    },
    resetError: (state) => {
      state.error = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.error = '';
        state.login = { username: '', password: '' };
        state.signup = { name: '', username: '', password: '', role: '', state: '', adminCode: '' };
        state.account = 'login';
        // Update the state with the user data from the action payload
        state.account = action.payload.role === 'admin' ? 'admin' : 'user';
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(signupUser.fulfilled, (state) => {
        state.error = '';
        state.signup = { name: '', username: '', password: '', role: '', state: '', adminCode: '' };
        state.account = 'login';
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export const { toggleAccount, resetError } = authSlice.actions;
export default authSlice.reducer;
    