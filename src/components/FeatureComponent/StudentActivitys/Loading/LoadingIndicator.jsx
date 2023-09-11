import React, { useEffect, useState } from 'react'

export default function LoadingIndicator({msg}) {
    const [count,setCount]=useState(0)
    const dotArray=new Array(count).fill(0)
    useEffect(()=>{
let id=setInterval(() => {
    setCount((prev)=>{
        let curr=prev+1
        curr=curr%4
        return curr
    })
}, 500);
return ()=>clearInterval(id)
    },[])
   
  return (<div>
    <h1>{msg}{dotArray.map(()=>".")}</h1>
    </div>
  )
}
