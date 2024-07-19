// src/Routes.tsx

import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './../components/Sidebar';
import Dashboard from './../pages/Dashboard';
import Orders from './../pages/Orders';
import SellerComments from './../pages/Comments';
import Dresses from './../pages/Dresses';
import DressesAdd from './../pages/DressesAdd';
import DressesEdit from './../pages/DressesEdit';
import OneOrder from './../pages/OneOrder';
import CommentOne from './../pages/CommentOne';
import Emails from './../pages/Emails';
import EmailOne from './../pages/EmailOne';
import Profile from './../pages/Profile';
import Login from './../pages/Login';
import Dressmakers from './../pages/Dressmakers';
import DressmakersAdd from './../pages/DressmakersAdd';
import DressmakersEdit from './../pages/DressmakersEdit';
import Filter from './../pages/Filter';
import FilterEdit from './../pages/FilterEdit';
import Banner from './../pages/Banner';
import BannerAdd from './../pages/BannerAdd';
import BannerEdit from './../pages/BannerEdit';
import Blog from './../pages/Blog';
import BlogAdd from './../pages/BlogAdd';
import Notification from './../pages/Notification';
import NotificationAdd from './../pages/NotificationAdd';
import NotificationEdit from '../pages/NotificationEdit';
import BlogEdit from '../pages/BlogEdit';

const RoutesAdmin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState(false);

  const checkToken = async () => {
    if (location.pathname !== '/super/login') {
      if (localStorage.getItem('lybas-token')) {
        if (location.pathname === '/') {
          setToken(true);
          navigate('/super');
        }
        setToken(true);
      } else {
        setToken(false);
        navigate('/super/login');
      }
    } else {
      console.log('hello');
      if (localStorage.getItem('lybas-token')) {
        setToken(true);
        navigate('/super');
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
        <Route path="/super/login" element={<Login />} />
      </Routes>
    );
  }
  return (
    <Routes>
      <Route path="/super" element={<Sidebar />}>
        <Route index element={<Dashboard />} />
        <Route path="/super/orders" element={<Orders />} />
        <Route path="/super/orders/:id" element={<OneOrder />} />
        <Route path="/super/dressmakers" element={<Dressmakers />} />
        <Route path="/super/dressmakers/add" element={<DressmakersAdd />} />
        <Route path="/super/dressmakers/:id" element={<DressmakersEdit />} />
        <Route path="/super/dresses" element={<Dresses />} />
        <Route path="/super/dresses/add" element={<DressesAdd />} />
        <Route path="/super/dresses/:id" element={<DressesEdit />} />
        <Route path="/super/comments" element={<SellerComments />} />
        <Route path="/super/comments/:id" element={<CommentOne />} />
        <Route path="/super/emails" element={<Emails />} />
        <Route path="/super/emails/:id/:type" element={<EmailOne />} />
        <Route path="/super/profile" element={<Profile />} />
        <Route path="/super/filter" element={<Filter />} />
        <Route path="/super/filter/:type" element={<FilterEdit />} />
        <Route path="/super/banner" element={<Banner />} />
        <Route path="/super/banner/add" element={<BannerAdd />} />
        <Route path="/super/banner/:id" element={<BannerEdit />} />
        <Route path="/super/blog" element={<Blog />} />
        <Route path="/super/blog/add" element={<BlogAdd />} />
        <Route path="/super/blog/:id" element={<BlogEdit />} />
        <Route path="/super/notification" element={<Notification />} />
        <Route path="/super/notification/add" element={<NotificationAdd />} />
        <Route path="/super/notification/:id" element={<NotificationEdit />} />
      </Route>
    </Routes>
  );
};

export default RoutesAdmin;
