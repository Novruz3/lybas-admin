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
export const fetchGallery = createAsyncThunk(
  "data/fetchGallery",
  async (_, { getState }) => {
    try {
      const { limit, page } = getState().Gallery;
      const data = await AxiosCustom(
        `/back/galleries?limit=${limit}&page=${page+1}`
      );
      console.log(data);
      return data;
    } catch (error) {
      console.error(error);
    }
  }
);

const Gallery = createSlice({
  name: "Gallery",
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
      .addCase(fetchGallery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGallery.fulfilled, (state, action) => {
        state.loading = false;
        state.data = [...action?.payload?.data.galleries];
        state.count = action?.payload.data.count;
      })
      .addCase(fetchGallery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "An error occurred";
      });
  },
});

export const { setLimit, setPage } = Gallery.actions;
export default Gallery.reducer;
