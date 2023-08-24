import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import TabIcon from "./TabIcon";
import { allConceptsDetails } from "../../redux/features/ConceptDetailsRedux";
import { ActiveTabParams } from "../../redux/features/addActiveTabLink";

import { ROUTERKEYCONST } from "../../constants";

interface props {
  allConceptsDetails: allConceptsDetails;
  item: ActiveTabParams;
  handleClickMathVideoLesson: Function;
  queryParams: String;
  calcWidth: number;
  elementPosition: number;
  currentSelectedMenuIndex: number;
  handleOpenSubMenu: Function;
}
export default function MathzoneNavbar({
  allConceptsDetails,
  item,
  handleClickMathVideoLesson,
  queryParams,
  calcWidth,
  elementPosition,
  currentSelectedMenuIndex,
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
  return (
    <>
      {
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
          {allConceptsDetails?.conceptDetails
            .filter((videos) => videos.video !== "")
            .map((videos, index) => {
              if (videos.video.length === 0) {
                return;
              }

              return (
                <li
                  className="rounded-sm px-3 pl-6 pr-3 py-3  relative item-center"
                  key={index}
                >
                  <div
                    className="flex gap-2 relative item-center "
                    onClick={() => handleSelectTopic(index)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className={"w-48"} style={{ display: "block" }}>
                      <div className="flex gap-2">
                        <div> {videos?.name}</div>
                      </div>
                    </div>
                    <TabIcon
                      src={`/menu-icon/chevron_${
                        currentSelectedTopic === index ? "up" : "down"
                      }.svg`}
                    />
                  </div>

                  {currentSelectedTopic === index && (
                    <div className="w-full">
                      {videos.video.map((tag, tagIndex) =>
                        tag.name ? (
                          <div
                            className="py-3 pl-2"
                            key={tagIndex}
                            onClick={() => handleTagSelected(tagIndex)}
                          >
                            <div
                              className="flex gap-2 relative item-center justify-between"
                              style={{ cursor: "pointer" }}
                            >
                              <div style={{ display: "block" }}>
                                <div className="flex gap-2">
                                  <NavLink
                                    key={tagIndex}
                                    to={"/mathvideolesson"}
                                    onClick={() =>
                                      handleClickMathVideoLesson({
                                        path: ROUTERKEYCONST.mathvideolesson,
                                        key: ROUTERKEYCONST.mathvideolesson,
                                        name: ROUTERKEYCONST.mathvideolesson,
                                        icon: item.icon,
                                        extraParams: {
                                          videoUrl: tag.url,
                                        },
                                      })
                                    }
                                    className={"w-48"}
                                    style={{ display: "block" }}
                                  >
                                    {tag?.name}
                                  </NavLink>
                                </div>
                              </div>
                            </div>
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
      }
    </>
  );
}
