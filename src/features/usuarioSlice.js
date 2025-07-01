import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token : "",
    nombre : "",
    esAdministrador : false
}
export const usuarioSlice = createSlice({
    name: "usuario",
    initialState,
    reducers:{
        guardarToken:(state, action) =>{
            state.token=action.payload
        },
        guardarNombre:(state, action) =>
        {
            state.nombre=action.payload
        },
         guardarTipoUsuario:(state, action) =>
        {
            state.esAdministrador=action.payload
        }
    }

})
export const {guardarToken, guardarNombre, guardarTipoUsuario} = usuarioSlice.actions;
export default usuarioSlice.reducer;