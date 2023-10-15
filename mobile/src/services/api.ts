import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.0.102:3333'
});

// Interceptando as requisições
api.interceptors.request.use((config) => {
  console.log("INTERCEPTOR REQUEST", config.data)
  return config;
}, (error) => {
  console.log("ERROR REQUEST", error);
  return Promise.reject(error);
});

// Interceptando as respostas
api.interceptors.response.use((response) => {
  console.log('INTERCEPTOR RESPONSE => ', response)
  return response;
}, (error) => {
  console.log('ERROR RESPONSE => ', error)
  return Promise.reject(error);
});

export { api };