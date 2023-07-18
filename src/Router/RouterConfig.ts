import AllScreen from "../components/FeatureComponent/AllScreen/AllScreen"
import Coding from "../components/FeatureComponent/Coding/Coding"

const routerConfig=[
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
        component:AllScreen,
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
        component:AllScreen,
        name:"Mathzone"
    },
    {
        path:"/Whiteboard",
        key:"/Whiteboard",
        exact:true,
        component:AllScreen,
        name:"Whiteboard"
    },
    {
        path:"/Lesson",
        exact:true,
        component:AllScreen,
        name:"Lesson"
    },
]
export default routerConfig