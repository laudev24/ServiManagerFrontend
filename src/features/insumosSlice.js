import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    insumos : []
    
}
export const insumosSlice = createSlice({
    name: "insumos",
    initialState,
    reducers:{
        guardarInsumos: (state, action) => {
            state.insumos = action.payload;
        }
    }
})

export const {guardarInsumos} = insumosSlice.actions;
export default insumosSlice.reducer;