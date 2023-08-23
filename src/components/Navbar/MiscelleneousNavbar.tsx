import React from "react";
import TabIcon from "./TabIcon";
import { ActiveTabParams } from "../../redux/features/addActiveTabLink";
import { NavLink } from "react-router-dom";
import { ROUTERKEYCONST } from "../../constants";
interface MiscelleneousNavbarInterface {
  index: number;
  handleOpenSubMenu: Function;
  handleClick: Function;
  queryParams: string;
  item: ActiveTabParams;
}
export default function MiscelleneousNavbar({
  index,
  handleOpenSubMenu,
  queryParams,
  handleClick,
  item,
}: MiscelleneousNavbarInterface) {
  return (
    <>
      {" "}
      <li
        key={index}
        className="rounded-sm px-3 pl-6 pr-3 py-3 hover:bg-black w-full flex gap-2"
        onMouseEnter={() => handleOpenSubMenu(index)}
      >
        <NavLink
          to={`${item.path}${ROUTERKEYCONST.miscellaneous.subRoute.flagQuestion.route}?${queryParams}`}
          onClick={() =>
            handleClick({
              path: `${item.path}${ROUTERKEYCONST.miscellaneous.subRoute.flagQuestion.route}`,
              key: ROUTERKEYCONST.miscellaneous.subRoute.flagQuestion.keys,
              name: item.name,
              icon: item.icon,
              extraParams: {},
            })
          }
          className={"w-48"}
          style={{ display: "block" }}
        >
          <div className="flex gap-2">
            <TabIcon src={item.icon} />
            <div> {item.name}</div>
          </div>
        </NavLink>
        <TabIcon src={"/menu-icon/chevron.svg"} />
      </li>
    </>
  );
}
