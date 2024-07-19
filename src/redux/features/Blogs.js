import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosCustom } from '../../common/AxiosInstance.js';

const initialState = {
  data: [],
  loading: false,
  error: null,
  limit: 5,
  offset: 0,
  count: 0,
  search: '',
  filter: {}
};
export const fetchDataBlogs = createAsyncThunk('data/fetchDataBlogs', async (_, { getState }) => {
  try {
    const { limit, offset, filter, search } = getState().Blogs;
    const data = await AxiosCustom(`/blogs?limit=${limit}&offset=${offset}&filter=${JSON.stringify(filter)}&keyword=${search}`);
    return data;
  } catch (error) {
    console.log(error.response.data.message);
    const err = error.response.data.message;
    if (err === 'jwt expired') {
      window.location.reload('/login');
      localStorage.clear('lybas-token');
    }
    throw error;
  }
});

// Create a slice using Redux Toolkit
const Blogs = createSlice({
  name: 'Blogs',
  initialState,
  reducers: {
    setLimit: (state, action) => {
      state.limit = action.payload;
      state.offset = 0; // Reset the offset when changing the limit
    },
    setOffset: (state, action) => {
      state.offset = action.payload;
    },
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    setFilter: (state, action) => {
      console.log(action.payload, 123);
      state.filter = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDataBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDataBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.data = [...action?.payload?.data.data];
        state.count = action?.payload.data.count;
      })
      .addCase(fetchDataBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'An error occurred';
      });
  }
});

// Export the actions and reducer
export const { setLimit, setOffset, setSearch, setFilter } = Blogs.actions;
export default Blogs.reducer;
