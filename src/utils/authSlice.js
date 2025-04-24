import { createSlice } from '@reduxjs/toolkit';

const getInitialAuthState = () => {
    const savedUser = localStorage.getItem('user');
    return {
        isAuthenticated: !!savedUser,
        user: savedUser ? JSON.parse(savedUser) : null,
    };
};

const initialState = getInitialAuthState();

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload;
            localStorage.setItem('user', JSON.stringify(action.payload));
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            localStorage.removeItem('user');
        },
        updateUser: (state, action) => {
            state.user = { ...state.user, ...action.payload };
            localStorage.setItem('user', JSON.stringify(state.user));
        }
    }
});

export const { login, logout, updateUser } = authSlice.actions;

export default authSlice.reducer;