import ActiveTabMenu from "../Navbar/MathNavbar/ActiveTabMenu";
import NestedMenu from "../MenuBar/NestedMenu";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import {
  isParent,
  isTutor,
  isTutorTechBoth,
} from "../../utils/participantIdentity";
import MuteAll from "../MuteAll/MuteAll";
import TechJoinedClass from "../TechJoinedClass/TechJoinedClass";
import ParentActionNavbar from "../ParentActionNavbar/ParentActionNavbar";
import ParentJoinedClass from "../ParentJoinedClass/ParentJoinedClass";
import ToggleOffIcon from "@material-ui/icons/ToggleOff";
import ToggleOnIcon from "@material-ui/icons/ToggleOn";
import { useDispatch } from "react-redux";
import { changeGGbMode } from "../../redux/features/ComponentLevelDataReducer";
import useVideoContext from "../../hooks/useVideoContext/useVideoContext";
import { GGB, ROUTERKEYCONST } from "../../constants";

import ReplayIcon from "@mui/icons-material/Replay";
import { refreshNewCodingTeacher } from "../../redux/features/liveClassDetails";

export default function Header2() {
  const dispatch = useDispatch();
  const { role_name, group_class } = useSelector(
    (state: RootState) => state.videoCallTokenData
  );
  const { isGgb } = useSelector((state: RootState) => state.liveClassDetails);
  const { ggbData } = useSelector(
    (state: RootState) => state.ComponentLevelDataReducer
  );

  const { room } = useVideoContext();
  const [localDataTrackPublication] = [
    ...room!.localParticipant.dataTracks.values(),
  ];
  const { currentMode } = ggbData;
  const handleDataTrack = (
    pathName: string,
    key: string,
    currentMode: string,
    dataTrackName: string
  ) => {
    let DataTrackObj = {
      pathName: pathName,
      key: key,
      value: {
        currentMode,
        datatrackName: dataTrackName,
      },
    };
    localDataTrackPublication.track.send(JSON.stringify(DataTrackObj));
  };
  const handleChangeMode = () => {
    if (role_name.toString() === "tutor") {
      const { currentMode } = ggbData;
      let mode = currentMode === "tutor" ? "student" : "tutor";
      dispatch(changeGGbMode(mode));
      handleDataTrack(
        ROUTERKEYCONST.lesson,
        ROUTERKEYCONST.lesson,
        mode,
        GGB.ggbChangeMode
      );
    }
  };
  const { currentSelectedKey } = useSelector(
    (state: RootState) => state.activeTabReducer
  );

  const { refreshNewCodingIframe } = useSelector(
    (state: RootState) => state.liveClassDetails
  );

  return (
    <>
      {/* TechJoinedClass component will update the techJoinedClass value in redux whenever tech joined the class*/}
      <TechJoinedClass />
      {/* ParentJoinedClass component will update the parentJoinedClass value in redux whenever parent joined the class*/}
      <ParentJoinedClass />

      <div className="bg-header-black flex min-h-[40px] h-[46px] w-full justify-between items-center ">
        <div className="relative flex flex-row z-10">
          <NestedMenu />
          <ActiveTabMenu />
        </div>

        {isParent({ identity: String(role_name) }) && (
          <div className="justify-center content-center items-center p-5 pr-[10px]">
            <ParentActionNavbar />
          </div>
        )}

        {isTutorTechBoth({ identity: String(role_name) }) && group_class && (
          <div className=" justify-center content-center items-center p-5 pr-[30px]">
            <MuteAll />
          </div>
        )}
        {isGgb && (
          <div className="flex items-center gap-2 mr-4">
            <div className="text-white">Tutor</div>
            <div
              onClick={handleChangeMode}
              style={{
                pointerEvents:
                  role_name.toString() === "tutor" ? "initial" : "none",
              }}
            >
              {currentMode === "tutor" ? (
                <ToggleOffIcon
                  style={{ fontSize: 60, color: "white", cursor: "pointer" }}
                  titleAccess="change mode"
                />
              ) : (
                <ToggleOnIcon
                  style={{ fontSize: 60, cursor: "pointer" }}
                  titleAccess="change mode"
                  color="primary"
                />
              )}
            </div>
            <div className="text-white">Student</div>
          </div>
        )}

        {isTutor({ identity: String(role_name) }) &&
          currentSelectedKey === "iframeCoding" && (
            <div className=" justify-center content-center items-center p-5 pr-[30px]">
              <button
                onClick={() => {
                  dispatch(refreshNewCodingTeacher(!refreshNewCodingIframe));
                }}
              >
                <ReplayIcon
                  style={{
                    color: "white",
                  }}
                />
              </button>
            </div>
          )}
      </div>
    </>
  );
}
