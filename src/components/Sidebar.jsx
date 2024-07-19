import { t } from 'i18next';
import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import Dropdown from './Dropdown';
import PopupLogout from './PopupLogout';
import Logo from '../assets/images/lybas.svg';
import { AxiosCustom } from '../common/AxiosInstance';
import { api } from '../common/Config';
import image from '../assets/images/person-fill.svg';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDataNotification } from '../redux/features/Notification';
import { fetchDataEmails } from '../redux/features/Emails';
import { socket } from '../socket';
import { fetchDataOrders } from '../redux/features/Orders';

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [active, setActive] = useState(location.pathname.split('/')[2] ? location.pathname.split('/')[2] : '/');
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({});
  const notifications = useSelector((state) => state?.Notification?.data);
  const emails = useSelector((state) => state?.Emails?.data);
  const notReadCount = useSelector((state) => state?.Emails?.notRead);
  const notReadOrder = useSelector((state) => state?.Orders?.notRead);
  const orderCount = useSelector((state) => state?.Orders?.count);
  const [notReadOrderLocal, setNotReadOrderLocal] = useState(0);

  useEffect(() => {
    socket.connect();
    const path = window.location.pathname.split('/')[2];
    if (path === 'orders') {
      setNotReadOrderLocal(0);
    }
    socket.on('admin-mail', async () => {
      if (path !== 'emails') {
        await dispatch(fetchDataEmails());
      } else {
        const res = await AxiosCustom('/mails/isRead');
        if (res.status === 200) {
          await dispatch(fetchDataEmails());
        }
      }
    });
    socket.on('admin-order', async (res) => {
      if (orderCount < 1) {
        await dispatch(fetchDataOrders());
      } else {
        if (path !== 'orders') {
          console.log(55);
          setNotReadOrderLocal(res);
        } else {
          console.log(58);
          await dispatch(fetchDataOrders());
        }
      }
    });

    return () => {
      socket.off('admin-mail');
      socket.off('admin-order');
    };
  }, [location]);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await AxiosCustom('/get-me');
        setData(res.data);
      } catch (error) {
        console.log(error.response.data.message);
        if (error.response.data.message === 'jwt expired' || error.response.status === 401) {
          localStorage.setItem('lybas-token', '');
          navigate('/super/login');
        }
      }
    };
    getData();
    if (!notifications?.length) dispatch(fetchDataNotification());
    if (!emails?.length) dispatch(fetchDataEmails());
  }, []);

  return (
    <div className="sellerProfile_sidebar">
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 light:bg-gray-800 light:border-gray-700">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start">
              <Link to="/super" className="flex ml-2 md:mr-24 w-[10rem] h-[35px]">
                <img src={Logo} alt="" />
              </Link>
            </div>
            <div className="w-full flex justify-between">
              <div className="flex items-start flex-col">
                <h3 className="text-xl font-semibold mb-1">
                  {t('hello')} {data?.login}
                </h3>
                <p className="text-sm text-lybas-gray">{t('welcomeDashboard')}</p>
              </div>
              <div className="flex items-center">
                <div className="buttons_alert_message">
                  <button
                    onClick={() => (navigate('/super/notification'), setActive('notification'))}
                    className={'alert border rounded-lg p-2 relative ' + (active === 'notification' && 'bg-lybas-light-blue')}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M7.05033 3.05025C8.36309 1.7375 10.1436 1 12.0001 1C13.8566 1 15.6371 1.7375 16.9498 3.05025C18.2626 4.36301 19.0001 6.14349 19.0001 8C19.0001 11.3527 19.7171 13.4346 20.378 14.6461C20.7098 15.2544 21.0329 15.6535 21.2573 15.8904C21.3698 16.0091 21.4581 16.0878 21.5114 16.1322C21.538 16.1544 21.5558 16.168 21.5635 16.1737C21.5647 16.1746 21.5657 16.1753 21.5664 16.1758C21.9249 16.4221 22.0835 16.8725 21.9572 17.2898C21.8295 17.7115 21.4407 18 21.0001 18H3.00008C2.55941 18 2.17068 17.7115 2.04299 17.2898C1.91664 16.8725 2.07528 16.4221 2.43377 16.1758C2.43447 16.1753 2.43542 16.1746 2.43663 16.1737C2.44432 16.168 2.46218 16.1544 2.4888 16.1322C2.54202 16.0878 2.6304 16.0091 2.74288 15.8904C2.9673 15.6535 3.29039 15.2544 3.62218 14.6461C4.28301 13.4346 5.00008 11.3527 5.00008 8C5.00008 6.14348 5.73758 4.36301 7.05033 3.05025ZM2.44388 16.169C2.44395 16.1689 2.44403 16.1688 2.44411 16.1688C2.44411 16.1688 2.4441 16.1688 2.4441 16.1688L2.44388 16.169ZM5.1494 16H18.8508C18.7747 15.8753 18.6983 15.7434 18.6222 15.6039C17.783 14.0654 17.0001 11.6473 17.0001 8C17.0001 6.67392 16.4733 5.40215 15.5356 4.46447C14.5979 3.52678 13.3262 3 12.0001 3C10.674 3 9.40223 3.52678 8.46454 4.46447C7.52686 5.40215 7.00008 6.67392 7.00008 8C7.00008 11.6473 6.21715 14.0654 5.37797 15.6039C5.30188 15.7434 5.22549 15.8753 5.1494 16Z"
                        fill="#64748B"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M9.76841 20.135C10.2461 19.8579 10.8581 20.0205 11.1352 20.4982C11.2231 20.6498 11.3493 20.7756 11.5011 20.863C11.6529 20.9504 11.825 20.9965 12.0002 20.9965C12.1754 20.9965 12.3475 20.9504 12.4993 20.863C12.6511 20.7756 12.7773 20.6498 12.8652 20.4982C13.1423 20.0205 13.7542 19.8579 14.232 20.135C14.7097 20.4121 14.8723 21.024 14.5952 21.5018C14.3315 21.9564 13.9529 22.3337 13.4975 22.5961C13.0421 22.8584 12.5258 22.9965 12.0002 22.9965C11.4746 22.9965 10.9583 22.8584 10.5028 22.5961C10.0474 22.3337 9.6689 21.9564 9.40518 21.5018C9.12806 21.024 9.29069 20.4121 9.76841 20.135Z"
                        fill="#64748B"
                      />
                    </svg>
                    {/* <span className='alert_red absolute w-3 h-3 bg-red-500 top-1 right-2 rounded-full border-2 border-white'></span> */}
                  </button>
                  <button
                    onClick={() => (navigate('/super/emails'), setActive('emails'))}
                    className={
                      'message border rounded-lg p-2 relative mx-4 hover:bg-gray-100 ' + (active === 'emails' && 'bg-lybas-light-blue')
                    }
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M4 5C3.45228 5 3 5.45228 3 6V18C3 18.5477 3.45228 19 4 19H20C20.5477 19 21 18.5477 21 18V6C21 5.45228 20.5477 5 20 5H4ZM1 6C1 4.34772 2.34772 3 4 3H20C21.6523 3 23 4.34772 23 6V18C23 19.6523 21.6523 21 20 21H4C2.34772 21 1 19.6523 1 18V6Z"
                        fill="#64748B"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M1.18085 5.42654C1.49757 4.97409 2.1211 4.86406 2.57355 5.18077L12.0001 11.7793L21.4266 5.18077C21.8791 4.86406 22.5026 4.97409 22.8193 5.42654C23.136 5.87899 23.026 6.50252 22.5735 6.81923L12.5735 13.8192C12.2292 14.0603 11.7709 14.0603 11.4266 13.8192L1.42662 6.81923C0.974174 6.50252 0.864139 5.87899 1.18085 5.42654Z"
                        fill="#64748B"
                      />
                    </svg>
                    {notReadCount > 0 && (
                      <span className="message_number h-6 w-6 flex items-center justify-center absolute top-[-10px] right-[-10px] text-white bg-lybas-blue rounded-full text-[12px]">
                        {notReadCount}
                      </span>
                    )}
                  </button>
                </div>
                <div className="language">
                  <Dropdown />
                </div>
                <div className="flex items-center">
                  <div className="flex items-center ml-3">
                    <div>
                      <button
                        onClick={() => (navigate('/super/profile'), setActive('profile'))}
                        type="button"
                        className="flex text-sm border border-gray-500 rounded-full focus:ring-4 focus:ring-gray-300 light:focus:ring-gray-600"
                        aria-expanded="false"
                        data-dropdown-toggle="dropdown-user"
                      >
                        <span className="sr-only">Open user menu</span>
                        <img className="w-8 h-8 rounded-full" src={data?.image ? api + data?.image : image} alt="user photo" />
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
            <li className="sidebar_link" onClick={() => setActive('/')}>
              <Link
                to={'/super'}
                className={
                  'flex items-center p-2 pl-4 text-gray-900 rounded-lg light:text-white hover:bg-gray-100 light:hover:bg-gray-700 group ' +
                  (active === '/' ? 'active' : '')
                }
              >
                <svg
                  className="flex-shrink-0 w-5 h-5 fill-gray-500 transition duration-75 light:fill-gray-400 group-hover:fill-gray-900 light:group-hover:fill-white"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8.53955 0.907986C8.81038 0.697338 9.18962 0.697338 9.46045 0.907986L16.2105 6.15799C16.3931 6.30008 16.5 6.51856 16.5 6.75V15C16.5 15.5967 16.2629 16.169 15.841 16.591C15.419 17.0129 14.8467 17.25 14.25 17.25H3.75C3.15326 17.25 2.58097 17.0129 2.15901 16.591C1.73705 16.169 1.5 15.5967 1.5 15V6.75C1.5 6.51856 1.60685 6.30008 1.78954 6.15799L8.53955 0.907986ZM3 7.11681V15C3 15.1989 3.07902 15.3897 3.21967 15.5303C3.36032 15.671 3.55109 15.75 3.75 15.75H14.25C14.4489 15.75 14.6397 15.671 14.7803 15.5303C14.921 15.3897 15 15.1989 15 15V7.11681L9 2.45015L3 7.11681Z"
                  />
                  <path
                    className="group-hover:fill-red"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M6 9C6 8.58579 6.33579 8.25 6.75 8.25H11.25C11.6642 8.25 12 8.58579 12 9V16.5C12 16.9142 11.6642 17.25 11.25 17.25C10.8358 17.25 10.5 16.9142 10.5 16.5V9.75H7.5V16.5C7.5 16.9142 7.16421 17.25 6.75 17.25C6.33579 17.25 6 16.9142 6 16.5V9Z"
                  />
                </svg>
                <span className="ml-3 text-lybas-gray group-hover:text-gray-900">{t('home')}</span>
              </Link>
            </li>
            <li className="sidebar_link" onClick={() => setActive('orders')}>
              <Link
                to={'/super/orders'}
                className={
                  'flex items-center p-2 pl-4 text-gray-900 rounded-lg light:text-white hover:bg-gray-100 light:hover:bg-gray-700 group ' +
                  (active === 'orders' ? 'active' : '')
                }
              >
                <svg
                  className="flex-shrink-0 w-5 h-5 fill-gray-500 transition duration-75 light:fill-gray-400 group-hover:fill-gray-900 light:group-hover:fill-white"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M3.9 1.05C4.04164 0.861146 4.26393 0.75 4.5 0.75H13.5C13.7361 0.75 13.9584 0.861146 14.1 1.05L16.35 4.05C16.4474 4.17982 16.5 4.33772 16.5 4.5V15C16.5 15.5967 16.2629 16.169 15.841 16.591C15.419 17.0129 14.8467 17.25 14.25 17.25H3.75C3.15326 17.25 2.58097 17.0129 2.15901 16.591C1.73705 16.169 1.5 15.5967 1.5 15V4.5C1.5 4.33772 1.55263 4.17982 1.65 4.05L3.9 1.05ZM4.875 2.25L3 4.75V15C3 15.1989 3.07902 15.3897 3.21967 15.5303C3.36032 15.671 3.55109 15.75 3.75 15.75H14.25C14.4489 15.75 14.6397 15.671 14.7803 15.5303C14.921 15.3897 15 15.1989 15 15V4.75L13.125 2.25H4.875Z" />
                  <path d="M1.5 4.5C1.5 4.08579 1.83579 3.75 2.25 3.75H15.75C16.1642 3.75 16.5 4.08579 16.5 4.5C16.5 4.91421 16.1642 5.25 15.75 5.25H2.25C1.83579 5.25 1.5 4.91421 1.5 4.5Z" />
                  <path d="M6 6.75C6.41421 6.75 6.75 7.08579 6.75 7.5C6.75 8.09674 6.98705 8.66903 7.40901 9.09099C7.83097 9.51295 8.40326 9.75 9 9.75C9.59674 9.75 10.169 9.51295 10.591 9.09099C11.0129 8.66903 11.25 8.09674 11.25 7.5C11.25 7.08579 11.5858 6.75 12 6.75C12.4142 6.75 12.75 7.08579 12.75 7.5C12.75 8.49456 12.3549 9.44839 11.6517 10.1517C10.9484 10.8549 9.99456 11.25 9 11.25C8.00544 11.25 7.05161 10.8549 6.34835 10.1517C5.64509 9.44839 5.25 8.49456 5.25 7.5C5.25 7.08579 5.58579 6.75 6 6.75Z" />
                </svg>

                <span className="ml-3 text-lybas-gray group-hover:text-gray-900">{t('orders')}</span>
                {notReadOrderLocal > 0 && (
                  <div className="flex justify-end w-full text-lybas-blue">
                    <span className="w-6 h-6 rounded-full flex justify-center items-center bg-blue-100">{notReadOrderLocal}</span>
                  </div>
                )}
                {notReadOrderLocal < 1 && notReadOrder > 0 && (
                  <div className="flex justify-end w-full text-lybas-blue">
                    <span className="w-6 h-6 rounded-full flex justify-center items-center bg-blue-100">{notReadOrder}</span>
                  </div>
                )}
              </Link>
            </li>
            <li className="sidebar_link" onClick={() => setActive('dressmakers')}>
              <Link
                to={'/super/dressmakers'}
                className={
                  'flex items-center p-2 pl-4 text-gray-900 rounded-lg light:text-white hover:bg-gray-100 light:hover:bg-gray-700 group ' +
                  (active === 'dressmakers' ? 'active' : '')
                }
              >
                <svg
                  className="flex-shrink-0 w-5 h-5 fill-gray-500 transition duration-75 light:fill-gray-400 group-hover:fill-gray-900 light:group-hover:fill-white"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M3.9 1.05C4.04164 0.861146 4.26393 0.75 4.5 0.75H13.5C13.7361 0.75 13.9584 0.861146 14.1 1.05L16.35 4.05C16.4474 4.17982 16.5 4.33772 16.5 4.5V15C16.5 15.5967 16.2629 16.169 15.841 16.591C15.419 17.0129 14.8467 17.25 14.25 17.25H3.75C3.15326 17.25 2.58097 17.0129 2.15901 16.591C1.73705 16.169 1.5 15.5967 1.5 15V4.5C1.5 4.33772 1.55263 4.17982 1.65 4.05L3.9 1.05ZM4.875 2.25L3 4.75V15C3 15.1989 3.07902 15.3897 3.21967 15.5303C3.36032 15.671 3.55109 15.75 3.75 15.75H14.25C14.4489 15.75 14.6397 15.671 14.7803 15.5303C14.921 15.3897 15 15.1989 15 15V4.75L13.125 2.25H4.875Z" />
                  <path d="M1.5 4.5C1.5 4.08579 1.83579 3.75 2.25 3.75H15.75C16.1642 3.75 16.5 4.08579 16.5 4.5C16.5 4.91421 16.1642 5.25 15.75 5.25H2.25C1.83579 5.25 1.5 4.91421 1.5 4.5Z" />
                  <path d="M6 6.75C6.41421 6.75 6.75 7.08579 6.75 7.5C6.75 8.09674 6.98705 8.66903 7.40901 9.09099C7.83097 9.51295 8.40326 9.75 9 9.75C9.59674 9.75 10.169 9.51295 10.591 9.09099C11.0129 8.66903 11.25 8.09674 11.25 7.5C11.25 7.08579 11.5858 6.75 12 6.75C12.4142 6.75 12.75 7.08579 12.75 7.5C12.75 8.49456 12.3549 9.44839 11.6517 10.1517C10.9484 10.8549 9.99456 11.25 9 11.25C8.00544 11.25 7.05161 10.8549 6.34835 10.1517C5.64509 9.44839 5.25 8.49456 5.25 7.5C5.25 7.08579 5.58579 6.75 6 6.75Z" />
                </svg>

                <span className="ml-3 text-lybas-gray group-hover:text-gray-900">{t('dressmakers')}</span>
              </Link>
            </li>
            <li className="sidebar_link" onClick={() => setActive('dresses')}>
              <Link
                to={'/super/dresses'}
                className={
                  'flex items-center p-2 pl-4 text-gray-900 rounded-lg light:text-white hover:bg-gray-100 light:hover:bg-gray-700 group ' +
                  (active === 'dresses' ? 'active' : '')
                }
              >
                <svg
                  className="flex-shrink-0 w-5 h-5 fill-gray-500 transition duration-75 light:fill-gray-400 group-hover:fill-gray-900 light:group-hover:fill-white"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M7.87661 1.05206C8.21826 0.85518 8.60566 0.751541 9 0.751541C9.39435 0.751541 9.78177 0.855188 10.1234 1.05208C10.124 1.05238 10.1245 1.05268 10.125 1.05298L15.375 4.05298C15.7167 4.25027 16.0005 4.53394 16.198 4.87554C16.3954 5.21715 16.4996 5.60467 16.5 5.99923V12.0008C16.4996 12.3953 16.3954 12.7829 16.198 13.1245C16.0005 13.4661 15.7167 13.7497 15.375 13.947L15.3721 13.9487L10.125 16.947C10.1245 16.9473 10.1241 16.9475 10.1237 16.9478C9.78194 17.1448 9.39444 17.2485 9 17.2485C8.60558 17.2485 8.21809 17.1448 7.87639 16.9478C7.87593 16.9476 7.87546 16.9473 7.875 16.947L2.6279 13.9487L2.625 13.947C2.2833 13.7497 1.99948 13.4661 1.80202 13.1245C1.60456 12.7829 1.5004 12.3953 1.5 12.0008V5.99923C1.5004 5.60467 1.60456 5.21714 1.80202 4.87554C1.99948 4.53394 2.2833 4.25027 2.625 4.05298L2.62789 4.05131L7.87661 1.05206ZM9 2.25154C8.86835 2.25154 8.73901 2.2862 8.625 2.35202L8.62211 2.35369L3.375 5.35202C3.37461 5.35225 3.37421 5.35248 3.37382 5.35271C3.26044 5.41844 3.16626 5.51273 3.10067 5.62621C3.03491 5.73998 3.00019 5.86904 3 6.00045V11.9996C3.00019 12.131 3.03491 12.26 3.10067 12.3738C3.16626 12.4873 3.26044 12.5816 3.37382 12.6473C3.37421 12.6475 3.37461 12.6478 3.375 12.648L8.625 15.648C8.73901 15.7138 8.86835 15.7485 9 15.7485C9.13165 15.7485 9.26098 15.7138 9.375 15.648L9.3779 15.6463L14.625 12.648C14.6254 12.6478 14.6258 12.6475 14.6262 12.6473C14.7396 12.5816 14.8337 12.4873 14.8993 12.3738C14.9651 12.2599 14.9999 12.1308 15 11.9992V6.00077C14.9999 5.86925 14.9651 5.74008 14.8993 5.62621C14.8337 5.51274 14.7396 5.41844 14.6262 5.35271C14.6258 5.35248 14.6254 5.35225 14.625 5.35202L9.375 2.35203C9.26098 2.2862 9.13165 2.25154 9 2.25154Z" />
                  <path d="M1.80331 4.84446C2.01072 4.48591 2.46951 4.36339 2.82806 4.5708L9.00002 8.14106L15.172 4.5708C15.5305 4.36339 15.9893 4.48591 16.1967 4.84446C16.4041 5.20301 16.2816 5.6618 15.9231 5.86921L9.37556 9.65671C9.14323 9.7911 8.8568 9.7911 8.62447 9.65671L2.07697 5.86921C1.71843 5.6618 1.59591 5.20301 1.80331 4.84446Z" />
                  <path d="M9 8.25C9.41421 8.25 9.75 8.58579 9.75 9V16.56C9.75 16.9742 9.41421 17.31 9 17.31C8.58579 17.31 8.25 16.9742 8.25 16.56V9C8.25 8.58579 8.58579 8.25 9 8.25Z" />
                </svg>
                <span className="ml-3 text-lybas-gray group-hover:text-gray-900">{t('dresses')}</span>
              </Link>
            </li>
            <li className="sidebar_link" onClick={() => setActive('filter')}>
              <Link
                to={'/super/filter'}
                className={
                  'flex items-center p-2 pl-4 text-gray-900 rounded-lg light:text-white hover:bg-gray-100 light:hover:bg-gray-700 group ' +
                  (active === 'filter' ? 'active' : '')
                }
              >
                <svg
                  className="flex-shrink-0 w-5 h-5 fill-gray-500 transition duration-75 light:fill-gray-400 group-hover:fill-gray-900 light:group-hover:fill-white"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M1.5 2.25C1.5 1.83579 1.83579 1.5 2.25 1.5H7.5C7.91421 1.5 8.25 1.83579 8.25 2.25V7.5C8.25 7.91421 7.91421 8.25 7.5 8.25H2.25C1.83579 8.25 1.5 7.91421 1.5 7.5V2.25ZM3 3V6.75H6.75V3H3Z"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M9.75 2.25C9.75 1.83579 10.0858 1.5 10.5 1.5H15.75C16.1642 1.5 16.5 1.83579 16.5 2.25V7.5C16.5 7.91421 16.1642 8.25 15.75 8.25H10.5C10.0858 8.25 9.75 7.91421 9.75 7.5V2.25ZM11.25 3V6.75H15V3H11.25Z"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M9.75 10.5C9.75 10.0858 10.0858 9.75 10.5 9.75H15.75C16.1642 9.75 16.5 10.0858 16.5 10.5V15.75C16.5 16.1642 16.1642 16.5 15.75 16.5H10.5C10.0858 16.5 9.75 16.1642 9.75 15.75V10.5ZM11.25 11.25V15H15V11.25H11.25Z"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M1.5 10.5C1.5 10.0858 1.83579 9.75 2.25 9.75H7.5C7.91421 9.75 8.25 10.0858 8.25 10.5V15.75C8.25 16.1642 7.91421 16.5 7.5 16.5H2.25C1.83579 16.5 1.5 16.1642 1.5 15.75V10.5ZM3 11.25V15H6.75V11.25H3Z"
                  />
                </svg>
                <span className="ml-3 text-lybas-gray group-hover:text-gray-900">{t('filter')}</span>
              </Link>
            </li>
            <li className="sidebar_link" onClick={() => setActive('banner')}>
              <Link
                to={'/super/banner'}
                className={
                  'flex items-center p-2 pl-4 text-gray-900 rounded-lg light:text-white hover:bg-gray-100 light:hover:bg-gray-700 group ' +
                  (active === 'banner' ? 'activeStroke' : '')
                }
              >
                <svg
                  className="flex-shrink-0 w-5 h-5 stroke-gray-500 transition duration-75 light:stroke-gray-400 group-hover:stroke-gray-900 light:group-hover:stroke-white"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.04688 5.46875C5.27987 5.46875 5.46875 5.27987 5.46875 5.04688C5.46875 4.81388 5.27987 4.625 5.04688 4.625C4.81388 4.625 4.625 4.81388 4.625 5.04688C4.625 5.27987 4.81388 5.46875 5.04688 5.46875Z"
                    strokeWidth="2"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14.75 8.75009L8.75009 14.75L1.25 7.24991V1.25H7.24991L14.75 8.75009Z"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="ml-3 text-lybas-gray group-hover:text-gray-900">{t('banner')}</span>
              </Link>
            </li>
            <li className="sidebar_link" onClick={() => setActive('comments')}>
              <Link
                to={'/super/comments'}
                className={
                  'flex items-center p-2 pl-4 text-gray-900 rounded-lg light:text-white hover:bg-gray-100 light:hover:bg-gray-700 group ' +
                  (active === 'comments' ? 'active' : '')
                }
              >
                <svg
                  className="flex-shrink-0 w-5 h-5 fill-gray-500 transition duration-75 light:fill-gray-400 group-hover:fill-gray-900 light:group-hover:fill-white"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M3.75 3C3.55109 3 3.36032 3.07902 3.21967 3.21967C3.07902 3.36032 3 3.55109 3 3.75V13.9393L4.71967 12.2197C4.86032 12.079 5.05109 12 5.25 12H14.25C14.4489 12 14.6397 11.921 14.7803 11.7803C14.921 11.6397 15 11.4489 15 11.25V3.75C15 3.55109 14.921 3.36032 14.7803 3.21967C14.6397 3.07902 14.4489 3 14.25 3H3.75ZM2.15901 2.15901C2.58097 1.73705 3.15326 1.5 3.75 1.5H14.25C14.8467 1.5 15.419 1.73705 15.841 2.15901C16.2629 2.58097 16.5 3.15326 16.5 3.75V11.25C16.5 11.8467 16.2629 12.419 15.841 12.841C15.419 13.2629 14.8467 13.5 14.25 13.5H5.56066L2.78033 16.2803C2.56583 16.4948 2.24324 16.559 1.96299 16.4429C1.68273 16.3268 1.5 16.0533 1.5 15.75V3.75C1.5 3.15326 1.73705 2.58097 2.15901 2.15901Z" />
                </svg>
                <span className="ml-3 text-lybas-gray group-hover:text-gray-900">{t('comments')}</span>
              </Link>
            </li>
            <hr />
            <li className="sidebar_link" onClick={() => setActive('blog')}>
              <Link
                to={'/super/blog'}
                className={
                  'flex items-center p-2 pl-4 text-gray-900 rounded-lg light:text-white hover:bg-gray-100 light:hover:bg-gray-700 group ' +
                  (active === 'blog' ? 'active' : '')
                }
              >
                <svg
                  className="flex-shrink-0 w-5 h-5 fill-gray-500 transition duration-75 light:fill-gray-400 group-hover:fill-gray-900 light:group-hover:fill-white"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M1.77778 16C1.28889 16 0.87037 15.8259 0.522222 15.4778C0.174074 15.1296 0 14.7111 0 14.2222V1.77778C0 1.28889 0.174074 0.87037 0.522222 0.522222C0.87037 0.174074 1.28889 0 1.77778 0H9.77778V1.77778H1.77778V14.2222H14.2222V6.22222H16V14.2222C16 14.7111 15.8259 15.1296 15.4778 15.4778C15.1296 15.8259 14.7111 16 14.2222 16H1.77778ZM4.44444 12.4444V10.6667H11.5556V12.4444H4.44444ZM4.44444 9.77778V8H11.5556V9.77778H4.44444ZM4.44444 7.11111V5.33333H11.5556V7.11111H4.44444ZM12.4444 5.33333V3.55556H10.6667V1.77778H12.4444V0H14.2222V1.77778H16V3.55556H14.2222V5.33333H12.4444Z" />
                </svg>
                <span className="ml-3 text-lybas-gray group-hover:text-gray-900">{t('blog')}</span>
              </Link>
            </li>
            <li className="sidebar_link" onClick={() => setOpen(true)}>
              <button
                className={
                  'flex w-full items-center p-2 pl-4 text-gray-900 rounded-lg light:text-white hover:bg-gray-100 light:hover:bg-gray-700 group ' +
                  (active === 'comments' ? 'active' : '')
                }
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M3.75 3C3.55109 3 3.36032 3.07902 3.21967 3.21967C3.07902 3.36032 3 3.55109 3 3.75V14.25C3 14.4489 3.07902 14.6397 3.21967 14.7803C3.36032 14.921 3.55109 15 3.75 15H6.75C7.16421 15 7.5 15.3358 7.5 15.75C7.5 16.1642 7.16421 16.5 6.75 16.5H3.75C3.15326 16.5 2.58097 16.2629 2.15901 15.841C1.73705 15.419 1.5 14.8467 1.5 14.25V3.75C1.5 3.15326 1.73705 2.58097 2.15901 2.15901C2.58097 1.73705 3.15326 1.5 3.75 1.5H6.75C7.16421 1.5 7.5 1.83579 7.5 2.25C7.5 2.66421 7.16421 3 6.75 3H3.75Z"
                    fill="#64748B"
                  />
                  <path d="M12 12.75L15.75 9L12 5.25" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M6 9C6 8.58579 6.33579 8.25 6.75 8.25H15.75C16.1642 8.25 16.5 8.58579 16.5 9C16.5 9.41421 16.1642 9.75 15.75 9.75H6.75C6.33579 9.75 6 9.41421 6 9Z"
                    fill="#64748B"
                  />
                </svg>
                <span className="ml-3 text-lybas-gray group-hover:text-gray-900">{t('logout')}</span>
              </button>
            </li>
          </ul>
        </div>
      </aside>

      <PopupLogout open={open} setOpen={setOpen} />

      <div className="p-4 sm:ml-64 bg-[#F4F7FF] h-screen">
        <div className="p-4 rounded-lg mt-14">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
