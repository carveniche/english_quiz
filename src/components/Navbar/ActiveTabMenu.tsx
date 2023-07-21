import React from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { RootState } from "../../redux/store";
import CloseIconButton from "./CloseIconButton";
import TabIcon from "./TabIcon";

export default function ActiveTabMenu() {
  const { activeTab } = useSelector(
    (state: RootState) => state.activeTabReducer
  );
  const activeLink = activeTab;
  const handleCloseButton = (key: String | undefined) => {};
  return activeLink.length ? (
    <div className="flex gap-x-10">
      {activeLink.map((item) => (
        <div key={`${item.key}`} className="text-BDBDBD">
          <TabIcon src={item?.icon} />
          <div>
            <NavLink to={`${item.path}`}>{item.name}</NavLink>
          </div>
          <CloseIconButton onClick={() => handleCloseButton(item.key)} />
        </div>
      ))}
    </div>
  ) : (
    <></>
  );
}
