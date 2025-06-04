import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    chats : []
    
}
export const chatsSlice = createSlice({
    name: "chats",
    initialState,
    reducers:{
        guardarChats: (state, action) => {
            state.chats = action.payload;
        }
    }
})

export const {guardarChats} = chatsSlice.actions;
export default chatsSlice.reducer;