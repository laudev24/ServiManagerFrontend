import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    apiKey : "",
    id : -1
}
export const usuarioSlice = createSlice({
    name: "usuario",
    initialState,
    reducers:{
        guardarApikey:(state, action) =>{
            state.apiKey=action.payload
        },
        guardarId:(state, action) =>
        {
            state.id=action.payload
        }
    }

})
export const {guardarApikey, guardarId} = usuarioSlice.actions;
export default usuarioSlice.reducer;