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
        eliminarFichaTecnica: (state, action) => {
            const idAEliminar = action.payload;
            state.fichasTecnicas = state.fichasTecnicas.filter(ft => ft.id !== idAEliminar);
        }
    }
})

export const {guardarFichasTecnicas, eliminarFichaTecnica} = fichasTecnicasSlice.actions;
export default fichasTecnicasSlice.reducer;