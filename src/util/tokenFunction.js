import jwt_decode from "jwt-decode";

export const expToken = (token) => {
  if (token == null) return true;
  let exp = new Date(jwt_decode(token).exp * 1000);
  const dataAtual = new Date();
  return dataAtual > exp;
};

export const getAdmin = (token) => {
  return jwt_decode(token).admin;
};
