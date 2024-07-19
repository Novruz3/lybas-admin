import { t } from 'i18next';
import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import CircularProgress from '@mui/material/CircularProgress';
import { AxiosCustom } from '../common/AxiosInstance';
import { useDispatch } from 'react-redux';
import { fetchDataCategories } from '../redux/features/Categories';
import { fetchDataSizes } from '../redux/features/Sizes';
import { fetchDataColors } from '../redux/features/Colors';
import { fetchDataMaterials } from '../redux/features/Materials';

function OneFilter({ data, type, setOpenEdit, setEditId, index }) {
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const handleClose = () => {
    setLoading(false);
    setOpen(false);
  };
  const deleteData = async () => {
    setLoading(true);
    try {
      if (type === 'allCategories') {
        const res = await AxiosCustom('/categories/delete/' + data.id, { method: 'POST' });
        if (res.status === 200) {
          await dispatch(fetchDataCategories());
          handleClose();
        }
      } else if (type === 'size') {
        const res = await AxiosCustom('/sizes/delete/' + data.id, { method: 'POST' });
        if (res.status === 200) {
          await dispatch(fetchDataSizes());
          handleClose();
        }
      } else if (type === 'color') {
        const res = await AxiosCustom('/colors/delete/' + data.id, { method: 'POST' });
        if (res.status === 200) {
          await dispatch(fetchDataColors());
          handleClose();
        }
      } else if (type === 'fabric') {
        const res = await AxiosCustom('/materials/delete/' + data.id, { method: 'POST' });
        if (res.status === 200) {
          await dispatch(fetchDataMaterials());
          handleClose();
        }
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  return (
    <div className="data">
      <div className="data_label font-bold mb-2">
        {t('type')} {index + 1}
      </div>
      <div className="data_input rounded-lg bg-gray-100 flex items-center">
        {(type === 'allCategories' || type === 'fabric') && (
          <input
            type="text"
            className="outline-none w-full bg-gray-100 py-2.5 px-5 text-lybas-gray rounded-lg"
            disabled={disabled}
            placeholder={t('nameSimple')}
            value={data?.name_tm}
          />
        )}
        {type === 'size' && (
          <input
            type="text"
            className="outline-none w-full bg-gray-100 py-2.5 px-5 text-lybas-gray rounded-lg"
            disabled={disabled}
            placeholder={t('nameSimple')}
            value={data?.size}
          />
        )}
        {type === 'color' && (
          <>
            <div className="min-w-[32px] h-8 rounded shadow-lybas-1 ml-3" style={{ background: data?.hex }}></div>
            <input
              type="text"
              className="outline-none w-full bg-gray-100 py-2.5 pl-2 pr-5 text-lybas-gray rounded-lg"
              disabled={disabled}
              placeholder={t('nameSimple')}
              value={data?.hex}
            />
          </>
        )}
        <button className="mr-2" onClick={() => (setOpenEdit(true), setEditId(data))}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M19.3 8.925L15.05 4.725L16.45 3.325C16.8333 2.94167 17.3042 2.75 17.8625 2.75C18.4208 2.75 18.8917 2.94167 19.275 3.325L20.675 4.725C21.0583 5.10833 21.2583 5.57083 21.275 6.1125C21.2917 6.65417 21.1083 7.11667 20.725 7.5L19.3 8.925ZM17.85 10.4L7.25 21H3V16.75L13.6 6.15L17.85 10.4Z"
              fill="#1A54EB"
            />
          </svg>
        </button>
        <button onClick={() => setOpen(true)} className="mr-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M7 21C6.45 21 5.97917 20.8042 5.5875 20.4125C5.19583 20.0208 5 19.55 5 19V6H4V4H9V3H15V4H20V6H19V19C19 19.55 18.8042 20.0208 18.4125 20.4125C18.0208 20.8042 17.55 21 17 21H7ZM9 17H11V8H9V17ZM13 17H15V8H13V17Z"
              fill="#FF3521"
            />
          </svg>
        </button>
      </div>

      <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{t('doYouWantToDelete')}</DialogTitle>
        <DialogActions>
          <Button onClick={handleClose}>{t('cancel')}</Button>
          <Button onClick={deleteData} autoFocus sx={{ color: 'red' }}>
            {loading ? <CircularProgress size={20} /> : <span>{t('ok')}</span>}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default OneFilter;
