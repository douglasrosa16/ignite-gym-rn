import axios from 'axios';
import { AppError } from '@utils/AppError';

const api = axios.create({
  baseURL: 'http://10.1.1.87:3333',
  timeout: 6000
});

api.interceptors.response.use(response => response, error => {
  if(error.response && error.response.data){
    return Promise.reject(new AppError(error.response.data.message));
  }else {
    return Promise.reject(error);
  }
});

export { api };

// Interceptando as requisições
// api.interceptors.request.use((config) => {
//   console.log("INTERCEPTOR REQUEST", config.data)
//   return config;
// }, (error) => {
//   console.log("ERROR REQUEST", error);
//   return Promise.reject(error);
// });

// Interceptando as respostas
// api.interceptors.response.use((response) => {
//   console.log('INTERCEPTOR RESPONSE => ', response)
//   return response;
// }, (error) => {
//   console.log('ERROR RESPONSE => ', error)
//   return Promise.reject(error);
// });

