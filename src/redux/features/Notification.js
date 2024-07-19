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
  filter: ''
};
export const fetchDataNotification = createAsyncThunk('data/fetchDataNotification', async (_, { getState }) => {
  try {
    const { limit, offset, filter, search } = getState().Notification;
    const data = await AxiosCustom(`/notifications?limit=${limit}&offset=${offset}&filter=${JSON.stringify(filter)}&keyword=${search}`);
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
const Notification = createSlice({
  name: 'Notification',
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
      state.offset = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDataNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDataNotification.fulfilled, (state, action) => {
        state.loading = false;
        state.data = [...action?.payload?.data.data];
        state.count = action?.payload.data.count;
      })
      .addCase(fetchDataNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'An error occurred';
      });
  }
});

// Export the actions and reducer
export const { setLimit, setOffset, setSearch, setFilter } = Notification.actions;
export default Notification.reducer;
