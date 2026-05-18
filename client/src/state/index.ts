import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface initialStateTypes {
  isSidebarCollapsed: boolean;
  isDarkMode: boolean;
  isModalNewProjectOpen: boolean;
  isModalNewTaskOpen: boolean;
}

const initialState: initialStateTypes = {
  isSidebarCollapsed: false,
  isDarkMode: false,
  isModalNewProjectOpen: false,
  isModalNewTaskOpen: false,
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setIsSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.isSidebarCollapsed = action.payload;
    },
    setIsDarkMode: (state, action: PayloadAction<boolean>) => {
      state.isDarkMode = action.payload;
    },
    setIsModalNewProjectOpen: (state, action: PayloadAction<boolean>) => {
      state.isModalNewProjectOpen = action.payload;
    },
    setIsModalNewTaskOpen: (state, action: PayloadAction<boolean>) => {
      state.isModalNewTaskOpen = action.payload;
    },
  },
});

export const {
  setIsSidebarCollapsed,
  setIsDarkMode,
  setIsModalNewProjectOpen,
  setIsModalNewTaskOpen,
} = globalSlice.actions;

export default globalSlice.reducer;