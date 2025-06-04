import { configureStore } from "@reduxjs/toolkit";
import clientesReducer from "../features/clientesSlice";
import maquinasReducer from "../features/maquinasSlice";
import fichasTecnicasReducer from "../features/fichasTecnicasSlice";
import solicitudesReducer from "../features/solicitudesSlice";
import insumosReducer from "../features/insumosSlice";
import chatsReducer from "../features/chatsSlice";
import categoriasReducer from "../features/categoriasSlice";
import usuarioReducer from "../features/usuarioSlice";




export const store= configureStore ({
    reducer : {
        clientesSlice : clientesReducer,
        maquinasSlice : maquinasReducer,
        fichasTecnicasSlice : fichasTecnicasReducer,
        solicitudesSlice : solicitudesReducer,
        insumosSlice : insumosReducer,
        chatsSlice : chatsReducer,
        categoriasSlice : categoriasReducer,
        usuarioSlice : usuarioReducer
    }
})