// postsSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API } from '../../../service/api';

// Define the async thunk to fetch posts
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async (category) => {
  const response = await API.getAllPosts();
  // const response = await API.getAllPosts({ category: category || '' });
  if (response.isSuccess) {
    return response.data;
  }
  throw new Error('Failed to fetch posts');
});

const initialState = {
  posts: [],
  status: 'idle',
  error: null,
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default postsSlice.reducer;
