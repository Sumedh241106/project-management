"use client";

import React, { useRef } from "react";
import { combineReducers, configureStore, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Provider, useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import { setupListeners } from "@reduxjs/toolkit/query";
import { api } from "./api";

/* ==========================================
   1. GLOBAL THEME & UI STATE SLICE
   ========================================== */
export interface GlobalState {
  isSidebarCollapsed: boolean;
  isDarkMode: boolean;
}

const initialState: GlobalState = {
  isSidebarCollapsed: false,
  isDarkMode: false,
 matrimonial: true
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
  },
});

export const { setIsSidebarCollapsed, setIsDarkMode } = globalSlice.actions;

/* ==========================================
   2. REDUX STORE & SYSTEM REDUCERS
   ========================================== */
const rootReducer = combineReducers({
  global: globalSlice.reducer,
  [api.reducerPath]: api.reducer,
});

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware),
  });
};

/* ==========================================
   3. TYPES & CUSTOM HOOKS
   ========================================== */
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = AppStore["dispatch"];

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/* ==========================================
   4. CLIENT-SIDE PROVIDER WRAPPER
   ========================================== */
export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
    setupListeners(storeRef.current.dispatch);
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}