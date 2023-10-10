import { useEffect, useRef, useState } from "react";
import styles from "../Mathzone/component/OnlineQuiz.module.css";
import QuizPageLayout from "../Mathzone/QuizPageLayout/QuizPageLayout";
import QuizWhitePage from "../Mathzone/QuizPageLayout/QuizWhitepage";
import handleResizeWidth from "../Mathzone/handleResizeWidth";
import useSpeakerViewParticipants from "../../../hooks/useSpeakerViewParticipants/useSpeakerViewParticipants";
import { allExcludedParticipants } from "../../../utils/excludeParticipant";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { CICO } from "../../../constants";
import useVideoContext from "../../../hooks/useVideoContext/useVideoContext";
import { fetchCheckInData, fetchCheckOutData } from "../../../api";
import Affirmation from "./Affirmation/Affirmation";
import { RootState } from "../../../redux/store";
import { cicoComponentLevelDataTrack } from "../../../redux/features/ComponentLevelDataReducer";
import { useDispatch } from "react-redux";
import FeelingChart from "./FeelingChart/FeelingChart";
import MainShapeChallenge from "./ShapeChallenge/MainShapeChallenge";
function Cico() {
  const heightRef = useRef(null);
  const [currentHeight, setCurrentHeight] = useState(0);
  const [loading, setLoading] = useState(true);
  const speakerViewParticipants = useSpeakerViewParticipants();
  const { room } = useVideoContext();
  const localParticipant = room?.localParticipant;
  const [apiData, setApiData] = useState({});
  const identity = localParticipant?.identity;
  const { otherData } = useSelector(
    (state: RootState) => state.ComponentLevelDataReducer
  );
  let { students } = useSelector(
    (state: RootState) => state.videoCallTokenData
  );
  students = students || [];
  const remoteParticipant = speakerViewParticipants.filter((item) => {
    return !allExcludedParticipants.includes(item.identity);
  });

  const { liveClassId, userId } = useSelector(
    (state: RootState) => state?.liveClassDetails
  );
  const dispatch = useDispatch();
  const {
    currentSelectedRouter,
    currentSelectedIndex,
    currentSelectedKey,
    activeTabArray,
  } = useSelector((state: RootState) => state.activeTabReducer);
  const { cico_type }: { cico_type: string } = useParams();
  useEffect(() => {
    window.addEventListener("resize", () => {
      setTimeout(() => {
        handleResizeWidth(heightRef.current, setCurrentHeight);
      }, 500);
    });
    return () => {
      window.removeEventListener("resize", () => {
        setTimeout(() => {
          handleResizeWidth(heightRef.current, setCurrentHeight);
        }, 500);
      });
    };
  }, []);
  useEffect(() => {
    setTimeout(() => {
      handleResizeWidth(heightRef.current, setCurrentHeight);
    });
  }, []);
  const handleDataTrack = (payload: { data: object; key: string }) => {
    const [localDataTrackPublication] = [
      ...room!.localParticipant.dataTracks.values(),
    ];
    if (!payload.key) payload.key = CICO.checkIn;
    let activeTabData = activeTabArray[currentSelectedIndex];
    let DataTrackObj = {
      pathName: currentSelectedRouter,
      key: currentSelectedKey,
      value: {
        type: payload.key,
        identity: null,
        cicoData: {
          ...payload.data,
        },
        activeTabData,
      },
    };
    localDataTrackPublication.track.send(JSON.stringify(DataTrackObj));
  };
  const fetchCicoData = async (type: string | undefined) => {
    if (type === CICO.checkIn) {
      try {
        let { data } = await fetchCheckInData(
          students[0]?.id || "",
          liveClassId
        );
        setTimeout(() => {
          handleDataTrack({ key: CICO.checkIn, data: { apiData: data } });
        }, 1000);
        let apiData: any = { apiData: data };
        dispatch(cicoComponentLevelDataTrack(apiData));
        if (data.status) {
          setApiData({ ...data });
        } else {
          setApiData({
            msg: data?.message || "No activity assigned To this batch",
          });
        }
      } catch (e) {
        setApiData({ msg: "No activity assigned To this batch" });
      }
    } else {
      let { data } = await fetchCheckOutData(
        students[0]?.id || "",
        `${liveClassId}`
      );
      dispatch(cicoComponentLevelDataTrack(apiData));
      if (data.status) {
        setApiData({ ...data });
      } else {
        setApiData({
          msg: data?.message || "No activity assigned To this batch",
        });
      }
      setTimeout(() => {
        handleDataTrack({ key: CICO.checkOut, data: { apiData: data } });
      }, 1000);
    }
  };
  const updateStudentData = () => {
    if (otherData?.apiData?.status) {
      setApiData(otherData?.apiData || {});
    }
  };
  useEffect(() => {
    if (allExcludedParticipants.includes(identity ?? "")) {
      console.log("hello");
      fetchCicoData(cico_type);
    }
  }, [cico_type]);
  useEffect(() => {
    if (allExcludedParticipants.includes(identity ?? "")) {
      return;
    }
    updateStudentData();
  }, [cico_type, otherData?.apiData?.status]);
  return (
    <>
      <div
        className={`${styles.mainPage} h-full w-full m-0`}
        style={{ margin: 0, padding: 0, width: "100%" }}
        key={cico_type}
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
        <QuizPageLayout key={"1"} height={currentHeight}>
          <div
            style={{
              position: "relative",
              margin: "0 auto",
              width: "calc(100% - 100px)",
              maxHeight: `calc(100% - ${true ? 0 : 18}px)`,
              minHeight: `calc(100% - ${true ? 0 : 18}px)`,
            }}
          >
            {apiData?.name === "Affirmation" ? (
              <div
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: "indigo",
                }}
              >
                CICO:&nbsp;&nbsp; Self-Affirmation
              </div>
            ) : apiData?.name === "Feeling" ? (
              <div
                style={{
                  marginTop: "0.4rem",
                  fontSize: 18,
                  fontWeight: "bold",
                  color: "indigo",
                }}
              >
                CICO:&nbsp;&nbsp; Feeling-Chart
              </div>
            ) : (
              ""
            )}
            <QuizWhitePage
              key={apiData?.activity_id}
              style={
                apiData?.name === "Shape"
                  ? {
                      clear: "both",
                      width: "100%",
                      minHeight: "100%",
                      maxHeight: "100%",
                      height: "100%",
                    }
                  : ""
              }
            >
              {apiData?.name === "Affirmation" ? (
                <Affirmation
                  apiData={apiData}
                  identity={identity}
                  userId={userId}
                  liveClassID={liveClassId}
                  students={students}
                  activityType={cico_type}
                  handleDataTrack={handleDataTrack}
                />
              ) : apiData?.name === "Feeling" ? (
                <FeelingChart
                  identity={identity}
                  apiData={apiData}
                  userId={userId}
                  liveClassId={liveClassId}
                  students={students}
                  activityType={cico_type}
                  handleDataTrack={handleDataTrack}
                />
              ) : apiData?.name === "Shape" ? (
                <MainShapeChallenge
                  identity={identity}
                  apiData={apiData}
                  userId={userId}
                  liveClassId={liveClassId}
                  students={students}
                  activityType={cico_type}
                  handleDataTrack={handleDataTrack}
                />
              ) : (
                <h3>{apiData?.msg || ""}</h3>
              )}
            </QuizWhitePage>
          </div>
        </QuizPageLayout>
      </div>
    </>
  );
}
export default function MainCico() {
  const { cico_type }: { cico_type: string } = useParams();
  return (
    <>
      <Cico key={cico_type} />
    </>
  );
}
