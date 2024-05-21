// import axios from 'axios';
// import instance from './config/Interceptor';
import qs from 'qs';
import instance from './Interceptor';
export function post(endPoint, params, isStringfy = true) {
  return instance.post(
    endPoint,params
    // isStringfy ? JSON.stringify(params) : qs.stringify(params),
  );
}

export function get(endPoint) {
  // console.log("endPoint", endPoint);
  return instance.get(endPoint);
}

export function deleteCall(endPoint, params) {
  return instance.delete(endPoint, {
    data:params
  });
}

export function putCall(endPoint, payload) {
  return instance.put(endPoint, 
    payload
  );
}
