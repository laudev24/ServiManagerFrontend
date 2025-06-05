import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    maquinas : []
    
}
export const maquinasSlice = createSlice({
    name: "maquinas",
    initialState,
    reducers:{
        guardarMaquinas: (state, action) => {
            state.maquinas = action.payload;
        },
        eliminarMaquina:(state, action) => {
            state.listaMaquinas=action.payload
        }
    }
})

export const {guardarMaquinas, eliminarMaquina} = maquinasSlice.actions;
export default maquinasSlice.reducer;