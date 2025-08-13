import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    insumos: []
};

export const insumosSlice = createSlice({
    name: "insumos",
    initialState,
    reducers: {
        guardarInsumos: (state, action) => {
            state.insumos = action.payload;
        },
        modificarInsumo: (state, action) => {
            const index = state.insumos.findIndex(i => i.id === action.payload.id);
            if (index !== -1) {
                state.insumos[index] = action.payload;
            }
        }
    }
});

export const { guardarInsumos, modificarInsumo } = insumosSlice.actions;
export default insumosSlice.reducer;
