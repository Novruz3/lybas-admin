import React, { useState } from 'react';
import Breadcrumb from '../components/Breadcrumb';
import { t } from 'i18next';
import { useNavigate } from 'react-router-dom';
import { Valid } from '../common/Valid';
import { AxiosCustom } from '../common/AxiosInstance';
import { useDispatch } from 'react-redux';
import { fetchTextSlider } from '../redux/features/TextSlider';

function TextSliderAdd() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [data, setData] = useState({
    description_tm: '',
    description_ru: '',
    description_en: ''
  });
  const sendData = async () => {
    if (Valid(data)) {
      try {
        const res = await AxiosCustom('/back/text-slider', { method: 'POST', data });
        if (res.status) {
          dispatch(fetchTextSlider());
          navigate('/textSlider');
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
      <Breadcrumb page={'sliderText'} pageLink={'sliderText'} name={t('addSliderText')} />
      <div className="dress-add_content flex justify-between mt-5">
        <div className="dress-add_content_left w-full h-[70vh] overflow-auto rounded-lg border bg-white mr-5">
          <div className="name px-5 py-4 font-bold border-b">{t('aboutTheNotification')}</div>
          <div className="inputs grid grid-cols-2 gap-5 p-5">
            <div className="dress-input col-span-2">
              <label className="label font-semibold block mb-2.5" htmlFor="name">
                {`${t('description_tm')}_tm`}
              </label>
              <textarea
                name="description_tm"
                value={data.description_tm}
                onChange={(e) => setData({ ...data, description_tm: e.target.value })}
                type="text"
                className="w-full text-lybas-gray bg-gray-100 rounded-lg outline-none px-5 py-2.5"
                placeholder={`${t('description_tm')}_tm`}
              />
            </div>
            <div className="dress-input col-span-2">
              <label className="label font-semibold block mb-2.5" htmlFor="name">
                {`${t('description_ru')}_ru`}
              </label>
              <textarea
                name="description_ru"
                value={data.description_ru}
                onChange={(e) => setData({ ...data, description_ru: e.target.value })}
                type="text"
                className="w-full text-lybas-gray bg-gray-100 rounded-lg outline-none px-5 py-2.5"
                placeholder={`${t('description_ru')}_ru`}
              />
            </div>
            <div className="dress-input col-span-2">
              <label className="label font-semibold block mb-2.5" htmlFor="name">
                {`${t('description_en')}_en`}
              </label>
              <input
                name="description_en"
                value={data.description_en}
                onChange={(e) => setData({ ...data, description_en: e.target.value })}
                type="text"
                className="w-full text-lybas-gray bg-gray-100 rounded-lg outline-none px-5 py-2.5"
                placeholder={`${t('description_en')}_en`}
              />
            </div>
            <div className="actions col-span-2 flex mt-10">
              <button onClick={() => navigate('/textSlider')} className="bg-white border mr-5 px-20 py-2 rounded hover:bg-gray-100">
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

export default TextSliderAdd;
