import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';
import { t } from 'i18next';
import OneFilter from '../components/OneFilter';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import CircularProgress from '@mui/material/CircularProgress';
import { DialogContent } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDataCategories } from '../redux/features/Categories';
import { fetchDataSizes } from '../redux/features/Sizes';
import { fetchDataMaterials } from '../redux/features/Materials';
import { fetchDataColors } from '../redux/features/Colors';
import { Valid } from '../common/Valid';
import { AxiosCustom } from '../common/AxiosInstance';

function FilterEdit() {
  const { type } = useParams();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categoryData, setCategoryData] = useState({
    name_tm: '',
    name_en: '',
    name_ru: ''
  });
  const [sizeData, setSizeData] = useState({
    size: ''
  });

  const category = useSelector((state) => state?.Categories?.data);
  const size = useSelector((state) => state?.Sizes?.data);
  const material = useSelector((state) => state?.Materials?.data);
  const color = useSelector((state) => state?.Colors?.data);

  const setEditId = (data) => {
    if (type === 'fabric' || type === 'allCategories') {
      setCategoryData(data);
    } else if (type === 'size') {
      setSizeData(data);
    } else if (type === 'color') {
      setSizeData({ size: data.hex, id: data.id });
    }
  };

  const handleClose = () => {
    setOpen(false);
    setLoading(false);
    setCategoryData({
      name_tm: '',
      name_en: '',
      name_ru: ''
    });
    setSizeData({ size: '' });
  };

  const handleInput = (e) => {
    if (type === 'allCategories' || type === 'fabric') {
      setCategoryData({ ...categoryData, [e.target.name]: e.target.value });
    } else if (type === 'color' || type === 'size') {
      setSizeData({ ...sizeData, size: e.target.value });
    }
  };

  useEffect(() => {
    if (type === 'allCategories') {
      if (!category.length) dispatch(fetchDataCategories());
    } else if (type === 'size') {
      if (!size.length) dispatch(fetchDataSizes());
    } else if (type === 'fabric') {
      if (!material.length) dispatch(fetchDataMaterials());
    } else if (type === 'color') {
      if (!color.length) dispatch(fetchDataColors());
    }
  }, []);

  const sendData = async () => {
    if (type === 'allCategories') {
      if (Valid(categoryData)) {
        setLoading(true);
        try {
          if (categoryData.id) {
            const res = await AxiosCustom('/categories/' + categoryData.id, { method: 'PATCH', data: categoryData });
            if (res.status === 200) {
              await dispatch(fetchDataCategories());
              handleClose();
            }
          } else {
            const res = await AxiosCustom('/categories/add', { method: 'POST', data: categoryData });
            if (res.status === 201) {
              await dispatch(fetchDataCategories());
              handleClose();
            }
          }
        } catch (error) {
          console.log(error);
          setLoading(false);
        }
      } else {
        alert(t('fillTheGaps'));
        setLoading(false);
      }
    } else if (type === 'size') {
      if (Valid(sizeData)) {
        setLoading(true);
        try {
          if (sizeData.id) {
            const res = await AxiosCustom('/sizes/' + sizeData.id, { method: 'PATCH', data: sizeData });
            if (res.status === 200) {
              await dispatch(fetchDataSizes());
              setLoading(false);
              setOpen(false);
              handleClose();
            }
          } else {
            const res = await AxiosCustom('/sizes/add', { method: 'POST', data: sizeData });
            if (res.status === 201) {
              await dispatch(fetchDataSizes());
              handleClose();
            }
          }
        } catch (error) {
          console.log(error);
          setLoading(false);
        }
      } else {
        alert(t('fillTheGaps'));
        setLoading(false);
      }
    } else if (type === 'fabric') {
      if (Valid(categoryData)) {
        setLoading(true);
        try {
          if (categoryData.id) {
            const res = await AxiosCustom('/materials/' + categoryData.id, { method: 'PATCH', data: categoryData });
            if (res.status === 200) {
              await dispatch(fetchDataMaterials());
              handleClose();
            }
          } else {
            const res = await AxiosCustom('/materials/add', { method: 'POST', data: categoryData });
            if (res.status === 201) {
              await dispatch(fetchDataMaterials());
              handleClose();
            }
          }
        } catch (error) {
          console.log(error);
          setLoading(false);
        }
      } else {
        alert(t('fillTheGaps'));
        setLoading(false);
      }
    } else if (type === 'color') {
      if (Valid(sizeData)) {
        setLoading(true);
        try {
          if (sizeData.id) {
            const res = await AxiosCustom('/colors/' + sizeData.id, { method: 'PATCH', data: { hex: sizeData.size } });
            if (res.status === 200) {
              await dispatch(fetchDataColors());
              handleClose();
            }
          } else {
            const res = await AxiosCustom('/colors/add', { method: 'POST', data: { hex: sizeData.size } });
            if (res.status === 201) {
              await dispatch(fetchDataColors());
              handleClose();
            }
          }
        } catch (error) {
          console.log(error);
          setLoading(false);
        }
      } else {
        alert(t('fillTheGaps'));
        setLoading(false);
      }
    }
  };

  return (
    <div className="filter-edit">
      <Breadcrumb page={'filter'} pageLink={'/filter'} name={t(type)} />

      <div className="filter-edit_body bg-white rounded-lg border mt-5">
        <div className="filter-edit_body_title py-3 px-5 font-bold border-b">{t(type)}</div>
        <div className="filter-edit_body_datas grid grid-cols-3 gap-5 p-5">
          {type === 'allCategories' &&
            category.map((onedata, index) => (
              <OneFilter data={onedata} type={type} setOpenEdit={setOpen} setEditId={setEditId} index={index} key={index} />
            ))}
          {type === 'size' &&
            size.map((onedata, index) => (
              <OneFilter data={onedata} type={type} setOpenEdit={setOpen} setEditId={setEditId} index={index} key={index} />
            ))}
          {type === 'fabric' &&
            material.map((onedata, index) => (
              <OneFilter data={onedata} type={type} setOpenEdit={setOpen} setEditId={setEditId} index={index} key={index} />
            ))}
          {type === 'color' &&
            color.map((onedata, index) => (
              <OneFilter data={onedata} type={type} setOpenEdit={setOpen} setEditId={setEditId} index={index} key={index} />
            ))}
          <div className="flex items-end">
            <button onClick={() => setOpen(true)} className="bg-lybas-blue h-[44px] text-white py-2 px-20 rounded-lg">
              {t('add')}
            </button>
          </div>
        </div>
      </div>

      <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{t('addNewOne')}</DialogTitle>
        <DialogContent sx={{ width: '400px' }}>
          {(type === 'allCategories' || type === 'fabric') && (
            <>
              <div className="input-filter flex flex-col mb-2">
                <label className="mb-2 text-black cursor-pointer" htmlFor="tm">
                  Türkmençe
                </label>
                <input
                  className="w-full text-lybas-gray rounded-lg bg-gray-100 outline-none py-2 px-5"
                  type="text"
                  id="tm"
                  name="name_tm"
                  onChange={handleInput}
                  value={categoryData.name_tm}
                  placeholder="Türkmençe"
                />
              </div>
              <div className="input-filter flex flex-col mb-2">
                <label className="mb-2 text-black cursor-pointer" htmlFor="ru">
                  Русский
                </label>
                <input
                  className="w-full text-lybas-gray rounded-lg bg-gray-100 outline-none py-2 px-5"
                  type="text"
                  id="ru"
                  name="name_ru"
                  onChange={handleInput}
                  value={categoryData.name_ru}
                  placeholder="Русский"
                />
              </div>
              <div className="input-filter flex flex-col">
                <label className="mb-2 text-black cursor-pointer" htmlFor="en">
                  English
                </label>
                <input
                  className="w-full text-lybas-gray rounded-lg bg-gray-100 outline-none py-2 px-5"
                  type="text"
                  id="en"
                  name="name_en"
                  onChange={handleInput}
                  value={categoryData.name_en}
                  placeholder="English"
                />
              </div>
            </>
          )}
          {type === 'size' && (
            <div className="input-filter flex flex-col">
              <label className="mb-2 text-black cursor-pointer" htmlFor="en">
                {t('size')}
              </label>
              <input
                className="w-full text-lybas-gray rounded-lg bg-gray-100 outline-none py-2 px-5"
                type="text"
                id="en"
                name="size"
                onChange={handleInput}
                value={sizeData.size}
                placeholder={t('size')}
              />
            </div>
          )}
          {type === 'color' && (
            <div className="input-filter flex flex-col">
              <label className="mb-2 text-black cursor-pointer">{t('fabric')}</label>
              <input
                className="text-lybas-gray rounded-lg bg-gray-100 outline-none cursor-pointer"
                type="color"
                id="en"
                name="size"
                onChange={handleInput}
                value={sizeData.size}
                placeholder={t('color')}
              />
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{t('cancel')}</Button>
          <Button onClick={sendData} disabled={loading} autoFocus>
            {loading ? <CircularProgress size={20} /> : <span>{t('save')}</span>}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default FilterEdit;
