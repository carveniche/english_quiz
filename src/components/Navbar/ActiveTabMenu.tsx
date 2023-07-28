import React,{useEffect} from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { deleteFromActiveTab } from "../../redux/features/addActiveTabLink";
import { RootState } from "../../redux/store";
import { getQueryParams } from "../../utils/getQueryParams";
import CloseIconButton from "./CloseIconButton";
import TabIcon from "./TabIcon";

export default function ActiveTabMenu() {
  const dispatch=useDispatch()
  const navigation=useNavigate()
  const {activeTabArray,currentSelectedRouter}  = useSelector(
    (state: RootState) => state.activeTabReducer
  );
  const handleCloseButton = (key: String | undefined) => {
    dispatch(deleteFromActiveTab(`${key}`))
  };
  useEffect(()=>{
    navigation(`${currentSelectedRouter}?${getQueryParams()}`)
  },[currentSelectedRouter])
  return activeTabArray.length ? (
    <>
      {activeTabArray.map((item) => (
        <div key={`${item.key}`} className="activeTabLayout">
          <TabIcon src={item.icon} />
          <div>
            <NavLink to={`${item.path}`}>{item.name}</NavLink>
          </div>
          <CloseIconButton onClick={() => handleCloseButton(item.key)} />
        </div>
      ))}
    </>
  ) : (
    <></>
  );
}
