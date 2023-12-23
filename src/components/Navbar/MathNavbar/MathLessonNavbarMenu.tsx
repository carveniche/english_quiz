import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import TabIcon from "../NavbarIcons/TabIcon";
import { allConceptsDetails } from "../../../redux/features/ConceptDetailsRedux";
import { ActiveTabParams } from "../../../redux/features/addActiveTabLink";
import todayClassIcon from "../NavbarIcons/todayClassIconGreen.png";
import { GGB, ROUTERKEYCONST } from "../../../constants";

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
         transition duration-150 ease-in-out origin-top flex min-w-[360px] flex-col min-h-[48px] items-center -right-[1px]
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
                            {pdf?.today_class ? (
                              <div className="flex">
                                {pdf?.name}
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
                              pdf?.name
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

                  {currentSelectedTopic === index && (
                    <div className="w-full">
                      <div
                        className="w-full "
                        style={{
                          transition: "ease-in-out all 3000",
                        }}
                      >
                        {pdf.pdfs.map((tag, tagIndex) =>
                          tag.name ? (
                            <div
                              className="py-1 pl-12 hover:bg-black"
                              key={tagIndex}
                              onClick={() => handleTagSelected(tagIndex)}
                            >
                              <div
                                className="flex gap-2 relative item-center justify-between"
                                style={{ cursor: "pointer" }}
                              >
                                <div style={{ display: "block" }}>
                                  <div className="flex gap-2">
                                    {tag?.type === GGB.type ? (
                                      <NavLink
                                        key={tagIndex}
                                        to={`${GGB.key}?${queryParams}`}
                                        onClick={(e) =>
                                          handleClickMathLesson(
                                            {
                                              path: GGB.path,
                                              key: GGB.key,
                                              name: GGB.name,
                                              icon: GGB.icon,
                                              extraParams: {
                                                imageUrl: tag.images,
                                                tagId: tag?.id || 1,
                                                tagType: tag.type,
                                                ggbLink: tag?.link || "",
                                              },
                                            },
                                            e
                                          )
                                        }
                                        className="min-w-48 w-98"
                                        style={{ display: "block" }}
                                      >
                                        <div className="whitespace-nowrap">
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
                                            tag?.name + "(S)"
                                          )}
                                        </div>
                                      </NavLink>
                                    ) : (
                                      <NavLink
                                        key={tagIndex}
                                        to={`${item.key}?${queryParams}`}
                                        onClick={(e) =>
                                          handleClickMathLesson(
                                            {
                                              path: ROUTERKEYCONST.lesson,
                                              key: ROUTERKEYCONST.lesson,
                                              name: "Math Lesson",
                                              icon: item.icon,
                                              extraParams: {
                                                imageUrl: tag.images,
                                                tagId: tag?.id || 1,
                                                tagType: tag.type,
                                                ggbLink: tag?.link || "",
                                              },
                                            },
                                            e
                                          )
                                        }
                                        className="min-w-48 w-98"
                                        style={{ display: "block" }}
                                      >
                                        <div className="whitespace-nowrap">
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
                                      </NavLink>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
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
            No Lessons Present
          </li>
        </ul>
      )}
    </>
  );
}
