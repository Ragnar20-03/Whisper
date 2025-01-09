import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { act } from "react";


// Shape of the state
interface CounterState {
    value: number
}

// set Initial Vlaue ;
const initialState: CounterState = {
    value: 0
}

// Create Slice 

const counterSlice = createSlice({
    name: 'counter',  // name of slice 
    initialState, // intialState of Slice  , 
    reducers: { // actions to change the state 
        increment: (state) => {
            state.value += 1
        },
        decrement: (state) => {
            state.value += 1
        },
        incrementByAmount: (state, action: PayloadAction<number>) => {
            state.value += action.payload
        }
    }

})

// Export the actions so components can use them
export const { increment, decrement, incrementByAmount } = counterSlice.actions;

// Export the reducer to include it in the store
export default counterSlice.reducer;