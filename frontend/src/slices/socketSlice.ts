import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface sokcet {
    socket: WebSocket | null
}

const initialState: sokcet = {
    socket: null
}

const socketSlice = createSlice({
    name: 'socket',
    initialState,
    reducers: {
        setSocket: (state, action: PayloadAction<{ socket: WebSocket | null }>) => {
            state.socket = action.payload.socket
        },
        removeSocket: (state) => {
            state.socket = null
        }
    }
})

export const { setSocket, removeSocket } = socketSlice.actions
export default socketSlice.reducer