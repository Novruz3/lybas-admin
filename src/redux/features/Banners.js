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
export const fetchBanners = createAsyncThunk(
  "data/fetchBanners",
  async (_, { getState }) => {
    try {
      const { limit, page } = getState().Banners;
      const data = await AxiosCustom(
        `/back/sliders?limit=${limit}&page=${page+1}`
      );
      console.log(data);
      return data;
    } catch (error) {
      console.error(error);
    }
  }
);

const Banners = createSlice({
  name: "Banners",
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
      .addCase(fetchBanners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBanners.fulfilled, (state, action) => {
        state.loading = false;
        state.data = [...action?.payload?.data.sliders];
        state.count = action?.payload.data.count;
      })
      .addCase(fetchBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "An error occurred";
      });
  },
});

export const { setLimit, setPage } = Banners.actions;
export default Banners.reducer;
