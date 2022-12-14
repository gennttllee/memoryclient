import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as API from '../../api/index.js'

const initialState = {
    user: JSON.parse(localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user')) : null,
    status: 'idle',
    error: '',
    message: '',
    users: []
}

export const signIn = createAsyncThunk('user/signIn', async (data, { rejectWithValue }) => {
    try {
        const response = await API.signIn(data);
        return response.data
    } catch (error) {
        throw rejectWithValue(error)
    }
})

export const googleReg = createAsyncThunk('user/googleReg', async (data, { rejectWithValue }) => {
    try {
        const response = await API.google(data);
        return response.data
    } catch (error) {
        throw rejectWithValue(error)
    }
})

export const signUp = createAsyncThunk('user/signUp', async (info, { rejectWithValue }) => {
    const { picture } = info;
    try {
        const formData = new FormData();
        formData.append('file', picture)
        formData.append('upload_preset', 'my-uploads')
        const data = await fetch('https://api.cloudinary.com/v1_1/gennttllee/image/upload', {
            method: 'POST',
            body: formData
        }).then(r => r.json())
            .catch(error => rejectWithValue(error));
        const newData = { ...info, picture: data.secure_url }
        const response = await API.signUp(newData);
        return response.data
    } catch (error) {
        throw rejectWithValue(error)
    }
})

export const savePassword = createAsyncThunk('user/savePassword', async (data, { rejectWithValue }) => {

    try {
        const response = await API.savePass(data);
        return response.data
    } catch (error) {
        throw rejectWithValue(error)
    }
})

export const resetPassword = createAsyncThunk('user/resetPassword', async (email, { rejectWithValue }) => {
    try {
        const response = await API.resetPass(email);
        return response.data
    } catch (error) {
        throw rejectWithValue(error)
    }
})

export const fetchUsers = createAsyncThunk('user/fetchUsers', async (email) => {
    const response = await API.fetchUser(email);
    return response.data
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
            .addCase(resetPassword.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload.response.data.message
            })
            .addCase(resetPassword.fulfilled, (state, action) => {
                state.status = 'success'
                state.error = action.payload.message
                state.message = action.payload.otp
            })
            .addCase(savePassword.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(savePassword.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload.response.data.message
            })
            .addCase(savePassword.fulfilled, (state, action) => {
                state.status = 'success'
                const profile = { ...action.payload.result, token: action.payload.token }
                state.user = profile;
                localStorage.setItem('user', JSON.stringify(profile))
            })
            .addCase(fetchUsers.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.status = 'failed'
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.status = 'success'
                state.users = action.payload;
            })
    }
})

export const { addUser, logout } = userSlice.actions;
export const getStatus = (state) => state.users.status;
export const user = (state) => state.users.user
export const error = (state) => state.users.error
export const mess = (state) => state.users.message
export const users = (state) => state.users.users
export default userSlice.reducer