import React from 'react'
import { Speaking_Type } from './Speaking_Type';

export const Main_Speaking_Type = ({ obj }) => {
    let question_text = JSON.parse(obj?.question_data);
  return (<>

    <div>Main Speaking Type Page</div>
    <Speaking_Type />
    </>
  )
}
