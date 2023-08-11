import React, { useState } from "react"

export default function SpecailUserView({
    obj,
  userInfo,
  identity,
  setScoreUpdate,
  studentResponseSenderMathZone,
  conceptTag,
  conceptName,
  setCount,
  count,
  refreshQuestion,
  resultView
})
{
    const [state,setState]=useState("teacher")
    const handleRoleChange=(value)=>{
        setState(value)
    }
       return <div>
        <div>
      <label>Json Data</label>  <input type="radio" name="role" value="json" checked={state==="json"} onChange={()=>handleRoleChange()}/>
      <label>Teacher View</label>  <input type="radio" name="role" value="teacher" checked={state==="teacher"} onChange={()=>handleRoleChange()}/>
      <label>Student View</label>  <input type="radio" name="role" value="student" checked={state==="teacher"} onChange={()=>handleRoleChange()}/>
        </div>
        {
            state==="teacher"
        }
       </div> 
    }