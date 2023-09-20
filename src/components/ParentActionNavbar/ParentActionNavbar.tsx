import { useState } from "react";

import EverythingOkayModal from "./EverthingOkayModal/EverythingOkayModal";
import SuggestionCommentsModal from "./SuggestionCommentsModal/SuggestionCommentsModal";
import RaiseAnAlarmModal from "./RaiseAnAlarmModal/RaiseAnAlarmModal";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { isStudentId } from "../../utils/participantIdentity";
export default function ParentActionNavbar() {
  const [everythingOkayModal, setShowEverythingOkayModal] = useState(false);
  const [suggestionCommentsModal, setSuggestionCommentsModal] = useState(false);
  const [raiseAlarmModal, setRaiseAlarmModal] = useState(false);

  const { liveClassId, userId } = useSelector(
    (state: RootState) => state.liveClassDetails
  );

  const { student_ids } = useSelector((state) => state.videoCallTokenData);
  const student_id = Number(isStudentId({ identity: student_ids[0] }));

  const everythingOkayBtn = () => {
    setShowEverythingOkayModal(!everythingOkayModal);
  };

  const suggestionBtn = () => {
    setSuggestionCommentsModal(!suggestionCommentsModal);
  };

  const raiseAlarmBtn = () => {
    setRaiseAlarmModal(!raiseAlarmModal);
  };

  return (
    <>
      <div className="flex flex-row min-w-[500px] min-h-[35px] sm:min-w-[200px] sm:min-h-[25px] items-center justify-between rounded gap-2 bg-header-black-top px-2 py-1">
        <div>
          <button
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            type="button"
            onClick={everythingOkayBtn}
          >
            Everything Seems Good
          </button>
        </div>
        <div>
          <button
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
            type="button"
            onClick={suggestionBtn}
          >
            Send a Suggestion or Concern
          </button>
        </div>
        <div>
          <button
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            type="button"
            onClick={raiseAlarmBtn}
          >
            Raise An Alarm
          </button>
        </div>
      </div>

      {everythingOkayModal && (
        <EverythingOkayModal
          liveClassId={liveClassId}
          userId={userId}
          student_id={student_id}
          handleClose={everythingOkayBtn}
        />
      )}
      {suggestionCommentsModal && (
        <SuggestionCommentsModal
          liveClassId={liveClassId}
          userId={userId}
          student_id={student_id}
          handleClose={suggestionBtn}
        />
      )}

      {raiseAlarmModal && (
        <RaiseAnAlarmModal
          liveClassId={liveClassId}
          userId={userId}
          student_id={student_id}
          handleClose={raiseAlarmBtn}
        />
      )}
    </>
  );
}
