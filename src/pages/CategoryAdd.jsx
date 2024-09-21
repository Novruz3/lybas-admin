import React, { useState } from 'react';
import Breadcrumb from '../components/Breadcrumb';
import { t } from 'i18next';
import { useNavigate } from 'react-router-dom';
import { Valid } from '../common/Valid';
import { AxiosCustom } from '../common/AxiosInstance';
import { useDispatch } from 'react-redux';
import { fetchCategories } from '../redux/features/Categories';

function CategoryAdd() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [data, setData] = useState({
    name_tm: '',
    name_ru: '',
    name_en: ''
  });
  const sendData = async () => {
    if (Valid(data)) {
      try {
        const res = await AxiosCustom('/back/categories', { method: 'POST', data });
        console.log(res);
        if (res.status) {
          dispatch(fetchCategories());
          navigate('/categories');
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      alert(t('fillTheGaps'));
    }
  };

  return (
    <div className="dress-add">
      <Breadcrumb page={'category'} pageLink={'categories'} name={t('addCategory')} />

      <div className="dress-add_content flex justify-between mt-5">
        <div className="dress-add_content_left w-full h-[70vh] overflow-auto rounded-lg border bg-white mr-5">
          <div className="name px-5 py-4 font-bold border-b">{t('aboutTheNotification')}</div>
          <div className="inputs grid grid-cols-2 gap-5 p-5">
            <div className="dress-input col-span-2">
              <label className="label font-semibold block mb-2.5" htmlFor="name">
                {`${t('nameSimple')}_tm`}
              </label>
              <input
                name="name_tm"
                value={data.name_tm}
                onChange={(e) => setData({ ...data, name_tm: e.target.value })}
                type="text"
                className="w-full text-lybas-gray bg-gray-100 rounded-lg outline-none px-5 py-2.5"
                placeholder={`${t('nameSimple')}_tm`}
              />
            </div>
            <div className="dress-input col-span-2">
              <label className="label font-semibold block mb-2.5" htmlFor="name">
                {`${t('nameSimple')}_ru`}
              </label>
              <input
                name="name_ru"
                value={data.name_ru}
                onChange={(e) => setData({ ...data, name_ru: e.target.value })}
                type="text"
                className="w-full text-lybas-gray bg-gray-100 rounded-lg outline-none px-5 py-2.5"
                placeholder={`${t('nameSimple')}_ru`}
              />
            </div>
            <div className="dress-input col-span-2">
              <label className="label font-semibold block mb-2.5" htmlFor="name">
                {`${t('nameSimple')}_en`}
              </label>
              <input
                name="name_en"
                value={data.name_en}
                onChange={(e) => setData({ ...data, name_en: e.target.value })}
                type="text"
                className="w-full text-lybas-gray bg-gray-100 rounded-lg outline-none px-5 py-2.5"
                placeholder={`${t('nameSimple')}_en`}
              />
            </div>
            <div className="actions col-span-2 flex mt-10">
              <button onClick={() => navigate('/categories')} className="bg-white border mr-5 px-20 py-2 rounded hover:bg-gray-100">
                {t('cancel')}
              </button>
              <button onClick={sendData} className="bg-lybas-blue text-white border px-20 py-2 rounded hover:bg-blue-800">
                {t('save')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryAdd;
