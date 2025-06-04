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
        }
    }
})

export const {guardarFichasTecnicas} = fichasTecnicasSlice.actions;
export default fichasTecnicasSlice.reducer;