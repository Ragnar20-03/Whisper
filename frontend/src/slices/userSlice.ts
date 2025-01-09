import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";

interface userState {
    username: string | any
    isAdmin: boolean
}
const initialState: userState = {
    username: "User",
    isAdmin: false
}

const userSlice = createSlice({
    name: 'User',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<{ username: string, isAdmin: boolean }>) => {
            console.log("isAdmin is : ", action.payload);
            state.username = action.payload;
            state.isAdmin = action.payload.isAdmin

        },
        removeUser: (state) => {
            state.username = ""
            state.isAdmin = false
        }
    }
})

export const { setUser, removeUser } = userSlice.actions
export default userSlice.reducer