import React, { useEffect, useState } from "react";
import styles from "../Mathzone/component/OnlineQuiz.module.css";
import styles2 from "./HomeWork.module.css";
import DisplayHomeWorkQuestion from "./DisplayHomeWorkQuestion";
import FlagQuestionContextProvider from "../FlagQuestion/ContextProvider/FlagQuestionContextProvider";
import {
  getStudentSHomeWorkDetail,
  getStudentSHomeWorkIncorrectQuestionDate,
} from "../../../api";
import QuizPageLayout from "../Mathzone/QuizPageLayout/QuizPageLayout";
import QuizWhitePage from "../Mathzone/QuizPageLayout/QuizWhitepage";
import { ValidationContextProvider } from "../Mathzone/MainOnlineQuiz/MainOnlineQuizPage";
import useVideoContext from "../../../hooks/useVideoContext/useVideoContext";
const DisplayMathZoneDetails = ({ datas }) => {
  return datas?.map((item) => {
    return (
      <>
        {(() => {
          let arr = [];
          for (let key in item) {
            arr.push(
              key === "Review" ? (
                item[key]
              ) : (
                <div className={styles2.keyValue}>
                  {key !== "Status" && (
                    <div className={styles2.heading}>{key}</div>
                  )}
                  {key === "Status" ? (
                    <div
                      className={`${styles2.value} ${
                        styles2["homework-label"]
                      } ${
                        item[key]?.trim() === "Not Started"
                          ? styles2["homework-inactive-label"]
                          : item[key]?.trim() === "In Progress"
                          ? styles2["homework-inprogress-label"]
                          : styles2["homework-completed-label"]
                      }`}
                    >
                      {item[key]}
                    </div>
                  ) : (
                    <p className={styles2.value}>{item[key]}</p>
                  )}
                </div>
              )
            );
          }
          return arr;
        })()}
      </>
    );
  });
};
export default function HomeWork({
  practiceId,
  conceptName,
  conceptTag,

  openHomeWorkResponse,
  homeWorkCurrentQuestion,
  displayHomeWorkQuestion,
  homewWorkStudentName,
  homeWorkStudentId,
  quizId,
  liveClassId,
  userId,
  studentHomeWorkId,
  reference,
  clearCanvas,
  onSendWhiteBoardLines,
  openRoughBoardScreen,
  updatestateforchild,
  fetchAgainHomeWorkQuestion,
}) {
  const [data, setData] = useState(new Array(0).fill(0).map((_) => {}));
  const [daywiseConceptDetails, setDaywiseConceptDetails] = useState({});

  const [loading, setLoading] = useState(false);
  const { room } = useVideoContext();
  const identity = room?.localParticipant?.identity;
  //   const obj = jsonDataTesting();
  const [showQuestion, setShowQuestion] = useState(false);
  const [questionData, setQuestionData] = useState([]);
  const [quizTagId, setQuizTagId] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [selectedStudentName, setSelectedStudentName] = useState("");
  const [homeWorkId, setHomeWorkId] = useState("");

  const handleDataTrack = (payload) => {};
  const handleShowQuestion = async ({
    val,
    studentName,
    studentId,
    quizId,
    mathzone,
    homeWorkId,
  }) => {
    if (!val) return;
    setLoading(true);
    const { data } = await getStudentSHomeWorkIncorrectQuestionDate(
      liveClassId,
      quizId,
      homeWorkId
    );
    let datas = data?.result_data || [];
    setHomeWorkId(homeWorkId);
    setSelectedStudentName(studentName);
    setSelectedStudentId(studentId);
    setQuestionData([...datas]);
    setShowQuestion(val);
    setQuizTagId(quizId);
    setLoading(false);
    if (identity !== "tutor") return;
    let payload = {
      showQuestion,
      quizTagId: quizId,
      selectedStudentId: studentId,
      selectedStudentName: studentName,
      homeWorkId: homeWorkId,
      fetchAgain: true,
      currentFetchTime: 0,
    };
  };
  const groupingData = (data) => {
    console.log({ data });
    // data = data.homework_data;
    data = data || [];

    data?.sort((a, b) => a.student_id - b.student_id);
    let arr = [];
    for (let item of data) {
      if (arr.length < 1) arr.push({ ...item });
      else {
        if (arr[arr?.length - 1]?.student_id === item?.student_id) {
          arr[arr.length - 1].mathzone = [
            ...arr[arr.length - 1].mathzone,
            ...item.mathzone,
          ];
          // arr[arr.length - 1].workbook = [
          //   ...arr[arr.length - 1].workbook,
          //   ...item.workbook,
          // ];
          arr[arr.length - 1].coding = [
            ...arr[arr.length - 1].coding,
            ...item.coding,
          ];
        } else {
          arr.push({ ...item });
        }
      }
    }

    return [...arr];
  };
  const fetchStudentDetais = async () => {
    let { data } = await getStudentSHomeWorkDetail(liveClassId);

    let homeworkData = data?.homework_data || [];
    homeworkData = homeworkData[0] || {};
    let student_data = homeworkData?.student_data || [];
    data.result_data = groupingData([...student_data]);
    delete homeworkData?.student_data;
    setDaywiseConceptDetails({ ...homeworkData });
    if (identity !== "tutor") {
    }
    setData(data?.result_data || []);
  };
  useEffect(() => {
    fetchStudentDetais();
  }, []);
  useEffect(() => {
    if (identity === "tutor") return;
    if (!homeWorkStudentId) {
      setShowQuestion(false);
      return;
    }
    if (!fetchAgainHomeWorkQuestion) return;
    handleShowQuestion({
      val: displayHomeWorkQuestion,
      studentName: homewWorkStudentName,
      studentId: homeWorkStudentId,
      quizId: quizId,
      homeWorkId: studentHomeWorkId,
    });
  }, [displayHomeWorkQuestion, fetchAgainHomeWorkQuestion]);
  const handleSetShowQuestion = (val) => {
    setQuizTagId("");
    setHomeWorkId("");
    setShowQuestion(val);
    openHomeWorkResponse({
      studentName: homewWorkStudentName,
      studentId: homeWorkStudentId,
      currentQuestion: 0,
      displayHomeWorkQuestion: val,
      quizId: "",
      homeWorkId: "",
    });
  };
  return (
    <>
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <>
          {" "}
          {showQuestion ? (
            <FlagQuestionContextProvider>
              <DisplayHomeWorkQuestion
                setShowQuestion={handleSetShowQuestion}
                questionData={questionData}
                homeWorkStudentId={
                  identity === "tutor" ? selectedStudentId : homeWorkStudentId
                }
                displayHomeWorkQuestion={showQuestion}
                userId={userId}
                homeWorkCurrentQuestion={homeWorkCurrentQuestion}
                homewWorkStudentName={
                  identity === "tutor"
                    ? selectedStudentName
                    : homewWorkStudentName
                }
                openHomeWorkResponse={() => {}}
                identity={identity}
                quizId={quizTagId ?? quizId}
                val={showQuestion}
                homeWorkId={homeWorkId ?? studentHomeWorkId}
                liveClassId={liveClassId}
                handleShowQuestion={handleShowQuestion}
                clearCanvas={clearCanvas}
                onSendWhiteBoardLines={onSendWhiteBoardLines}
                openRoughBoardScreen={openRoughBoardScreen}
                updatestateforchild={updatestateforchild}
                reference={reference}
              />
            </FlagQuestionContextProvider>
          ) : (
            <>
              <div
                className={`${styles.mainPage} h-full w-full m-0`}
                style={{ margin: 0, padding: 0, width: "100%" }}
              >
                <QuizPageLayout>
                  <div className={styles.title2}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        fontWeight: "bold !important",
                      }}
                      id={styles.titleStatus}
                    >
                      Home Work
                    </div>
                  </div>
                  <div
                    style={{
                      position: "relative",
                      margin: "0 auto",
                      width: "calc(100% - 160px)",
                      maxHeight: `calc(100% - ${"tutor" ? 60 : 60}px)`,
                      minHeight: `calc(100% - ${"tutor" ? 60 : 60}px)`,
                    }}
                  >
                    <QuizWhitePage>
                      {data?.length ? (
                        <div
                          className={`${styles2["modal-header"]} ${styles2["homework-class-details"]}`}
                          style={{ marginBottom: 20 }}
                        >
                          <table>
                            <tbody>
                              <tr>
                                <td>
                                  <h3 className="topic-name">
                                    {daywiseConceptDetails?.day_math_concept ||
                                      ""}
                                  </h3>
                                  <h3
                                    style={{ marginTop: 10 }}
                                    className="topic-name"
                                  >
                                    {daywiseConceptDetails?.day_coding_concept ||
                                      ""}
                                  </h3>
                                </td>
                                <td>
                                  <label>Grade</label>
                                  <p>{daywiseConceptDetails?.grade}</p>
                                </td>
                                <td>
                                  <label>Start Time</label>
                                  <p>{daywiseConceptDetails?.start_time}</p>
                                </td>
                                <td>
                                  <label>End Time</label>
                                  <p>{daywiseConceptDetails?.end_time}</p>
                                </td>
                                <td>
                                  <label>Date</label>
                                  <p>{daywiseConceptDetails?.start_date}</p>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        ""
                      )}
                      {data?.length > 0 ? (
                        <>
                          {" "}
                          {data?.map((item, i) => (
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                              key={item?.student_id || i}
                            >
                              <div
                                className={styles2["student-details-container"]}
                              >
                                <div
                                  className={styles2["homework-student-avatar"]}
                                >
                                  <img
                                    src={item?.student_avatar}
                                    alt={"Avatar"}
                                  />
                                </div>
                                <div
                                  className={styles2["homework-student-name"]}
                                >
                                  {item?.name}
                                </div>
                              </div>
                              <div className={styles2.container}>
                                {item?.mathzone?.length > 0 && (
                                  <div className={styles2.innerContainer}>
                                    <div className={styles2.title}>
                                      Math Zone
                                    </div>

                                    {item?.mathzone?.map((mathzone, id) => (
                                      <div
                                        className={styles2.layoutContainer}
                                        key={id}
                                      >
                                        <DisplayMathZoneDetails
                                          datas={[
                                            {
                                              Topic: mathzone?.topic,
                                              "Sub Topic": mathzone?.sub_topic,
                                              Score: mathzone?.score ?? "N/A",
                                              "Created date":
                                                mathzone?.start_date ?? "N/A",
                                              "Due Date":
                                                mathzone?.due_date ?? "N/A",
                                              Review: (
                                                <div
                                                  style={{
                                                    justifyContent: "center",
                                                  }}
                                                >
                                                  <div
                                                    className={styles2.heading}
                                                  >
                                                    Review
                                                  </div>

                                                  {identity === "tutor" &&
                                                  mathzone?.tag_quiz_id &&
                                                  mathzone?.incorrect ? (
                                                    <div
                                                      className={
                                                        styles2.viewButton
                                                      }
                                                      style={{ fontSize: 14 }}
                                                      onClick={() =>
                                                        handleShowQuestion({
                                                          val: true,
                                                          studentName:
                                                            item?.name,
                                                          studentId:
                                                            item?.student_id,
                                                          quizId:
                                                            mathzone?.tag_quiz_id,
                                                          homeWorkId:
                                                            mathzone?.homework_id,
                                                        })
                                                      }
                                                    >
                                                      View{" "}
                                                    </div>
                                                  ) : (
                                                    <div>-</div>
                                                  )}
                                                </div>
                                              ),
                                              Status: mathzone?.status,
                                            },
                                          ]}
                                        />
                                      </div>
                                    ))}
                                  </div>
                                )}
                                {item?.workbook?.length > 0 && (
                                  <div className={styles2.innerContainer}>
                                    <div className={styles2.title}>
                                      Work Book
                                    </div>

                                    {item?.workbook?.map((workbook, id) => (
                                      <div
                                        className={styles2.layoutContainer}
                                        key={id}
                                      >
                                        <DisplayMathZoneDetails
                                          datas={[
                                            {
                                              Chapter: workbook?.chapter,
                                              From: workbook?.from_page,
                                              To: workbook?.to_page ?? "N/A",
                                              "Due Date": workbook?.due_date,
                                            },
                                          ]}
                                        />
                                      </div>
                                    ))}
                                  </div>
                                )}
                                {item?.coding?.length > 0 && (
                                  <div className={styles2.innerContainer}>
                                    <div className={styles2.title}>Coding</div>

                                    {item?.coding?.map((coding, id) => (
                                      <div
                                        className={styles2.layoutContainer}
                                        key={id}
                                      >
                                        <DisplayMathZoneDetails
                                          datas={[
                                            {
                                              Coding: coding?.coding,
                                              "Class Title":
                                                coding?.class_title,
                                              "Due Date": coding?.due_date,
                                            },
                                          ]}
                                        />

                                        {coding?.coding_url &&
                                          identity === "tutor" && (
                                            <div
                                              style={{
                                                justifyContent: "center",
                                              }}
                                            >
                                              <div>
                                                <a
                                                  target="_blank"
                                                  href={coding?.coding_url}
                                                  className={
                                                    styles2["coding-open-btn"]
                                                  }
                                                >
                                                  Open
                                                </a>
                                              </div>
                                            </div>
                                          )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </>
                      ) : (
                        <h1>
                          There is no Homework assigned for the last class. ...
                        </h1>
                      )}
                    </QuizWhitePage>
                  </div>
                </QuizPageLayout>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}
