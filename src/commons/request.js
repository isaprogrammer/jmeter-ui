import axios from "axios"
import {Message} from "element-ui";

let BASE_URL = "http://localhost:8888/jmeter-admin/0.0.14-SNAPSHOT";

axios.interceptors.request.use(config => {
  return config;
}, err => {
  Message.error({
    message: "请求异常，请联系管理员！"
  });
  return Promise.resolve(err);
})

axios.interceptors.response.use(response => {
  return response.data.data;
}, err => {
  Message.error({
    message: "系统异常，请联系管理员！"
  });
  return Promise.resolve(err);
})

export const post = (url, params) => {
  return axios({
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST",
    url: `${BASE_URL}${url}`,
    data: params
  })
}

export const submit = (url, params, config = {}) => {
  return axios({
    headers: {
      "Content-Type": "multipart/form-data"
    },
    method: "POST",
    url: `${BASE_URL}${url}`,
    data: params,
    ...config
  })
}
