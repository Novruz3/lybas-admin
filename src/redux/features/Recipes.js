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
export const fetchRecipes = createAsyncThunk(
  "data/fetchRecipes",
  async (_, { getState }) => {
    try {
      const { limit, page } = getState().Recipes;
      const data = await AxiosCustom(
        `/back/recipes?limit=${limit}&page=${page+1}`
      );
      console.log(data);
      return data;
    } catch (error) {
      console.error(error);
    }
  }
);

const Recipes = createSlice({
  name: "Recipes",
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
      .addCase(fetchRecipes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecipes.fulfilled, (state, action) => {
        state.loading = false;
        state.data = [...action?.payload?.data.recipes];
        state.count = action?.payload.data.count;
      })
      .addCase(fetchRecipes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "An error occurred";
      });
  },
});

export const { setLimit, setPage } = Recipes.actions;
export default Recipes.reducer;
