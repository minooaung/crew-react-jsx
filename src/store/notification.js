import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notificationMessage: null,
};

const notiSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    settingNotiMessage(state, action) {
      state.notificationMessage = action.payload;
    },
  },
});

export const notiActions = notiSlice.actions;

export default notiSlice.reducer;
