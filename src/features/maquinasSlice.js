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
        }
    }
})

export const {guardarMaquinas} = maquinasSlice.actions;
export default maquinasSlice.reducer;