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
  return (
    <>
      {item?.hasSubRoute ? (
        <ul
          onMouseLeave={() => handleOpenSubMenu(-1)}
          className={`bg-header-black text-white transform absolute scale-
         transition duration-150 ease-in-out origin-top flex min-w-[260px] flex-col min-h-[90px] items-center -right-[1px]
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
                className="rounded-sm w-full relative item-center"
                key={index}
              >
                <div
                  className="flex gap-2 px-3 pl-6 pr-3 py-3 hover:bg-black relative item-center "
                  style={{ cursor: "pointer" }}
                >
                  <div className={"w-48"} style={{ display: "block" }}>
                    <div
                      className="flex gap-2"
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
                      <div> {subRouteItem?.name}</div>
                    </div>
                  </div>
                </div>
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
