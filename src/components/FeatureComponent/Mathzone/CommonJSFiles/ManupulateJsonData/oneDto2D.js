export const student_answer="studentAnswer"
export default function oneDto2D(arr){
    let temp=[]
for(let i=0;i<arr?.length;i++){

    let {row}=arr[i]
    let tempArr=temp[Number(row)]||[]
    tempArr.push({...arr[i]})
    temp[Number(row)]=[...tempArr]
}
return temp
}