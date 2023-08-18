import { createSlice } from "@reduxjs/toolkit"
export interface mathzone{
    status:Boolean,
    demo:Boolean,
    conceptDetails:[]
}
interface conceptDetails{
mathzone:mathzone
}

const initialState:conceptDetails={
    mathzone:{
        status:false,
        demo:false,
        conceptDetails:[]
    }
}
const liveClassConceptDetails=createSlice({
    name:"LiveClassConceptDeails",
    initialState,
    reducers:{
        addToStore:(state,action)=>{
            const {payload}=action
            if(payload.status){
                const {concept_list}=payload
                if(concept_list.length){
                    state.mathzone.conceptDetails=concept_list||[]
                    state.mathzone.status=true
                }
            }
            
        }
    }
})
export const {addToStore}=liveClassConceptDetails.actions
export default liveClassConceptDetails.reducer

