export const handleLoadImage=(src:string,cb:Function)=>{
  
    if(src){
        let image=new window.Image()
        image.src=src
        image.onload = function () {
            console.log(image)
            if(typeof cb==="function")
            cb(image)
          };
    }
     }
