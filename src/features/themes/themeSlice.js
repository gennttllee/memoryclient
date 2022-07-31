import { createSlice, } from "@reduxjs/toolkit";

const initialState = {
    darkMode: localStorage.getItem('theme') ? localStorage.getItem('theme') : null,
};

const themeSlice = createSlice({
    name: 'darkMode',
    initialState,
    reducers: {
        toggle: (state) => {
            if (state.darkMode) {
                state.darkMode = null;
                localStorage.removeItem('theme')
            } else {
                state.darkMode = true
                localStorage.setItem('theme', true)
            }
        }
    }
})

export const { toggle } = themeSlice.actions;
export const theme = (state) => state.theme.darkMode;
export default themeSlice.reducer