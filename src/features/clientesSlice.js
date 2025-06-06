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
        },
        eliminarCliente: (state, action) => {
            const idAEliminar = action.payload;
            state.clientes = state.clientes.filter(m => m.id !== idAEliminar);
        }

    }
})

export const {guardarClientes, eliminarCliente} = clientesSlice.actions;
export default clientesSlice.reducer;