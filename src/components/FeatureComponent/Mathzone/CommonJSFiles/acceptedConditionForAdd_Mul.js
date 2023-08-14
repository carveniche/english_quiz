
function checkIsMissedCondition(obj,condition){
    let {isMissed}=obj
    if(String(isMissed)?.trim()===condition)
    return 1
    return 0
}
function checkForEmptyValue(arr,key){
for(let i=0;i<arr.length;i++){
    if(checkIsMissedCondition(arr[i],"true")){
        let value=arr[i][key]
        // console.log(value)
        if(value===""||value===undefined){
            
            return 0
        }
    }
}

return 1
}

function getValueObject(obj,key){
    return obj[key]
}
export default function acceptedConditionForAdd_Mul(arr){
if(Array.isArray(arr)){
    let n=arr?.length
    if(n===5){
        let acceptedValue=["+","x"]
        if(acceptedValue.includes(String(arr[1].value)?.trim())){
         if(checkIsMissedCondition(arr[0],"true"))
         {
            if(checkIsMissedCondition(arr[2],"true"))
            {
                if(checkForEmptyValue(arr,'dropVal'))
                {
                    let value1=getValueObject(arr[0],'dropVal')
                    let value2=getValueObject(arr[2],'dropVal')
                    let value3=getValueObject(arr[4],checkIsMissedCondition(arr[4],'true')?"dropVal":"value")
                    let sums=Number(value1)+Number(value2)
                    // console.log(sums)
                    if(sums===Number(value3))
                    return 2
                    return 1
                }
                
            }
         }  
        }
    }
}

}