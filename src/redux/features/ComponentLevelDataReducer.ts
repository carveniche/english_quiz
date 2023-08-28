import { createSlice } from "@reduxjs/toolkit"

export interface ComponentLevelData{
    mathzone:object;
    flaggedQuestion:object;
    otherData:object;
}

const initialState={
    mathzone:{},
    flaggedQuestion :{},
    otherData:{}
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
            
             
                    if(payload?.isFetchAgain){
                        payload.currentFetchTime=Number(!(state?.flaggedQuestion?.currentFetchTime||""))
                    }
                    state.flaggedQuestion=payload||{}
                
            
        },
        homeWorkQuestionDataTrack:(state:ComponentLevelData,action:any)=>{

            const {payload}=action;
            state.otherData=payload||{}
        }
    }
})
export const {changeMathzoneData,flagQuestionDetailsStore,homeWorkQuestionDataTrack}=ComponentLevelDataReducer.actions
export default ComponentLevelDataReducer.reducer