import React, { useContext, useEffect, useState } from 'react';
import Breadcrumb from '../components/Breadcrumb';
import { t } from 'i18next';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { VisibilityOff } from '@mui/icons-material';
import Person2Icon from '@mui/icons-material/Person2';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDataCategories } from '../redux/features/Categories';
import { CircularProgress } from '@mui/material';
import { Select, MenuItem, FormControl, Chip, Box } from '@mui/material';
import { AxiosCustom } from '../common/AxiosInstance';
import { fetchDataDressmakers } from '../redux/features/Dressmakers';
import { useNavigate } from 'react-router-dom';
import { Valid } from '../common/Valid';
import { AppContext } from '../App';

const velayats = ['ashgabat', 'ahal', 'balkan', 'mary', 'dashoguz'];

function DressmakersAdd() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const category = useSelector((state) => state?.Categories?.data);
  const [openPassword, setOpenPassword] = useState(false);
  const [file, setFile] = useState(null);
  const [sendImage, setSendImage] = useState('');
  const [data, setData] = useState({
    categoryIds: [],
    phone_number: '+9936',
    password: '',
    name: '',
    email: '',
    welayat: 'ashgabat'
  });

  useEffect(() => {
    if (!category.length) dispatch(fetchDataCategories());
  }, []);

  const { lang } = useContext(AppContext);

  const handleCategory = (e) => {
    setData({ ...data, categoryIds: e.target.value });
  };
  const handleVelayat = (e) => {
    setData({ ...data, welayat: e.target.value });
  };
  const handleInput = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleUploadImage = (event) => {
    const file = event.target.files[0];
    setFile({ url: URL.createObjectURL(file) });
    setSendImage(file);
  };

  const sendData = async (e) => {
    e.preventDefault();
    console.log(data);
    setLoading(true);
    if (Valid(data)) {
      const pattern = /^\+9936\d{7}$/;
      if (pattern.test(data.phone_number)) {
        try {
          if (sendImage) {
            const formData = new FormData();
            formData.append('image', sendImage);
            const resImage = await AxiosCustom(`/seller/upload-image`, { method: 'POST', data: formData }, true);
            await AxiosCustom('/seller/add', { method: 'POST', data: { ...data, image: resImage.data } });
          } else {
            await AxiosCustom('/seller/add', { method: 'POST', data: { ...data } });
          }
          setLoading(false);
          await dispatch(fetchDataDressmakers());
          navigate('/super/dressmakers');
          setLoading(false);
        } catch (error) {
          alert(error);
          setLoading(false);
        }
      } else {
        setLoading(false);
        alert(t('phoneNumberError'));
      }
    } else {
      setLoading(false);
      alert(t('fillTheGaps'));
    }
  };

  const getLabelForValue = (id) => {
    const selectedOption = category.find((option) => option.id === id);
    return selectedOption ? selectedOption['name_' + lang] : '';
  };

  return (
    <div className="dress-add">
      <Breadcrumb page={'dressmakers'} pageLink={'/dressmakers'} name={t('newDressmakerAdd')} />
      <form onSubmit={sendData}>
        <div className="dress-add_content flex justify-between mt-5">
          <div className="dress-add_content_left w-3/5 h-[70vh] overflow-auto rounded-lg border bg-white mr-5">
            <div className="name px-5 py-4 font-bold border-b">{t('personalInformation')}</div>
            <div className="inputs grid grid-cols-2 gap-5 p-5">
              <div className="dress-input">
                <label className="label font-semibold block mb-2.5" htmlFor="bussinessName">
                  {t('bussinessName')}
                </label>
                <input
                  type="text"
                  className="w-full text-lybas-gray bg-gray-100 rounded-lg outline-none px-5 py-2.5"
                  placeholder={t('bussinessName')}
                  id="bussinessName"
                  name="name"
                  value={data.name}
                  onChange={handleInput}
                />
              </div>
              <div className="dress-input">
                <label className="label font-semibold block mb-2.5" htmlFor="phoneNumber">
                  {t('phoneNumber')}
                </label>
                <input
                  name="phone_number"
                  value={data.phone_number}
                  onChange={handleInput}
                  type="text"
                  className="w-full text-lybas-gray bg-gray-100 rounded-lg outline-none px-5 py-2.5"
                  placeholder={t('phoneNumber')}
                  id="phoneNumber"
                />
              </div>
              <div className="dress-input col-span-2">
                <label className="label font-semibold block mb-2.5" htmlFor="email">
                  {t('email')}
                </label>
                <input
                  name="email"
                  value={data.email}
                  onChange={handleInput}
                  type="text"
                  className="w-full text-lybas-gray bg-gray-100 rounded-lg outline-none px-5 py-2.5"
                  placeholder={t('email')}
                  id="login"
                />
              </div>
              <div className="dress-input col-span-2">
                <label className="label font-semibold block mb-2.5" htmlFor="password">
                  {t('password')}
                </label>
                <div className="text-lybas-gray flex items-center pr-5 bg-gray-100 rounded-lg">
                  <input
                    type={openPassword ? 'text' : 'password'}
                    name="password"
                    onChange={handleInput}
                    className="w-full bg-gray-100 rounded-lg outline-none px-5 py-2.5"
                    placeholder={t('password')}
                    id="password"
                  />
                  <div className="cursor-pointer" onClick={() => setOpenPassword(!openPassword)}>
                    {openPassword ? <VisibilityIcon /> : <VisibilityOff />}
                  </div>
                </div>
              </div>
              <div className="dress-input sizes col-span-2">
                <div className="label font-semibold block mb-2.5" htmlFor="category">
                  {t('category')}
                </div>
                <div className="size flex flex-wrap items-center">
                  <FormControl fullWidth>
                    <Select
                      labelId="multi-select-label"
                      id="multi-select"
                      multiple
                      value={data.categoryIds}
                      onChange={handleCategory}
                      renderValue={(selected) => (
                        <Box display="flex" flexWrap="wrap">
                          {selected.map((value) => (
                            <Chip key={value} label={getLabelForValue(value)} style={{ margin: 2 }} />
                          ))}
                        </Box>
                      )}
                    >
                      {category.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option['name_' + lang]}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </div>
              <div className="dress-input sizes col-span-2">
                <div className="label font-semibold block mb-2.5" htmlFor="category">
                  {t('province')}
                </div>
                <div className="size flex flex-wrap items-center">
                  <FormControl fullWidth>
                    <Select labelId="multi-select-label" id="multi-select" onChange={handleVelayat} value={data.welayat}>
                      {velayats.map((option, index) => (
                        <MenuItem key={index} value={option}>
                          {t(option)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </div>
            </div>
          </div>
          <div className="right-container w-2/5 h-[70vh]">
            <div className="dress-add_content_right w-full overflow-auto rounded-lg border bg-white">
              <div className="name px-5 py-4 font-bold border-b">{t('profileImage')}</div>
              <div className="inputs p-5">
                <div className="flex items-center">
                  <div className="image w-[55px] h-[55px] rounded-full flex justify-center items-center bg-gray-100 object-cover mr-3 overflow-hidden">
                    {file ? (
                      <img className="h-[100%] object-cover" src={file.url} alt="" />
                    ) : (
                      <Person2Icon sx={{ width: '90%', height: '90%' }} />
                    )}
                  </div>
                  <div className="titleAndAction flex flex-col justify-center">
                    <div className="title font-semibold mb-1">{t('uploadImage')}</div>
                    <div className="actions flex items-center">
                      <label htmlFor="upload-image" className="text-lybas-blue mr-2 cursor-pointer">
                        {t('upload')}
                      </label>
                      <input id="upload-image" onChange={handleUploadImage} type="file" className="hidden" />
                      <div className="text-lybas-gray cursor-pointer" onClick={() => (setSendImage(''), setFile(''))}>
                        {t('delete')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="actions flex mt-10">
              <button onClick={() => navigate('/super/dressmakers')} className="bg-white border mr-5 w-full py-2 rounded hover:bg-gray-100">
                {t('cancel')}
              </button>
              <button
                disabled={loading}
                type="submit"
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
      </form>
    </div>
  );
}

export default DressmakersAdd;
