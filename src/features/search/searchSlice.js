import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as api from '../../api/index'

export const search = createAsyncThunk('search/search', async (data) => {
    const response = await api.search(data)
    return response.data
})

export const searchUser = createAsyncThunk('search/searchUser', async (data) => {
    const id = data.creator
    const response = await api.searchProfile(id)
    return response.data
})

export const searchPost = createAsyncThunk('search/searchPost', async (data) => {
    const id = data.id
    const response = await api.searchPost(id)
    return response.data
})

const initialState = {
    results: null,
    resultStatus: 'idle',
    post: null,
    postStatus: 'idle',
    search: null,
    searchStatus: 'idle'
}

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(search.pending, (state, action) => {
                state.searchStatus = 'loading'
            })
            .addCase(search.fulfilled, (state, action) => {
                state.searchStatus ='success'
                state.search = action.payload;
            })
            .addCase(search.rejected, (state, action) => {
                state.searchStatus = 'failed'
            })
            .addCase(searchUser.pending, (state, action) => {
                state.resultStatus = 'loading'
            })
            .addCase(searchUser.fulfilled, (state, action) => {
                state.resultStatus = 'success'
                state.results = action.payload;
            })
            .addCase(searchUser.rejected, (state, action) => {
                state.resultStatus = 'failed'
            })
            .addCase(searchPost.pending, (state, action) => {
                state.postStatus = 'loading'
            })
            .addCase(searchPost.fulfilled, (state, action) => {
                state.postStatus = 'success'
                state.post = action.payload;
            })
            .addCase(searchPost.rejected, (state, action) => {
                state.postStatus = 'failed'
            })
    }
})

export const userProfile = (state) => state.search.results;
export const resultStatus = (state) => state.search.resultStatus;
export const postStatus = (state) => state.search.postStatus;
export const searchWord =(state)=> state.search.search;
export const searchStatus = (state)=> state.search.searchStatus;
export const getPost = (state) => state.search.post;

export default searchSlice.reducer