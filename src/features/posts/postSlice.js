import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from '../../api';

const initialState = {
    posts: [],
    status: 'idle',
    error: null,
    update: null,
    show: false
};

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
    const response = await api.fetchData();
    return [...response.data]
})

export const createPost = createAsyncThunk('posts/createPost', async (newPost, { rejectWithValue }) => {
    let images = [];
    const { file } = newPost;
    try {
        for (const item of file) {
            const formData = new FormData();
            formData.append('file', item.file)
            formData.append('upload_preset', 'my-uploads')
            const data = await fetch('https://api.cloudinary.com/v1_1/gennttllee/image/upload', {
                method: 'POST',
                body: formData
            }).then(r => r.json());
            images.push(data.secure_url);
        }
        const post = { ...newPost, file: [...images] }
        const response = await api.createPost(post);
        return response.data
    } catch (error) {
        throw rejectWithValue(error)
    }
})

export const updatePost = createAsyncThunk('post/updatePost', async ({ id, data }, { rejectWithValue }) => {
    let images = [];
    const pictures = data.file;
    try {
        for (const item of pictures) {
            if (item.base64) {
                const formData = new FormData();
                formData.append('file', item.file)
                formData.append('upload_preset', 'my-uploads')
                const data = await fetch('https://api.cloudinary.com/v1_1/gennttllee/image/upload', {
                    method: 'POST',
                    body: formData
                }).then(r => r.json());
                images.push(data.secure_url);
            } else {
                images.push(item)
            }
        }
        const post = { ...data, file: [...images] }
        const response = await api.updatePost(id, post);
        return response.data
    } catch (error) {
        throw rejectWithValue(error)
    }
})

export const deletePost = createAsyncThunk('post/delete', async (id) => {
    await api.deletePost(id);
    return id;
})

export const likePost = createAsyncThunk('post/likePost', async ({ id, userInfo }) => {
    const response = await api.likePost(id, userInfo);
    return response.data
})

export const commentPost = createAsyncThunk('post/comment', async (data) => {
    const id = data.post._id
    const response = await api.commentPost(data, id);
    return response.data
})

const postSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        populate: (state, action) => {
            state.update = action.payload;
            state.show = !state.show
        },
        populated: (state, action) => {
            state.update = null;
        },
        setShow: (state, action) => {
            state.show = !state.show
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchPosts.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.posts = action.payload
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error
            })
            .addCase(createPost.fulfilled, (state, action) => {
                state.posts.unshift(action.payload)
            })
            .addCase(updatePost.fulfilled, (state, action) => {
                const newData = [];
                state.posts.forEach(post => {
                    if (post._id === action.payload._id) {
                        newData.push(action.payload)
                    } else {
                        newData.push(post)
                    }
                })
                state.posts = newData;
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                const newData = [];
                state.posts.forEach(post => {
                    if (post._id === action.payload) {
                        console.log('')
                    } else {
                        newData.push(post)
                    }
                })
                state.posts = newData;
            })
            .addCase(likePost.fulfilled, (state, action) => {
                const newData = [];
                state.posts.forEach(post => {
                    if (post._id === action.payload._id) {
                        newData.push(action.payload)
                    } else {
                        newData.push(post)
                    }
                })
                state.posts = newData;
            })
            .addCase(commentPost.fulfilled, (state, action) => {
                const newData = [];
                state.posts.forEach(post => {
                    if (post._id === action.payload._id) {
                        newData.push(action.payload)
                    } else {
                        newData.push(post)
                    }
                })
                state.posts = newData;
            })
    }
})

export const { populate, populated, setShow } = postSlice.actions;
export const show = (state) => state.posts.show
export const selectUpdate = (state) => state.posts.update;
export const selectAllPosts = (state) => state.posts.posts;
export const getPostStatus = (state) => state.posts.status;
export const getPostError = (state) => state.posts.error;

export default postSlice.reducer