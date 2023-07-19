// store.js

import { configureStore } from '@reduxjs/toolkit';
import postsReducer from '../components/home/post/postsSlice'
import authReducer from '../components/account/authSlice';

const store = configureStore({
  reducer: {
    posts: postsReducer,
    auth:authReducer
    // Add other reducers here if needed
  },
});

export default store;
