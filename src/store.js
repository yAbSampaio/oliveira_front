import { createStore } from "redux";
import AllReducer from "./store/reducers";
import ls from "local-storage";

const creds = {
  token: ls.get("token"),
  admin: ls.get("admin"),
};

export let initialState = creds;

const siderBar = {
  sidebarShow: "responsive",
};

const changeState = (state = siderBar, { type, ...rest }) => {
  switch (type) {
    case "set":
      return { ...state, ...rest };
    default:
      return state;
  }
};

const store = createStore(AllReducer, initialState);

store.subscribe(() => {
  const { token } = store.getState();
  const { admin } = store.getState();

  ls.set("token", token);
  ls.set("admin", admin);
});

export default store;
