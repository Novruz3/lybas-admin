import React, { useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./../components/Sidebar";
import Dashboard from "./../pages/Dashboard";
import Login from "../pages/Login";
import Category from "../pages/Category";
import Products from "../pages/Products";
import Gallery from "../pages/Gallery";
import Banner from "../pages/Banner";
import Recipes from "../pages/Recipes";
import FAQ from "../pages/FAQ";
import CategoryAdd from "../pages/CategoryAdd";
import ProductAdd from "../pages/ProductsAdd";
import RecipesAdd from "../pages/RecipesAdd";
import FAQAdd from "../pages/FAQAdd";
import BannerAdd from "../pages/BannerAdd";
import GalleryAdd from "../pages/GalleryAdd";
import Profile from "../pages/Profile";
import Register from "../pages/Register";
import Rewards from "../pages/Rewards";
import RewardsAdd from "../pages/RewardsAdd";
import TextSlider from "../pages/TextSlider";
import TextSliderAdd from "../pages/TextSliderAdd";
import RewardText from "../pages/RewardText";
import RewardTextAdd from "../pages/RewardTextAdd";
import AboutUs from "../pages/AboutUs";
import AboutUsAdd from "../pages/AboutUsAdd";

const RoutesAdmin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState(false);

  const checkToken = async () => {
    if (location.pathname !== "/login" || location.pathname !== "/register") {
      if (sessionStorage.getItem("access-token")) {
        if (location.pathname === "/") {
          setToken(true);
          navigate("/");
        }
        setToken(true);
      } else {
        setToken(false);
        if (location.pathname !== "/register") {
          navigate("/login");
        }
      }
    } else {
      console.log("hello");
      if (sessionStorage.getItem("access-token")) {
        setToken(true);
        navigate("/");
      } else {
        setToken(false);
      }
    }
  };
  useEffect(() => {
    checkToken();
  }, [navigate]);

  if (!token) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    );
  }
  return (
    <Routes>
      <Route path="/" element={<Sidebar />}>
        <Route index element={<Dashboard />} />
        <Route path="/categories" element={<Category />} />
        <Route path="/categories_add" element={<CategoryAdd />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products_add" element={<ProductAdd />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/gallery_add" element={<GalleryAdd />} />
        <Route path="/banner" element={<Banner />} />
        <Route path="/banner_add" element={<BannerAdd />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/recipes_add" element={<RecipesAdd />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/faq_add" element={<FAQAdd />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/rewards" element={<Rewards />} />
        <Route path="/reward_add" element={<RewardsAdd />} />
        <Route path="/textSlider" element={<TextSlider />} />
        <Route path="/textSlider_add" element={<TextSliderAdd />} />
        <Route path="/rewardText" element={<RewardText />} />
        <Route path="/rewardText_add" element={<RewardTextAdd />} />
        <Route path="/aboutUs" element={<AboutUs />} />
        <Route path="/aboutUs_add" element={<AboutUsAdd />} />
      </Route>
    </Routes>
  );
};

export default RoutesAdmin;
