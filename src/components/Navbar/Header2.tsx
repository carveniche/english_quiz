import Navbar from "./Navbar";

import { useState } from "react";
import ActiveTabMenu from "./ActiveTabMenu";
import NestedMenu from "../MenuBar/NestedMenu";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { isTutorTechBoth } from "../../utils/participantIdentity";
import MuteAll from "../MuteAll/MuteAll";

export default function Header2() {
  const { role_name } = useSelector(
    (state: RootState) => state.videoCallTokenData
  );
  return (
    <>
      <div className="bg-header-black flex min-h-[40px] w-full">
        <div className="relative z-10">
          <NestedMenu />
        </div>
        <ActiveTabMenu />
        {false && isTutorTechBoth({ identity: String(role_name) }) && (
          <div className=" justify-center content-center items-center p-5 pr-[30px]">
            <MuteAll />
          </div>
        )}
      </div>
    </>
  );
}
