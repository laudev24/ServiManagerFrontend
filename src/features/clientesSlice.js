import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    clientes : []
    
}
export const clientesSlice = createSlice({
    name: "clientes",
    initialState,
    reducers:{
        guardarClientes: (state, action) => {
            state.clientes = action.payload;
        }
    }
})

export const {guardarClientes} = clientesSlice.actions;
export default clientesSlice.reducer;