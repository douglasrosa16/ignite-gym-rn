import axios, { AxiosInstance, AxiosError } from 'axios';
import { AppError } from '@utils/AppError';
import { storageAuthTokenGet, storageAuthTokenRemove, storageAuthTokenSave } from '@storage/storageAuthToken';

type SignOut = () => void;

type PromiseType = {
  onSuccess: (token: string) => void;
  onFailure: (error: AxiosError) => void;
}

type APIInstanceProps = AxiosInstance & {
  registerInterceptTokenManager: (signOut: SignOut) => () => void;
}

const api = axios.create({
  baseURL: 'http://192.168.0.104:3333',
  timeout: 6000
}) as APIInstanceProps;

let failedQueue: Array<PromiseType> = [];
let isRefreshing = false;

//Pegando o signOut passado como parâmetro
api.registerInterceptTokenManager = signOut => {
  const interceptTokenManager = api.interceptors.response.use(response => response, async (requestError) => {

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

        //Se tiver retornando um novo Token, adicionar na fila os sucessos e erros
        //Se der sucesso passa o novo token atualizado
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({
              onSuccess: (token: string) => {
                originalRequestConfig.headers = { 'Authorization': `Bearer ${token}` }; //Repassa o novo token no headers
                resolve(api(originalRequestConfig)); //Reenviar a requisição
              },
              onFailure: (error: AxiosError) => {
                Promise.reject(error);
              }
            });
          });
        }

        isRefreshing = true;

        return new Promise(async (resolve, reject) => {
          try {
            const { data } = await api.post('/sessions/refresh-token', { refresh_token });
            await storageAuthTokenSave({ token: data.token, refresh_token: data.refresh_token });

            if (originalRequestConfig.data) {
              originalRequestConfig.data = JSON.parse(originalRequestConfig.data);
            }

            //Atualizar o cabeçalho da requisição atual
            originalRequestConfig.headers = { 'Authorization': `Bearer ${data.token}` };

            //Atualizar o cabeçalho das proximas requisições
            api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      
            failedQueue.forEach(request => {
              request.onSuccess(data.token);
            });

            console.log('Token atualizado!');

            resolve(api(originalRequestConfig)); //Reenviar/Processar a requisição

          } catch (error: any) {
            failedQueue.forEach(request => {
              request.onFailure(error);
            });

            signOut();
            reject(error);
          } finally {
            isRefreshing = false;
            failedQueue = [];
          }
        })

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

