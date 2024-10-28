import React from 'react'
import  Speaking_Type from './Speaking_Type';
import { WRITING_GPT } from "../../Utility/Constant";


export const Main_Speaking_Type = ({ obj }) => {
    let question_text = JSON.parse(obj?.question_data);
    let questionResponse=null;
    try{
      questionResponse=obj[WRITING_GPT.questionResponse]||null
      questionResponse=JSON.parse(questionResponse)
    }
    catch(e){
      console.log(e)
  
    }
    
  return (<>

    <div style={{display:'flex',justifyContent: 'center', alignItems: 'center', gap: '0.75rem',backgroundColor:'#f5fff6',padding:'1rem', boxShadow: 'rgba(170, 157, 157, 35%) 0px 5px 15px',
  borderRadius: '10px'}}> 
    <img id="message_img" src="https://d325uq16osfh2r.cloudfront.net/Speaking_type/person-speaking-clipart-md.png" alt="Audio recording" width="45" height="45" />
    <div style={{fontSize:'15px'}}>Please sit in a quiet place and be loud and clear while recording</div>
    </div>
   
  <br/>
    <Speaking_Type questionData={question_text}  questionResponse={questionResponse}  />
    </>
  )
}
