import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./slices/counterSlice"
import userReducer from "./slices/userSlice"
import socketReducer from "./slices/socketSlice"
import roomReducer from "./slices/roomSlice"

export const store = configureStore({
    reducer: {
        counter: counterReducer,
        user: userReducer,
        socket: socketReducer,
        room: roomReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch