export default function handleResizeWidth(identity){
    
    let myPage=document.getElementById('quizbodypage')
    let subTractElem=document.getElementById('outerBoxContainerOuiz')
    let removeHeight=subTractElem?.getBoundingClientRect()?.bottom

    myPage.style=`min-height:calc(100vh - ${removeHeight}px);height:calc(100vh - ${removeHeight}px);max-height:calc(100vh - ${removeHeight}px) `
    let id=setTimeout(()=>{
clearTimeout(id)
handleResizeCheckBtn()
    },0)
}
export function handleResizeCheckBtn(){
    let myPage=document.getElementById('quizWhitePage')
    let tops=myPage?.getBoundingClientRect()?.top||0
    let right=myPage?.getBoundingClientRect()?.right
    let btn=document.getElementById('solveBtn')
    
    if(btn){
    let widthBtn=btn?.offsetWidth

    btn.style=`top:${tops - 41}px;left:${right - widthBtn -10}px`
}}
const handleResizeWidth2=()=>{
    let myPage=document.getElementById('myPageOuiz')
    let subTractElem=document.getElementsByClassName('containerforparent')[0]

    let removeHeight=subTractElem?.clientHeight||0
    myPage.style=`min-height:calc(100vh - ${100}px);height:calc(100vh - ${100}px);max-height:calc(100vh - ${100}px); `
}