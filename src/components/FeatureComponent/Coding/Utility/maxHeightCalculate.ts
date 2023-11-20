export const maxHeightCalculate=(array:[])=>{
  
let maxHeight=0;
for(let item of array){
    console.log(item?.offsetHeight)
    
    let height=item?.offsetHeight||0
    if(height>maxHeight)
    maxHeight=height

}
console.log(maxHeight)
maxHeight=maxHeight?maxHeight:"initial"
return maxHeight
}