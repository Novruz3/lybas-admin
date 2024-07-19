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
export const fetchDataDayStatistics = createAsyncThunk('data/fetchDataDayStatistics', async (_, { getState }) => {
  const { limit, offset, filter, search } = getState().Statistics;
  try {
    const data = await AxiosCustom(`/orders/daily`);
    console.log(data, 'statisticaDay');
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
const DayStatistics = createSlice({
  name: 'DayStatistics',
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
      .addCase(fetchDataDayStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDataDayStatistics.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action?.payload?.data, 'bla');
        state.data = action?.payload?.data;
      })
      .addCase(fetchDataDayStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'An error occurred';
      });
  }
});

// Export the actions and reducer
export const { setLimit, setOffset, setSearch, setFilter } = DayStatistics.actions;
export default DayStatistics.reducer;
