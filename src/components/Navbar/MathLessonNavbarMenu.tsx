import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import TabIcon from "./TabIcon";
import { allConceptsDetails } from "../../redux/features/ConceptDetailsRedux";
import { ActiveTabParams } from "../../redux/features/addActiveTabLink";

import { ROUTERKEYCONST } from "../../constants";

interface props {
  allConceptsDetails: allConceptsDetails;
  item: ActiveTabParams;
  handleClickMathLesson: Function;
  queryParams: String;
  calcWidth: number;
  elementPosition: number;
  currentSelectedMenuIndex: number;
  handleOpenSubMenu: Function;
}
export default function MathLessonNavbarMenu({
  allConceptsDetails,
  item,
  handleClickMathLesson,
  queryParams,
  calcWidth,
  elementPosition,
  currentSelectedMenuIndex,
  handleOpenSubMenu,
}: props) {
  const [currentSelectedTopic, setCurrentSelectedTopic] = useState(-1);
  const [currentSelectedTag, setCurrentSelectedTag] = useState(-1);
  const [mathLessonPresent, setMathLessonPresent] = useState(false);
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

  const checkVideosPresentOrNot = () => {
    const check = allConceptsDetails?.conceptDetails.filter(
      ({ pdfs }) => pdfs.length > 0
    );

    if (check.length > 0) {
      setMathLessonPresent(true);
    } else {
      setMathLessonPresent(false);
    }
  };

  useEffect(() => {
    checkVideosPresentOrNot();
  }, []);

  return (
    <>
      {mathLessonPresent ? (
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
            .filter((pdf) => pdf.pdfs !== "")
            .map((pdf, index) => {
              if (pdf.pdfs.length === 0) {
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
                        <div> {pdf?.name}</div>
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
                      {pdf.pdfs.map((tag, tagIndex) =>
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
                                    to={`${item.key}?${queryParams}`}
                                    onClick={() =>
                                      handleClickMathLesson({
                                        path: ROUTERKEYCONST.lesson,
                                        key: ROUTERKEYCONST.lesson,
                                        name: "Math Lesson",
                                        icon: item.icon,
                                        extraParams: {
                                          imageUrl: tag.images,
                                          ggbLink: tag?.link || "",
                                          tagType: tag?.type || "",
                                          tagId: tag?.id || 1,
                                        },
                                      })
                                    }
                                    className={"w-48"}
                                    style={{ display: "block" }}
                                  >
                                    {tag?.name + " " + tag?.type}
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
      ) : (
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
          <li className="rounded-sm px-3 pl-6 pr-3 py-3  relative item-center">
            No Videos Present
          </li>
        </ul>
      )}
    </>
  );
}
