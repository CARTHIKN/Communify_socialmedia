import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authenticationSliceReducer from "./authentication/authenticationSlice";
import userBasicDetailsSliceReducer from "./userBasicDetials/userBasicDetailsSlice";
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import { thunk } from 'redux-thunk';


const persistConfig = {
  key: 'root',
  storage,
}

const rootReducer = combineReducers({ 
  authentication_user: authenticationSliceReducer,
  user_basic_details: userBasicDetailsSliceReducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

// Wrap thunk middleware in a function
const middleware = () => [thunk]

export const store = configureStore({
  reducer: persistedReducer,
  middleware,  // Use the function returning the middleware array
  devTools: process.env.NODE_ENV !== 'production',
})

export const persistor = persistStore(store)
