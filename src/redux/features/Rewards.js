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
export const fetchRewards = createAsyncThunk(
  "data/fetchRewards",
  async (_, { getState }) => {
    try {
      const { limit, page } = getState().Rewards;
      const data = await AxiosCustom(
        `/back/diploms?limit=${limit}&page=${page+1}`
      );
      console.log(data);
      return data;
    } catch (error) {
      console.error(error);
    }
  }
);

const Rewards = createSlice({
  name: "Rewards",
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
      .addCase(fetchRewards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRewards.fulfilled, (state, action) => {
        state.loading = false;
        state.data = [...action?.payload?.data.diploms];
        state.count = action?.payload.data.count;
      })
      .addCase(fetchRewards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "An error occurred";
      });
  },
});

export const { setLimit, setPage } = Rewards.actions;
export default Rewards.reducer;
