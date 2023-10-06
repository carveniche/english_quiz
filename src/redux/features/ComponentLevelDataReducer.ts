import { createSlice } from "@reduxjs/toolkit"


interface localLessonWhiteboardProps{
    currentIndex:number;
    identity:string,
    imagePoints:object
}
interface remoteLessonDataWhiteBoardDataProps{
    identity:string,
    imagePoints:object,
    currentIndex:number
}
export interface ComponentLevelData{
    mathzone:object;
    flaggedQuestion:object;
    otherData:otherData;
    remoteLessonDataWhiteBoardData:object;
    localLessonDataWhiteBoardData:localLessonWhiteboardProps;
    lessonWhiteBoardCount:number;
    lessonWhiteBoardData:remoteLessonDataWhiteBoardDataProps[]
    
}
interface otherData{
    [key:string]:string | number | object
}
const initialState={
    mathzone:{},
    flaggedQuestion :{},
    otherData:{},
    whiteBoardData:{},
    currentLessonIndex:0,
    remoteLessonDataWhiteBoardData:{},
    lessonWhiteBoardData:[],
    lessonWhiteBoardCounts:0,
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
        },
        lessonWhiteboardComponentLevelDataTrack:(state:any,action:any)=>{
            const {payload}=action
           state.remoteLessonDataWhiteBoardData=payload
           state.lessonWhiteBoardCounts+=1
    },
    currentLessonPdfIndexUpdate:(state:any,action:any)=>{
        const {payload}=action
        state.currentLessonIndex=Number(payload)||0
        state.lessonWhiteBoardCounts=0

    },
    saveAllLessonWhiteBoardData:(state:any,action:any)=>{
        const {payload}=action
        const {index,whiteBoardData}=payload
        let {lessonWhiteBoardData} = state
        lessonWhiteBoardData[payload.index]=payload.whiteBoardData
        state.remoteLessonDataWhiteBoardData={}
        state.lessonWhiteBoardCounts=0
    }
}
})
export const {changeMathzoneData,flagQuestionDetailsStore,homeWorkQuestionDataTrack,cicoComponentLevelDataTrack,whiteBoardComponentLevelDataTrack,lessonWhiteboardComponentLevelDataTrack,saveAllLessonWhiteBoardData,currentLessonPdfIndexUpdate}=ComponentLevelDataReducer.actions
export default ComponentLevelDataReducer.reducer