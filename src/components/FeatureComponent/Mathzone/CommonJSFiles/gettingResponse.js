export const serializeResponse = (target) => {
    var element = document.getElementById(target);
    var html = element.outerHTML;
  
  //  console.log(element.removeChild(element.children[1]))
 //  console.log(html)
    var ques = { html: html };
 
    return html
} 

export const serializeResponse2 = (target) => {
  var element = document.getElementById(target);
  var html = element.innerHTML;

//  console.log(element.removeChild(element.children[1]))
//  console.log(html)
  var ques = { html: html };

  return html
} 
