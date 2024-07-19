import { t } from 'i18next';
import React, { useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDataCategories, setOffset } from '../redux/features/Categories';
import { fetchDataSizes } from '../redux/features/Sizes';
import { fetchDataMaterials } from '../redux/features/Materials';
import { fetchDataColors } from '../redux/features/Colors';

const columns = [
  {
    id: 'filterName',
    label: 'filterName',
    minWidth: 170,
    maxWidth: 200,
    align: 'left'
  },
  {
    id: 'quantity',
    label: 'quantity',
    minWidth: 170,
    align: 'left'
  },
  {
    id: ' ',
    label: ' ',
    minWidth: 170,
    align: 'left'
  },
  {
    id: 'edit',
    label: 'edit',
    minWidth: 100,
    align: 'right'
  }
];

function Filter() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const category = useSelector((state) => state?.Categories?.count);
  const size = useSelector((state) => state?.Sizes?.count);
  const material = useSelector((state) => state?.Materials?.count);
  const color = useSelector((state) => state?.Colors?.count);

  useEffect(() => {
    if (!category) dispatch(fetchDataCategories());
    if (!size) dispatch(fetchDataSizes());
    if (!material) dispatch(fetchDataMaterials());
    if (!color) dispatch(fetchDataColors());
  }, []);

  return (
    <div className="filter">
      <div className="filter_header bg-white border rounded-lg py-3 px-5 mt-5 font-bold">{t('filter')}</div>
      <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: '20px', borderRadius: '10px' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column, index) => (
                  <TableCell key={index} align={column.align} style={{ minWidth: column.minWidth, maxWidth: column.maxWidth }}>
                    <span className="font-bold">{t(column.label)}</span>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow hover role="checkbox" tabIndex={-1}>
                <TableCell align={'left'} sx={{ fontWeight: 'bold' }}>
                  {t('allCategories')}
                </TableCell>
                <TableCell align={'left'}>{category}</TableCell>
                <TableCell align={'left'}></TableCell>
                <TableCell align={'right'}>
                  <button onClick={() => navigate('/super/filter/allCategories')}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M19.3 8.925L15.05 4.725L16.45 3.325C16.8333 2.94167 17.3042 2.75 17.8625 2.75C18.4208 2.75 18.8917 2.94167 19.275 3.325L20.675 4.725C21.0583 5.10833 21.2583 5.57083 21.275 6.1125C21.2917 6.65417 21.1083 7.11667 20.725 7.5L19.3 8.925ZM17.85 10.4L7.25 21H3V16.75L13.6 6.15L17.85 10.4Z"
                        fill="#1A54EB"
                      />
                    </svg>
                  </button>
                </TableCell>
              </TableRow>
              <TableRow hover role="checkbox" tabIndex={-1}>
                <TableCell align={'left'} sx={{ fontWeight: 'bold' }}>
                  {t('size')}
                </TableCell>
                <TableCell align={'left'}>{size}</TableCell>
                <TableCell align={'left'}></TableCell>
                <TableCell align={'right'}>
                  <button onClick={() => navigate('/super/filter/size')}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M19.3 8.925L15.05 4.725L16.45 3.325C16.8333 2.94167 17.3042 2.75 17.8625 2.75C18.4208 2.75 18.8917 2.94167 19.275 3.325L20.675 4.725C21.0583 5.10833 21.2583 5.57083 21.275 6.1125C21.2917 6.65417 21.1083 7.11667 20.725 7.5L19.3 8.925ZM17.85 10.4L7.25 21H3V16.75L13.6 6.15L17.85 10.4Z"
                        fill="#1A54EB"
                      />
                    </svg>
                  </button>
                </TableCell>
              </TableRow>
              <TableRow hover role="checkbox" tabIndex={-1}>
                <TableCell align={'left'} sx={{ fontWeight: 'bold' }}>
                  {t('fabric')}
                </TableCell>
                <TableCell align={'left'}>{material}</TableCell>
                <TableCell align={'left'}></TableCell>
                <TableCell align={'right'}>
                  <button onClick={() => navigate('/super/filter/fabric')}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M19.3 8.925L15.05 4.725L16.45 3.325C16.8333 2.94167 17.3042 2.75 17.8625 2.75C18.4208 2.75 18.8917 2.94167 19.275 3.325L20.675 4.725C21.0583 5.10833 21.2583 5.57083 21.275 6.1125C21.2917 6.65417 21.1083 7.11667 20.725 7.5L19.3 8.925ZM17.85 10.4L7.25 21H3V16.75L13.6 6.15L17.85 10.4Z"
                        fill="#1A54EB"
                      />
                    </svg>
                  </button>
                </TableCell>
              </TableRow>
              <TableRow hover role="checkbox" tabIndex={-1}>
                <TableCell align={'left'} sx={{ fontWeight: 'bold' }}>
                  {t('color')}
                </TableCell>
                <TableCell align={'left'}>{color}</TableCell>
                <TableCell align={'left'}></TableCell>
                <TableCell align={'right'}>
                  <button onClick={() => navigate('/super/filter/color')}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M19.3 8.925L15.05 4.725L16.45 3.325C16.8333 2.94167 17.3042 2.75 17.8625 2.75C18.4208 2.75 18.8917 2.94167 19.275 3.325L20.675 4.725C21.0583 5.10833 21.2583 5.57083 21.275 6.1125C21.2917 6.65417 21.1083 7.11667 20.725 7.5L19.3 8.925ZM17.85 10.4L7.25 21H3V16.75L13.6 6.15L17.85 10.4Z"
                        fill="#1A54EB"
                      />
                    </svg>
                  </button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
}

export default Filter;
