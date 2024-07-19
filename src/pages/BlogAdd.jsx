import React, { useState } from 'react';
import Breadcrumb from '../components/Breadcrumb';
import { t } from 'i18next';
import CircularProgress from '@mui/material/CircularProgress';
import { api } from '../common/Config';
import axios from 'axios';
import { Valid } from '../common/Valid';
import { AxiosCustom } from '../common/AxiosInstance';
import { useDispatch } from 'react-redux';
import { fetchDataBlogs } from '../redux/features/Blogs';
import { useNavigate } from 'react-router-dom';

function BlogAdd() {
  const [data, setData] = useState({
    header_tm: '',
    header_en: '',
    header_ru: '',
    body_tm: '',
    body_en: '',
    body_ru: '',
    image: ''
  });
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function convertBytesToKBorMB(bytes) {
    const KB = 1024;
    const MB = 1024 * KB;

    if (bytes < KB) {
      return bytes + ' bytes';
    } else if (bytes < MB) {
      return (bytes / KB).toFixed(2) + ' KB';
    } else {
      return (bytes / MB).toFixed(2) + ' MB';
    }
  }
  const handleUploadImage = (event) => {
    const formData = new FormData();
    formData.append('file', event.target.files[0]);
    setFile({
      url: URL.createObjectURL(event.target.files[0]),
      name: event.target.files[0].name,
      size: convertBytesToKBorMB(event.target.files[0].size)
    });
    axios
      .post(api + 'chief/blogs/upload-image', formData, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded / progressEvent.total) * 99);
          setProgress(progress);
        }
      })
      .then((response) => {
        setData({ ...data, image: response.data });
        setProgress(100);
      })
      .catch((error) => {
        alert('Error uploading file:', error);
        setFile({});
      });
  };

  const handleInput = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setData({ ...data, [name]: value });
  };

  const sendData = async () => {
    setLoading(true);
    try {
      if (Valid(data)) {
        const res = await AxiosCustom('/blogs/add', { method: 'POST', data });
        if (res.status === 201) {
          await dispatch(fetchDataBlogs());
          setLoading(false);
          navigate('/super/blog');
        }
      } else {
        alert(t('fillTheGaps'));
        setLoading(false);
      }
    } catch (error) {
      alert(error);
      setLoading(false);
    }
  };
  const deleteImage = () => {
    axios
      .post(api + 'chief/blogs/delete-image/' + data.image)
      .then((response) => {
        setFile(null);
      })
      .catch((error) => {
        alert('Error', error);
      });
  };
  return (
    <div className="dress-add">
      <Breadcrumb page={'banner'} pageLink={'/banner'} name={t('addBanner')} />

      <div className="dress-add_content flex justify-between mt-5">
        <div className="dress-add_content_left w-3/5 h-[70vh] overflow-auto rounded-lg border bg-white mr-5">
          <div className="name px-5 py-4 font-bold border-b">{t('aboutTheBanner')}</div>
          <div className="inputs grid grid-cols-2 gap-5 p-5">
            <div className="dress-input">
              <label className="label font-semibold block mb-2.5" htmlFor="name">
                {t('nameSimple')} tm
              </label>
              <input
                value={data.header_tm}
                name="header_tm"
                onChange={handleInput}
                type="text"
                className="w-full text-lybas-gray bg-gray-100 rounded-lg outline-none px-5 py-2.5"
                placeholder={t('nameSimple') + ' tm'}
                id="name"
              />
            </div>
            <div className="dress-input">
              <label className="label font-semibold block mb-2.5" htmlFor="name">
                {t('nameSimple')} en
              </label>
              <input
                value={data.header_en}
                name="header_en"
                onChange={handleInput}
                type="text"
                className="w-full text-lybas-gray bg-gray-100 rounded-lg outline-none px-5 py-2.5"
                placeholder={t('nameSimple') + ' en'}
                id="name"
              />
            </div>
            <div className="dress-input">
              <label className="label font-semibold block mb-2.5" htmlFor="name">
                {t('nameSimple')} ru
              </label>
              <input
                value={data.header_ru}
                name="header_ru"
                onChange={handleInput}
                type="text"
                className="w-full text-lybas-gray bg-gray-100 rounded-lg outline-none px-5 py-2.5"
                placeholder={t('nameSimple') + ' ru'}
                id="name"
              />
            </div>
            <div className="dress-input col-span-2">
              <label className="label font-semibold block mb-2.5" htmlFor="text-tm">
                {t('textTm')}
              </label>
              <textarea
                value={data.body_tm}
                name="body_tm"
                onChange={handleInput}
                className="w-full h-40 resize-none text-lybas-gray bg-gray-100 rounded-lg outline-none px-5 py-2.5"
                placeholder={t('textTm')}
                id="text-tm"
              />
            </div>
            <div className="dress-input col-span-2">
              <label className="label font-semibold block mb-2.5" htmlFor="text-ru">
                {t('textRu')}
              </label>
              <textarea
                value={data.body_en}
                name="body_en"
                onChange={handleInput}
                className="w-full h-40 resize-none text-lybas-gray bg-gray-100 rounded-lg outline-none px-5 py-2.5"
                placeholder={t('textRu')}
                id="text-ru"
              />
            </div>
            <div className="dress-input col-span-2">
              <label className="label font-semibold block mb-2.5" htmlFor="text-en">
                {t('textEn')}
              </label>
              <textarea
                value={data.body_ru}
                name="body_ru"
                onChange={handleInput}
                className="w-full h-40 resize-none text-lybas-gray bg-gray-100 rounded-lg outline-none px-5 py-2.5"
                placeholder={t('textEn')}
                id="text-en"
              />
            </div>
          </div>
        </div>
        <div className="right-container w-2/5 h-[70vh]">
          <div className="dress-add_content_right w-full overflow-auto rounded-lg border bg-white">
            <div className="name px-5 py-4 font-bold border-b">{t('uploadImage')}</div>
            <div className="inputs p-5">
              {file?.url ? (
                <div className="uploading-image_progressbar mb-3">
                  <div className="uploading-image mt-5 flex justify-between items-center">
                    <div className="left w-full flex flex-wrap items-center justify-between">
                      <div className="image w-full rounded-lg overflow-hidden">
                        <img className="max-h-[225px] w-full object-cover" src={file?.url} alt="" />
                      </div>
                      <div className="info flex flex-col justify-center">
                        <div className="name">{file?.name}</div>
                        <div className="size text-lybas-gray">
                          {file?.size} / {progress < 100 ? 'Loading' : <span className="text-green-400">Done</span>}
                        </div>
                      </div>
                      <button onClick={deleteImage}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M5.33317 15.8337L4.1665 14.667L8.83317 10.0003L4.1665 5.33366L5.33317 4.16699L9.99984 8.83366L14.6665 4.16699L15.8332 5.33366L11.1665 10.0003L15.8332 14.667L14.6665 15.8337L9.99984 11.167L5.33317 15.8337Z"
                            fill="#0B1527"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="progressbar bg-gray-200 w-full h-2 rounded-lg mt-3">
                    <div className={'progressbar_thumb bg-blue-700 h-full rounded-lg'} style={{ width: `${progress}%` }}></div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center w-full mt-3">
                  <label
                    htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center w-full  border-2 border-lybas-blue border-dashed rounded-lg cursor-pointer bg-gray-50"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="mb-3" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M11 16V7.85L8.4 10.45L7 9L12 4L17 9L15.6 10.45L13 7.85V16H11ZM6 20C5.45 20 4.97917 19.8042 4.5875 19.4125C4.19583 19.0208 4 18.55 4 18V15H6V18H18V15H20V18C20 18.55 19.8042 19.0208 19.4125 19.4125C19.0208 19.8042 18.55 20 18 20H6Z"
                          fill="#0E1217"
                        />
                      </svg>
                      <p className="mb-2 text-sm text-lybas-blue">{t('clickToUpload')}</p>
                      <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                    </div>
                    <input id="dropzone-file" onChange={handleUploadImage} type="file" className="hidden" />
                  </label>
                </div>
              )}
            </div>
          </div>
          <div className="actions flex mt-10">
            <button onClick={() => navigate('/super/blog')} className="bg-white border mr-5 w-full py-2 rounded hover:bg-gray-100">
              {t('cancel')}
            </button>
            <button
              disabled={loading}
              onClick={sendData}
              className={
                'text-white border flex items-center justify-center w-full py-2 rounded ' +
                (loading ? 'bg-gray-500 opacity-60' : 'bg-lybas-blue hover:bg-blue-800')
              }
            >
              <span className="mr-3">{t('save')}</span>
              {loading && <CircularProgress size={20} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogAdd;
