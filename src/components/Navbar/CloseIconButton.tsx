import { MouseEventHandler } from 'react'
interface CloseIconButton{
onClick:MouseEventHandler|undefined
}
export default function CloseIconButton({onClick}:CloseIconButton) {
   
  return (
    <div>
        <img src="/menu-icon/Close.svg" onClick={onClick}/>
    </div>
  )
}
