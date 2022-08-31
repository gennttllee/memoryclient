import {configureStore} from '@reduxjs/toolkit';
import postReducer from '../features/posts/postSlice';
import themeReducer from '../features/themes/themeSlice';
import userReducer from '../features/users/userSlice';
import searchReducer from '../features/search/searchSlice'
import chatReducer from '../features/chats/chatSlice';

export const store = configureStore({
    reducer : {
        posts : postReducer,
        theme : themeReducer,
        users : userReducer,
        search : searchReducer,
        chat : chatReducer
    }
})