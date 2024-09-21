import { t } from "i18next";
import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { api } from "../common/Config";
import image from "../assets/images/person-fill.svg";
import Dropdown from "./Dropdown";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [active, setActive] = useState(
    location.pathname.split("/")[2] ? location.pathname.split("/")[2] : "/"
  );
  const [data, setData] = useState({});

  return (
    <div className="sellerProfile_sidebar">
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 light:bg-gray-800 light:border-gray-700">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="w-full flex justify-between">
              <div className="flex items-start flex-col">
                <h3 className="text-xl font-semibold mb-1">
                  {t("hello")} {data?.login}
                </h3>
                <p className="text-sm text-lybas-gray">
                  {t("welcomeDashboard")}
                </p>
              </div>
              <div className="flex items-center">
                <div className="language">
                  <Dropdown />
                </div>
                <div className="flex items-center">
                  <div className="flex items-center ml-3">
                    <div>
                      <button
                        onClick={() => (
                          navigate("/profile"), setActive("profile")
                        )}
                        type="button"
                        className="flex text-sm border border-gray-500 rounded-full focus:ring-4 focus:ring-gray-300 light:focus:ring-gray-600"
                        aria-expanded="false"
                        data-dropdown-toggle="dropdown-user"
                      >
                        <span className="sr-only">Open user menu</span>
                        <img
                          className="w-8 h-8 rounded-full"
                          src={data?.image ? api + data?.image : image}
                          alt="user photo"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <aside
        id="logo-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen pt-24 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 light:bg-gray-800 light:border-gray-700"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-white light:bg-gray-800">
          <ul className="space-y-2 font-medium">
            <li className="sidebar_link" onClick={() => setActive("/")}>
              <Link
                to={"/"}
                className={
                  "flex items-center p-2 pl-4 text-gray-900 rounded-lg light:text-white hover:bg-gray-100 light:hover:bg-gray-700 group " +
                  (active === "/" ? "active" : "")
                }
              >
                <span className="ml-3 text-lybas-gray group-hover:text-gray-900">
                  {t("orders")}
                </span>
              </Link>
            </li>
            <li className="sidebar_link" onClick={() => setActive('categories')}>
              <Link
                to={'/categories'}
                className={
                  'flex items-center p-2 pl-4 text-gray-900 rounded-lg light:text-white hover:bg-gray-100 light:hover:bg-gray-700 group ' +
                  (active === 'categories' ? 'active' : '')
                }
              >
                <span className="ml-3 text-lybas-gray group-hover:text-gray-900">{t('category')}</span>
              </Link>
            </li>
            <li className="sidebar_link" onClick={() => setActive('products')}>
              <Link
                to={'/products'}
                className={
                  'flex items-center p-2 pl-4 text-gray-900 rounded-lg light:text-white hover:bg-gray-100 light:hover:bg-gray-700 group ' +
                  (active === 'products' ? 'active' : '')
                }
              >
                <span className="ml-3 text-lybas-gray group-hover:text-gray-900">{t('products')}</span>
              </Link>
            </li>
            <li className="sidebar_link" onClick={() => setActive('gallery')}>
              <Link
                to={'/gallery'}
                className={
                  'flex items-center p-2 pl-4 text-gray-900 rounded-lg light:text-white hover:bg-gray-100 light:hover:bg-gray-700 group ' +
                  (active === 'gallery' ? 'active' : '')
                }
              >
                <span className="ml-3 text-lybas-gray group-hover:text-gray-900">{t('gallery')}</span>
              </Link>
            </li>
            <li className="sidebar_link" onClick={() => setActive('banner')}>
              <Link
                to={'/banner'}
                className={
                  'flex items-center p-2 pl-4 text-gray-900 rounded-lg light:text-white hover:bg-gray-100 light:hover:bg-gray-700 group ' +
                  (active === 'banner' ? 'activeStroke' : '')
                }
              >
                <span className="ml-3 text-lybas-gray group-hover:text-gray-900">{t('banner')}</span>
              </Link>
            </li>
            <li className="sidebar_link" onClick={() => setActive('recipes')}>
              <Link
                to={'/recipes'}
                className={
                  'flex items-center p-2 pl-4 text-gray-900 rounded-lg light:text-white hover:bg-gray-100 light:hover:bg-gray-700 group ' +
                  (active === 'recipes' ? 'active' : '')
                }
              >
                <span className="ml-3 text-lybas-gray group-hover:text-gray-900">{t('resipe')}</span>
              </Link>
            </li>
            <li className="sidebar_link" onClick={() => setActive('rewards')}>
              <Link
                to={'/rewards'}
                className={
                  'flex items-center p-2 pl-4 text-gray-900 rounded-lg light:text-white hover:bg-gray-100 light:hover:bg-gray-700 group ' +
                  (active === 'rewards' ? 'active' : '')
                }
              >
                <span className="ml-3 text-lybas-gray group-hover:text-gray-900">{t('rewards')}</span>
              </Link>
            </li>
            <li className="sidebar_link" onClick={() => setActive('faq')}>
              <Link
                to={'/faq'}
                className={
                  'flex items-center p-2 pl-4 text-gray-900 rounded-lg light:text-white hover:bg-gray-100 light:hover:bg-gray-700 group ' +
                  (active === 'faq' ? 'active' : '')
                }
              >
                <span className="ml-3 text-lybas-gray group-hover:text-gray-900">{t('faq')}</span>
              </Link>
            </li>
            <li className="sidebar_link" onClick={() => setActive('textSlider')}>
              <Link
                to={'/textSlider'}
                className={
                  'flex items-center p-2 pl-4 text-gray-900 rounded-lg light:text-white hover:bg-gray-100 light:hover:bg-gray-700 group ' +
                  (active === 'textSlider' ? 'active' : '')
                }
              >
                <span className="ml-3 text-lybas-gray group-hover:text-gray-900">{t('textSlider')}</span>
              </Link>
            </li>
            <li className="sidebar_link" onClick={() => setActive('rewardText')}>
              <Link
                to={'/rewardText'}
                className={
                  'flex items-center p-2 pl-4 text-gray-900 rounded-lg light:text-white hover:bg-gray-100 light:hover:bg-gray-700 group ' +
                  (active === 'rewardText' ? 'active' : '')
                }
              >
                <span className="ml-3 text-lybas-gray group-hover:text-gray-900">{t('rewardText')}</span>
              </Link>
            </li>
            <li className="sidebar_link" onClick={() => setActive('aboutUs')}>
              <Link
                to={'/aboutUs'}
                className={
                  'flex items-center p-2 pl-4 text-gray-900 rounded-lg light:text-white hover:bg-gray-100 light:hover:bg-gray-700 group ' +
                  (active === 'aboutUs' ? 'active' : '')
                }
              >
                <span className="ml-3 text-lybas-gray group-hover:text-gray-900">{t('aboutUs')}</span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>

      <div className="p-4 sm:ml-64 bg-[#F4F7FF] h-screen">
        <div className="p-4 rounded-lg mt-14">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
