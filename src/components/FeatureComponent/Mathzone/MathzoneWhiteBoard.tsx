import { MATHZONEDATAKEY } from "../../../constants";

import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { useDispatch } from "react-redux";
import { openClosedMathzoneWhiteBoard } from "../../../redux/features/ComponentLevelDataReducer";
import useVideoContext from "../../../hooks/useVideoContext/useVideoContext";
import { isTutorTechBoth } from "../../../utils/participantIdentity";
import HelperWhiteBoard from "../../WhiteBoardHelper/HelperWhiteBoard";

export default function MathzoneWhiteBoard({
  currentSelectedRouter,
  currentSelectedKey,
  dataTrack,
  identity,
}: {
  currentSelectedRouter: string;
  currentSelectedKey: string;
  dataTrack: string;
  identity: string;
}) {
  const { isMathZoneWhiteBoard } = useSelector(
    (state: RootState) => state.ComponentLevelDataReducer
  );
  const { role_name } = useSelector(
    (state: RootState) => state.videoCallTokenData
  );
  const { room } = useVideoContext();
  const dispatch = useDispatch();
  const onShowRoughBoard = () => {
    dispatch(openClosedMathzoneWhiteBoard(!isMathZoneWhiteBoard));
    typeof handleDataTrack === "function" &&
      handleDataTrack(!isMathZoneWhiteBoard);
  };
  const handleDataTrack = (isMathZoneWhiteBoard: boolean) => {
    const [localDataTrackPublication] = [
      ...room.localParticipant.dataTracks.values(),
    ];

    let DataTrackObj = {
      pathName: currentSelectedRouter,
      key: currentSelectedKey,
      value: {
        type: MATHZONEDATAKEY.openClosedWhiteBoard,
        identity: null,
        isMathZoneWhiteBoard: isMathZoneWhiteBoard,
      },
    };

    localDataTrackPublication.track.send(JSON.stringify(DataTrackObj));
  };
  return (
    <div
      style={{
        position: "absolute",
        zIndex: 1,
        left: 0,
        width: isMathZoneWhiteBoard ? "100%" : "fit-content",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minWidth: 60,
        height: "calc(100% - 2px)",
        top: 0,
      }}
    >
      <div style={{ width: 60, display: "flex", justifyContent: "center" }}>
        {isTutorTechBoth({
          identity: `${room?.localParticipant.identity}`,
        }) && (
          <p
            className="pt-3"
            onClick={onShowRoughBoard}
            style={{
              writingMode: "vertical-rl",
              textOrientation: "mixed",
              padding: "12px 6px",
              color: "white",
              textAlign: "center",
              background: "#333",
              cursor: "pointer",
              letterSpacing: 4,
              fontSize: 16,
              fontWeight: "normal !important",
              borderRadius: 5,
            }}
          >
            {isMathZoneWhiteBoard ? "CLOSE WHITEBOARD" : "OPEN WHITEBOARD"}
          </p>
        )}
      </div>
      {isMathZoneWhiteBoard && (
        <div
          className=""
          style={{
            width: "calc(100% - 60px)",
            position: "relative",
            height: "calc(100%)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,

              left: 0,
              background: "black",
              opacity: 0.1,
              width: "100%",
              height: "100%",
            }}
          ></div>
          <div
            style={{
              top: 0,
              width: "100%",
              height: "100%",
              left: 0,
            }}
          >
            <HelperWhiteBoard
              dataTrackKey={dataTrack || MATHZONEDATAKEY.mathzoneWhiteBoardData}
              pathName={currentSelectedRouter}
              key={currentSelectedKey}
              removeClearAllBtn={
                isTutorTechBoth({ identity: role_name.toString() })
                  ? false
                  : true
              }
              isWritingDisabled={false}
              images={[]}
              isCico={false}
            />
          </div>
        </div>
      )}
    </div>
  );
}
