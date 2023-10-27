import axios, { AxiosInstance, AxiosError } from 'axios';
import { AppError } from '@utils/AppError';
import { storageAuthTokenGet } from '@storage/storageAuthToken';

type SignOut = () => void;

type PromiseType = {
  onSuccess: (token: string) => void;
  onFailure: (error: AxiosError) => void;
}

type APIInstanceProps = AxiosInstance & {
  registerInterceptTokenManager: (signOut: SignOut) => () => void;
}

const api = axios.create({
  baseURL: 'http://10.1.1.87:3333',
  timeout: 6000
}) as APIInstanceProps;

let failedQueue : Array<PromiseType> = [];

//Pegando o signOut passado como parâmetro
api.registerInterceptTokenManager = signOut => {
  const interceptTokenManager = api.interceptors.response.use(response => response, async ( requestError ) => {

    //Não autorizado
    if (requestError?.response?.status === 401) {
      if (requestError.response.data?.message === 'token.expired' || requestError.response.data?.message === 'token.invalid') {
        const { refresh_token } = await storageAuthTokenGet();

        //Caso não tenha o refresh Token desconecta o usuário
        if (!refresh_token) {
          signOut();
          Promise.reject(requestError);
        }

        const originalRequestConfig = requestError.config;
        console.log("REQUISIÇÃO => ", originalRequestConfig);


      }

      signOut(); //Caso seja não autorizado e não de certo o refresh, então desloga o usuário
    }

  
    if (requestError.response && requestError.response.data) {
      return Promise.reject(new AppError(requestError.response.data.message));
    } else {
      return Promise.reject(requestError);
    }
  });

  return () => {
    api.interceptors.response.eject(interceptTokenManager);
  };
}


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

