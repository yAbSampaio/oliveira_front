import axios from "axios";
export const API_URL = "http://ec2-34-200-220-14.compute-1.amazonaws.com:3333";
//
export const routeRegister = (data, token) => {
  const config = {
    headers: { authorization: token },
  };
  return axios.post(API_URL + "/register", data, config).then(function (res) {
    let data = res.data;
    return data;
  });
};

export const routeLogar = (data) => {
  return axios.post(API_URL + "/login", data).then(function (res) {
    let data = res.data;
    return data;
  });
};

export const routeGetClient = (data, token) => {
  const config = {
    headers: { authorization: token },
  };
  return axios.post(API_URL + "/profile", data, config).then(function (res) {
    let data = res.data;
    return data;
  });
};

export const routeEdit = (data, token) => {
  const config = {
    headers: { authorization: token },
  };
  return axios
    .post(API_URL + "/profile/edit", data, config)
    .then(function (res) {
      let data = res.data;
      return data;
    });
};

export const routePay = (data, token) => {
  const config = {
    headers: { authorization: token },
  };
  return axios
    .post(API_URL + "/add_payment", data, config)
    .then(function (res) {
      let data = res.data;
      return data;
    });
};

export const routeListClient = (token) => {
  const config = {
    headers: { authorization: token },
  };
  return axios.post(API_URL + "/list", {}, config).then(function (res) {
    let data = res.data;
    return data;
  });
};

export const routeListLiqui = (data, token) => {
  const config = {
    headers: { authorization: token },
  };
  return axios.post(API_URL + "/paid_off", data, config).then(function (res) {
    let data = res.data;
    return data;
  });
};

export const routeSearchClient = (data, token) => {
  const config = {
    headers: { authorization: token },
  };
  return axios.post(API_URL + "/search", data, config).then(function (res) {
    let data = res.data;
    return data;
  });
};

export const routeHistoric = (data, token) => {
  const config = {
    headers: { authorization: token },
  };
  return axios
    .post(API_URL + "/get_historic", data, config)
    .then(function (res) {
      let data = res.data;
      return data;
    });
};

export const routeBalance = (data, token) => {
  const config = {
    headers: { authorization: token },
  };
  return axios
    .post(API_URL + "/get_balance", data, config)
    .then(function (res) {
      let data = res.data;
      return data;
    });
};
