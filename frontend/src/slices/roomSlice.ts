import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface Room {
    roomName: string,
    roomCode: string
}

const initialState: Room = {
    roomName: "",
    roomCode: ""
}

const roomSlice = createSlice({
    name: "room ",
    initialState,
    reducers: {
        setRoom: (state, action: PayloadAction<{ roomName: string, roomCode: string }>) => {
            state.roomName = action.payload.roomName;
            state.roomCode = action.payload.roomCode;
        }
    }
})