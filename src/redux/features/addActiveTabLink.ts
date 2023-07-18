import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { MAXIMUMACTIVETAB } from "../../constants"

export interface ActiveTabParams{
    path:String,
    key:String|undefined,
    name:String
}

const initialState:ActiveTabParams[]=[]
const activeTabReducer=createSlice({
    name:"addToActiveTab",
    initialState,
    reducers:{
        addToActiveTab:(state,action:PayloadAction<ActiveTabParams>)=>{
            let notIncluded=false
            for(let item of state){
                if(item.key===action.payload.key)
                notIncluded=true
            }
       
          if(!notIncluded) {
            if(state.length===MAXIMUMACTIVETAB){
                state.shift()
            }
            state.push({...action.payload})
        }
        }
    }
})
export const {addToActiveTab}=activeTabReducer.actions
export default activeTabReducer.reducer