import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosCustom } from '../../common/AxiosInstance.js';

const initialState = {
  data: {},
  loading: false,
  error: null,
  limit: 5,
  offset: 0,
  count: 0,
  search: '',
  filter: {}
};
export const fetchDataStatistics = createAsyncThunk('data/fetchDataStatistics', async (_, { getState }) => {
  try {
    const data = await AxiosCustom(`/stats`);
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
const Statistics = createSlice({
  name: 'Statistics',
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
      state.filter = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDataStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDataStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.data = { ...action?.payload?.data };
      })
      .addCase(fetchDataStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'An error occurred';
      });
  }
});

// Export the actions and reducer
export const { setLimit, setOffset, setSearch, setFilter } = Statistics.actions;
export default Statistics.reducer;
