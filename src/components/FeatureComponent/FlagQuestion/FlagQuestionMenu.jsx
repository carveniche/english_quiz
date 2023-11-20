import React, { useEffect, useState } from "react";
import styles2 from "./FlagQuestion.module.css";
import styles from "../Mathzone/component/OnlineQuiz.module.css";
import QuizPageLayout from "../Mathzone/QuizPageLayout/QuizPageLayout";
import QuizWhitePage from "../Mathzone/QuizPageLayout/QuizWhitepage";
import { getFlagQuestionConceptList } from "../../../api";
import { useSelector } from "react-redux";
import FlagQuestion from "./FlagQuestion";
import { FLAGGEDQUESTIONKEY } from "../../../constants";
import { isTutorTechBoth } from "../../../utils/participantIdentity";
import useVideoContext from "../../../hooks/useVideoContext/useVideoContext";
export default function FlagQuestionMenu(props) {
  const heightRef = React.useRef();
  const [flaggedConceptList, setFlaggedConceptList] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [isError, setIsError] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");
  const [selectedTagId, setSelectedTagId] = useState("");
  const [selectedConceptId, setSelectedConceptId] = useState("");
  const [selectedTagName, setSelectedTagName] = useState("");
  const [selectedConceptName, setSelectedConceptName] = useState("");
  const [showQuestion, setShowQuestion] = useState(false);
  const { liveClassId, userId } = useSelector(
    (state) => state.liveClassDetails
  );
  const {
    currentSelectedRouter,
    currentSelectedIndex,
    currentSelectedKey,
    activeTabArray,
  } = useSelector((state) => state.activeTabReducer);
  const { room } = useVideoContext();
  const identity = room?.localParticipant?.identity;
  const { flaggedQuestion } = useSelector(
    (state) => state.ComponentLevelDataReducer
  );
  console.log(flaggedQuestion);
  let activeTabData = activeTabArray[currentSelectedIndex];
  const handleDataTrack = (payload) => {
    const [localDataTrackPublication] = [
      ...room.localParticipant.dataTracks.values(),
    ];
    let activeTabData = activeTabArray[currentSelectedIndex];
    let DataTrackObj = {
      pathName: currentSelectedRouter,
      key: currentSelectedKey,
      value: {
        type: FLAGGEDQUESTIONKEY.flaggedQuestionMenu,
        identity: null,
        flaggedQuestionData: {
          ...payload,
        },
        activeTabData,
      },
    };
    localDataTrackPublication.track.send(JSON.stringify(DataTrackObj));
  };
  const fetchConceptList = async (liveClassId) => {
    try {
      let { data } = await getFlagQuestionConceptList(liveClassId);
      setLoading(false);
      setErrorMsg("");
      setIsError(false);
      if (data.status) {
        setFlaggedConceptList(data?.flagged_concepts_data || []);
      }
    } catch (e) {
      setFlaggedConceptList([]);
      setLoading(false);
      setIsError(true);
      setErrorMsg((typeof e?.message == "string" ? e?.message : "") || "");
    }
  };
  React.useEffect(() => {
    fetchConceptList(liveClassId);
  }, []);
  const handleViewQuestion = (tagId, conceptId, tagName, conceptName) => {
    setSelectedConceptId(conceptId);
    setSelectedTagId(tagId);
    setSelectedTagName(tagName);
    setSelectedConceptName(conceptName);
    setShowQuestion(true);
    let payload = {
      showQuestion: true,
      currentQuestion: 0,
      selectedTagId: tagId,
      selectedConceptId: conceptId,
      selectedTagName: tagName,
      selectedConceptName: conceptName,
      isFetchAgain: true,
      currentFetchTime: Number(!flaggedQuestion?.currentFetchTime),
    };
    handleDataTrack(payload);
  };
  const handleCloseQuestion = () => {
    setShowQuestion(false);
    let payload = {
      showQuestion: false,
      currentQuestion: 0,
      selectedTagId: "",
      selectedConceptId: "",
      selectedTagName: "",
      selectedConceptName: "",
      isFetchAgain: false,
      currentFetchTime: 0,
    };
    handleDataTrack(payload);
    //
  };
  useEffect(() => {
    if (!isTutorTechBoth(identity)) {
      setSelectedTagId(flaggedQuestion?.selectedTagId || "");
      setSelectedConceptId(flaggedQuestion?.selectedConceptId || "");
      setSelectedConceptName(flaggedQuestion?.selectedConceptName || "");
      setSelectedTagName(flaggedQuestion?.selectedTagName || "");
      setShowQuestion(flaggedQuestion?.showQuestion || false);
    }
  }, [
    flaggedQuestion?.showQuestion,
    flaggedQuestion?.selectedTagId,
    flaggedQuestion?.selectedConceptId,
  ]);
  const handleFlagQuestionChange = (val, fetchAgain) => {
    console.log("calling", fetchAgain);
    let payload = {
      showQuestion: true,
      currentQuestion: val,
      selectedTagId: selectedTagId || "",
      selectedConceptId: selectedConceptId || "",
      selectedTagName: selectedTagName || "",
      selectedConceptName: selectedConceptName || "",
      isFetchAgain: fetchAgain,
      currentFetchTime: Number(!flaggedQuestion?.currentFetchTime),
    };
    handleDataTrack(payload);
  };
  return (
    <>
      {showQuestion ? (
        <FlagQuestion
          {...props}
          conceptId={selectedConceptId}
          flagTagId={selectedTagId}
          flagTagName={selectedTagName}
          conceptName={selectedConceptName}
          handleCloseQuestion={handleCloseQuestion}
          liveClassId={liveClassId}
          identity={identity}
          currentUserId={userId}
          isFetchAgain={flaggedQuestion?.isFetchAgain || false}
          currentFetchTime={flaggedQuestion?.currentFetchTime || 0}
          currentQuestion={flaggedQuestion?.currentQuestion || 0}
          handleFlagQuestionChange={handleFlagQuestionChange}
        />
      ) : (
        <div
          className={`${styles.mainPage} h-full w-full m-0`}
          style={{ margin: 0, padding: 0, width: "100%" }}
        >
          <div
            style={{
              width: "100%",
              padding: 0,
              margin: 0,
              height: "fit-content",
            }}
            ref={heightRef}
          ></div>
          <QuizPageLayout>
            <div
              style={{
                position: "relative",
                margin: "0 auto",
                width: "calc(100% - 160px)",
                maxHeight: `calc(100% - ${"tutor" ? 0 : 0}px)`,
                minHeight: `calc(100% - ${"tutor" ? 0 : 0}px)`,
              }}
            >
              <QuizWhitePage>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginBlock: "1rem",
                    fontSize: 22,
                    color: "indigo",
                  }}
                >
                  Flagged Question
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "1rem",
                    flexWrap: "wrap",
                  }}
                >
                  {" "}
                  {flaggedConceptList.length ? (
                    flaggedConceptList?.map((concept, i) => (
                      <div className={styles2.conceptContainer} key={i}>
                        <div>{concept?.name}</div>
                        <ul>
                          {concept?.tags?.map((tag, i) => (
                            <li key={i}>
                              {identity === "tutor" ? (
                                <a
                                  style={{
                                    fontWeight: "normal",
                                    fontSize: 18,
                                    cursor: "pointer",
                                  }}
                                  className={styles2.viewQuestion}
                                  onClick={() =>
                                    handleViewQuestion(
                                      tag?.tag_id,
                                      concept?.sub_concept_id,
                                      tag?.name,
                                      concept?.name
                                    )
                                  }
                                >
                                  {tag?.name}
                                </a>
                              ) : (
                                <a
                                  style={{ fontWeight: "normal", fontSize: 18 }}
                                >
                                  {tag?.name}
                                </a>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))
                  ) : (
                    <h3>
                      There are no flagged questions available for discussion
                    </h3>
                  )}
                </div>
              </QuizWhitePage>
            </div>
          </QuizPageLayout>
        </div>
      )}
    </>
  );
}
