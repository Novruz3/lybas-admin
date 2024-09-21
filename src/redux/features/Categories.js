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
export const fetchCategories = createAsyncThunk(
  "data/fetchCategories",
  async (_, { getState }) => {
    try {
      const { limit, page } = getState().Categories;
      const data = await AxiosCustom(
        `/back/categories?limit=${limit}&page=${page+1}`
      );
      return data;
    } catch (error) {
      console.error(error);
    }
  }
);

const Categories = createSlice({
  name: "Categories",
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
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.data = [...action?.payload?.data.categories];
        state.count = action?.payload.data.count;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "An error occurred";
      });
  },
});

export const { setLimit, setPage } = Categories.actions;
export default Categories.reducer;
