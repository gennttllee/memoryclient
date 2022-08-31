import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from '../../api';

const initialState = {
    chats: [],
    status: 'idle',
    error: null,
};

export const fetchChats = createAsyncThunk('chat/fetchChats', async(data)=>{
    const response = await api.fetchChat(data);
    return response.data
})

export const createChat = createAsyncThunk('chat/createChat', async(data)=>{
    const response = await api.createChat(data);
    return response.data
})

const chatSlice = createSlice({
    name : 'chats',
    initialState,
    reducers : {},
    extraReducers(builder){
        builder
                .addCase(fetchChats.pending, (state, action)=>{
                    state.status = 'loading'
                })
                .addCase(fetchChats.fulfilled, (state, action)=>{
                    state.status = 'success'
                    state.chats = action.payload
                })
                .addCase(fetchChats.rejected, (state, action)=>{
                    state.status = 'failed'
                    state.error = action.error
                })
                .addCase(createChat.pending, (state, action)=>{
                    state.status = 'loading'
                })
                .addCase(createChat.fulfilled, (state, action)=>{
                    state.status = 'success'
                    state.chats.unshift(action.payload)
                })
                .addCase(createChat.rejected, (state, action)=>{
                    state.status = 'failed'
                    state.error = action.error
                })
    }
})

export const myChats =(state)=> state.chat.chats
export default chatSlice.reducer