const setAdmin = (state = {}, action) => {
  switch (action.type) {
    case "SETADMIN":
      return action.admin;
    case "RESET":
      return "";
    default:
      return state;
  }
};

export default setAdmin;
