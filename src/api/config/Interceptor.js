import axios from "axios";
import LocalStorageService from "../../storage/LocalStorageService";

// console.log("process.env.REACT_APP_PUBLIC_URL,", process.env);
// baseURL: "http://49.206.253.146:1773/",
const instance = axios.create({
  baseURL: "http://106.51.242.196:2109/",
});
const localStorageService = LocalStorageService.getService();
const userAccessToken = localStorageService.getUserAuthAccessToken();
console.log("userAccessToken", userAccessToken);
// let accesstoken="5cd59bcb6f99cec3fc932e5d6f7fdabea59d96b8bf8d9b7980d2ac4bb955ff19"
// const jwt = localStorage.getItem("jwt");
const wt = localStorage.getItem("wt");
const wtt = localStorage.getItem("wtt");
instance.interceptors.request.use(
  (config) => {
    config.headers = {
      "Content-Type": "application/json",
      wt: wt,
      wtt: wtt,
    };
    // if (userAccessToken) {
    //   config.headers["wt"] = wt;
    //   config.headers["wtt"] = wtt;
    // }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

//Add a response interceptor

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 404) {
      // history.push( '/not-found' );
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);
export default instance;
