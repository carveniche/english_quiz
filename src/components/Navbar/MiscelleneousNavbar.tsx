import { useState } from "react";
import TabIcon from "./TabIcon";
import { ActiveTabParams } from "../../redux/features/addActiveTabLink";

interface MiscelleneousNavbarInterface {
  index: number;
  handleOpenSubMenu: Function;
  handleClick: Function;
  queryParams: string;
  item: ActiveTabParams;
  calcWidth: number;
  elementPosition: number;
}
export default function MiscelleneousNavbar({
  index,
  handleOpenSubMenu,
  queryParams,
  handleClick,
  item,
  elementPosition,
  calcWidth,
}: MiscelleneousNavbarInterface) {
  const [open, setOpen] = useState(false);
  return (
    <>
      {item?.hasSubRoute ? (
        <ul
          onMouseLeave={() => handleOpenSubMenu(-1)}
          className={`bg-header-black text-white transform absolute scale-
         transition duration-150 ease-in-out origin-top flex min-w-[260px] flex-col min-h-[48px] items-center -right-px
         `}
          style={{
            maxHeight: `calc(100vh - 72px - 45.28px - 61.61px - ${
              elementPosition * calcWidth
            }px)`,
            overflowX: "hidden",
            overflowY: "auto",
          }}
        >
          {item?.subRoute.map((subRouteItem, index) => {
            return (
              <li
                className="rounded-sm px-3 pl-6 pr-3 py-3  relative item-center"
                key={index}
              >
                <div
                  className="flex gap-2 relative item-center "
                  style={{ cursor: "pointer" }}
                >
                  <div className={"w-48"} style={{ display: "block" }}>
                    <div
                      className="flex gap-2"
                      onClick={() => setOpen((prev) => !prev)}
                    >
                      <div> {subRouteItem?.name}</div>
                      {subRouteItem.hasChildren && (
                        <TabIcon
                          src={`/menu-icon/chevron_${open ? "up" : "down"}.svg`}
                        />
                      )}
                    </div>
                  </div>
                </div>
                {subRouteItem.hasChildren && open && (
                  <div className="py-3 pl-2">
                    {subRouteItem?.subRoute.map((subRouteInner, index) => (
                      <div>
                        <div
                          onClick={() =>
                            handleClick({
                              path: `${item.path}${subRouteItem.key}`,
                              key: item.key,
                              name: `${item.name}:${subRouteItem.name} `,
                              icon: item.icon,
                              extraParams: {},
                            })
                          }
                        >
                          {subRouteInner?.name}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <></>
      )}
    </>
  );
}
