import ActiveTabMenu from "./ActiveTabMenu";
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

import ReplayIcon from "@mui/icons-material/Replay";
import { useDispatch } from "react-redux";
import { refreshNewCodingTeacher } from "../../redux/features/liveClassDetails";

export default function Header2() {
  const dispatch = useDispatch();
  const { role_name, group_class } = useSelector(
    (state: RootState) => state.videoCallTokenData
  );

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
