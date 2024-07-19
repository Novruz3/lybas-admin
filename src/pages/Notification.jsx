import React, { useEffect, useState } from 'react';
import Search from '../components/Search';
import { t } from 'i18next';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDataNotification, setOffset, setLimit, setFilter, setSearch } from '../redux/features/Notification';
import { AxiosCustom } from '../common/AxiosInstance';
import { useNavigate } from 'react-router-dom';
const columns = [
  {
    id: 'nameSimple',
    label: 'nameSimple',
    minWidth: 170,
    align: 'left'
  },
  {
    id: 'email',
    label: 'email',
    minWidth: 170,
    align: 'left'
  },
  {
    id: 'dateTime',
    label: 'dateTime',
    minWidth: 170,
    align: 'left'
  },
  {
    id: '',
    label: '',
    minWidth: 100,
    align: 'left'
  },
  {
    id: '',
    label: '',
    minWidth: 100,
    align: 'left'
  },
  {
    action: 'action',
    label: 'action',
    minWidth: 50,
    align: 'right'
  }
];

function Notification() {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const data = useSelector((state) => state?.Notification?.data);
  const offset = useSelector((state) => state?.Notification?.offset);
  const limit = useSelector((state) => state?.Notification?.limit);
  const count = useSelector((state) => state?.Notification?.count);
  const [deleteId, setDeleteId] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChangePage = async (event, newPage) => {
    await dispatch(setOffset(newPage * limit));
    await dispatch(fetchDataNotification());
  };

  const handleChangeRowsPerPage = async (event) => {
    await dispatch(setLimit(event.target.value));
    await dispatch(fetchDataNotification());
  };

  useEffect(() => {
    if (!data.length) dispatch(fetchDataNotification());
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const deleteData = async () => {
    try {
      const res = await AxiosCustom('/notifications/delete/' + deleteId, { method: 'POST' });
      if (res.status === 200) {
        handleClose();
        dispatch(fetchDataNotification());
      }
    } catch (error) {
      alert(error);
    }
  };

  const setFilterData = async (filter) => {
    await dispatch(setFilter(filter));
    await dispatch(fetchDataNotification());
  };

  const setSearchData = async (search) => {
    await dispatch(setSearch(search));
    await dispatch(fetchDataNotification());
  };

  return (
    <div className="notification">
      <Search
        title="notification"
        className="mt-5"
        action={{ link: '/notification/add', text: 'addNotification' }}
        setDate={setFilterData}
        setSearch={setSearchData}
      />
      <div className="notification_table mt-5 shadow-lybas-1 rounded-lg overflow-hidden">
        <div className="relative overflow-x-auto">
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns.map((column, index) => (
                      <TableCell key={index} align={column.align} style={{ minWidth: column.minWidth }}>
                        <span className="font-bold">{t(column.label)}</span>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.length > 0 &&
                    data.map((notif, index) => (
                      <TableRow key={index} hover role="checkbox" tabIndex={-1}>
                        <TableCell align={'left'}>
                          <div className={'table-with-grid_tr_data col-span-3 flex items-center'}>
                            <div className="name font-semibold">{notif?.name}</div>
                          </div>
                        </TableCell>
                        <TableCell align={'left'}>
                          <div className="banner_name">
                            <div className="name font-semibold">{notif?.count}</div>
                          </div>
                        </TableCell>
                        <TableCell align={'left'}>
                          {notif.createdAt.split('T')[0]} / {notif.createdAt.split('T')[1].split('.')[0]}
                        </TableCell>
                        <TableCell align={'left'}></TableCell>
                        <TableCell align={'left'}></TableCell>
                        <TableCell align={'right'}>
                          <div className="flex justify-end items-end">
                            <button onClick={() => navigate('/super/notification/' + notif.id)} className="mr-5">
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                  d="M19.3 8.925L15.05 4.725L16.45 3.325C16.8333 2.94167 17.3042 2.75 17.8625 2.75C18.4208 2.75 18.8917 2.94167 19.275 3.325L20.675 4.725C21.0583 5.10833 21.2583 5.57083 21.275 6.1125C21.2917 6.65417 21.1083 7.11667 20.725 7.5L19.3 8.925ZM17.85 10.4L7.25 21H3V16.75L13.6 6.15L17.85 10.4Z"
                                  fill="#1A54EB"
                                />
                              </svg>
                            </button>
                            <button onClick={() => (setOpen(true), setDeleteId(notif.id))} className="mr-3">
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                  d="M7 21C6.45 21 5.97917 20.8042 5.5875 20.4125C5.19583 20.0208 5 19.55 5 19V6H4V4H9V3H15V4H20V6H19V19C19 19.55 18.8042 20.0208 18.4125 20.4125C18.0208 20.8042 17.55 21 17 21H7ZM9 17H11V8H9V17ZM13 17H15V8H13V17Z"
                                  fill="#FF3521"
                                />
                              </svg>
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 100]}
              component="div"
              count={count}
              rowsPerPage={limit}
              page={offset / limit}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </div>
        <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogTitle id="alert-dialog-title">{t('doYouWantToDelete')}</DialogTitle>
          <DialogActions>
            <Button onClick={handleClose}>{t('cancel')}</Button>
            <Button onClick={() => (handleClose, deleteData())} autoFocus sx={{ color: 'red' }}>
              {t('ok')}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

export default Notification;
