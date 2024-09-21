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
export const fetchFAQ = createAsyncThunk(
  "data/fetchFAQ",
  async (_, { getState }) => {
    try {
      const { limit, page } = getState().FAQ;
      const data = await AxiosCustom(
        `/back/faqs?limit=${limit}&page=${page+1}`
      );
      return data;
    } catch (error) {
      console.error(error);
    }
  }
);

const FAQ = createSlice({
  name: "FAQ",
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
      .addCase(fetchFAQ.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFAQ.fulfilled, (state, action) => {
        state.loading = false;
        state.data = [...action?.payload?.data.faqs];
        state.count = action?.payload.data.count;
      })
      .addCase(fetchFAQ.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "An error occurred";
      });
  },
});

export const { setLimit, setPage } = FAQ.actions;
export default FAQ.reducer;
