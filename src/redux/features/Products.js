import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosCustom } from "../../common/AxiosInstance.js";

const initialState = {
  data: [],
  loading: false,
  error: null,
  limit: 10,
  page: 0,
  count: 0,
};
export const fetchProducts = createAsyncThunk(
  "data/fetchProducts",
  async (_, { getState }) => {
    try {
      const { limit, page } = getState().Products;
      const data = await AxiosCustom(
        `/back/products?limit=${limit}&page=${page+1}`
      );
      console.log(data);
      return data;
    } catch (error) {
      console.error(error);
    }
  }
);

const Products = createSlice({
  name: "Products",
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
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.data = [...action?.payload?.data.products];
        state.count = action?.payload.data.count;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "An error occurred";
      });
  },
});

export const { setLimit, setPage } = Products.actions;
export default Products.reducer;
