import axios from 'axios'
import qs from 'qs'


/**
 * http request 拦截器
 */
axios.interceptors.request.use(
  (config) => {
    config.data = qs.stringify(config.data);
    config.headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// /**
//  * http response 拦截器
//  */
//  axios.interceptors.response.use(
//   (response) => {
//     if (response.data.errCode === 2) {
//       console.log("过期");
//     }
//     return response;
//   },
//   (error) => {
//     console.log("请求出错：", error);
//   }
// );

/**
 * 封装get方法
 * @param url  请求url
 * @param params  请求参数
 * @returns {Promise}
 */
function get(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: params,
    }).then((response) => {
      if (response.data.error_code === 0) {
        resolve(response.data.data);
      } else {
        reject(response.data.error_msg);
      }
    })
      .catch((error) => {
        reject(error);
      });
  });
}

/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */
function post(url, data) {
  return new Promise((resolve, reject) => {
    axios.post(url, data).then((response) => {
      if (response.data.error_code === 0) {
        console.log(response.data.data)
        resolve(response.data.data);
      } else {
        console.log(response.data.error_msg)
        reject(response.data.error_msg);
      }
    }).catch((error) => {
      reject(error);
    });;
  });
}


export { post, get };