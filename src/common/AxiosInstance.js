import axios, { AxiosInstance as Axios } from 'axios';
import { api as url } from './Config';

export const BASE_URL = url + 'chief/';
const token = localStorage.getItem('token');

const AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 100000,
  headers: {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : ''
  }
});

const AxiosInstanceFormData = axios.create({
  baseURL: BASE_URL,
  timeout: 100000,
  headers: {
    Authorization: token ? `Bearer ${token}` : '',
    'Content-Type': 'multipart/form-data'
  }
});
const AxiosCustom = async (url, options = { method: 'GET' }, file = false) => {
  const token = localStorage.getItem('lybas-token');
  if (file) {
    const response = await axios({
      url,
      baseURL: BASE_URL,
      timeout: 100000,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: token ? `Bearer ${token}` : ''
      },
      ...options
    });
    return response;
  }
  const response = await axios({
    url,
    baseURL: BASE_URL,
    timeout: 100000,
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : ''
    },
    ...options
  });
  return response;
};

export { AxiosInstance, AxiosInstanceFormData, AxiosCustom };
