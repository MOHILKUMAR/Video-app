import { createSlice } from "@reduxjs/toolkit";

// index.html sets the class before React loads, so read the theme from there.
const getInitialTheme = () =>
  document.documentElement.classList.contains("dark") ? "dark" : "light";

const appSlice = createSlice({
  name: "app",
  initialState: {
    // Desktop: full sidebar vs. icon-only rail.
    isMenuOpen: true,
    // Mobile, tablet and watch page: slide-in drawer.
    isDrawerOpen: false,
    theme: getInitialTheme(),
  },
  reducers: {
    toggleMenu: (state) => {
      state.isMenuOpen = !state.isMenuOpen;
    },
    toggleDrawer: (state) => {
      state.isDrawerOpen = !state.isDrawerOpen;
    },
    closeDrawer: (state) => {
      state.isDrawerOpen = false;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
  },
});

export const { toggleMenu, toggleDrawer, closeDrawer, setTheme } =
  appSlice.actions;
export default appSlice.reducer;
