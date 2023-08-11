import { student_answer } from "./oneDto2D"
export default function oneDInsertValueSelectChoice(arr,value){
for(let i=0;i<arr?.length;i++){
    if(arr[i]?.isMissed==="true"){
        arr[i][student_answer]=value
       
    }
    else{
        arr[i].studentAnswer=""
    }
}
return [...arr]
}