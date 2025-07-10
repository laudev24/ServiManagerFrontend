import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    clienteId : -1
    
}
export const clienteSlice = createSlice({
    name: "clienteId",
    initialState,
    reducers:{
        guardarClienteId: (state, action) => {
            state.clienteId = action.payload;
        }

    }
})

export const {guardarClienteId} = clienteSlice.actions;
export default clienteSlice.reducer;