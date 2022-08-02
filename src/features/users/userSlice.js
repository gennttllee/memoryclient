import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as API from '../../api/index.js'

const initialState = {
    user: JSON.parse(localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user')) : null,
    status: 'idle',
    error: ''
}

export const signIn = createAsyncThunk('user/signIn', async (data, { rejectWithValue }) => {
    try {
        const response = await API.signIn(data);
        return response.data
    } catch (error) {
        throw rejectWithValue(error)
    }
})

export const googleReg = createAsyncThunk('user/googleReg', async (data, { rejectWithValue })=> {
    try {
        const response = await API.google(data);
        return response.data
    } catch (error) {
        throw rejectWithValue(error)
    }
})

export const signUp = createAsyncThunk('user/signUp', async (data, { rejectWithValue }) => {
    try {
        const response = await API.signUp(data);
        return response.data
    } catch (error) {
        throw rejectWithValue(error)
    }
})

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        addUser: (state, action) => {
            state.user = { ...action.payload.profile, token: action.payload.token }
            localStorage.setItem('user', JSON.stringify(state.user))
        },
        logout: (state, action) => {
            state.user = null;
            localStorage.removeItem('user');
        }
    },
    extraReducers(builder) {
        builder
            .addCase(signIn.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(signIn.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload.response.data.message
            })
            .addCase(signIn.fulfilled, (state, action) => {
                state.status = 'success'
                const profile = { ...action.payload.result, token: action.payload.token }
                state.user = profile;
                localStorage.setItem('user', JSON.stringify(profile))
            })
            .addCase(signUp.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(signUp.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload.response.data.message
            })
            .addCase(signUp.fulfilled, (state, action) => {
                state.status = 'success'
                const profile = { ...action.payload.result, token: action.payload.token }
                state.user = profile;
                localStorage.setItem('user', JSON.stringify(profile))
            })
            .addCase(googleReg.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload.response.data.message
            })
            .addCase(googleReg.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(googleReg.fulfilled, (state, action) => {
                state.status = 'success'
                const profile = { ...action.payload.result, token: action.payload.token }
                state.user = profile;
                localStorage.setItem('user', JSON.stringify(profile))
            })
    }
})

export const { addUser, logout } = userSlice.actions;
export const getStatus = (state) => state.users.status;
export const user = (state) => state.users.user
export const error = (state) => state.users.error
export default userSlice.reducer