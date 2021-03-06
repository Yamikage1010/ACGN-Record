import axios from 'axios'
import qs from 'qs'
import store from 'store'
import router from '../router'
// post请求头的设置
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
axios.defaults.baseURL = 'http://192.168.43.82:9810'
axios.defaults.timeout = 30000 //设置超时时间
// 请求拦截器
axios.interceptors.request.use(
  config => {
    const Token = store.get('Token')
    Token && (config.headers.token = Token)
    return config
  },
  error => {
    return Promise.error(error)
  }
)
// 请求拦截器
// axios.interceptors.request.use(
//   config => {
//     const Token = localStorage.getItem('Token')
//     Token && (config.headers.Token = Token);
//     return config;
//   },
//   error => {
//     return Promise.error(error);
//   }
// );

// 响应拦截器
axios.interceptors.response.use(
  response => {
    if (response.status === 200) {
      if (response.data.code === 505) {
        store.remove('userData')
        store.remove('Token')
        store.remove('acgnConfig')
        router.push({
          name: 'login'
        })
      }
      return Promise.resolve(response)
    } else {
      console.log(response.status)
      return Promise.resolve(response)
    }
  },
  error => {
    if (error.response.status) {
      return Promise.reject(error.response)
    }
  }
)

// get 请求
export function get(url, params) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params
      })
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}

// post请求
export function post(url, params) {
  return new Promise((resolve, reject) => {
    axios
      .post(url, qs.stringify(params))
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}
