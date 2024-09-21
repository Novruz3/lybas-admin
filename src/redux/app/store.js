import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import Orders from "../features/Orders";
import Categories from "../features/Categories";
import Products from "../features/Products";
import Recipes from "../features/Recipes";
import FAQ from "../features/FAQ";
import Banners from "../features/Banners";
import Gallery from "../features/Gallery";
import Rewards from "../features/Rewards";
import RewardText from "../features/RewardText";
import AboutUs from "../features/AboutUs";
import TextSlider from "../features/TextSlider";

export const store = configureStore({
  reducer: {
    Orders,
    Categories,
    Products,
    Recipes,
    FAQ,
    Banners,
    Gallery,
    Rewards,
    RewardText,
    AboutUs,
    TextSlider,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
