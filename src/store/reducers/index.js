import { combineReducers } from "redux";
import setToken from "./setToken";
import setAdmin from "./setAdmin";

const allReducers = combineReducers({
  token: setToken,
  admin: setAdmin,
});

export default allReducers;
