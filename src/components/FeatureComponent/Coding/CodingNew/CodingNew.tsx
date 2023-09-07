import { isTutor } from "../../../../utils/participantIdentity";
import CodingHeader from "../CodingHeader";

import CodingNewStudent from "./CodingNewStudent";

import CodingNewTeacher from "./CodingNewTeacher";

interface CodingNew {
  identity: string;
  env: string;
}

export default function CodingNew({ identity, env }: CodingNew) {
  return (
    <div className="flex flex-col w-full h-full justify-center items-cente">
      <div className="flex w-full h-1/5 justify-center items-center">
        <CodingHeader />
      </div>
      <div className="flex w-full h-full justify-center items-center">
        {isTutor({ identity: identity }) ? (
          <CodingNewTeacher />
        ) : (
          <CodingNewStudent />
        )}
      </div>
    </div>
  );
}
