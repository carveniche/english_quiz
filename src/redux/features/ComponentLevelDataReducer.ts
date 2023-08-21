import { createSlice } from "@reduxjs/toolkit"

export interface ComponentLevelData{
    mathzone:object
}

const initialState={
    mathzone:{}
}

const ComponentLevelDataReducer=createSlice({
    name:"ComponentLevelData",
    initialState,
    reducers:{
        changeMathzoneData:(state,action)=>{
            state.mathzone=action.payload||{}
        }
    }
})
export const {changeMathzoneData}=ComponentLevelDataReducer.actions
export default ComponentLevelDataReducer.reducer