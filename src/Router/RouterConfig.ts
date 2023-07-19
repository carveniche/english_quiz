import Whiteboard from "../components/FeatureComponent/Whiteboard/Whiteboard"
import AllScreen from "../components/FeatureComponent/AllScreen/AllScreen"
import Coding from "../components/FeatureComponent/Coding/Coding"
import Lesson from "../components/FeatureComponent/Lesson/Lesson"
import Mathzone from "../components/FeatureComponent/Mathzone/Mathzone"
import MyScreen from "../components/FeatureComponent/MyScreen/MyScreen"
import React from "react"
interface routerConfig{
    path:String,
    key:String,
    exact:Boolean,
    component:React.ComponentType,
    name:String,

}
const routerConfig:routerConfig[]=[
    {
        path:"/allscreen",
        key:"/allscreen",
        exact:true,
        component:AllScreen,
    
        name:"All Screen",
       
    },
    {
        path:"/myscreen",
        key:"/myscreen",
        exact:true,
        component:MyScreen,
        name:"My Screen"

    },
    {
        path:"/coding",
        key:"/coding",
        exact:true,
        component:Coding,
        name:"Coding"
    },
    {
        path:"/mathzone",
        key:"/mathzone",
        exact:true,
        component:Mathzone,
        name:"Mathzone"
    },
    {
        path:"/Whiteboard",
        key:"/Whiteboard",
        exact:true,
        component:Whiteboard,
        name:"Whiteboard"
    },
    {
        path:"/Lesson",
        key:"/Lesson",
        exact:true,
        component:Lesson,
        name:"Lesson"
    },
]
export default routerConfig