import React, { useEffect, useState } from 'react';
import Breadcrumb from '../components/Breadcrumb';
import { t } from 'i18next';
import { AxiosCustom } from '../common/AxiosInstance';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const loginAdmin = sessionStorage.getItem("admin")
  const [data, setData] = useState({
    login: loginAdmin,
    password: '',
  });
  const navigate = useNavigate();

  const handleInput = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const sendData = async () => {
    try {
      const res = await AxiosCustom('/admins/update', { method: 'POST', data });
      if(res.data.status){
        console.log(res)
        alert(t('save'));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="one-comment">
      <Breadcrumb page={'profile'} pageLink={'/profile'} name={loginAdmin} />

      <div className="one-comment_content flex mt-5">
        <div className="one-comment_content_left bg-white rounded-lg w-full mr-5">
          <div className="title py-3 px-5 font-semibold border-b">{t('personalInformation')}</div>

          <div className="inputs grid grid-cols-4 gap-5 p-5">
            <div className="data col-span-1">
              <div className="data_title font-semibold mb-2">{t('nameSimple')}</div>
              <input
                name="login"
                type='text'
                value={data.login}
                onChange={handleInput}
                className="data_title w-full outline-none text-lybas-gray bg-gray-200 rounded-lg py-2.5 px-5"
                placeholder={t('nameSimple')}
              />
            </div>
            <div className="data col-span-1">
              <div className="data_title font-semibold mb-2">{t('password')}</div>
              <input
                name="password"
                type='password'
                value={data.password}
                onChange={handleInput}
                className="data_title w-full outline-none text-lybas-gray bg-gray-200 rounded-lg py-2.5 px-5"
                placeholder={t('password')}
              />
            </div>
          </div>
          <div className="actions flex my-8 justify-end px-16">
            <button onClick={() => navigate('/')} className="bg-white border rounded-lg py-2 px-16 mr-5 hover:bg-gray-100">
              {t('cancel')}
            </button>
            <button onClick={sendData} className="bg-lybas-blue text-white rounded-lg px-16 py-2 hover:bg-blue-700">
              {t('update')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
