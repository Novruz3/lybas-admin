import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosCustom } from "../../common/AxiosInstance.js";

const initialState = {
  data: [],
  loading: false,
  error: null,
};
export const fetchAboutUs = createAsyncThunk(
  "data/fetchAboutUs",
  async (_) => {
    try {
      const data = await AxiosCustom(
        'back/about-us/one'
      );
      return data;
    } catch (error) {
      console.error(error);
    }
  }
);

const AboutUs = createSlice({
  name: "AboutUs",
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAboutUs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAboutUs.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action?.payload?.data;
      })
      .addCase(fetchAboutUs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "An error occurred";
      });
  },
});

export default AboutUs.reducer;
