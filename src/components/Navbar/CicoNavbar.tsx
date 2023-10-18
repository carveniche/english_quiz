import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import TabIcon from "./TabIcon";
import { allConceptsDetails } from "../../redux/features/ConceptDetailsRedux";
import { ActiveTabParams } from "../../redux/features/addActiveTabLink";
import { CICO } from "../../constants";
interface props {
  allConceptsDetails: allConceptsDetails;
  item: ActiveTabParams;
  handleClick: Function;
  queryParams: String;
  calcWidth: number;
  elementPosition: number;
  currentSelectedMenuIndex: number;
  handleOpenSubMenu: Function;
}
export default function CicoNavbar({
  allConceptsDetails,
  item,
  handleClick,
  queryParams,
  calcWidth,
  elementPosition,
  currentSelectedMenuIndex,
  handleOpenSubMenu,
}: props) {
  return (
    <>
      <ul
        className={`bg-header-black text-white transform absolute scale-
          transition duration-150 ease-in-out origin-top flex min-w-[260px] flex-col min-h-[80px] items-center right-0
          `}
        style={{
          maxHeight: `calc(100vh - 72px - 45.28px - 61.61px - ${
            elementPosition * calcWidth
          }px)`,
          overflowX: "hidden",
          overflowY: "auto",
        }}
      >
        <li className="rounded-sm w-full relative item-center">
          <div
            className="flex gap-2 px-3 pl-6 pr-3 py-3 hover:bg-black relative item-center "
            style={{ cursor: "pointer" }}
          >
            <NavLink
              key={`${CICO.key}-${CICO.checkIn}`}
              to={`${CICO.path}/${CICO.checkIn}?${queryParams}`}
              onClick={() =>
                handleClick({
                  path: `${CICO.path}/${CICO.checkIn}`,
                  key: `${CICO.key}`,
                  name: `Cico:Check-In`,
                  icon: "",
                  extraParams: {},
                })
              }
              className={"w-48"}
              style={{ display: "block" }}
            >
              Check In
            </NavLink>
          </div>
        </li>
        <li className="rounded-sm w-full relative item-center">
          <div
            className="flex gap-2 px-1 pl-6 pr-3 py-1 hover:bg-black relative item-center "
            style={{ cursor: "pointer" }}
          >
            <NavLink
              key={`${CICO.key}-${CICO.checkOut}`}
              to={`${CICO.path}/${CICO.checkOut}?${queryParams}`}
              onClick={() =>
                handleClick({
                  path: `${CICO.path}/${CICO.checkOut}`,
                  key: `${CICO.key}`,
                  name: `Cico:Check-Out`,
                  icon: "",
                  extraParams: {},
                })
              }
              className={"w-48"}
              style={{ display: "block" }}
            >
              Check Out
            </NavLink>
          </div>
        </li>
      </ul>
    </>
  );
}
