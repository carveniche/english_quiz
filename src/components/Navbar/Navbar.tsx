import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { ActiveTabParams, addToActiveTab } from "../../redux/features/addActiveTabLink";
import routerConfig from "../../Router/RouterConfig";
interface routingParams{
  queryParams:String
}

export default function Navbar({queryParams}:routingParams) {
  const dispatch=useDispatch()
  const handleClick=({path,key,name}:ActiveTabParams)=>{
dispatch(addToActiveTab({path,key,name}))
  }
  return (
    <div>
     {
      routerConfig.map((item)=> <div>
      <NavLink to={`${item.path}?${queryParams}`} key={item.key} onClick={()=>handleClick({path:item.path,key:item.key,name:item.name})}>{item.name}</NavLink>
    </div>)
     }
    </div>
  );
}
