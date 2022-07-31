import {configureStore} from '@reduxjs/toolkit';
import postReducer from '../features/posts/postSlice';
import themeReducer from '../features/themes/themeSlice';
import userReducer from '../features/users/userSlice';
import searchReducer from '../features/search/searchSlice'

export const store = configureStore({
    reducer : {
        posts : postReducer,
        theme : themeReducer,
        users : userReducer,
        search : searchReducer,
    }
})