import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosCustom } from "../../common/AxiosInstance.js";

const initialState = {
  data: [],
  loading: false,
  error: null,
  limit: 10,
  page: 0,
  count : 0
};
export const fetchOrders = createAsyncThunk(
  "data/fetchOrders",
  async (_, { getState }) => {
    try {
      const { limit, page } = getState().Orders;
      const data = await AxiosCustom(`/back/mails?limit=${limit}&page=${page+1}`);
      return data;
    } catch (error) {
      console.error(error);
      // const err = error.response.data.message;
      // if (err === 'jwt expired') {
      //   window.location.reload('/login');
      //   localStorage.clear('lybas-token');
      // }
      // throw error;
    }
  }
);

const Orders = createSlice({
  name: "Orders",
  initialState,
  reducers: {
    setLimit: (state, action) => {
      state.limit = action.payload;
      state.page = 1;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.data = [...action?.payload?.data.mails];
        state.count = action?.payload.data.count;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "An error occurred";
      });
  },
});

export const { setLimit, setPage } = Orders.actions;
export default Orders.reducer;
