import { createSlice } from "@reduxjs/toolkit"

export interface ComponentLevelData{
    mathzone:object;
    flaggedQuestion:object;
}

const initialState={
    mathzone:{},
    flaggedQuestion :{}
}

const ComponentLevelDataReducer=createSlice({
    name:"ComponentLevelData",
    initialState,
    reducers:{
        changeMathzoneData:(state:ComponentLevelData,action:any)=>{
            state.mathzone=action.payload||{}
        },
        flagQuestionDetailsStore:(state:ComponentLevelData,action:any)=>{
            const {payload}=action
            
              console.log(payload)
                    
                    state.flaggedQuestion=payload||{}
                
            
        }
    }
})
export const {changeMathzoneData,flagQuestionDetailsStore}=ComponentLevelDataReducer.actions
export default ComponentLevelDataReducer.reducer