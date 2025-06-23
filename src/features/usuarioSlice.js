import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token : "",
    nombre : ""
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
        }
    }

})
export const {guardarToken, guardarNombre} = usuarioSlice.actions;
export default usuarioSlice.reducer;