
export default function numberSystemConverter(n,numberSystem,chartType){
    let temp = [];
      for (let i = 0; i < n; i++) {
        if(chartType=="indian")
        temp.push(numberSystem["indian"][i]);
        else{
          temp.push(numberSystem["international"][i]);
        }
      }
      temp = temp.reverse();
      return temp
}