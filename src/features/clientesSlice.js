import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  clientes: []
};

export const clientesSlice = createSlice({
  name: "clientes",
  initialState,
  reducers: {
    guardarClientes: (state, action) => {
      state.clientes = action.payload;
    },
    eliminarCliente: (state, action) => {
      const id = action.payload;
      state.clientes = state.clientes.filter(c => c.id !== id);
    },
    modificarCliente: (state, action) => {
      const clienteModificado = action.payload;
      const index = state.clientes.findIndex(c => c.id === clienteModificado.id);
      if (index !== -1) {
        state.clientes[index] = clienteModificado;
      }
    }
  }
});

export const { guardarClientes, eliminarCliente, modificarCliente } = clientesSlice.actions;
export default clientesSlice.reducer;