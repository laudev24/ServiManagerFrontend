import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    fotos : []
}

export const fotosSlice = createSlice({
    name: "fotos",
    initialState,
    reducers:{
        guardarFotos: (state, action) => {
            state.fotos = [...state.fotos, action.payload];
        }
    }
})

export const {guardarFotos} = fotosSlice.actions;
export default fotosSlice.reducer;