import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosCustom } from "../../common/AxiosInstance.js";

const initialState = {
  data: [],
  loading: false,
  error: null,
};
export const fetchTextSlider = createAsyncThunk(
  "data/fetchTextSlider",
  async (_) => {
    try {
      const data = await AxiosCustom(
        '/back/text-slider/one'
      );
      return data;
    } catch (error) {
      console.error(error);
    }
  }
);

const TextSlider = createSlice({
  name: "TextSlider",
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTextSlider.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTextSlider.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action?.payload?.data;
      })
      .addCase(fetchTextSlider.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "An error occurred";
      });
  },
});

export default TextSlider.reducer;
