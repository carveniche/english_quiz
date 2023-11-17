import { useState } from "react";
import { NavLink } from "react-router-dom";
import TabIcon from "./TabIcon";
import { allConceptsDetails } from "../../redux/features/ConceptDetailsRedux";
import { ActiveTabParams } from "../../redux/features/addActiveTabLink";
import todayClassIcon from "./NavbarIcons/todayClassIconGreen.png";
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
export default function MathzoneNavbar({
  allConceptsDetails,
  item,
  handleClick,
  queryParams,
  calcWidth,
  elementPosition,
  handleOpenSubMenu,
}: props) {
  const [currentSelectedTopic, setCurrentSelectedTopic] = useState(-1);
  const [currentSelectedTag, setCurrentSelectedTag] = useState(-1);
  const handleSelectTopic = (index: number) => {
    if (index === currentSelectedTopic) {
      setCurrentSelectedTopic(-1);
    } else {
      setCurrentSelectedTopic(index);
    }
    setCurrentSelectedTag(-1);
  };
  const handleTagSelected = (index: number) => {
    if (currentSelectedTag === index) {
      setCurrentSelectedTag(-1);
    } else {
      setCurrentSelectedTag(index);
    }
  };

  function convertToLevel1(inputString: string) {
    const capitalized =
      inputString.charAt(0).toUpperCase() + inputString.slice(1);

    const result = capitalized.replace(/(\d)/, " $1");

    return result;
  }

  return (
    <>
      {
        <ul
          onMouseLeave={() => handleOpenSubMenu(-1)}
          className={`bg-header-black text-white transform absolute scale-
          transition duration-150 ease-in-out origin-top flex min-w-[360px] flex-col min-h-[38px] items-center -right-[1px]
          `}
          style={{
            maxHeight: `calc(100vh - 72px - 45.28px - 61.61px - ${
              elementPosition * calcWidth
            }px)`,
            overflowX: "hidden",
            overflowY: "auto",
          }}
        >
          {allConceptsDetails?.mathzoneConceptDetails.map((math, index) => {
            return (
              <li
                className="rounded-sm w-full h-full relative item-center"
                key={index}
              >
                <div className="w-full h-full px-3 pl-6 pr-3 py-3 hover:bg-black">
                  <div
                    className="flex gap-2 relative item-center "
                    onClick={() => handleSelectTopic(index)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className={"w-full"} style={{ display: "block" }}>
                      <div className="flex gap-2">
                        <div>
                          {math?.today_class ? (
                            <div className="flex">
                              {math?.name}
                              <img
                                style={{
                                  width: "40px",
                                  margin: "auto",
                                  marginLeft: "5px",
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                                src={todayClassIcon}
                              />
                            </div>
                          ) : (
                            math?.name
                          )}
                        </div>
                      </div>
                    </div>
                    <TabIcon
                      src={`/menu-icon/chevron_${
                        currentSelectedTopic === index ? "up" : "down"
                      }.svg`}
                    />
                  </div>
                </div>
                {math.tags.length && currentSelectedTopic === index && (
                  <div className="w-full">
                    <div className="w-full">
                      {math.tags.map((tag, tagIndex) =>
                        tag.name ? (
                          tag?.levels?.length ? (
                            <>
                              <div
                                className="px-1 pl-12 pr-3 py-1 hover:bg-black"
                                key={tagIndex}
                                onClick={() => handleTagSelected(tagIndex)}
                              >
                                <div
                                  className="flex gap-2 relative item-center justify-between"
                                  style={{ cursor: "pointer" }}
                                >
                                  <div style={{ display: "block" }}>
                                    <div className="flex gap-2">
                                      <div>
                                        {tag?.today_class ? (
                                          <div className="flex">
                                            {tag?.name}
                                            <img
                                              style={{
                                                width: "40px",
                                                margin: "auto",
                                                marginLeft: "5px",
                                                display: "flex",
                                                justifyContent: "center",
                                              }}
                                              src={todayClassIcon}
                                            />
                                          </div>
                                        ) : (
                                          tag?.name
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <TabIcon
                                    src={`/menu-icon/chevron_${
                                      currentSelectedTag === index
                                        ? "up"
                                        : "down"
                                    }.svg`}
                                  />
                                </div>
                              </div>
                              <div>
                                {Boolean(tag.levels.length) &&
                                  currentSelectedTag === tagIndex && (
                                    <div className="w-full">
                                      <div className="w-full">
                                        {tag.levels.map((level, levelIndex) => (
                                          <div className="pl-16 pr-3 hover:bg-black">
                                            <NavLink
                                              key={levelIndex}
                                              to={`${item.path}/${math.id}/${
                                                tag.tag_id
                                              }/${
                                                level.split("level")[1]
                                              }?${queryParams}`}
                                              onClick={() =>
                                                handleClick({
                                                  path: `${item.path}/${
                                                    math.id
                                                  }/${tag.tag_id}/${
                                                    level.split("level")[1]
                                                  }`,
                                                  key: item.key,
                                                  name: `${item.name}:${math.name} - ${tag.name}`,
                                                  icon: item.icon,
                                                  extraParams: {
                                                    conceptName: math.name,
                                                    tagName: tag.name,
                                                    level:
                                                      level.split("level")[1],
                                                  },
                                                })
                                              }
                                              className={"w-48"}
                                              style={{ display: "block" }}
                                            >
                                              {convertToLevel1(level)}
                                            </NavLink>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                              </div>
                            </>
                          ) : (
                            <div className="w-full" key={tagIndex}>
                              <div
                                className="px-1 py-1 pl-12 pr-3 hover:bg-black"
                                style={{ cursor: "pointer" }}
                              >
                                <div style={{ display: "block" }}>
                                  <div className="flex gap-2">
                                    <NavLink
                                      to={`${item.path}/${math.id}/${tag.tag_id}/0
                                    }?${queryParams}`}
                                      onClick={() =>
                                        handleClick({
                                          path: `${item.path}/${math.id}/${tag.tag_id}/0`,
                                          key: item.key,
                                          name: `${item.name}:${math.name} - ${tag.name}`,
                                          icon: item.icon,
                                          extraParams: {
                                            conceptName: math.name,
                                            tagName: tag.name,
                                            level: 0,
                                          },
                                        })
                                      }
                                      className={"w-48"}
                                      style={{
                                        display: "block",
                                        color: "green",
                                      }}
                                    >
                                      {tag?.name}
                                    </NavLink>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        ) : (
                          ""
                        )
                      )}
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      }
    </>
  );
}
