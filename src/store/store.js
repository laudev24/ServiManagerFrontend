import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import { combineReducers } from 'redux';

import clientesReducer from "../features/clientesSlice";
import maquinasReducer from "../features/maquinasSlice";
import fichasTecnicasReducer from "../features/fichasTecnicasSlice";
import solicitudesReducer from "../features/solicitudesSlice";
import insumosReducer from "../features/insumosSlice";
import chatsReducer from "../features/chatsSlice";
import categoriasReducer from "../features/categoriasSlice";
import usuarioReducer from "../features/usuarioSlice";
import fotosReducer from "../features/fotosSlice";

const persistConfig = {
  key: 'root',
  storage,
};

const rootReducer = combineReducers({
    clientesSlice : clientesReducer,
    maquinasSlice : maquinasReducer,
    fichasTecnicasSlice : fichasTecnicasReducer,
    solicitudesSlice : solicitudesReducer,
    insumosSlice : insumosReducer,
    chatsSlice : chatsReducer,
    categoriasSlice : categoriasReducer,
    usuarioSlice : usuarioReducer,
    fotosSlice : fotosReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);



