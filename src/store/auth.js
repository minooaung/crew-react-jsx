import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null, // Persist user
};

const authSlice = createSlice({
  name: "authentication",
  //initialState: initialState,
  initialState, // Same as above, shortened
  reducers: {
    settingUser(state, action) {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload)); // Save user
    },
    logout(state) {
      state.user = null; // Clear user on logout
      localStorage.removeItem("user"); // Clear user on logout
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
