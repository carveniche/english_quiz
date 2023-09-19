import ActiveTabMenu from "./ActiveTabMenu";
import NestedMenu from "../MenuBar/NestedMenu";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { isParent, isTutorTechBoth } from "../../utils/participantIdentity";
import MuteAll from "../MuteAll/MuteAll";
import TechJoinedClass from "../TechJoinedClass/TechJoinedClass";
import ParentActionNavbar from "../ParentActionNavbar/ParentActionNavbar";

export default function Header2() {
  const { role_name } = useSelector(
    (state: RootState) => state.videoCallTokenData
  );

  return (
    <>
      {/* TechJoinedClass component will update the techJoinedClass value in redux whenever tech joined the class*/}
      <TechJoinedClass />
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

        {isTutorTechBoth({ identity: String(role_name) }) && (
          <div className=" justify-center content-center items-center p-5 pr-[30px]">
            <MuteAll />
          </div>
        )}
      </div>
    </>
  );
}
