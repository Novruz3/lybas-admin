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
  filter: {},
  welayat: ''
};
export const fetchDataDressmakers = createAsyncThunk('data/fetchDataDressmakers', async (_, { getState }) => {
  try {
    const { limit, offset, search, filter, welayat } = getState().Dressmakers;
    const data = await AxiosCustom(
      `/seller?limit=${limit}&offset=${offset}&keyword=${search}&filter=${JSON.stringify(filter)}&welayat=${welayat}`
    );
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
const Dressmakers = createSlice({
  name: 'Dressmakers',
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
      state.offset = 0;
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
      state.offset = 0;
    },
    setWelayat: (state, action) => {
      state.welayat = action.payload;
      state.offset = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDataDressmakers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDataDressmakers.fulfilled, (state, action) => {
        state.loading = false;
        state.data = [...action?.payload?.data.data];
        state.count = action?.payload.data.count;
      })
      .addCase(fetchDataDressmakers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'An error occurred';
      });
  }
});

// Export the actions and reducer
export const { setLimit, setOffset, setSearch, setFilter, setWelayat } = Dressmakers.actions;
export default Dressmakers.reducer;
