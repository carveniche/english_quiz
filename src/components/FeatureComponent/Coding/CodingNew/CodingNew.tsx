import { useState } from "react";
import { isTutor } from "../../../../utils/participantIdentity";
import CodingHeader from "../CodingHeader";

import CodingNewStudent from "./CodingNewStudent";

import CodingNewTeacher from "./CodingNewTeacher";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import ScratchWhiteBoard from "./ScratchWhiteBoard";

interface CodingNew {
  identity: string;
  env: string;
}
export default function CodingNew({ identity, env }: CodingNew) {
  const { isScratchOpenStatus, scratchPdfsImages } = useSelector(
    (state: RootState) => state.ComponentLevelDataReducer
  );
  return (
    <div className="flex flex-col w-full h-full justify-center items-cente">
      {isScratchOpenStatus ? (
        <>
          <ScratchWhiteBoard pdfImages={scratchPdfsImages} />
        </>
      ) : (
        <>
          <div className="flex w-full h-1/5 justify-center items-center">
            <CodingHeader />
          </div>
          <div className="flex w-full h-full justify-center items-center">
            {isTutor({ identity: identity }) ? (
              <CodingNewTeacher env={env} />
            ) : (
              <CodingNewStudent env={env} />
            )}
          </div>
        </>
      )}
    </div>
  );
}
