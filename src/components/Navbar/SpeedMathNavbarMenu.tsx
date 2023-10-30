import { useState } from "react";
import { NavLink } from "react-router-dom";
import { ActiveTabParams } from "../../redux/features/addActiveTabLink";
import { ROUTERKEYCONST } from "../../constants";

interface props {
  item: ActiveTabParams;
  handleClickSpeedMath: Function;
  queryParams: String;
  calcWidth: number;
  elementPosition: number;
  currentSelectedMenuIndex: number;
  handleOpenSubMenu: Function;
}
export default function SpeedMathNavbarMenu({
  item,
  handleClickSpeedMath,
  queryParams,
  calcWidth,
  elementPosition,
  handleOpenSubMenu,
}: props) {
  const [currentSelectedTopic, setCurrentSelectedTopic] = useState(-1);

  const handleSelectTopic = (index: number) => {
    if (index === currentSelectedTopic) {
      setCurrentSelectedTopic(-1);
    } else {
      setCurrentSelectedTopic(index);
    }
  };

  const speedMathLevels = [
    "Level 1",
    "Level 2",
    "Level 3",
    "Level 4",
    "Level 5",
  ];

  return (
    <>
      {
        <ul
          onMouseLeave={() => handleOpenSubMenu(-1)}
          className={`bg-header-black text-white transform absolute scale-
          transition duration-150 ease-in-out origin-top flex min-w-[260px] flex-col min-h-[48px] items-center right-0
          `}
          style={{
            maxHeight: `calc(100vh - 72px - 45.28px - 61.61px - ${
              elementPosition * calcWidth
            }px)`,
            overflowX: "hidden",
            overflowY: "auto",
            // zIndex: 99,
          }}
        >
          {speedMathLevels.map((levels, index) => {
            return (
              <li
                className="rounded-sm  w-full h-full relative item-center"
                key={index}
              >
                <div className="w-full h-full px-3 pl-6 pr-3 py-3 hover:bg-black">
                  <div
                    className="flex gap-2 relative item-center "
                    onClick={() => handleSelectTopic(index)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className={"w-48"} style={{ display: "block" }}>
                      <div className="flex gap-2">
                        <NavLink
                          key={index}
                          to={`/speedmath?${queryParams}`}
                          onClick={() =>
                            handleClickSpeedMath({
                              path: ROUTERKEYCONST.speedmath,
                              key: ROUTERKEYCONST.speedmath,
                              name: "Speed Math",
                              icon: item.icon,
                              extraParams: {
                                speedMathLevel: index + 1,
                              },
                            })
                          }
                          className={"w-48"}
                          style={{ display: "block" }}
                        >
                          {levels}
                        </NavLink>
                      </div>
                    </div>
                    {/* <TabIcon
                    src={`/menu-icon/chevron_${
                      currentSelectedTopic === index ? "up" : "down"
                    }.svg`}
                  /> */}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      }
    </>
  );
}
