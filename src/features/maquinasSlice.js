import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    maquinas: []

}
export const maquinasSlice = createSlice({
    name: "maquinas",
    initialState,
    reducers: {
        guardarMaquinas: (state, action) => {
            state.maquinas = action.payload;
        },
        agregarMaquina: (state, action) => {
            state.maquinas.push(action.payload);
        },
        eliminarMaquina: (state, action) => {
            const idAEliminar = action.payload;
            state.maquinas = state.maquinas.filter(m => m.id !== idAEliminar);
        }

    }
})

export const { guardarMaquinas, eliminarMaquina, agregarMaquina } = maquinasSlice.actions;
export default maquinasSlice.reducer;