import React from 'react'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { RootState } from '../../redux/store'

export default function ActiveTabMenu() {
    const activeLink=useSelector((state:RootState)=>state.activeTabReducer)
    
  return (
    <div>
        {
        activeLink.map((item=><div key={`${item.key}`}>

            <NavLink to={`${item.path}`} >{item.name}</NavLink>
        </div>))
        }
    </div>
  )
}
