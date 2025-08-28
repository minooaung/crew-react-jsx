import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../store/auth";
import notiReducer from "../store/notification";

const store = configureStore({
  reducer: { auth: authReducer, notification: notiReducer },
});

export default store;
