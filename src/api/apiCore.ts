import axios from 'axios';
import appConfig from "@/config/appConfig.ts";
import {toastUtil} from "@/utils/toastUtil.ts";

// content type
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.common['x-language-id'] = !localStorage.getItem('i18nextLng') ? 1 : (localStorage.getItem('i18nextLng') === "vi" ? 1 : 2);
axios.defaults.headers.common['X-Channel-Code'] = appConfig.CHANNEL_CODE;
axios.defaults.baseURL = appConfig.API_URL;

const AUTH_NAME = 'wii-token';

// intercepting to capture errors
axios.interceptors.response.use(
  (response: any) => {
    return response;
  },
  async (error: any) => {
    let message: string;
    
    if (error && error.message === 'Network Error') {
      message = 'No Internet';
      toastUtil.error(message, 99);
      // return message
    }
      // else if (error && error.response && error.response.status === 404) {
      //   window.location.href = '/not-found';
    // }
    else if (error && error.response && error.response.status === 403) {
      window.location.href = '/access-denied';
    } else {
      switch (error.response.status) {
        case 400:
          message = 'Unknown error occurred\n';
          break;
        case 401:
          message = 'Access denied';
          localStorage.removeItem(AUTH_NAME);
          window.location.href = '/';
          break;
        case 403:
          message = 'Access denied';
          break;
        case 404:
          message = 'Not found';
          break;
        case 413:
          message = 'Up to 5MB';
          break;
        case 500:
          message = 'Unknown error occurred\n';
          break;
        case 502:
          message = 'Bad Gateway';
          break;
        case 503:
          message = 'Not Ready';
          break;
        default: {
          message = error.response && error.response.data ? error.response.data['message'] : error.message || error;
        }
      }
      // if (message.includes(',')) {
      //   const arr = message.split(",").map(item => item.trim());
      //   arr && arr.forEach(item => {
      //     toastUtil.error(item)
      //   })
      // } else {
      return error.response;
      // }
    }
  },
);
/**
 * Sets the default authorization
 * @param {*} token
 */
const setAuthorization = (token: string | null) => {
  if (token) axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
  else delete axios.defaults.headers.common['Authorization'];
};

const getTokenFromCookie = () => {
  const token = localStorage.getItem(AUTH_NAME);
  return token ?? null;
};

class APICore {
  /**
   * Fetches data from given url
   */
  get = (url: string, params?: any) => {
    let response: any;
    if (params) {
      const queryString = params
        ? Object.keys(params)
          .map((key) => key + '=' + params[key])
          .join('&')
        : '';
      response = axios.get(`${url}?${queryString}`, params);
    } else {
      response = axios.get(`${url}`, params);
    }
    return response;
  };
  
  getFile = (url: string, params: any) => {
    let response: any;
    const config = {
      headers: {
        ...axios.defaults.headers,
        'content-type': 'multipart/form-data',
      },
      responseType: 'blob'
    };
    if (params) {
      const queryString = params
        ? Object.keys(params)
          .map((key) => key + '=' + params[key])
          .join('&')
        : '';
      // @ts-ignore
      response = axios.get(`${url}?${queryString}`, config);
    } else {
      // @ts-ignore
      response = axios.get(`${url}`, config);
    }
    return response;
  };
  
  getMultiple = (urls: string, params: any) => {
    const reqs = [];
    let queryString = '';
    if (params) {
      queryString = params
        ? Object.keys(params)
          .map((key) => key + '=' + params[key])
          .join('&')
        : '';
    }
    
    for (const url of urls) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      reqs.push(axios.get(`${url}?${queryString}`));
    }
    return axios.all(reqs);
  };
  
  /**
   * post given data to url
   */
  create = (url: string, data: any) => {
    return axios.post(url, data);
  };
  
  /**
   * Updates patch data
   */
  updatePatch = (url: string, data: any) => {
    return axios.patch(url, data);
  };
  
  /**
   * Updates data
   */
  update = (url: string, data: any) => {
    return axios.put(url, data);
  };
  
  /**
   * Deletes data
   */
  delete = (url: string, data?: any) => {
    return axios.delete(url, data);
  };
  
  /**
   * post given data to url with file
   */
  createWithFile = (url: string, file: any) => {
    const formData = new FormData();
    
    formData.append('image_url', file);
    
    const config = {
      headers: {
        ...axios.defaults.headers,
        'content-type': 'multipart/form-data',
      },
    };
    return axios.post(url, formData, config);
  };
  
  /**
   * post given data to url with file
   */
  updateWithFile = (url: string, data: any) => {
    const formData = new FormData();
    for (const k in data) {
      formData.append(k, data[k]);
    }
    
    const config = {
      headers: {
        ...axios.defaults.headers,
        'content-type': 'multipart/form-data',
      },
    };
    return axios.patch(url, formData, config);
  }
}

/*
Check if token available in session
*/

const token = getTokenFromCookie();
if (token) {
  setAuthorization(token);
}

export {APICore, setAuthorization};
