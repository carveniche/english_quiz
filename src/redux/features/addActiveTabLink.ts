import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { MAXIMUMACTIVETAB, ROUTERKEYCONST } from "../../constants"
import defaultRouter from "../../Router/defaultRouter"
export interface ActiveTabParams{
    path:String,
    key:String,
    name:String,
    icon: String
}
export interface activeTabStateReducer{
    activeTabArray:ActiveTabParams[]
    currentSelectedRouter:String
}

const initialState:activeTabStateReducer={
activeTabArray:[{
    path:defaultRouter.path,
    key:defaultRouter.key,
    name:defaultRouter.name,
    icon:defaultRouter.icon
}],
currentSelectedRouter:ROUTERKEYCONST.allScreen
}
const activeTabReducer=createSlice({
    name:"addToActiveTab",
    initialState,
    reducers:{
        
        addToActiveTab:(state,action:PayloadAction<ActiveTabParams>)=>{
            
          
            const {activeTabArray}=state
            let notIncluded=false
            state.currentSelectedRouter=action.payload.key
            for(let item of activeTabArray){
                if(item.key===action.payload.key)
                notIncluded=true
            }
       
          if(!notIncluded) {
            if(activeTabArray.length===MAXIMUMACTIVETAB){
                activeTabArray.shift()
            }
            activeTabArray.push({...action.payload})
        }
        },
        deleteFromActiveTab:(state,action:PayloadAction<String>)=>{
            let {activeTabArray}=state
            // const navigate=useNavigate()
            activeTabArray=activeTabArray.filter(item=>item.key!==action.payload)
            console.log(activeTabArray)
            let currentTab:String=state.currentSelectedRouter
            if(!activeTabArray.length){
               const {path,key,icon,name}=defaultRouter
                activeTabArray=[{
                    path,key,icon,name
                }]
                
                currentTab=key
            }
            else{
                if(action.payload==state.currentSelectedRouter){
                    currentTab=state.activeTabArray[activeTabArray.length-1].key
                }
                // navigate(`${currentTab}?${getQueryParams()}`)
                
            }
            return {...state,activeTabArray,currentSelectedRouter:currentTab}
        }
    }
})
export const {addToActiveTab,deleteFromActiveTab}=activeTabReducer.actions
export default activeTabReducer.reducer