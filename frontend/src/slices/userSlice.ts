import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
interface userState {
    username: string | any
}
const initialState: userState = {
    username: "User"
}

const userSlice = createSlice({
    name: 'User',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<string>) => {
            state.username = action.payload
        },
        removeUser: (state) => {
            state.username = ""
        }
    }
})

export const { setUser, removeUser } = userSlice.actions
export default userSlice.reducer