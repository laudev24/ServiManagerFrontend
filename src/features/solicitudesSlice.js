import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    solicitudes : []
    
}
export const solicitudesSlice = createSlice({
    name: "solicitudes",
    initialState,
    reducers:{
        guardarSolicitudes: (state, action) => {
            state.solicitudes = action.payload;
        }
    }
})

export const {guardarSolicitudes} = solicitudesSlice.actions;
export default solicitudesSlice.reducer;