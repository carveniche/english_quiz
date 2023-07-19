import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { ActiveTabParams, addToActiveTab } from "../../redux/features/addActiveTabLink";
import routerConfig from "../../Router/RouterConfig";


export default function Navbar() {
  const queryParams = new URLSearchParams(window.location.search).toString()
  const dispatch=useDispatch()
  const handleClick=({path,key,name}:ActiveTabParams)=>{
dispatch(addToActiveTab({path,key,name}))
  }
  return (
    <div style={{position:'fixed',zIndex:99999,left:180,top:20}} className="text-F2F2F2">
     {
      routerConfig.map((item)=>{console.log(item); return <div key={item.key}>
      <NavLink to={`${item.path}?${queryParams}`}  onClick={()=>handleClick({path:item.path,key:item.key,name:item.name})}>{item.name}</NavLink>
    </div>})
     }
    </div>
  );
}
