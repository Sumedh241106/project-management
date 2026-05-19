"use client";

import React, { useRef } from "react";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { Provider, useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import { setupListeners } from "@reduxjs/toolkit/query";
import { api } from "./api"; // Cleanly imports your existing api configuration

/* ==========================================
   1. REDUX STORE & SYSTEM REDUCERS
   ========================================== */
const rootReducer = combineReducers({
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
   2. TYPES & CUSTOM HOOKS
   ========================================== */
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = AppStore["dispatch"];

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/* ==========================================
   3. CLIENT-SIDE PROVIDER WRAPPER
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