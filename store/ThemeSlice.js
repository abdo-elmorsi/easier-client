import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: "",
};

const ThemeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state, { payload }) => {
      state.theme = payload;
      localStorage.setItem("theme", payload);
    },
  },
});

export const { toggleTheme } = ThemeSlice.actions;

export default ThemeSlice.reducer;
