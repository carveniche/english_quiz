import { createSlice } from "@reduxjs/toolkit"

export interface ComponentLevelData{
    mathzone:object;
    flaggedQuestion:object;
    otherData:otherData;
}
interface otherData{
    [key:string]:string | number | object
}
const initialState={
    mathzone:{},
    flaggedQuestion :{},
    otherData:{},
    whiteBoardData:{}
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
        },
        cicoComponentLevelDataTrack:(state:ComponentLevelData,action:any)=>{
            const {payload}=action
            console.log(payload)
            for(let key in payload){
                state.otherData[key]=payload[key]
            }

        },
        whiteBoardComponentLevelDataTrack:(state:any,action:any)=>{
            const {payload}=action
        
            state.whiteBoardData.whiteBoardsPoints=payload
            state.whiteBoardData.count=Number(state.whiteBoardData.count+1)||1
        }
    }
})
export const {changeMathzoneData,flagQuestionDetailsStore,homeWorkQuestionDataTrack,cicoComponentLevelDataTrack,whiteBoardComponentLevelDataTrack}=ComponentLevelDataReducer.actions
export default ComponentLevelDataReducer.reducer