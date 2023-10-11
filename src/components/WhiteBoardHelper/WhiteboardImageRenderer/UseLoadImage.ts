import React, { useState } from 'react'

export default function UseLoadImage() {
 const [image,setImage]=useState("")
 const handleLoadImage=(src:string)=>{
if(src){
    let image=new window.Image()
    image.onload = function () {
        let height = 400;
        if (identity === "tutor") height = props.height;
        let imageWidthHeightRatio = image.width / image.height;
        let width = height * imageWidthHeightRatio;
  
        imageDimension.current = {
          width: width,
          height: height,
        };
        handleLoad(image);
      };
}
 }
 return [image,handleLoadImage]
}
