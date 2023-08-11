function changeQuestionContent(data){
for(let i=0;i<data?.length;i++){
if(Array.isArray(data[i])){
    data[i]=changeQuestionContent(data[i])
}
else if(data[i]?.isMissed=="true"){
    if(data[i]?.value!==undefined)
    data[i].value=symbolCollection()[String(data[i]?.value)?.trim()]?symbolCollection()[String(data[i]?.value)?.trim()]:data[i]?.value
    else if(data[i]?.numvalue!==undefined)
    data[i].numvalue=symbolCollection()[String(data[i]?.numvalue)?.trim()]?symbolCollection()[String(data[i]?.numvalue)?.trim()]:data[i]?.numvalue
    else if(data[i]?.count!==undefined)
    data[i].count=symbolCollection()[String(data[i]?.count)?.trim()]?symbolCollection()[String(data[i]?.count)?.trim()]:data[i]?.count
}
}
return data
}

function changeChoices(data){
    for(let i=0;i<data?.length;i++)
    {
        if(typeof data[i]=='object'){
            if(data[i]?.value!==undefined)
            {
                data[i].value=symbolCollection()[String(data[i]?.value)?.trim()]?symbolCollection()[String(data[i]?.value)?.trim()]:data[i]?.value
            }
            else if(data[i]?.image!==undefined)
            {
                data[i].image=symbolCollection()[String(data[i]?.image)?.trim()]?symbolCollection()[String(data[i]?.image)?.trim()]:data[i]?.image
            }
        }
        else{
            data[i]=symbolCollection()[String(data[i])?.trim()]?symbolCollection()[String(data[i])?.trim()]:data[i]
        }
    }
    return data

}

export const symbolCollection=()=>{
    return {
        '&lt':'<',
        '&gt':'>'
        
    }
}
export default function replaceJsonData(data){
    let notIncluded=["tenframes","questiontextoptions","countofobjectsyesno","hundreds_chart","memory_card_game","options_multiple_pictures","questiontextimages","number_bond"]
    if(data?.question_data &&notIncluded.includes(data?.question_data[0]?.question_type))
    return data
    let question_text=""
    try{
        question_text=JSON.parse(data?.question_data[0]?.question_text)
    }
    catch(e){
    console.log(e)
    }
 
if(typeof question_text!=="object")
return data
    if(typeof question_text=="object")
    {
        let questionContent=question_text?.questionContent
       
          
        if(Array.isArray(questionContent)){
  
            questionContent=changeQuestionContent(questionContent)
           
            question_text={...question_text,questionContent:questionContent}
          
        }
    }
    let choices=''
    
    choices=question_text?.choices
  
    if(Array.isArray(choices))
    {
        choices=changeChoices(choices)

        question_text={...question_text,choices}
        
    }

    if(question_text?.answer!==undefined){
        question_text.answer=symbolCollection()[String(question_text?.answer)?.trim()]?symbolCollection()[String(question_text?.answer)?.trim()]:question_text?.answer
    }
    if(question_text?.answerValue!==undefined){
        question_text.answerValue=symbolCollection()[String(question_text?.answerValue)?.trim()]?symbolCollection()[String(question_text?.answerValue)?.trim()]:question_text?.answerValue
    }
    if(question_text?.answerCount!==undefined){
        question_text.answerCount=symbolCollection()[String(question_text?.answerCount)?.trim()]?symbolCollection()[String(question_text?.answerCount)?.trim()]:question_text?.answerCount
    }

    if(typeof question_text=="object"){
        try{
question_text=JSON.stringify(question_text)
        }
        catch(e)
        {
            console.log('error')
        }
    data.question_data[0]={...data?.question_data[0],question_text}

}

    return data

}