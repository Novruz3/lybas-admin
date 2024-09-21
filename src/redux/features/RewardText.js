import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosCustom } from "../../common/AxiosInstance.js";

const initialState = {
  data: [],
  loading: false,
  error: null,
};
export const fetchRewardText = createAsyncThunk(
  "data/fetchRewardText",
  async (_) => {
    try {
      const data = await AxiosCustom(
        '/back/reward-text/one'
      );
      return data;
    } catch (error) {
      console.error(error);
    }
  }
);

const RewardText = createSlice({
  name: "RewardText",
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRewardText.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRewardText.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action?.payload?.data;
      })
      .addCase(fetchRewardText.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "An error occurred";
      });
  },
});

export default RewardText.reducer;
