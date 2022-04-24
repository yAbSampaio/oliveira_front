const setToken = (state = {}, action) => {
  switch (action.type) {
    case "SETTOKEN":
      return action.token;
    case "RESET":
      return "";
    default:
      return state;
  }
};

export default setToken;
