import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    fichasTecnicas : []
    
}
export const fichasTecnicasSlice = createSlice({
    name: "fichasTecnicas",
    initialState,
    reducers:{
        guardarFichasTecnicas: (state, action) => {
            state.fichasTecnicas = action.payload;
        },
        agregarFichaTecnica: (state, action) => {
            state.fichasTecnicas.push(action.payload);
        },
        eliminarFichaTecnica: (state, action) => {
            const idAEliminar = action.payload;
            state.fichasTecnicas = state.fichasTecnicas.filter(ft => ft.id !== idAEliminar);
        }
    }
})

export const {guardarFichasTecnicas, eliminarFichaTecnica, agregarFichaTecnica} = fichasTecnicasSlice.actions;
export default fichasTecnicasSlice.reducer;