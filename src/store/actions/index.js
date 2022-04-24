export const setToken = (token) => {
  return {
    type: "SETTOKEN",
    token: token,
  };
};
export const setAdmin = (admin) => {
  console.log(admin);
  return {
    type: "SETADMIN",
    admin: admin,
  };
};

export const reset = () => {
  return {
    type: "RESET",
  };
};
