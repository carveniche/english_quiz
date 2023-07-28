import { MouseEventHandler } from 'react'
interface CloseIconButton{
onClick:MouseEventHandler|undefined
}
export default function CloseIconButton({onClick}:CloseIconButton) {
   
  return (
    <div className='cursor-pointer'>
        <img src="/menu-icon/Close.svg" onClick={onClick}/>
    </div>
  )
}
