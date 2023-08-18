import React from "react";
import { NavLink } from "react-router-dom";
import TabIcon from "./TabIcon";
import { mathzone } from "../../redux/features/ConceptDetailsRedux";
import { ActiveTabParams } from "../../redux/features/addActiveTabLink";
interface props {
  mathzone: mathzone;
  item: ActiveTabParams;
  handleClick: Function;
  queryParams: String;
}
export default function MathzoneNavbar({
  mathzone,
  item,
  handleClick,
  queryParams,
}: props) {
  return (
    <li className="rounded-sm px-3 pl-6 pr-3 py-3 hover:bg-black w-full flex gap-2 relative bg-red">
      <div className={"w-48"} style={{ display: "block" }}>
        <div className="flex gap-2">
          <TabIcon src={item.icon} />
          <div> {item.name}</div>
        </div>
      </div>
      <TabIcon src={"/menu-icon/chevron.svg"} />
      {mathzone.status && (
        <ul
          className="bg-header-black text-white transform absolute scale-
          transition duration-150 ease-in-out origin-top flex min-w-[260px] flex-col min-h-[48px] items-center -right-px
          "
        >
          {mathzone?.conceptDetails.map((math, index) => {
            return (
              <li
                className="rounded-sm px-3 pl-6 pr-3 py-3  relative item-center"
                key={index}
              >
                <div className="flex gap-2 relative item-center ">
                  <div className={"w-48"} style={{ display: "block" }}>
                    <div className="flex gap-2">
                      <div> {math.name}</div>
                    </div>
                  </div>
                  <TabIcon src={"/menu-icon/chevron_down.svg"} />
                </div>
                {math.tags.length && (
                  <div className="w-full">
                    {math.tags.map((tag, tagIndex) =>
                      tag.name ? (
                        <div className="py-3 pl-2" key={tagIndex}>
                          <div>{tag.name}</div>

                          {tag.levels.length && (
                            <div>
                              {tag.levels.map((level, levelIndex) => (
                                <NavLink
                                  key={levelIndex}
                                  to={`${item.path}/${math.id}/${tag.tag_id}/${
                                    level.split("level")[1]
                                  }?${queryParams}`}
                                  onClick={() =>
                                    handleClick({
                                      path: `${item.path}/${math.id}/${
                                        tag.tag_id
                                      }/${level.split("level")[1]}`,
                                      key: item.key,
                                      name: `${item.name}:${math.name} - ${tag.name}`,
                                      icon: item.icon,
                                      extraParams: {
                                        conceptName: math.name,
                                        tagName: tag.name,
                                        level: level.split("level")[1],
                                      },
                                    })
                                  }
                                  className={"w-48"}
                                  style={{ display: "block" }}
                                >
                                  {level}
                                </NavLink>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        ""
                      )
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
}
